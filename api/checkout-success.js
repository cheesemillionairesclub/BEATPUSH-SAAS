import Stripe from 'stripe';

export default async function handler(req, res) {
    const { session_id } = req.query;

    if (!session_id) {
        return res.status(400).json({ error: 'Missing session_id' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        res.status(200).json({
            status: session.payment_status,
            customer_email: session.customer_details?.email || null,
            metadata: session.metadata || {},
            amount_total: session.amount_total,
            currency: session.currency,
        });
    } catch (error) {
        console.error('Checkout success error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve session' });
    }
}
