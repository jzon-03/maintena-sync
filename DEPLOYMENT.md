# GitHub Pages Deployment Guide

## Quick Deployment

Run the deployment script:
```bash
node deploy.js
```

## Manual Deployment

1. Build the application:
```bash
npm run build:github-pages
```

2. Deploy to GitHub Pages:
```bash
npm run deploy:github-pages
```

## Custom Domain Setup

Your custom domain `preventive-maintenance.sharpfloornc.com` is already configured in the CNAME file.

### DNS Configuration Required

Configure your domain with these DNS records:

**For subdomain (recommended):**
```
Type: CNAME
Name: preventive-maintenance
Value: jzon-03.github.io
```

**Or for apex domain:**
```
Type: A
Name: @
Values: 
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
```

**And AAAA records:**
```
Type: AAAA
Name: @
Values:
  2606:50c0:8000::153
  2606:50c0:8001::153
  2606:50c0:8002::153
  2606:50c0:8003::153
```

## Repository Settings

1. Go to your repository settings on GitHub
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select "gh-pages" branch
5. Set folder to "/ (root)"
6. Add custom domain: `preventive-maintenance.sharpfloornc.com`
7. Enable "Enforce HTTPS"

## Automated Deployment

The GitHub Actions workflow will automatically deploy when you push to the master branch.