import Stripe from 'stripe';

export const config = {
    api: { bodyParser: false },
};

async function getRawBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

async function saveOrderToSupabase(session, metadata) {
    const SUPABASE_URL = 'https://wrdbhyypbpppzrtyacvw.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_SERVICE_KEY) {
        console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
        return null;
    }

    const customerEmail = session.customer_details?.email;

    // Check if order already exists (idempotency)
    try {
        const checkRes = await fetch(
            `${SUPABASE_URL}/rest/v1/orders?stripe_session_id=eq.${session.id}&select=id`,
            {
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                },
            }
        );
        const existing = await checkRes.json();
        if (existing && existing.length > 0) {
            console.log('Order already exists for session:', session.id);
            return existing[0];
        }
    } catch (err) {
        console.error('Error checking existing order:', err.message);
    }

    // Insert new order
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Prefer': 'return=representation',
            },
            body: JSON.stringify({
                stripe_session_id: session.id,
                stripe_payment_intent: session.payment_intent || null,
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
                order_status: 'in_progress',
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
    }

    res.status(200).json({ received: true });
}
