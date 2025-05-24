const { kv } = require('@vercel/kv');

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subdomain } = req.query;
    
    if (!subdomain) {
      return res.status(400).json({ error: 'Subdomain is required' });
    }

    const portfolioData = await kv.get(`portfolio:${subdomain}`);
    
    if (!portfolioData) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json(portfolioData);
  } catch (error) {
    console.error('Error loading portfolio:', error);
    res.status(500).json({ error: 'Failed to load portfolio' });
  }
} 