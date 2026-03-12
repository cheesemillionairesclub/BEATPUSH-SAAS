import Stripe from 'stripe';

const PRODUCT_DESCRIPTION = 'All purchases comply with Beatport\'s platform mechanics and are made through legitimate customer accounts. 24/48H delivery. You will receive a detailed receipt once your order is complete.';

const PACK_CONFIG = {
    '50':   { amount: 24000,  currency: 'usd', name: 'Beatport Campaign - 50 Copies',      mode: 'payment' },
    '100':  { amount: 48000,  currency: 'usd', name: 'Beatport Campaign - 100 Copies',     mode: 'payment' },
    '200':  { amount: 96000,  currency: 'usd', name: 'Beatport Campaign - 200 Copies',     mode: 'payment' },
    '500':  { amount: 190000, currency: 'usd', name: 'Beatport Campaign - 500 Copies',     mode: 'payment' },
    '1000': { amount: 385000, currency: 'usd', name: 'Beatport Campaign - 1,000 Copies',   mode: 'payment' },
    'daily-push': { amount: 5500, currency: 'usd', name: 'Beatport Daily Push - 10 Copies/Day', mode: 'subscription', interval: 'day' },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { pack, track_title, track_artist, track_url, genre, similar_artists, release_status } = req.body || {};

    const packKey = String(pack || '');
    if (!packKey || !PACK_CONFIG[packKey]) {
        return res.status(400).json({ error: `Invalid pack: ${packKey}` });
    }

    console.log(`Creating checkout for pack: ${packKey}, amount: ${PACK_CONFIG[packKey].amount}, mode: ${PACK_CONFIG[packKey].mode}`);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const config = PACK_CONFIG[packKey];
    const origin = req.headers.origin || 'https://beatpush.app';

    const metadata = {
        pack,
        track_title:     (track_title || '').substring(0, 500),
        track_artist:    (track_artist || '').substring(0, 500),
        track_url:       (track_url || '').substring(0, 500),
        genre:           (genre || '').substring(0, 500),
        similar_artists: (similar_artists || '').substring(0, 500),
        release_status:  (release_status || '').substring(0, 500),
    };

    try {
        let sessionParams;

        if (config.mode === 'subscription') {
            sessionParams = {
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: config.currency,
                        product_data: { name: config.name, description: PRODUCT_DESCRIPTION },
                        unit_amount: config.amount,
                        recurring: { interval: config.interval },
                    },
                    quantity: 1,
                }],
                mode: 'subscription',
                subscription_data: { metadata },
                metadata,
                success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/`,
            };
        } else {
            sessionParams = {
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: config.currency,
                        product_data: { name: config.name, description: PRODUCT_DESCRIPTION },
                        unit_amount: config.amount,
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                payment_intent_data: {
                    metadata,
                    receipt_email: null, // Will be set from Checkout email
                },
                invoice_creation: { enabled: true },
                metadata,
                success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/`,
            };
        }

        const session = await stripe.checkout.sessions.create(sessionParams);
        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error.message);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
}
