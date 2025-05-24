# PureWork Portfolio Website Builder

A minimalistic SaaS platform for job seekers and personal brand creators to build professional portfolio websites—no coding required.

## Features
- Clean, modern landing page
- User authentication with Clerk
- Split-screen website editor with real-time preview
- Subdomain reservation and activation
- Vercel deployment with wildcard subdomain support
- Cloud database storage with Vercel KV

## Architecture

### Local Development
- **Frontend**: Static HTML/CSS/JS served from Express
- **Backend**: Express server with file-based storage
- **Database**: JSON files in `/data/portfolios/`
- **URLs**: `localhost:54121/[subdomain]`

### Production (Vercel)
- **Frontend**: Static files served from Vercel CDN
- **Backend**: Serverless functions in `/api/`
- **Database**: Vercel KV (Redis-compatible)
- **URLs**: `[subdomain].pureview.dev`

## Getting Started

### Local Development

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd purework-portfolio
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the server:**
   ```sh
   npm start
   ```

4. **Access the app:**
   - Main app: `http://localhost:54121`
   - Editor: `http://localhost:54121/editor.html`
   - Portfolios: `http://localhost:54121/[subdomain]`

### Production Deployment

1. **Deploy to Vercel:**
   - See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions
   - Includes Vercel KV database setup and subdomain configuration

2. **Configure Domain:**
   - Set up `pureview.dev` with wildcard subdomain support
   - Enable HTTPS for all subdomains automatically

## Tech Stack

### Core Technologies
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Express.js (local) / Vercel Functions (production)
- **Database**: JSON files (local) / Vercel KV (production)
- **Authentication**: Clerk
- **Hosting**: Vercel with CDN

### Key Dependencies
- `express` - Local development server
- `@vercel/kv` - Cloud database for production
- `slugify` - URL-safe subdomain generation
- `cors` - Cross-origin resource sharing

## Project Structure

```
purework-portfolio/
├── public/                  # Static frontend files
│   ├── index.html          # Landing page
│   ├── editor.html         # Portfolio editor
│   ├── styles/             # CSS files
│   └── src/                # JavaScript files
├── api/                    # Vercel serverless functions
│   ├── portfolio/          # Portfolio CRUD operations
│   └── subdomain/          # Subdomain management
├── server/                 # Local Express server
├── data/                   # Local JSON storage
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies and scripts
```

## Features in Detail

### 🎨 Split-Screen Editor
- Real-time preview as you type
- Form-based interface for non-technical users
- Auto-save to localStorage
- Device preview controls (desktop/tablet/mobile)

### 🌐 Subdomain System
- Automatic subdomain generation from names
- Conflict resolution with numbered suffixes
- Clean URLs: `john-doe.pureview.dev`

### 🔐 Authentication
- Clerk integration for secure user management
- Session-based access control
- Logout functionality

### 📱 Responsive Design
- Mobile-first approach
- Professional typography with Space Grotesk font
- Clean, minimalistic UI

## Development vs Production

| Feature | Local Development | Production (Vercel) |
|---------|------------------|-------------------|
| **Database** | JSON files | Vercel KV |
| **API** | Express server | Serverless functions |
| **Subdomains** | Path-based (`/subdomain`) | True subdomains |
| **Storage** | File system | Cloud database |
| **HTTPS** | HTTP only | Automatic HTTPS |
| **Scaling** | Single server | Auto-scaling |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm start`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For deployment help, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

---

Built with ❤️ for job seekers and personal brand creators 