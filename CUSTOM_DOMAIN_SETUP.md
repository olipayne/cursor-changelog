# Custom Domain Setup for Cursor Change Alerter

This document outlines the steps to set up custom domains for both the backend API and frontend of the Cursor Change Alerter application.

## Domain Structure

The project uses the following domain structure:
- Frontend: `cursor-changelog.com`
- API/Backend: `api.cursor-changelog.com`

## Prerequisites

1. Own the domain `cursor-changelog.com`
2. Have access to DNS settings for the domain
3. Have a Cloudflare account with the domain added to your Cloudflare account

## Backend Custom Domain Setup

### 1. Configure Wrangler

The backend custom domain is configured in `wrangler.jsonc`:

```json
"routes": [
  { "pattern": "api.cursor-changelog.com", "custom_domain": true }
]
```

### 2. Verify DNS Settings

1. Log in to the Cloudflare Dashboard
2. Navigate to the DNS settings for your domain
3. Create or verify that you have an A record for `api.cursor-changelog.com` pointing to `192.0.2.1` (Cloudflare's placeholder IP)
4. Make sure the proxy status is enabled (orange cloud)

### 3. SSL/TLS Settings

1. In the Cloudflare Dashboard, go to the SSL/TLS section
2. Set the encryption mode to "Full" or "Full (strict)"
3. Ensure that a certificate is issued for `api.cursor-changelog.com`

## Frontend Custom Domain Setup

### 1. Deploy the Frontend to Cloudflare Pages

Use the following command to deploy the frontend:

```bash
cd frontend
npm run build
npx wrangler pages deploy dist
```

### 2. Add Custom Domain to Pages Project

1. Log in to the Cloudflare Dashboard
2. Navigate to the "Pages" section
3. Select the "cursor-changelog-pages" project
4. Go to the "Custom domains" tab
5. Click "Set up a custom domain"
6. Enter "cursor-changelog.com" as the domain
7. Follow the prompts to complete the domain setup

### 3. Verify DNS Settings

1. Check that Cloudflare has automatically created the necessary DNS records
2. You should see a CNAME record for `cursor-changelog.com` pointing to your Pages project

## Environment Configuration

Make sure your environment variables point to the correct domains:

### Backend
No additional configuration needed, as the backend references itself.

### Frontend
Update the `.env` file to use the custom domain for API calls:

```
VITE_API_URL=https://api.cursor-changelog.com
```

## Verification

After completing the setup:

1. Visit `https://cursor-changelog.com` to confirm the frontend is working
2. Make API requests to `https://api.cursor-changelog.com` to confirm the backend is working
3. Test authentication and other features to ensure everything is functioning correctly

## Troubleshooting

If you encounter any issues:

1. Verify DNS settings and ensure propagation has completed (may take up to 24 hours)
2. Check for any SSL/TLS errors in the browser console
3. Confirm that the Cloudflare Worker and Pages configurations are correct
4. Inspect the Cloudflare Logs in the dashboard for any errors 