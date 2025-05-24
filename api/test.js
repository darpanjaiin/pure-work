export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const host = req.headers.host;
  const isDevelopment = host?.includes('localhost') || host?.includes('127.0.0.1') || host?.includes('local');
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'pauseforaminute.xyz';

  res.json({
    message: 'Test API endpoint working!',
    host: host,
    isDevelopment: isDevelopment,
    domain: domain,
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString()
  });
} 