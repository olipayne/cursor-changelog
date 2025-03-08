import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            Cursor Change Alerter
          </Link>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-primary-200 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/versions" className="hover:text-primary-200 transition-colors">
                Versions
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary-200 transition-colors">
                About
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" className="hover:text-primary-200 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-primary-200 transition-colors"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-primary-200 transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="bg-white text-primary-600 px-4 py-2 rounded-md hover:bg-primary-50 transition-colors">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 