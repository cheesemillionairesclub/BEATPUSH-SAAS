import Stripe from 'stripe';

export const config = {
    api: { bodyParser: false },
};

const SUPABASE_URL = 'https://wrdbhyypbpppzrtyacvw.supabase.co';

async function getRawBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

async function supabaseFetch(path, serviceKey, options = {}) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        ...options,
        headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            ...(options.headers || {}),
        },
    });
    return res;
}

async function saveOrderToSupabase(session, metadata) {
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_SERVICE_KEY) {
        console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
        return null;
    }

    const customerEmail = session.customer_details?.email;

    // Check if order already exists (idempotency)
    try {
        const checkRes = await supabaseFetch(
            `orders?stripe_session_id=eq.${session.id}&select=id`,
            SUPABASE_SERVICE_KEY
        );
        const existing = await checkRes.json();
        if (existing && existing.length > 0) {
            console.log('Order already exists for session:', session.id);
            return existing[0];
        }
    } catch (err) {
        console.error('Error checking existing order:', err.message);
    }

    // For subscriptions, store the subscription ID in stripe_payment_intent
    // (this field is null for subscription sessions, so we reuse it)
    const stripeRef = session.payment_intent || session.subscription || null;

    // Insert new order
    try {
        const response = await supabaseFetch('orders', SUPABASE_SERVICE_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
            },
            body: JSON.stringify({
                stripe_session_id: session.id,
                stripe_payment_intent: stripeRef,
                customer_email: customerEmail || null,
                pack: metadata.pack || '',
                amount: session.amount_total || 0,
                currency: session.currency || 'usd',
                track_title: metadata.track_title || '',
                track_artist: metadata.track_artist || '',
                track_artwork: metadata.track_artwork || '',
                track_url: metadata.track_url || '',
                genre: metadata.genre || '',
                similar_artists: metadata.similar_artists ? metadata.similar_artists.split(',').map(s => s.trim()) : [],
                release_status: metadata.release_status || '',
                order_status: metadata.pack === 'daily-push' ? 'active_missing_receipt' : 'in_progress',
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Supabase insert error:', errText);
            return null;
        }

        const data = await response.json();
        console.log('Order saved to Supabase:', data[0]?.id);
        return data[0];
    } catch (err) {
        console.error('Failed to save order to Supabase:', err.message);
        return null;
    }
}

// Handle recurring invoice payment for a subscription
async function handleInvoicePaid(invoice) {
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_SERVICE_KEY) return;

    const subscriptionId = invoice.subscription;
    if (!subscriptionId) return;

    // Skip the first invoice (already handled by checkout.session.completed)
    if (invoice.billing_reason === 'subscription_create') {
        console.log('Skipping first invoice for subscription:', subscriptionId);
        return;
    }

    console.log('=== SUBSCRIPTION RENEWAL PAYMENT ===');
    console.log('Subscription ID:', subscriptionId);
    console.log('Amount:', invoice.amount_paid);
    console.log('====================================');

    // Find the order by stripe_payment_intent (which stores subscription ID for daily push)
    try {
        const checkRes = await supabaseFetch(
            `orders?stripe_payment_intent=eq.${subscriptionId}&pack=eq.daily-push&select=*`,
            SUPABASE_SERVICE_KEY
        );
        const orders = await checkRes.json();
        if (!orders || !orders.length) {
            console.log('No order found for subscription:', subscriptionId);
            return;
        }

        const order = orders[0];
        const today = new Date().toISOString().split('T')[0];
        const lastUpdate = order.updated_at ? order.updated_at.split('T')[0] : null;

        // If receipt was already uploaded today, keep complete_for_day status
        if (order.order_status === 'complete_for_day' && lastUpdate === today) {
            console.log('Receipt already uploaded today for subscription:', subscriptionId);
            return;
        }

        // New payment day, receipt not yet sent -> mark as missing receipt
        await supabaseFetch(`orders?id=eq.${order.id}`, SUPABASE_SERVICE_KEY, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_status: 'active_missing_receipt',
                updated_at: new Date().toISOString(),
            }),
        });
        console.log('Order marked as active_missing_receipt:', order.id);
    } catch (err) {
        console.error('Error handling invoice.paid:', err.message);
    }
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(subscription) {
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_SERVICE_KEY) return;

    const subscriptionId = subscription.id;

    console.log('=== SUBSCRIPTION CANCELLED ===');
    console.log('Subscription ID:', subscriptionId);
    console.log('==============================');

    try {
        const checkRes = await supabaseFetch(
            `orders?stripe_payment_intent=eq.${subscriptionId}&pack=eq.daily-push&select=id`,
            SUPABASE_SERVICE_KEY
        );
        const orders = await checkRes.json();
        if (!orders || !orders.length) {
            console.log('No order found for cancelled subscription:', subscriptionId);
            return;
        }

        await supabaseFetch(`orders?id=eq.${orders[0].id}`, SUPABASE_SERVICE_KEY, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_status: 'cancelled',
                updated_at: new Date().toISOString(),
            }),
        });
        console.log('Order marked as cancelled:', orders[0].id);
    } catch (err) {
        console.error('Error handling subscription.deleted:', err.message);
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
        console.error('STRIPE_WEBHOOK_SECRET is not set');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    let event;

    try {
        const rawBody = await getRawBody(req);
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const customerEmail = session.customer_details?.email;

        console.log('=== PAYMENT SUCCESS ===');
        console.log('Session ID:', session.id);
        console.log('Customer Email:', customerEmail);
        console.log('Amount:', session.amount_total, session.currency);
        console.log('Pack:', metadata.pack);
        console.log('Track:', metadata.track_title, '-', metadata.track_artist);
        if (session.subscription) {
            console.log('Subscription ID:', session.subscription);
        }
        console.log('=======================');

        // Save order to Supabase
        await saveOrderToSupabase(session, metadata);

        // Set receipt_email on the PaymentIntent so Stripe sends the receipt
        if (customerEmail && session.payment_intent) {
            try {
                await stripe.paymentIntents.update(session.payment_intent, {
                    receipt_email: customerEmail,
                });
                console.log('Receipt will be sent to:', customerEmail);
            } catch (err) {
                console.error('Failed to set receipt_email:', err.message);
            }
        }
    } else if (event.type === 'invoice.paid') {
        await handleInvoicePaid(event.data.object);
    } else if (event.type === 'customer.subscription.deleted') {
        await handleSubscriptionDeleted(event.data.object);
    }

    res.status(200).json({ received: true });
}
