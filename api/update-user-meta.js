// Update user profile with country (from IP) and device type
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

    // Get user token
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Missing authorization' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify user with Supabase
    let user;
    try {
        const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': SUPABASE_SERVICE_KEY,
            },
        });
        if (!userRes.ok) return res.status(401).json({ error: 'Invalid token' });
        user = await userRes.json();
    } catch (e) {
        return res.status(401).json({ error: 'Auth failed' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const device_type = body.device_type || 'unknown';

    // Detect country from IP
    const ip = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '').split(',')[0].trim();
    let country = 'unknown';

    if (ip) {
        try {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode`);
            if (geoRes.ok) {
                const geoData = await geoRes.json();
                if (geoData.status === 'success') {
                    country = geoData.countryCode || geoData.country || 'unknown';
                }
            }
        } catch (e) {
            console.error('Geo lookup failed:', e.message);
        }
    }

    // Update profile
    try {
        const updateData = {
            country,
            device_type,
            updated_at: new Date().toISOString(),
        };

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                    'Prefer': 'return=representation',
                },
                body: JSON.stringify(updateData),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            console.error('Profile update error:', errText);
            return res.status(500).json({ error: 'Failed to update profile' });
        }

        const data = await response.json();
        return res.status(200).json({ success: true, country, device_type });
    } catch (error) {
        console.error('Update user meta error:', error.message);
        return res.status(500).json({ error: 'Failed to update profile' });
    }
}
