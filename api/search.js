// File: /api/search.js

export default async function handler(req, res) {
  // ─── CORS ────────────────────────────────────────────────────────────────
  // Allow any origin (so you can embed on Squarespace or open from your Vercel URL)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  // Only POST for the real work
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // ─── Parse body ────────────────────────────────────────────────────────────
  const { origin, destination, departure_date } = req.body;

  try {
    // ─── Call Duffel v2 ────────────────────────────────────────────────────────
    const duffelRes = await fetch('https://api.duffel.com/air/offer_requests', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer duffel_test_4S3f1DRv9V2ouqVN86bYmiHGfyBFO8V8enkZS-RbCfh',
        'Content-Type': 'application/json',
        'Duffel-Version': 'v2',
      },
      body: JSON.stringify({
        data: {
          slices: [
            { origin, destination, departure_date }
          ],
          passengers: [
            { type: 'adult' }
          ],
          cabin_class: 'economy'
        }
      })
    });

    const text = await duffelRes.text();
    if (!duffelRes.ok) {
      // Forward Duffel’s error message
      return res.status(duffelRes.status).json({ error: text });
    }

    const data = JSON.parse(text);
    return res.status(200).json(data);

  } catch (err) {
    console.error('Duffel API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
