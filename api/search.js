// This is an API route file for Vercel (inside the /api directory)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { origin, destination, departure_date } = req.body;

  const response = await fetch('https://api.duffel.com/air/offer_requests', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer duffel_test_4S3f1DRv9V2ouqVN86bYmiHGfyBFO8V8enkZS-RbCfh',
      'Content-Type': 'application/json',
      'Duffel-Version': 'v1',
    },
    body: JSON.stringify({
      slices: [
        {
          origin,
          destination,
          departure_date,
        },
      ],
      passengers: [
        {
          type: 'adult',
        },
      ],
      cabin_class: 'economy',
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}
