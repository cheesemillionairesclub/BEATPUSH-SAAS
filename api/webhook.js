import Stripe from 'stripe';

export const config = {
    api: { bodyParser: false },
};

async function getRawBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        const rawBody = await getRawBody(req);
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const metadata = session.metadata || {};

        console.log('=== PAYMENT SUCCESS ===');
        console.log('Session ID:', session.id);
        console.log('Customer Email:', session.customer_details?.email);
        console.log('Amount:', session.amount_total, session.currency);
        console.log('Pack:', metadata.pack);
        console.log('Track:', metadata.track_title, '-', metadata.track_artist);
        console.log('Track URL:', metadata.track_url);
        console.log('Genre:', metadata.genre);
        console.log('Similar Artists:', metadata.similar_artists);
        console.log('Release Status:', metadata.release_status);
        console.log('=======================');
    }

    res.status(200).json({ received: true });
}
