const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const slugify = require('slugify');

const app = express();
const PORT = process.env.PORT || 54121;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Data storage directory
const DATA_DIR = path.join(__dirname, '../data');
const PORTFOLIOS_DIR = path.join(DATA_DIR, 'portfolios');

// Ensure data directories exist
fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(PORTFOLIOS_DIR);

// Portfolio data helper functions
const portfolioHelpers = {
  // Save portfolio data
  async savePortfolio(subdomain, portfolioData) {
    const filePath = path.join(PORTFOLIOS_DIR, `${subdomain}.json`);
    await fs.writeJson(filePath, portfolioData, { spaces: 2 });
    console.log(`📁 Portfolio saved for ${subdomain}`);
    return true;
  },

  // Load portfolio data
  async loadPortfolio(subdomain) {
    const filePath = path.join(PORTFOLIOS_DIR, `${subdomain}.json`);
    if (await fs.pathExists(filePath)) {
      return await fs.readJson(filePath);
    }
    return null;
  },

  // Check if subdomain exists
  async subdomainExists(subdomain) {
    const filePath = path.join(PORTFOLIOS_DIR, `${subdomain}.json`);
    return await fs.pathExists(filePath);
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

// Middleware to extract subdomain
const extractSubdomain = (req, res, next) => {
  const host = req.get('host');
  const subdomain = host.split('.')[0];
  
  // Skip subdomain logic for localhost development
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    // For localhost, check if there's a subdomain parameter
    const urlParts = req.originalUrl.split('/');
    if (urlParts[1] && urlParts[1] !== 'api' && urlParts[1] !== 'editor' && urlParts[1] !== 'admin') {
      req.subdomain = urlParts[1];
      req.originalUrl = '/' + urlParts.slice(2).join('/');
    } else {
      req.subdomain = null;
    }
  } else {
    // For production, use actual subdomain
    req.subdomain = subdomain !== 'www' ? subdomain : null;
  }
  
  next();
};

app.use(extractSubdomain);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes

// Save portfolio data
app.post('/api/portfolio/save', async (req, res) => {
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

        // Save portfolio    await portfolioHelpers.savePortfolio(subdomain, portfolioData);    // Determine the correct URL based on environment    const host = req.get('host');    const isDevelopment = host?.includes('localhost') || host?.includes('127.0.0.1');    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'pauseforaminute.xyz';        let portfolioUrl;    if (isDevelopment) {      // For local development, use localhost path-based routing      portfolioUrl = `http://localhost:${PORT}/${subdomain}`;    } else {      // For production, use subdomain routing      portfolioUrl = `https://${subdomain}.${domain}`;    }    console.log(`🌐 Generated portfolio URL: ${portfolioUrl} (isDev: ${isDevelopment}, host: ${host})`);    res.json({      success: true,      subdomain,      url: portfolioUrl,      message: 'Portfolio saved successfully!'    });

  } catch (error) {
    console.error('Error saving portfolio:', error);
    res.status(500).json({ error: 'Failed to save portfolio' });
  }
});

// Get portfolio data
app.get('/api/portfolio/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const portfolioData = await portfolioHelpers.loadPortfolio(subdomain);
    
    if (!portfolioData) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json(portfolioData);
  } catch (error) {
    console.error('Error loading portfolio:', error);
    res.status(500).json({ error: 'Failed to load portfolio' });
  }
});

// Check subdomain availability
app.get('/api/subdomain/check/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const cleanSubdomain = slugify(subdomain, { lower: true, strict: true });
    const exists = await portfolioHelpers.subdomainExists(cleanSubdomain);
    
    res.json({
      subdomain: cleanSubdomain,
      available: !exists
    });
  } catch (error) {
    console.error('Error checking subdomain:', error);
    res.status(500).json({ error: 'Failed to check subdomain' });
  }
});

// Portfolio rendering template
const generatePortfolioHTML = (portfolioData) => {
  const { personalInfo, contactInfo, education, experience, skills } = portfolioData;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Space Grotesk', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        .portfolio-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 48px;
            padding-bottom: 32px;
            border-bottom: 1px solid #e5e7eb;
        }
        .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            margin: 0 auto 24px;
            color: #fff;
            font-weight: 600;
        }
        .name {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: #111;
        }
        .title {
            font-size: 1.3rem;
            color: #2563eb;
            margin: 0 0 16px 0;
            font-weight: 500;
        }
        .bio {
            font-size: 1.1rem;
            color: #6b7280;
            margin: 0 0 24px 0;
        }
        .contact {
            display: flex;
            justify-content: center;
            gap: 24px;
            flex-wrap: wrap;
        }
        .contact-item {
            color: #374151;
            text-decoration: none;
            font-size: 0.95rem;
            transition: color 0.2s;
        }
        .contact-item:hover {
            color: #2563eb;
        }
        .section {
            margin-bottom: 40px;
        }
        .section h2 {
            font-size: 1.8rem;
            font-weight: 600;
            margin: 0 0 24px 0;
            color: #111;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
        }
        .item {
            margin-bottom: 24px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
        }
        .item h3 {
            margin: 0 0 8px 0;
            font-size: 1.2rem;
            font-weight: 600;
            color: #111;
        }
        .item p {
            margin: 0 0 8px 0;
            color: #6b7280;
            font-weight: 500;
        }
        .item .description {
            color: #374151;
            margin: 0;
            line-height: 1.5;
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        .skill-tag {
            background: #e0e7ff;
            color: #3730a3;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }
        .footer {
            margin-top: 60px;
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #9ca3af;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .portfolio-container {
                padding: 20px 15px;
            }
            .name {
                font-size: 2rem;
            }
            .contact {
                flex-direction: column;
                align-items: center;
                gap: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="portfolio-container">
        <header class="header">
            <div class="avatar">
                ${personalInfo.fullName ? personalInfo.fullName.split(' ').map(n => n[0]).slice(0, 2).join('') : '👤'}
            </div>
            <h1 class="name">${personalInfo.fullName || 'Your Name'}</h1>
            <p class="title">${personalInfo.jobTitle || 'Your Professional Title'}</p>
            <p class="bio">${personalInfo.bio || 'Your bio will appear here...'}</p>
            <div class="contact">
                ${contactInfo.email ? `<a href="mailto:${contactInfo.email}" class="contact-item">📧 ${contactInfo.email}</a>` : ''}
                ${contactInfo.phone ? `<a href="tel:${contactInfo.phone}" class="contact-item">📱 ${contactInfo.phone}</a>` : ''}
                ${contactInfo.linkedin ? `<a href="${contactInfo.linkedin}" target="_blank" class="contact-item">💼 LinkedIn</a>` : ''}
                ${contactInfo.github ? `<a href="${contactInfo.github}" target="_blank" class="contact-item">💻 GitHub</a>` : ''}
            </div>
        </header>

        ${education && education.length > 0 ? `
        <section class="section">
            <h2>Education</h2>
            ${education.map(edu => `
                <div class="item">
                    <h3>${edu.degree || 'Degree'}</h3>
                    <p>${edu.school || 'School'}${edu.startYear && edu.endYear ? ` • ${edu.startYear} - ${edu.endYear}` : ''}</p>
                </div>
            `).join('')}
        </section>
        ` : ''}

        ${experience && experience.length > 0 ? `
        <section class="section">
            <h2>Experience</h2>
            ${experience.map(exp => `
                <div class="item">
                    <h3>${exp.position || 'Position'}</h3>
                    <p>${exp.company || 'Company'}${exp.startDate && exp.endDate ? ` • ${exp.startDate} - ${exp.endDate}` : ''}</p>
                    ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}

        ${skills && skills.length > 0 ? `
        <section class="section">
            <h2>Skills</h2>
            <div class="skills">
                ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </section>
        ` : ''}

        <footer class="footer">
            <p>Built with PureWork • <a href="/" style="color: #2563eb;">Create your own portfolio</a></p>
        </footer>
    </div>
</body>
</html>
  `;
};

// Subdomain routing - serve portfolio websites
app.get('*', async (req, res) => {
  // Check if this is a portfolio subdomain request
  if (req.subdomain) {
    try {
      const portfolioData = await portfolioHelpers.loadPortfolio(req.subdomain);
      
      if (portfolioData) {
        const html = generatePortfolioHTML(portfolioData);
        res.send(html);
        return;
      } else {
        // Portfolio not found
        res.status(404).send(`
          <h1>Portfolio Not Found</h1>
          <p>The portfolio "${req.subdomain}" does not exist.</p>
          <a href="/">Create your own portfolio</a>
        `);
        return;
      }
    } catch (error) {
      console.error('Error serving portfolio:', error);
      res.status(500).send('Error loading portfolio');
      return;
    }
  }

  // For non-subdomain requests, serve the main app
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PureWork Portfolio Server running on http://localhost:${PORT}`);
  console.log(`📝 Editor available at http://localhost:${PORT}/editor.html`);
  console.log(`🌐 Portfolios accessible at http://localhost:${PORT}/[subdomain]`);
  console.log(`📁 Data stored in: ${DATA_DIR}`);
}); 