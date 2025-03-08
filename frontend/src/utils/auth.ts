// Token keys
export const AUTH0_TOKEN_KEY = 'auth0_token';
export const BACKEND_TOKEN_KEY = 'cursor_alerter_token';

/**
 * Sets the Auth0 token in local storage
 */
export const setAuth0Token = (token: string): void => {
  if (token) {
    localStorage.setItem(AUTH0_TOKEN_KEY, token);
  }
};

/**
 * Sets the backend JWT token in local storage
 */
export const setBackendToken = (token: string): void => {
  if (token) {
    localStorage.setItem(BACKEND_TOKEN_KEY, token);
  }
};

/**
 * Gets the appropriate token for API requests
 * Prioritizes backend token over Auth0 token
 */
export const getToken = (): string | null => {
  const backendToken = localStorage.getItem(BACKEND_TOKEN_KEY);
  if (backendToken) {
    return backendToken;
  }
  
  const auth0Token = localStorage.getItem(AUTH0_TOKEN_KEY);
  return auth0Token;
};

/**
 * Removes all auth tokens from local storage
 */
export const removeTokens = (): void => {
  localStorage.removeItem(AUTH0_TOKEN_KEY);
  localStorage.removeItem(BACKEND_TOKEN_KEY);
}; 