import Stripe from 'stripe';

const PRODUCT_DESCRIPTION = 'All purchases comply with Beatport\'s platform mechanics and are made through legitimate customer accounts. 24/48H delivery. You will receive a detailed receipt once your order is complete.';

export default async function handler(req, res) {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse body - handle both parsed and raw
    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    if (!body) body = {};

    const pack = String(body.pack || '');
    const track_title = body.track_title || '';
    const track_artist = body.track_artist || '';
    const track_url = body.track_url || '';
    const genre = body.genre || '';
    const similar_artists = body.similar_artists || '';
    const release_status = body.release_status || '';

    console.log('=== CREATE CHECKOUT ===');
    console.log('Received pack:', pack);
    console.log('Raw body:', JSON.stringify(body));

    // Define all packs inline - no external config to avoid any reference issues
    let amount, currency, name, mode, interval;

    if (pack === '50') {
        amount = 24000; currency = 'usd'; name = 'Beatport Campaign - 50 Copies'; mode = 'payment';
    } else if (pack === '100') {
        amount = 48000; currency = 'usd'; name = 'Beatport Campaign - 100 Copies'; mode = 'payment';
    } else if (pack === '200') {
        amount = 96000; currency = 'usd'; name = 'Beatport Campaign - 200 Copies'; mode = 'payment';
    } else if (pack === '500') {
        amount = 190000; currency = 'usd'; name = 'Beatport Campaign - 500 Copies'; mode = 'payment';
    } else if (pack === '1000') {
        amount = 385000; currency = 'usd'; name = 'Beatport Campaign - 1,000 Copies'; mode = 'payment';
    } else if (pack === 'daily-push') {
        amount = 5500; currency = 'usd'; name = 'Beatport Daily Push - 10 Copies/Day'; mode = 'subscription'; interval = 'day';
    } else {
        console.log('INVALID PACK:', pack);
        return res.status(400).json({ error: `Invalid pack: "${pack}"` });
    }

    console.log(`Creating session: pack=${pack}, amount=${amount}, mode=${mode}`);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = req.headers.origin || 'https://beatpush.app';

    const metadata = {
        pack,
        track_title:     track_title.substring(0, 500),
        track_artist:    track_artist.substring(0, 500),
        track_url:       track_url.substring(0, 500),
        genre:           genre.substring(0, 500),
        similar_artists: similar_artists.substring(0, 500),
        release_status:  release_status.substring(0, 500),
    };

    try {
        let sessionParams;

        if (mode === 'subscription') {
            sessionParams = {
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency,
                        product_data: { name, description: PRODUCT_DESCRIPTION },
                        unit_amount: amount,
                        recurring: { interval },
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
                        currency,
                        product_data: { name, description: PRODUCT_DESCRIPTION },
                        unit_amount: amount,
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                payment_intent_data: { metadata },
                invoice_creation: { enabled: true },
                metadata,
                success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/`,
            };
        }

        console.log('Session params mode:', sessionParams.mode);
        const session = await stripe.checkout.sessions.create(sessionParams);
        console.log('Session created:', session.id, 'URL:', session.url);
        return res.status(200).json({ url: session.url, pack, amount, mode });
    } catch (error) {
        console.error('Stripe checkout error:', error.message);
        return res.status(500).json({ error: 'Failed to create checkout session', details: error.message });
    }
}
