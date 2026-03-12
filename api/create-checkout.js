import Stripe from 'stripe';

const PACK_PRICES = {
    '50':         { amount: 24000,  currency: 'usd', name: 'Beatport Campaign - 50 Copies' },
    '100':        { amount: 48000,  currency: 'usd', name: 'Beatport Campaign - 100 Copies' },
    '200':        { amount: 96000,  currency: 'usd', name: 'Beatport Campaign - 200 Copies' },
    '500':        { amount: 190000, currency: 'usd', name: 'Beatport Campaign - 500 Copies' },
    '1000':       { amount: 385000, currency: 'usd', name: 'Beatport Campaign - 1,000 Copies' },
    'daily-push': { amount: 5500,   currency: 'usd', name: 'Beatport Daily Push - 10 Copies/Day' },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { pack, track_title, track_artist, track_url, genre, similar_artists, release_status } = req.body || {};

    if (!pack || !PACK_PRICES[pack]) {
        return res.status(400).json({ error: `Invalid pack: ${pack}` });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount, currency, name } = PACK_PRICES[pack];

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency,
                    product_data: { name },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            metadata: {
                pack,
                track_title:     (track_title || '').substring(0, 500),
                track_artist:    (track_artist || '').substring(0, 500),
                track_url:       (track_url || '').substring(0, 500),
                genre:           (genre || '').substring(0, 500),
                similar_artists: (similar_artists || '').substring(0, 500),
                release_status:  (release_status || '').substring(0, 500),
            },
            success_url: `${req.headers.origin || 'https://beatpush.com'}/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:  `${req.headers.origin || 'https://beatpush.com'}/`,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error.message);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
}
