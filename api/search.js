// File: /api/search.js

export default async function handler(req, res) {
  // ── CORS ───────────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // ── Parse body ────────────────────────────────────────────────────────
  const { origin, destination, departure_date } = req.body;

  try {
    // ── Call Duffel v2 ────────────────────────────────────────────────────
    const duffelRes = await fetch('https://api.duffel.com/air/offer_requests', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer duffel_test_4S3f1DRv9V2ouqVN86bYmiHGfyBFO8V8enkZS-RbCfh',
        'Content-Type': 'application/json',
        'Duffel-Version': 'v2',                // ← use v2
      },
      body: JSON.stringify({
        data: {                               // ← wrap in “data”
          slices: [{ origin, destination, departure_date }],
          passengers: [{ type: 'adult' }],
          cabin_class: 'economy'
        }
      })
    });

    const text = await duffelRes.text();
    if (!duffelRes.ok) {
      // forward the actual error message from Duffel
      return res.status(duffelRes.status).json({ error: text });
    }
    const data = JSON.parse(text);
    return res.status(200).json(data);

  } catch (err) {
    console.error('Duffel API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
