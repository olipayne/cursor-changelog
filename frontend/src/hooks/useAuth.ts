import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook for easy access to the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 