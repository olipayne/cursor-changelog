# Cursor Change Alerter Frontend

This is the frontend application for the Cursor Change Alerter service. It provides a user interface for managing notification preferences and viewing Cursor version history.

> **IMPORTANT**: This project is NOT affiliated with, endorsed by, or connected to Cursor in any way.

## Features

- User registration and authentication
- Notification channel management (Slack, Telegram)
- Test notification feature
- Cursor version history view
- Responsive design with Tailwind CSS

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios for API communication
- Cloudflare Pages for hosting

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Install dependencies:
```
npm install
```

2. Set up environment variables by creating a `.env.local` file:
```
VITE_API_URL=http://localhost:8787
```

3. Start the development server:
```
npm run dev
```

4. Build for production:
```
npm run build
```

5. Preview the production build:
```
npm run preview
```

## Deployment

Deploy to Cloudflare Pages:

```
npm run deploy:prod
```

This command builds the application and deploys it to Cloudflare Pages with custom domain configuration.

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components for different routes
- `src/services/` - API and authentication services
- `src/hooks/` - Custom React hooks
- `src/context/` - React context providers
- `src/types/` - TypeScript type definitions

## License

MIT

