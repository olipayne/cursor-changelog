import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import ApiService from '../services/api';
import { FiClock, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';

interface Version {
  id: number;
  version: string;
  detected_at: string;
}

const VersionsPage: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    loadVersions(0);
  }, []);

  const loadVersions = async (newOffset: number) => {
    try {
      setLoading(true);
      const response = await ApiService.versions.getHistory(limit, newOffset);
      
      if (response.data.success) {
        const newVersions = response.data.data;
        
        if (newOffset === 0) {
          setVersions(newVersions);
        } else {
          setVersions(prev => [...prev, ...newVersions]);
        }
        
        // Check if there are more versions to load
        if (newVersions.length < limit) {
          setHasMore(false);
        }
      } else {
        setError(response.data.error || 'Failed to fetch version history');
      }
    } catch (err) {
      setError('An error occurred while fetching version history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    loadVersions(newOffset);
  };

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

  // Format date in a readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-blue-400 text-transparent bg-clip-text">
          Cursor Version History
        </h1>
        
        <div className="card mb-8">
          <div className="p-4 border-b border-cursor-border mb-4">
            <h2 className="text-xl font-semibold text-primary-400">All Detected Versions</h2>
            <p className="text-cursor-muted mt-1">A complete history of Cursor versions detected by our system</p>
          </div>
          
          {loading && versions.length === 0 ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="flex items-center justify-center text-red-400">
                <FiAlertTriangle className="mr-2" />
                <span>{error}</span>
              </div>
            </div>
          ) : versions.length === 0 ? (
            <div className="p-12 text-center text-cursor-muted">
              No version history found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-cursor-border">
                  <thead className="bg-cursor-darker">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cursor-muted uppercase tracking-wider">
                        Version
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cursor-muted uppercase tracking-wider">
                        Detected
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cursor-muted uppercase tracking-wider">
                        Full Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cursor-border">
                    {versions.map((version, index) => (
                      <tr 
                        key={version.id} 
                        className={index === 0 ? "bg-cursor-dark/40" : ""}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {index === 0 ? (
                            <span className="flex items-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300 mr-2">
                                Latest
                              </span>
                              <span className="font-mono text-lg text-primary-400">v{version.version}</span>
                            </span>
                          ) : (
                            <span className="font-mono text-cursor-light">v{version.version}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-cursor-muted">
                          <div className="flex items-center">
                            <FiClock className="mr-2" />
                            {formatRelativeTime(version.detected_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-cursor-muted">
                          <div className="flex items-center">
                            <FiCalendar className="mr-2" />
                            {formatDate(version.detected_at)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {hasMore && (
                <div className="flex justify-center p-6 border-t border-cursor-border mt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-4 py-2 border border-cursor-border text-cursor-light rounded hover:bg-cursor-dark flex items-center transition-colors"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Loading more...
                      </>
                    ) : (
                      'Load More Versions'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-400">About Version History</h2>
          <p className="text-cursor-muted mb-3">
            This page shows all Cursor versions detected by our automated system, which checks for new releases every 5 minutes.
          </p>
          <p className="text-cursor-muted">
            The latest version is marked and highlighted. We maintain a complete history of versions to help track the frequency and pattern of Cursor updates.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default VersionsPage; 