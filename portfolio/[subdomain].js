const { kv } = require('@vercel/kv');

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

export default async function handler(req, res) {
  try {
    const { subdomain } = req.query;
    
    if (!subdomain) {
      return res.status(400).send('Subdomain is required');
    }

    const portfolioData = await kv.get(`portfolio:${subdomain}`);
    
    if (!portfolioData) {
      return res.status(404).send(`
        <h1>Portfolio Not Found</h1>
        <p>The portfolio "${subdomain}" does not exist.</p>
        <a href="/">Create your own portfolio</a>
      `);
    }

    const html = generatePortfolioHTML(portfolioData);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
    
  } catch (error) {
    console.error('Error serving portfolio:', error);
    res.status(500).send('Error loading portfolio');
  }
} 