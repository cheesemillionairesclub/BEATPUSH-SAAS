export default async function handler(req, res) {
    const { q, type } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Missing query parameter "q"' });
    }

    try {
        const typeParam = type ? `&type=${encodeURIComponent(type)}` : '';
        const response = await fetch(`http://185.209.228.153:8080/search?q=${encodeURIComponent(q)}${typeParam}`);

        if (!response.ok) {
            return res.status(response.status).json({ error: `Upstream error: ${response.status}` });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from Beatport search API' });
    }
}
