const { kv } = require('@vercel/kv');
const slugify = require('slugify');

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

    const cleanSubdomain = slugify(subdomain, { lower: true, strict: true });
    const portfolio = await kv.get(`portfolio:${cleanSubdomain}`);
    const exists = !!portfolio;
    
    res.json({
      subdomain: cleanSubdomain,
      available: !exists
    });
  } catch (error) {
    console.error('Error checking subdomain:', error);
    res.status(500).json({ error: 'Failed to check subdomain' });
  }
} 