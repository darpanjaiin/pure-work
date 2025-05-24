# PureWork Portfolio Builder

A minimalistic SaaS portfolio website builder with subdomain routing. Create beautiful, responsive portfolio websites in minutes.

## ✨ Features

- **🚀 Quick Setup**: Create your portfolio in 3 minutes
- **📱 Responsive Design**: Mobile-first, beautiful on all devices
- **🌐 Custom Subdomains**: Get your own subdomain (e.g., `yourname.pauseforaminute.xyz`)
- **🔐 Secure Authentication**: Powered by Clerk
- **⚡ Real-time Preview**: See changes instantly as you type
- **☁️ Cloud Storage**: Portfolios stored securely in Vercel KV
- **🎨 Professional Templates**: Clean, modern design

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd pure-work
npm install
npm run setup
```

### 2. Environment Setup

Copy the environment template and fill in your values:

```bash
cp env.example .env
```

Required environment variables:

```env
# Vercel KV Database (get from Vercel Dashboard → Storage → KV)
KV_REST_API_URL=https://your-kv-database-url.vercel-storage.com
KV_REST_API_TOKEN=your_kv_rest_api_token_here

# Clerk Authentication (get from Clerk Dashboard → API Keys)
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dHJ1c3Rpbmctd2FzcC0zNy5jbGVyay5hY2NvdW50cy5kZXYk

# Domain Configuration
NEXT_PUBLIC_DOMAIN=pauseforaminute.xyz
NEXT_PUBLIC_APP_URL=https://pauseforaminute.xyz
```

### 3. Local Development

```bash
# Start development server
npm run dev

# Or serve static files only
npm run static
```

Visit:
- Homepage: http://localhost:3000
- Editor: http://localhost:3000/editor.html

## 🏗️ Architecture

### Local Development
- **Frontend**: Static HTML/CSS/JS served from `public/`
- **Backend**: Express.js server with file-based storage
- **Storage**: JSON files in `data/portfolios/`

### Production (Vercel)
- **Frontend**: Static files served via Vercel CDN
- **Backend**: Serverless functions in `api/` and `portfolio/`
- **Storage**: Vercel KV (Redis-compatible)
- **Authentication**: Clerk
- **Subdomains**: Automatic routing via Vercel

## 📁 Project Structure

```
pure-work/
├── public/                 # Frontend files
│   ├── index.html         # Homepage
│   ├── editor.html        # Portfolio editor
│   ├── styles/            # CSS files
│   └── src/               # JavaScript files
├── api/                   # Vercel serverless functions
│   ├── portfolio/         # Portfolio CRUD operations
│   └── subdomain/         # Subdomain management
├── portfolio/             # Portfolio rendering
│   └── [subdomain].js     # Dynamic portfolio pages
├── server/                # Local development server
├── data/                  # Local storage (development only)
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Clerk Setup

1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Get your publishable key and secret key
4. Add to environment variables

### Vercel KV Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → KV
3. Create new database
4. Copy connection details to environment variables

### Domain Setup

1. Add your domain in Vercel project settings
2. Add wildcard domain (`*.yourdomain.com`)
3. Configure DNS:
   - A Record: `@` → `76.76.21.21`
   - CNAME: `*` → `cname.vercel-dns.com`

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

3. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file

4. **Deploy**:
   - Vercel will automatically deploy
   - Your app will be available at your custom domain

### Environment Variables in Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Source |
|----------|-------|---------|
| `KV_REST_API_URL` | `https://...` | Vercel KV Database |
| `KV_REST_API_TOKEN` | `AX...` | Vercel KV Database |
| `CLERK_SECRET_KEY` | `sk_test_...` | Clerk Dashboard |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` | Clerk Dashboard |
| `NEXT_PUBLIC_DOMAIN` | `pauseforaminute.xyz` | Your domain |
| `NEXT_PUBLIC_APP_URL` | `https://pauseforaminute.xyz` | Your domain |

## 📝 Usage

### Creating a Portfolio

1. **Visit Homepage**: Go to your domain
2. **Sign Up/Login**: Click "Create My Portfolio"
3. **Fill Information**: Add your details in the editor
4. **Live Preview**: See changes in real-time
5. **Publish**: Click "Publish" to get your subdomain

### Editor Features

- **Personal Information**: Name, title, bio, location
- **Contact Information**: Email, phone, LinkedIn, GitHub
- **Education**: Add multiple education entries
- **Work Experience**: Add multiple work experiences
- **Skills**: Comma-separated skills list
- **Live Preview**: Real-time preview with device controls
- **Auto-save**: Automatically saves to localStorage

## 🛠️ Development

### Available Scripts

```bash
npm run setup      # Initial setup and directory creation
npm run dev        # Development server with auto-reload
npm run start      # Production server
npm run static     # Serve static files only
```

### Adding Features

1. **Frontend**: Edit files in `public/`
2. **API**: Add serverless functions in `api/`
3. **Styling**: Update CSS in `public/styles/`
4. **Portfolio Template**: Modify `portfolio/[subdomain].js`

### Local Testing

```bash
# Test homepage
curl http://localhost:3000

# Test API
curl http://localhost:3000/api/subdomain/check/test

# Test portfolio creation
curl -X POST http://localhost:3000/api/portfolio/save \
  -H "Content-Type: application/json" \
  -d '{"portfolioData":{"personalInfo":{"fullName":"Test User"}}}'
```

## 🔍 Troubleshooting

### Common Issues

1. **Authentication not working**:
   - Check Clerk publishable key
   - Verify domain settings in Clerk dashboard

2. **Portfolio not saving**:
   - Check Vercel KV connection
   - Verify environment variables

3. **Subdomain not working**:
   - Check DNS configuration
   - Verify wildcard domain in Vercel

4. **Local development issues**:
   - Run `npm run setup`
   - Check if all dependencies are installed

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=true npm run dev
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Documentation**: Check this README
- **Issues**: Create GitHub issue
- **Email**: [your-email@domain.com]

---

**Built with ❤️ using Vercel, Clerk, and modern web technologies.** 