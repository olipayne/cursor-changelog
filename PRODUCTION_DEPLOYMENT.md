# Production Deployment Guide

This document outlines the steps for deploying the Cursor Change Alerter application to production.

## Backend Deployment

### Deploy API with Custom Domain

```bash
# Navigate to the project root
cd cursor-changelog

# Deploy to Cloudflare Workers
npx wrangler deploy
```

This will deploy the backend API to `api.cursor-changelog.com` as configured in `wrangler.jsonc`.

### Setting JWT Secret

For production, set a secure JWT secret:

```bash
# Set a secure random JWT secret
npx wrangler secret put JWT_SECRET
```

## Frontend Deployment

### Production Build and Deploy

```bash
# Navigate to the frontend directory
cd frontend

# Build and deploy to production
npm run deploy:prod
```

This uses the dedicated production deployment script which:
- Builds the application with production settings
- Deploys to the 'main' branch which is configured as the production branch
- Sets appropriate commit messages and metadata

### Environment Variables

For production, you need to set environment variables. The easiest way is through the Cloudflare Dashboard:

1. Log in to the Cloudflare Dashboard
2. Navigate to the "Pages" section
3. Select the "cursor-changelog-pages" project
4. Go to the "Settings" tab, then "Environment variables"
5. Add the following variables in the "Production" column:
   - `VITE_API_URL`: https://api.cursor-changelog.com
   - `VITE_AUTH0_DOMAIN`: Your Auth0 domain
   - `VITE_AUTH0_CLIENT_ID`: Your Auth0 client ID
6. Click "Save" to apply the changes
7. Redeploy your application to use the new environment variables

### Triggering a Production Deployment

After setting environment variables, you can trigger a new production deployment:

```bash
cd frontend
npm run deploy:prod
```

## Monitoring the Production Application

To confirm your application is working correctly in production:

1. Visit `https://cursor-changelog.com` in your browser
2. Check that API requests to `https://api.cursor-changelog.com` are working
3. Try signing in and checking notification preferences
4. Monitor the application logs in the Cloudflare Dashboard

## Custom Domain Setup

Refer to `CUSTOM_DOMAIN_SETUP.md` for detailed instructions on setting up and maintaining your custom domains. 