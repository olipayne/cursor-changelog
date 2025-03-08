import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 mb-2">
          &copy; {new Date().getFullYear()} Cursor Change Alerter
        </p>
        <p className="text-sm text-gray-500">
          Stay updated with the latest Cursor editor releases
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Built with ❤️ and <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Cursor</a>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          <strong>Not affiliated with Cursor.</strong> <Link to="/about" className="underline hover:text-primary-600">Read our disclaimer</Link>
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <a 
            href="https://github.com/cursor-changeloger/cursor-change-alerter" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary-600 transition-colors"
          >
            GitHub Repo
          </a>
          <Link 
            to="/about" 
            className="text-gray-500 hover:text-primary-600 transition-colors"
          >
            About
          </Link>
          <a 
            href="https://www.cursor.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary-600 transition-colors"
          >
            Cursor Editor
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 