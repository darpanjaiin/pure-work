# 🚀 Deployment Checklist

Use this checklist to ensure your PureWork portfolio builder is properly deployed and functional.

## ✅ Pre-Deployment Setup

### 1. Environment Variables
- [ ] **Clerk Authentication**
  - [ ] `CLERK_SECRET_KEY` (from Clerk Dashboard → API Keys)
  - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (already set: `pk_test_dHJ1c3Rpbmctd2FzcC0zNy5jbGVyay5hY2NvdW50cy5kZXYk`)

- [ ] **Vercel KV Database**
  - [ ] `KV_REST_API_URL` (from Vercel Dashboard → Storage → KV)
  - [ ] `KV_REST_API_TOKEN` (from Vercel Dashboard → Storage → KV)

- [ ] **Domain Configuration**
  - [ ] `NEXT_PUBLIC_DOMAIN=pauseforaminute.xyz`
  - [ ] `NEXT_PUBLIC_APP_URL=https://pauseforaminute.xyz`

### 2. Clerk Setup
- [ ] Create Clerk account at [clerk.com](https://clerk.com)
- [ ] Create new application
- [ ] Configure allowed domains:
  - [ ] Add `pauseforaminute.xyz`
  - [ ] Add `*.pauseforaminute.xyz` (for subdomains)
- [ ] Set redirect URLs:
  - [ ] Sign-in: `https://pauseforaminute.xyz/editor.html`
  - [ ] Sign-up: `https://pauseforaminute.xyz/editor.html`

### 3. Vercel KV Database
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Navigate to Storage → KV
- [ ] Create new database (name: `purework-portfolios`)
- [ ] Copy connection details

## 🌐 Domain & DNS Setup

### 1. Domain Configuration in Vercel
- [ ] Add `pauseforaminute.xyz` to Vercel project
- [ ] Add `*.pauseforaminute.xyz` (wildcard subdomain)
- [ ] Verify domain ownership

### 2. DNS Configuration
- [ ] **A Record**: `@` → `76.76.21.21`
- [ ] **CNAME Record**: `*` → `cname.vercel-dns.com`
- [ ] **CNAME Record**: `www` → `pauseforaminute.xyz`

### 3. SSL Certificate
- [ ] Vercel automatically provisions SSL
- [ ] Verify HTTPS works for main domain
- [ ] Verify HTTPS works for subdomains

## 🚀 Vercel Deployment

### 1. Repository Setup
- [ ] Push code to GitHub
- [ ] Ensure all files are committed:
  - [ ] `vercel.json`
  - [ ] `package.json`
  - [ ] `api/` directory
  - [ ] `portfolio/` directory
  - [ ] `public/` directory

### 2. Vercel Project Setup
- [ ] Import GitHub repository to Vercel
- [ ] Set framework preset to "Other"
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `public`

### 3. Environment Variables in Vercel
Add all environment variables in Project Settings → Environment Variables:

- [ ] `KV_REST_API_URL`
- [ ] `KV_REST_API_TOKEN`
- [ ] `CLERK_SECRET_KEY`
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `NEXT_PUBLIC_DOMAIN`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NODE_ENV=production`

### 4. Deploy
- [ ] Trigger deployment
- [ ] Check deployment logs for errors
- [ ] Verify deployment success

## 🧪 Post-Deployment Testing

### 1. Homepage Testing
- [ ] Visit `https://pauseforaminute.xyz`
- [ ] Verify homepage loads correctly
- [ ] Test "Create My Portfolio" button
- [ ] Verify Clerk authentication modal appears

### 2. Authentication Testing
- [ ] Sign up with new account
- [ ] Verify email confirmation (if enabled)
- [ ] Test sign-in process
- [ ] Verify redirect to editor after login

### 3. Editor Testing
- [ ] Access `https://pauseforaminute.xyz/editor.html`
- [ ] Verify authentication check works
- [ ] Test form inputs and live preview
- [ ] Test adding/removing education and experience
- [ ] Verify auto-save functionality

### 4. Portfolio Creation Testing
- [ ] Fill out portfolio information
- [ ] Click "Publish" button
- [ ] Verify success modal appears
- [ ] Test generated subdomain URL
- [ ] Verify portfolio displays correctly

### 5. Subdomain Testing
- [ ] Create test portfolio with subdomain `test`
- [ ] Visit `https://test.pauseforaminute.xyz`
- [ ] Verify portfolio loads correctly
- [ ] Test responsive design on mobile
- [ ] Verify all contact links work

### 6. API Testing
Test API endpoints directly:

```bash
# Check subdomain availability
curl https://pauseforaminute.xyz/api/subdomain/check/test

# Test portfolio retrieval
curl https://pauseforaminute.xyz/api/portfolio/test
```

## 🔍 Troubleshooting

### Common Issues & Solutions

#### 1. Authentication Not Working
- **Issue**: Clerk authentication fails
- **Solutions**:
  - [ ] Verify Clerk publishable key is correct
  - [ ] Check domain settings in Clerk dashboard
  - [ ] Ensure redirect URLs are properly configured

#### 2. Portfolio Not Saving
- **Issue**: "Error publishing portfolio" message
- **Solutions**:
  - [ ] Check Vercel KV connection in dashboard
  - [ ] Verify environment variables are set
  - [ ] Check function logs in Vercel dashboard

#### 3. Subdomain Not Working
- **Issue**: Subdomain returns 404 or doesn't load
- **Solutions**:
  - [ ] Verify wildcard domain is added in Vercel
  - [ ] Check DNS CNAME record for `*`
  - [ ] Wait for DNS propagation (up to 24 hours)

#### 4. SSL Certificate Issues
- **Issue**: HTTPS not working for subdomains
- **Solutions**:
  - [ ] Verify wildcard domain is properly configured
  - [ ] Check Vercel SSL certificate status
  - [ ] Wait for certificate provisioning

## 📊 Monitoring & Maintenance

### 1. Regular Checks
- [ ] Monitor Vercel function logs
- [ ] Check Vercel KV database usage
- [ ] Monitor Clerk authentication metrics
- [ ] Verify domain and SSL certificate status

### 2. Performance Monitoring
- [ ] Test page load speeds
- [ ] Monitor API response times
- [ ] Check mobile responsiveness
- [ ] Verify SEO meta tags

### 3. Security
- [ ] Keep dependencies updated
- [ ] Monitor Clerk security alerts
- [ ] Review Vercel security recommendations
- [ ] Regular backup of portfolio data

## 🎉 Launch Checklist

### Final Steps Before Going Live
- [ ] All tests pass ✅
- [ ] Domain properly configured ✅
- [ ] SSL certificates active ✅
- [ ] Authentication working ✅
- [ ] Portfolio creation working ✅
- [ ] Subdomains working ✅
- [ ] Mobile responsive ✅
- [ ] Error handling tested ✅

### Marketing & Launch
- [ ] Update social media profiles
- [ ] Create launch announcement
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Prepare customer support documentation

---

**🚀 Ready to launch! Your PureWork portfolio builder is now live and functional.**

## 📞 Support

If you encounter any issues during deployment:

1. Check the troubleshooting section above
2. Review Vercel deployment logs
3. Check Clerk dashboard for authentication issues
4. Verify all environment variables are set correctly

**Happy deploying! 🎉** 