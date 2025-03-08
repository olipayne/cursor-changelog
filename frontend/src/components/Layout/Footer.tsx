import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cursor-darker py-8 mt-auto border-t border-cursor-border">
      <div className="container mx-auto px-4 text-center">
        <p className="text-cursor-light mb-2">
          &copy; {new Date().getFullYear()} Cursor Changelog
        </p>
        <p className="text-sm text-cursor-muted">
          Stay updated with the latest Cursor editor releases
        </p>
        <p className="text-sm text-cursor-muted mt-1">
          Built with ❤️ and <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Cursor</a>
        </p>
        <p className="text-xs text-cursor-muted mt-2">
          <strong>Not affiliated with Cursor.</strong> <Link to="/about" className="underline hover:text-primary-400">Read our disclaimer</Link>
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <a 
            href="https://github.com/olipayne/cursor-changelog" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cursor-muted hover:text-primary-400 transition-colors text-sm"
          >
            GitHub
          </a>
          <Link 
            to="/about" 
            className="text-cursor-muted hover:text-primary-400 transition-colors text-sm"
          >
            About
          </Link>
          <a 
            href="https://www.cursor.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cursor-muted hover:text-primary-400 transition-colors text-sm"
          >
            Cursor Editor
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 