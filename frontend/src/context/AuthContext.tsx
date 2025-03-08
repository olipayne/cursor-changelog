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
  login: (email: string) => Promise<void>;
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
  login: async () => {},
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
  const { loginWithRedirect, logout: auth0Logout, user: auth0User, isAuthenticated: isAuth0Authenticated, isLoading: isAuth0Loading } = useAuth0();

  // Check for token and user data on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        } else if (isAuth0Authenticated && auth0User) {
          // If authenticated with Auth0, sync with our backend
          const email = auth0User.email || '';
          const name = auth0User.name || '';
          
          try {
            // Try to login first, if user exists
            const response = await ApiService.auth.login(email);
            const { token, user } = response.data.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
          } catch (err) {
            // If login fails, register the user
            const response = await ApiService.auth.register(email, name);
            const { token, user } = response.data.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuth0Loading) {
      checkAuth();
    }
  }, [auth0User, isAuth0Authenticated, isAuth0Loading]);

  // Login method with email
  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await ApiService.auth.login(email);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register method
  const register = async (email: string, name?: string) => {
    setIsLoading(true);
    try {
      const response = await ApiService.auth.register(email, name);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
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
    localStorage.removeItem('user');
    setUser(null);
    
    // If using Auth0, also log out there
    if (isAuth0Authenticated) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    }
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
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithGitHub,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 