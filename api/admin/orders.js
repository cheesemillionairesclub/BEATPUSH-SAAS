// Admin API: List all orders (with Stripe sync), update receipt
import Stripe from 'stripe';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const SUPABASE_URL = 'https://wrdbhyypbpppzrtyacvw.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Verify admin: check the user's token and profile
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Not authenticated' });

    const token = authHeader.replace('Bearer ', '');

    // Get user from token
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': SUPABASE_SERVICE_KEY,
        },
    });
    if (!userRes.ok) return res.status(401).json({ error: 'Invalid token' });
    const user = await userRes.json();

    // Check if admin
    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=is_admin`, {
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
    });
    const profiles = await profileRes.json();
    if (!profiles[0]?.is_admin) return res.status(403).json({ error: 'Not admin' });

    // GET: list all orders enriched with Stripe data
    if (req.method === 'GET') {
        const ordersRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?order=created_at.desc&select=*`, {
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            },
        });
        const orders = await ordersRes.json();

        // Enrich with Stripe data
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const enrichedOrders = await enrichWithStripeData(stripe, orders, SUPABASE_URL, SUPABASE_SERVICE_KEY);

        return res.status(200).json(enrichedOrders);
    }

    // PATCH: update order (receipt, status)
    if (req.method === 'PATCH') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) { body = {}; }
        }

        const { order_id, receipt_url, order_status } = body;
        if (!order_id) return res.status(400).json({ error: 'Missing order_id' });

        const updates = { updated_at: new Date().toISOString() };
        if (receipt_url !== undefined) updates.receipt_url = receipt_url;

        // Allow admin to mark classic orders as completed
        if (order_status !== undefined) {
            // Verify the order is a classic order before allowing status change
            const orderCheckRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&select=pack`, {
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                },
            });
            const orderCheck = await orderCheckRes.json();
            const isClassicOrder = orderCheck[0] && orderCheck[0].pack !== 'daily-push';

            if (isClassicOrder && order_status === 'completed') {
                updates.order_status = 'completed';
            }
        }

        const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Prefer': 'return=representation',
            },
            body: JSON.stringify(updates),
        });

        if (!updateRes.ok) {
            const errText = await updateRes.text();
            return res.status(500).json({ error: 'Update failed', details: errText });
        }

        const updated = await updateRes.json();
        return res.status(200).json({ success: true, order: updated[0] });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

async function enrichWithStripeData(stripe, orders, supabaseUrl, supabaseKey) {
    const today = new Date().toISOString().split('T')[0];

    const enriched = await Promise.all(orders.map(async (order) => {
        try {
            if (order.pack === 'daily-push') {
                return await enrichDailyPush(stripe, order, today, supabaseUrl, supabaseKey);
            } else {
                return await enrichOneTimeOrder(stripe, order);
            }
        } catch (err) {
            console.error(`Error enriching order ${order.id}:`, err.message);
            return order; // Return original if Stripe fetch fails
        }
    }));

    return enriched;
}

async function enrichOneTimeOrder(stripe, order) {
    // Fetch exact amount from Stripe via payment intent
    if (order.stripe_payment_intent) {
        try {
            const pi = await stripe.paymentIntents.retrieve(order.stripe_payment_intent);
            order.stripe_amount_received = pi.amount_received || 0;
            order.stripe_currency = pi.currency || 'usd';
        } catch (err) {
            // Payment intent might not exist (old orders), use stored amount
            order.stripe_amount_received = order.amount || 0;
            order.stripe_currency = order.currency || 'usd';
        }
    } else {
        order.stripe_amount_received = order.amount || 0;
        order.stripe_currency = order.currency || 'usd';
    }

    return order;
}

async function enrichDailyPush(stripe, order, today, supabaseUrl, supabaseKey) {
    const subscriptionId = order.stripe_payment_intent; // We stored subscription ID here

    if (!subscriptionId) {
        // Try to find subscription ID from checkout session
        if (order.stripe_session_id) {
            try {
                const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
                if (session.subscription) {
                    // Update the order with the subscription ID for future use
                    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': supabaseKey,
                            'Authorization': `Bearer ${supabaseKey}`,
                        },
                        body: JSON.stringify({ stripe_payment_intent: session.subscription }),
                    });
                    return await enrichDailyPushWithSubscription(stripe, order, session.subscription, today, supabaseUrl, supabaseKey);
                }
            } catch (err) {
                console.error('Error retrieving session for subscription:', err.message);
            }
        }
        order.stripe_amount_received = order.amount || 0;
        order.stripe_subscription_status = 'unknown';
        return order;
    }

    return await enrichDailyPushWithSubscription(stripe, order, subscriptionId, today, supabaseUrl, supabaseKey);
}

async function enrichDailyPushWithSubscription(stripe, order, subscriptionId, today, supabaseUrl, supabaseKey) {
    // Fetch subscription status from Stripe
    let subscription;
    try {
        subscription = await stripe.subscriptions.retrieve(subscriptionId);
    } catch (err) {
        // Subscription might be deleted
        if (err.code === 'resource_missing') {
            order.stripe_subscription_status = 'canceled';
            order.stripe_amount_received = 0;
            if (order.order_status !== 'cancelled') {
                await updateOrderStatus(supabaseUrl, supabaseKey, order.id, 'cancelled');
                order.order_status = 'cancelled';
            }
            // Still try to get invoices total
            try {
                const invoices = await stripe.invoices.list({
                    subscription: subscriptionId,
                    status: 'paid',
                    limit: 100,
                });
                order.stripe_amount_received = invoices.data.reduce((sum, inv) => sum + inv.amount_paid, 0);
            } catch (_) {}
            return order;
        }
        throw err;
    }

    order.stripe_subscription_status = subscription.status;

    // Determine correct order_status based on Stripe
    if (subscription.status === 'canceled' || subscription.status === 'unpaid' || subscription.status === 'incomplete_expired') {
        if (order.order_status !== 'cancelled') {
            await updateOrderStatus(supabaseUrl, supabaseKey, order.id, 'cancelled');
            order.order_status = 'cancelled';
        }
    } else if (subscription.status === 'active' || subscription.status === 'trialing') {
        // Check if receipt was uploaded today
        const lastUpdate = order.updated_at ? order.updated_at.split('T')[0] : null;
        const hasReceiptToday = order.receipt_url && lastUpdate === today && order.order_status === 'complete_for_day';

        if (hasReceiptToday) {
            // Keep complete_for_day
        } else if (order.order_status !== 'active_missing_receipt') {
            await updateOrderStatus(supabaseUrl, supabaseKey, order.id, 'active_missing_receipt');
            order.order_status = 'active_missing_receipt';
        }
    }

    // Get total amount paid from Stripe invoices
    try {
        const invoices = await stripe.invoices.list({
            subscription: subscriptionId,
            status: 'paid',
            limit: 100,
        });
        order.stripe_amount_received = invoices.data.reduce((sum, inv) => sum + inv.amount_paid, 0);
        order.stripe_days_paid = invoices.data.length;
    } catch (err) {
        console.error('Error fetching invoices:', err.message);
        order.stripe_amount_received = order.amount || 0;
    }

    return order;
}

async function updateOrderStatus(supabaseUrl, supabaseKey, orderId, status) {
    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
            order_status: status,
            updated_at: new Date().toISOString(),
        }),
    });
}
