import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout/Layout';
import { FiAlertTriangle, FiCheck, FiDownload, FiArrowRight } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';

// Update interface to match the actual API response
interface Version {
  id: number;
  version: string;
  detected_at: string;
}

interface ApiResponse {
  success: boolean;
  data: Version;
  error?: string;
}

const HomePage: React.FC = () => {
  const [latestVersion, setLatestVersion] = useState<Version | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchLatestVersion = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get<ApiResponse>('/api/versions/latest');
        if (response.data.success) {
          setLatestVersion(response.data.data);
          setError(null);
        } else {
          setError(response.data.error || 'Failed to fetch the latest Cursor version');
        }
      } catch (err) {
        console.error('Error fetching latest release:', err);
        setError('Failed to fetch the latest Cursor version. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestVersion();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Unknown date';
    }
  };

  // For now, we don't have release notes from the API
  const renderPlaceholderNotes = () => {
    return (
      <p className="text-cursor-muted">
        Visit the <a 
          href={latestVersion ? `https://www.cursor.com/changelog#:~:text=${latestVersion.version}` : "https://www.cursor.com/changelog"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary-400 hover:underline"
        >
          Cursor Changelog
        </a> for detailed release notes.
      </p>
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-blue-400 text-transparent bg-clip-text">
            Stay Updated with Cursor Editor
          </h1>
          <p className="text-xl text-cursor-muted max-w-2xl mx-auto">
            Get notified when new versions of Cursor are released and never miss important updates or features.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="card bg-cursor-darker p-6 rounded-lg border border-red-800 mb-8">
            <div className="flex items-center text-red-400">
              <FiAlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : latestVersion && (
          <div className="card mb-12">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300 mb-2">
                  Latest Release
                </span>
                <h2 className="text-2xl font-bold">Cursor {latestVersion.version}</h2>
                <p className="text-cursor-muted mt-1">Released on {formatDate(latestVersion.detected_at)}</p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://www.cursor.com/downloads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-cursor-light rounded-md transition-colors"
                >
                  <FiDownload className="mr-2" />
                  Download
                </a>
                <Link 
                  to="/versions" 
                  className="flex items-center justify-center px-4 py-2 border border-cursor-border hover:bg-cursor-dark text-cursor-light rounded-md transition-colors"
                >
                  View All Versions
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-primary-400 mb-2">What's New:</h3>
              {renderPlaceholderNotes()}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card flex flex-col h-full">
            <h2 className="text-xl font-bold mb-3">Get Notified</h2>
            <p className="text-cursor-muted mb-6 flex-grow">
              Receive notifications when new versions of Cursor are released and stay ahead with the latest features and improvements.
            </p>
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
              >
                Go to dashboard <FiArrowRight className="ml-1" />
              </Link>
            ) : (
              <Link 
                to="/register" 
                className="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
              >
                Sign up now <FiArrowRight className="ml-1" />
              </Link>
            )}
          </div>
          
          <div className="card flex flex-col h-full">
            <h2 className="text-xl font-bold mb-3">Browse All Versions</h2>
            <p className="text-cursor-muted mb-6 flex-grow">
              View the complete history of Cursor releases, including release dates and version numbers for all detected updates.
            </p>
            <Link 
              to="/versions" 
              className="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
            >
              View version history <FiArrowRight className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage; 