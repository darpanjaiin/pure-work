#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 PureWork Portfolio Setup');
console.log('============================\n');

// Check if required directories exist
const requiredDirs = ['public', 'api', 'portfolio', 'data'];
const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));

if (missingDirs.length > 0) {
  console.log('📁 Creating missing directories...');
  missingDirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`   ✅ Created ${dir}/`);
  });
}

// Create data/portfolios directory for local development
const portfoliosDir = 'data/portfolios';
if (!fs.existsSync(portfoliosDir)) {
  fs.mkdirSync(portfoliosDir, { recursive: true });
  console.log(`   ✅ Created ${portfoliosDir}/`);
}

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('\n⚠️  Environment file not found!');
  console.log('   Please copy env.example to .env and fill in your values:');
  console.log('   cp env.example .env');
  console.log('\n   Required environment variables:');
  console.log('   - KV_REST_API_URL (from Vercel KV)');
  console.log('   - KV_REST_API_TOKEN (from Vercel KV)');
  console.log('   - CLERK_SECRET_KEY (from Clerk Dashboard)');
} else {
  console.log('\n✅ Environment file found');
}

console.log('\n📦 Available Scripts:');
console.log('   npm start       - Start production server');
console.log('   npm run dev     - Start development server with auto-reload');
console.log('   npm run static  - Serve static files only');

console.log('\n🌐 Local Development URLs:');
console.log('   Homepage: http://localhost:3000');
console.log('   Editor:   http://localhost:3000/editor.html');

console.log('\n🚀 Deployment:');
console.log('   1. Push to GitHub');
console.log('   2. Connect to Vercel');
console.log('   3. Add environment variables in Vercel dashboard');
console.log('   4. Deploy!');

console.log('\n✨ Setup complete! Run "npm run dev" to start developing.'); 