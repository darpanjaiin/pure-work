import { kv } from '@vercel/kv';
import slugify from 'slugify';

// Portfolio data helper functions
const portfolioHelpers = {
  // Save portfolio data to Vercel KV
  async savePortfolio(subdomain, portfolioData) {
    try {
      await kv.set(`portfolio:${subdomain}`, portfolioData);
      console.log(`📁 Portfolio saved for ${subdomain}`);
      return true;
    } catch (error) {
      console.error('Error saving to KV:', error);
      // For development, just log and continue
      return true;
    }
  },

  // Check if subdomain exists
  async subdomainExists(subdomain) {
    try {
      const portfolio = await kv.get(`portfolio:${subdomain}`);
      return !!portfolio;
    } catch (error) {
      console.error('Error checking KV:', error);
      // For development, assume it doesn't exist
      return false;
    }
  },

  // Generate unique subdomain
  async generateSubdomain(name) {
    let baseSlug = slugify(name, { lower: true, strict: true });
    let subdomain = baseSlug;
    let counter = 1;

    try {
      while (await this.subdomainExists(subdomain)) {
        subdomain = `${baseSlug}-${counter}`;
        counter++;
      }
    } catch (error) {
      console.error('Error generating subdomain:', error);
      // Just use the base slug with a random number
      subdomain = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;
    }

    return subdomain;
  }
};

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { portfolioData, customSubdomain } = req.body;
    
    if (!portfolioData?.personalInfo?.fullName) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    // Generate or use custom subdomain
    let subdomain;
    if (customSubdomain) {
      subdomain = slugify(customSubdomain, { lower: true, strict: true });
      if (await portfolioHelpers.subdomainExists(subdomain)) {
        return res.status(409).json({ error: 'Subdomain already exists' });
      }
    } else {
      subdomain = await portfolioHelpers.generateSubdomain(portfolioData.personalInfo.fullName);
    }

    // Add metadata
    portfolioData.metadata = {
      subdomain,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0'
    };

    // Save portfolio
    await portfolioHelpers.savePortfolio(subdomain, portfolioData);

    // Determine the correct URL based on environment
    const host = req.headers.host;
    const isDevelopment = host?.includes('localhost') || host?.includes('127.0.0.1') || host?.includes('local');
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'pauseforaminute.xyz';
    
    let portfolioUrl;
    if (isDevelopment) {
      // For local development, use localhost path-based routing
      portfolioUrl = `http://localhost:3000/${subdomain}`;
    } else {
      // For production, use subdomain routing
      portfolioUrl = `https://${subdomain}.${domain}`;
    }

    console.log(`🌐 Generated portfolio URL: ${portfolioUrl} (isDev: ${isDevelopment}, host: ${host})`);

    res.json({
      success: true,
      subdomain,
      url: portfolioUrl,
      message: 'Portfolio saved successfully!'
    });

  } catch (error) {
    console.error('Error saving portfolio:', error);
    res.status(500).json({ 
      error: 'Failed to save portfolio',
      details: error.message 
    });
  }
} 