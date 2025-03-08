// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cursor-change-alerter.olbol.workers.dev';

// Auth0 configuration
export const AUTH0_CONFIG = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  redirectUri: window.location.origin,
  audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
  scope: 'openid profile email',
  cacheLocation: 'localstorage' as 'localstorage' | 'memory',
  useRefreshTokens: true
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
  },
  // Version endpoints
  VERSIONS: {
    LATEST: '/api/versions/latest',
    HISTORY: '/api/versions/history',
  },
  // Notification endpoints
  NOTIFICATIONS: {
    CHANNELS: '/api/notifications/channels',
    PREFERENCES: '/api/notifications/preferences',
    HISTORY: '/api/notifications/history',
  }
}; 