import React, { useEffect, useState } from 'react';

// This component will redirect to the RSS feed endpoint on the backend
const RssFeed: React.FC = () => {
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Since we can't properly set Content-Type headers in React Router,
    // we'll redirect to a backend endpoint that serves the RSS feed
    if (isRedirecting) {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.cursor-changelog.com';
      window.location.href = `${apiBaseUrl}/api/versions/rss`;
      setIsRedirecting(false);
    }
  }, [isRedirecting]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-cursor-dark text-cursor-light">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Redirecting to RSS Feed...</h1>
        <p className="text-cursor-muted">
          If you are not redirected automatically, 
          <a 
            href="https://api.cursor-changelog.com/api/versions/rss" 
            className="text-primary-400 hover:underline ml-1"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RssFeed; 