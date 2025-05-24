const { kv } = require('@vercel/kv');
const slugify = require('slugify');

// Portfolio data helper functions
const portfolioHelpers = {
  // Save portfolio data to Vercel KV
  async savePortfolio(subdomain, portfolioData) {
    await kv.set(`portfolio:${subdomain}`, portfolioData);
    console.log(`📁 Portfolio saved for ${subdomain}`);
    return true;
  },

  // Check if subdomain exists
  async subdomainExists(subdomain) {
    const portfolio = await kv.get(`portfolio:${subdomain}`);
    return !!portfolio;
  },

  // Generate unique subdomain
  async generateSubdomain(name) {
    let baseSlug = slugify(name, { lower: true, strict: true });
    let subdomain = baseSlug;
    let counter = 1;

    while (await this.subdomainExists(subdomain)) {
      subdomain = `${baseSlug}-${counter}`;
      counter++;
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
    
    if (!portfolioData.personalInfo?.fullName) {
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

    // Determine the domain based on environment
    const host = req.headers.host;
    const isDevelopment = host?.includes('localhost') || host?.includes('127.0.0.1');
    const baseUrl = isDevelopment
      ? `http://${host}`
      : `https://${subdomain}.pauseforaminute.xyz`;

    res.json({
      success: true,
      subdomain,
      url: `${baseUrl}`,
      message: 'Portfolio saved successfully!'
    });

  } catch (error) {
    console.error('Error saving portfolio:', error);
    res.status(500).json({ error: 'Failed to save portfolio' });
  }
} 