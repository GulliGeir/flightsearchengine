// File: /api/search.js

export default async function handler(req, res) {
  // 1) Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');               // allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');  // allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');   // allowed headers

  // 2) Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3) Only allow POST for the actual request
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 4) Pull params from the body
  const { origin, destination, departure_date } = req.body;

  try {
    const duffelRes = await fetch('https://api.duffel.com/air/offer_requests', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer duffel_test_4S3f1DRv9V2ouqVN86bYmiHGfyBFO8V8enkZS-RbCfh',
        'Content-Type': 'application/json',
        'Duffel-Version': 'v1',
      },
      body: JSON.stringify({
        slices: [{ origin, destination, departure_date }],
        passengers: [{ type: 'adult' }],
        cabin_class: 'economy',
      }),
    });

    if (!duffelRes.ok) {
      const err = await duffelRes.text();
      return res.status(duffelRes.status).json({ error: err });
    }

    const data = await duffelRes.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error('Duffel API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
