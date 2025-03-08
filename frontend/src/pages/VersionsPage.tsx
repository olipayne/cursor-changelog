import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import ApiService from '../services/api';

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
        <h1 className="text-3xl font-bold mb-6">Cursor Version History</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-primary-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-primary-700">All Detected Versions</h2>
            <p className="text-gray-600 mt-1">A complete history of Cursor versions detected by our system</p>
          </div>
          
          {loading && versions.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="text-red-500">{error}</div>
            </div>
          ) : versions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No version history found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Version
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detected
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {versions.map((version, index) => (
                      <tr 
                        key={version.id} 
                        className={index === 0 ? "bg-green-50" : ""}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {index === 0 ? (
                            <span className="flex items-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                                Latest
                              </span>
                              <span className="font-mono text-lg">v{version.version}</span>
                            </span>
                          ) : (
                            <span className="font-mono">v{version.version}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatRelativeTime(version.detected_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(version.detected_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {hasMore && (
                <div className="flex justify-center p-6 border-t border-gray-200">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="btn btn-outline flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
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
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">About Version History</h2>
          <p className="text-gray-600 mb-3">
            This page shows all Cursor versions detected by our automated system, which checks for new releases every 6 hours.
          </p>
          <p className="text-gray-600">
            The latest version is marked and highlighted. We maintain a complete history of versions to help track the frequency and pattern of Cursor updates.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default VersionsPage; 