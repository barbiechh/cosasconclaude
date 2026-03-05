export default async function handler(req, res) {
  // Allow requests from the browser
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Mc-Auth');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.headers['x-mc-auth'];
  if (!token) {
    return res.status(400).json({ error: 'Missing X-Mc-Auth header' });
  }

  // The Metricool path comes as a query param: /api/metricool?path=/admin/simpleProfiles&userId=123
  const { path, ...queryParams } = req.query;
  if (!path) {
    return res.status(400).json({ error: 'Missing path param' });
  }

  const qs = new URLSearchParams(queryParams).toString();
  const url = `https://app.metricool.com/api${path}${qs ? '?' + qs : ''}`;

  try {
    const mcRes = await fetch(url, {
      method: req.method,
      headers: {
        'X-Mc-Auth': token,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await mcRes.json();
    return res.status(mcRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
