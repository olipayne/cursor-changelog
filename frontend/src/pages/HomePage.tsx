import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ApiService from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Helmet } from 'react-helmet-async';

interface VersionData {
  id: number;
  version: string;
  detected_at: string;
}

const HomePage: React.FC = () => {
  const [latestVersion, setLatestVersion] = useState<VersionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        const response = await ApiService.versions.getLatest();
        if (response.data.success) {
          setLatestVersion(response.data.data);
        } else {
          setError(response.data.error || 'Failed to fetch the latest version');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestVersion();
  }, []);

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Array of time period divisions
    const divisions = [
      { amount: 60 * 60 * 24 * 365, name: 'year', plural: 'years' },
      { amount: 60 * 60 * 24 * 30, name: 'month', plural: 'months' },
      { amount: 60 * 60 * 24 * 7, name: 'week', plural: 'weeks' },
      { amount: 60 * 60 * 24, name: 'day', plural: 'days' },
      { amount: 60 * 60, name: 'hour', plural: 'hours' },
      { amount: 60, name: 'minute', plural: 'minutes' },
      { amount: 1, name: 'second', plural: 'seconds' }
    ];
    
    for (const division of divisions) {
      if (seconds >= division.amount) {
        const count = Math.floor(seconds / division.amount);
        return `${count} ${count === 1 ? division.name : division.plural} ago`;
      }
    }
    
    return 'just now';
  };

  return (
    <Layout>
      <Helmet>
        <title>Cursor Change Alerter - Stay Updated with the Latest Cursor Releases</title>
        <meta name="description" content="Receive notifications when new versions of Cursor editor are released. Get updates via Email, Slack, Telegram, and more." />
      </Helmet>
      
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Cursor Change Alerter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stay up-to-date with the latest Cursor editor releases through personalized notifications
          </p>
          
          <div className="mt-8">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn btn-primary px-8 py-3 rounded-md text-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="btn btn-primary px-8 py-3 rounded-md text-lg"
              >
                Sign Up for Free
              </Link>
            )}
          </div>
        </section>
        
        {/* Latest Version Section */}
        <section className="py-12">
          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100">
            <h2 className="text-2xl font-bold mb-6 text-center">Latest Cursor Version</h2>
            
            <div className="py-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
              ) : latestVersion ? (
                <div className="text-center space-y-4">
                  <div className="inline-block bg-primary-100 text-primary-800 text-3xl px-6 py-2 rounded-lg font-mono">
                    v{latestVersion.version}
                  </div>
                  
                  <div className="flex flex-col gap-1 items-center">
                    <p className="text-gray-600">
                      Detected {formatRelativeTime(latestVersion.detected_at)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Date(latestVersion.detected_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <a 
                      href="https://www.cursor.com/downloads" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary inline-block"
                    >
                      Download Now
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No version information available</p>
              )}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Use Cursor Change Alerter?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Stay Updated</h3>
              <p className="text-gray-600">
                Never miss a Cursor update again. Get notified as soon as new versions are released.
              </p>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Multiple Channels</h3>
              <p className="text-gray-600">
                Choose how you want to be notified: Email, Slack, Telegram, and more.
              </p>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Simple Setup</h3>
              <p className="text-gray-600">
                Easy to configure and manage. Set up once and forget about it.
              </p>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-12 text-center">
          <div className="card bg-primary-50 border border-primary-100">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Create an account and set up your notification preferences in minutes.
            </p>
            
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn btn-primary"
              >
                Go to Your Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="btn btn-primary"
              >
                Sign Up Now
              </Link>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage; 