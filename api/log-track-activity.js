// Log track search and selection activity to Supabase
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

    const { type, query, track_title, track_artist, track_artwork, track_url, track_genre, user_id } = body;

    if (!type || !['search', 'select'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type. Must be "search" or "select".' });
    }

    try {
        const record = {
            activity_type: type,
            search_query: query || null,
            track_title: track_title || null,
            track_artist: track_artist || null,
            track_artwork: track_artwork || null,
            track_url: track_url || null,
            track_genre: track_genre || null,
            user_id: user_id || null,
        };

        const response = await fetch(`${SUPABASE_URL}/rest/v1/track_activity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Prefer': 'return=representation',
            },
            body: JSON.stringify(record),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Supabase insert error:', errText);
            return res.status(500).json({ error: 'Failed to log activity', details: errText });
        }

        const data = await response.json();
        return res.status(200).json({ success: true, activity: data[0] });
    } catch (error) {
        console.error('Log activity error:', error.message);
        return res.status(500).json({ error: 'Failed to log activity', details: error.message });
    }
}
