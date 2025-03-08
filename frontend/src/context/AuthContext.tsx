import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ApiService from '../services/api';

// User type definition
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Authentication context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (email: string, name?: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => void;
  loginWithGitHub: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  register: async () => {},
  logout: () => {},
  loginWithGoogle: () => {},
  loginWithGitHub: () => {},
});

// Auth provider props type
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { 
    loginWithRedirect, 
    logout: auth0Logout, 
    user: auth0User, 
    isAuthenticated: isAuth0Authenticated, 
    isLoading: isAuth0Loading, 
    getAccessTokenSilently 
  } = useAuth0();

  // Check for auth state and sync with backend
  useEffect(() => {
    const syncAuthState = async () => {
      try {
        // If authenticated with Auth0
        if (isAuth0Authenticated && auth0User) {
          const email = auth0User.email || '';
          const name = auth0User.name || '';
          
          try {
            // Get token from Auth0
            const auth0Token = await getAccessTokenSilently();
            
            // Try to login or register with our backend to get our custom token
            try {
              // First try to login
              const response = await ApiService.auth.login(email);
              const backendToken = response.data.data.token;
              const userData = response.data.data.user;
              
              // Store both tokens - backend token for API requests, Auth0 token for authentication state
              localStorage.setItem('token', backendToken);
              localStorage.setItem('auth0Token', auth0Token);
              localStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
            } catch (err) {
              // If login fails, register the user
              const response = await ApiService.auth.register(email, name);
              const backendToken = response.data.data.token;
              const userData = response.data.data.user;
              
              localStorage.setItem('token', backendToken);
              localStorage.setItem('auth0Token', auth0Token);
              localStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
            }
          } catch (error) {
            console.error('Failed to get token from Auth0:', error);
          }
        } else {
          // Check for token in local storage (for existing sessions)
          const token = localStorage.getItem('token');
          const userData = localStorage.getItem('user');
          
          if (token && userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('auth0Token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuth0Loading) {
      syncAuthState();
    }
  }, [auth0User, isAuth0Authenticated, isAuth0Loading, getAccessTokenSilently]);

  // Register method (only used for direct registrations without Auth0)
  const register = async (email: string, name?: string) => {
    setIsLoading(true);
    try {
      // Use Auth0's universal login for signup
      await loginWithRedirect({
        authorizationParams: {
          connection: 'Username-Password-Authentication',
          screen_hint: 'signup',
        }
      });
      // Auth0 will handle the authentication flow
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth0Token');
    localStorage.removeItem('user');
    setUser(null);
    
    // Log out from Auth0
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // Login with Google
  const loginWithGoogle = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2'
      }
    });
  };

  // Login with GitHub
  const loginWithGitHub = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'github'
      }
    });
  };

  // Value object for the context provider
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    register,
    logout,
    loginWithGoogle,
    loginWithGitHub,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 