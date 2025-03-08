# Cursor Change Alerter

A serverless application that tracks Cursor editor updates and notifies users through various channels when a new version is released.

> **IMPORTANT DISCLAIMER**: This project is NOT affiliated with, endorsed by, or connected to Cursor in any way. This is an independent service created to provide notifications about publicly available information regarding Cursor updates.

## Features

- **Version Tracking**: Automatically checks for new Cursor releases every 5 minutes
- **Multiple Notification Channels**: Support for Slack and Telegram notifications
- **Test Notifications**: Test your notification setup with a single click
- **User Accounts**: Simple authentication system for managing notification preferences
- **Serverless Architecture**: Built on Cloudflare Workers, D1, and other serverless technologies

## Tech Stack

- **Cloudflare Workers**: Serverless JavaScript/TypeScript runtime
- **Cloudflare D1**: Serverless SQL database
- **Cloudflare Pages**: Frontend hosting
- **Hono**: Lightweight web framework for Cloudflare Workers
- **React**: Frontend UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework

## Recent Updates

- Removed Email notifications in favor of focusing on Slack and Telegram
- Added test notification feature to verify notification channel setups
- Added detailed setup instructions for Telegram notifications
- Added About page with disclaimer about non-affiliation with Cursor

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Versions

- `GET /api/versions/latest` - Get the latest Cursor version
- `GET /api/versions/history` - Get version history

### Notifications

- `GET /api/notifications/channels` - Get available notification channels
- `GET /api/notifications/preferences` - Get user notification preferences
- `POST /api/notifications/preferences` - Create a new notification preference
- `PUT /api/notifications/preferences/:id` - Update a notification preference
- `DELETE /api/notifications/preferences/:id` - Delete a notification preference
- `POST /api/notifications/test/:id` - Send a test notification
- `GET /api/notifications/history` - Get notification history

## Development

### Prerequisites

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   wrangler secret put JWT_SECRET
   ```
4. Run locally: `npm run dev`

### Frontend Development

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`

### Deployment

Deploy the backend to Cloudflare Workers:

```
npm run deploy
```

Deploy the frontend to Cloudflare Pages:

```
cd frontend
npm run deploy:prod
```

## License

MIT 