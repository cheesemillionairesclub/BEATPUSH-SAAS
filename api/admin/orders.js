// Admin API: List all orders, update status, upload receipt
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const SUPABASE_URL = 'https://wrdbhyypbpppzrtyacvw.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Verify admin: check the user's token and profile
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Not authenticated' });

    const token = authHeader.replace('Bearer ', '');

    // Get user from token
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': SUPABASE_SERVICE_KEY,
        },
    });
    if (!userRes.ok) return res.status(401).json({ error: 'Invalid token' });
    const user = await userRes.json();

    // Check if admin
    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=is_admin`, {
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
    });
    const profiles = await profileRes.json();
    if (!profiles[0]?.is_admin) return res.status(403).json({ error: 'Not admin' });

    // GET: list all orders
    if (req.method === 'GET') {
        const ordersRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?order=created_at.desc&select=*`, {
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            },
        });
        const orders = await ordersRes.json();
        return res.status(200).json(orders);
    }

    // PATCH: update order status or receipt
    if (req.method === 'PATCH') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) { body = {}; }
        }

        const { order_id, order_status, receipt_url } = body;
        if (!order_id) return res.status(400).json({ error: 'Missing order_id' });

        const updates = { updated_at: new Date().toISOString() };
        if (order_status) updates.order_status = order_status;
        if (receipt_url !== undefined) updates.receipt_url = receipt_url;

        const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Prefer': 'return=representation',
            },
            body: JSON.stringify(updates),
        });

        if (!updateRes.ok) {
            const errText = await updateRes.text();
            return res.status(500).json({ error: 'Update failed', details: errText });
        }

        const updated = await updateRes.json();
        return res.status(200).json({ success: true, order: updated[0] });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
