import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiMenu, FiX } from 'react-icons/fi';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-cursor-darker text-cursor-light border-b border-cursor-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <svg 
              className="w-7 h-7 mr-2 group-hover:text-primary-400 text-cursor-light transition-colors" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 4L20 12L12 20L4 12L12 4Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-bold tracking-tight">Cursor Changelog</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-cursor-light hover:text-primary-400 focus:outline-none transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/versions" className="hover:text-primary-400 transition-colors text-sm">
                Versions
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary-400 transition-colors text-sm">
                About
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" className="hover:text-primary-400 transition-colors text-sm">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-primary-400 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-primary-400 transition-colors text-sm">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-cursor-light px-4 py-2 rounded text-sm transition-colors">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-4 pt-2 pb-4 bg-cursor-darker border-t border-cursor-border">
            <ul className="flex flex-col space-y-3">
              <li>
                <Link 
                  to="/versions" 
                  className="block hover:text-primary-400 transition-colors text-sm py-2"
                  onClick={closeMenu}
                >
                  Versions
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="block hover:text-primary-400 transition-colors text-sm py-2"
                  onClick={closeMenu}
                >
                  About
                </Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      to="/dashboard" 
                      className="block hover:text-primary-400 transition-colors text-sm py-2"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="block w-full text-left hover:text-primary-400 transition-colors text-sm py-2"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="block hover:text-primary-400 transition-colors text-sm py-2"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="pt-2">
                    <Link 
                      to="/register" 
                      className="block w-full bg-primary-600 hover:bg-primary-700 text-cursor-light px-4 py-2 rounded text-sm transition-colors text-center"
                      onClick={closeMenu}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 