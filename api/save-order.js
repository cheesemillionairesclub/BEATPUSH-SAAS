// Save order to Supabase after Stripe payment
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const SUPABASE_URL = 'https://wrdbhyypbpppzrtyacvw.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const {
        user_id, stripe_session_id, stripe_payment_intent,
        customer_email, pack, amount, currency,
        track_title, track_artist, track_artwork, track_url,
        genre, similar_artists, release_status,
    } = body;

    try {
        // Check if order already exists (webhook may have already created it)
        if (stripe_session_id) {
            const checkRes = await fetch(
                `${SUPABASE_URL}/rest/v1/orders?stripe_session_id=eq.${stripe_session_id}&select=*`,
                {
                    headers: {
                        'apikey': SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                    },
                }
            );
            const existing = await checkRes.json();
            if (existing && existing.length > 0) {
                // Order already exists - update with user_id if missing
                const order = existing[0];
                if (user_id && !order.user_id) {
                    await fetch(
                        `${SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'apikey': SUPABASE_SERVICE_KEY,
                                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                            },
                            body: JSON.stringify({ user_id }),
                        }
                    );
                    order.user_id = user_id;
                }
                return res.status(200).json({ success: true, order, existing: true });
            }
        }

        const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Prefer': 'return=representation',
            },
            body: JSON.stringify({
                user_id: user_id || null,
                stripe_session_id: stripe_session_id || null,
                stripe_payment_intent: stripe_payment_intent || null,
                customer_email: customer_email || null,
                pack: pack || '',
                amount: amount || 0,
                currency: currency || 'usd',
                track_title: track_title || '',
                track_artist: track_artist || '',
                track_artwork: track_artwork || '',
                track_url: track_url || '',
                genre: genre || '',
                similar_artists: similar_artists || [],
                release_status: release_status || '',
                order_status: 'in_progress',
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Supabase insert error:', errText);
            return res.status(500).json({ error: 'Failed to save order', details: errText });
        }

        const data = await response.json();
        return res.status(200).json({ success: true, order: data[0] });
    } catch (error) {
        console.error('Save order error:', error.message);
        return res.status(500).json({ error: 'Failed to save order', details: error.message });
    }
}
