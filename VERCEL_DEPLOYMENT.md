# Vercel Deployment Guide

## 🚀 Deploy PureWork to Vercel

This guide will help you deploy your portfolio builder to Vercel with subdomain support.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Domain**: Purchase `pureview.dev` or your chosen domain

### Step 1: Set up Vercel KV Database

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → KV
3. Name it `purework-portfolios`
4. Copy the connection details

### Step 2: Environment Variables

In your Vercel project settings, add these environment variables:

```bash
# Vercel KV Database
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dHJ1c3Rpbmctd2FzcC0zNy5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=your_clerk_secret_key

# Domain Configuration
NEXT_PUBLIC_DOMAIN=pauseforaminute.xyz
NEXT_PUBLIC_APP_URL=https://pauseforaminute.xyz
```

### Step 3: Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration from `vercel.json`
3. Deploy!

### Step 4: Configure Custom Domain & Subdomains

1. **Add Domain**: In Vercel project settings, add `pauseforaminute.xyz`
2. **Wildcard Subdomain**: Add `*.pauseforaminute.xyz` for portfolio subdomains
3. **DNS Configuration**: Point your domain's DNS to Vercel:
   ```
   A Record: @ → 76.76.19.19
   CNAME: * → cname.vercel-dns.com
   ```

### Step 5: Test Your Deployment

1. Visit `https://pauseforaminute.xyz` - should show your landing page
2. Create a portfolio and publish it
3. Visit `https://[subdomain].pauseforaminute.xyz` - should show the portfolio

### Features After Deployment

✅ **Serverless API Routes**: Portfolio saving/loading via Vercel Functions  
✅ **Global CDN**: Fast loading worldwide  
✅ **Automatic HTTPS**: SSL certificates for all subdomains  
✅ **Scalable Database**: Vercel KV for portfolio storage  
✅ **Authentication**: Clerk integration for user management  
✅ **Subdomain Routing**: Dynamic portfolio URLs  

### Local Development vs Production

| Feature | Local (localhost:54121) | Production (Vercel) |
|---------|------------------------|-------------------|
| Database | JSON files | Vercel KV |
| API | Express server | Serverless functions |
| Subdomains | `/subdomain` paths | `subdomain.domain.com` |
| Storage | File system | Cloud database |

### Troubleshooting

**Portfolio not saving?**
- Check KV database connection in Vercel dashboard
- Verify environment variables are set

**Subdomain not working?**
- Ensure wildcard domain `*.pureview.dev` is added
- Check DNS propagation (can take up to 24 hours)

**Authentication issues?**
- Verify Clerk publishable key matches your domain
- Check Clerk dashboard for allowed origins

### Next Steps

1. **Custom Domain**: Set up your own domain
2. **Analytics**: Add Vercel Analytics
3. **Monitoring**: Set up error tracking
4. **Payments**: Integrate Stripe for premium features
5. **SEO**: Add meta tags and sitemaps 