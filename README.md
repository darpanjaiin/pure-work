# PureWork Portfolio Website Builder

A minimalistic SaaS platform for job seekers and personal brand creators to build professional portfolio websites—no coding required.

## Features
- Clean, modern landing page
- User authentication (Clerk or Supabase)
- Split-screen website editor with real-time preview
- Subdomain reservation and activation
- Stripe-powered payment flow
- Hosted on Vercel with wildcard subdomain support

## Folder Structure
```
purework-portfolio/
│
├── public/                  # Static assets (images, favicon, etc.)
│   └── ...
│
├── src/                     # Source code
│   ├── components/          # Reusable UI components (buttons, forms, etc.)
│   ├── pages/               # Page-level components (Landing, Editor, Auth, etc.)
│   ├── styles/              # CSS or Tailwind config
│   ├── utils/               # Utility functions (API, helpers)
│   └── index.js             # App entry point
│
├── .env.example             # Example environment variables
├── package.json             # Project dependencies and scripts
├── README.md                # Project overview and setup instructions
├── vercel.json              # Vercel configuration (for subdomains, rewrites)
└── ...
```

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd purework-portfolio
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your Supabase/Clerk, Stripe, and Vercel credentials.
4. **Run locally:**
   ```sh
   npm start
   ```
5. **Deploy to Vercel:**
   - Connect your repo to Vercel and follow the deployment instructions.

## Tech Stack
- HTML, CSS, JavaScript
- Clerk or Supabase (authentication & database)
- Stripe (payments)
- Vercel (hosting)
- GoDaddy (domain management)

## License
MIT 