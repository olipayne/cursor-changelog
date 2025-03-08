import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../hooks/useAuth';
import ApiService from '../services/api';

interface NotificationChannel {
  id: number;
  name: string;
  config: string;
}

interface NotificationPreference {
  id: number;
  channel_id: number;
  channel_config: string;
  is_active: boolean;
}

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New preference state
  const [newChannelId, setNewChannelId] = useState<number | ''>('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newChatId, setNewChatId] = useState('');
  const [newBotToken, setNewBotToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestingChannel, setIsTestingChannel] = useState<number | null>(null);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        
        // Fetch notification channels
        const channelsResponse = await ApiService.notifications.getChannels();
        if (channelsResponse.data.success) {
          setChannels(channelsResponse.data.data);
        }
        
        // Fetch user's notification preferences
        const preferencesResponse = await ApiService.notifications.getPreferences();
        if (preferencesResponse.data.success) {
          setPreferences(preferencesResponse.data.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load notification settings. Please try again later.');
      } finally {
        setIsLoadingData(false);
      }
    };
    
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  
  const handleAddPreference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelId) return;
    
    try {
      setIsSubmitting(true);
      
      // Create channel config based on channel type
      const selectedChannel = channels.find(channel => channel.id === newChannelId);
      if (!selectedChannel) return;
      
      let channelConfig: any = {};
      
      switch (selectedChannel.name.toLowerCase()) {
        case 'slack':
          channelConfig = { webhook: newWebhookUrl };
          break;
        case 'telegram':
          channelConfig = { chatId: newChatId, botToken: newBotToken };
          break;
      }
      
      // Create new preference
      const response = await ApiService.notifications.createPreference(
        Number(newChannelId),
        channelConfig,
        true
      );
      
      if (response.data.success) {
        // Add new preference to state
        setPreferences(prev => [...prev, response.data.data]);
        
        // Reset form
        setNewChannelId('');
        setNewWebhookUrl('');
        setNewChatId('');
        setNewBotToken('');
        
        setError(null);
      }
    } catch (err) {
      console.error('Error adding notification preference:', err);
      setError('Failed to add notification preference. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTogglePreference = async (id: number, isActive: boolean) => {
    try {
      const response = await ApiService.notifications.updatePreference(id, {
        is_active: !isActive
      });
      
      if (response.data.success) {
        // Update preferences in state
        setPreferences(prev => 
          prev.map(pref => 
            pref.id === id ? { ...pref, is_active: !isActive } : pref
          )
        );
      }
    } catch (err) {
      console.error('Error updating notification preference:', err);
      setError('Failed to update notification status. Please try again.');
    }
  };
  
  const handleDeletePreference = async (id: number) => {
    if (!confirm('Are you sure you want to delete this notification channel?')) return;
    
    try {
      const response = await ApiService.notifications.deletePreference(id);
      
      if (response.data.success) {
        // Remove preference from state
        setPreferences(prev => prev.filter(pref => pref.id !== id));
      }
    } catch (err) {
      console.error('Error deleting notification preference:', err);
      setError('Failed to delete notification channel. Please try again.');
    }
  };
  
  const handleTestNotification = async (id: number) => {
    try {
      setIsTestingChannel(id);
      setError(null);
      
      const response = await ApiService.notifications.testNotification(id);
      
      if (response.data.success) {
        // Show success message
        alert('Test notification sent successfully! Check your device to confirm receipt.');
      } else {
        setError(`Failed to send test notification: ${response.data.error}`);
      }
    } catch (err) {
      console.error('Error testing notification:', err);
      setError('Failed to send test notification. Please check your configuration.');
    } finally {
      setIsTestingChannel(null);
    }
  };
  
  const getChannelName = (channelId: number) => {
    const channel = channels.find(c => c.id === channelId);
    return channel ? channel.name : 'Unknown';
  };
  
  const getConfigDisplay = (preference: NotificationPreference) => {
    try {
      const config = JSON.parse(preference.channel_config);
      const channelName = getChannelName(preference.channel_id).toLowerCase();
      
      switch (channelName) {
        case 'slack':
          return config.webhook ? 'Webhook configured' : 'No webhook';
        case 'telegram':
          return config.chatId ? 'Chat ID configured' : 'No Chat ID';
        default:
          return 'Configuration available';
      }
    } catch (err) {
      return 'Invalid configuration';
    }
  };
  
  if (isLoading || !isAuthenticated) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Notification Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <span className="block">{error}</span>
          </div>
        )}
        
        <div className="grid gap-8 md:grid-cols-1">
          {/* Current Notification Channels */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Your Notification Channels</h2>
            
            {isLoadingData ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : preferences.length === 0 ? (
              <p className="text-gray-500 py-4">You haven't set up any notification channels yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {preferences.map(preference => (
                      <tr key={preference.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {getChannelName(preference.channel_id)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getConfigDisplay(preference)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleTogglePreference(preference.id, preference.is_active)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${preference.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                          >
                            {preference.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleTestNotification(preference.id)}
                            disabled={isTestingChannel === preference.id || !preference.is_active}
                            className={`text-blue-600 hover:text-blue-900 mr-4 ${(isTestingChannel === preference.id || !preference.is_active) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isTestingChannel === preference.id ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Testing...
                              </span>
                            ) : 'Test'}
                          </button>
                          <button
                            onClick={() => handleDeletePreference(preference.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Add New Notification Channel */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Add Notification Channel</h2>
            
            <form onSubmit={handleAddPreference} className="space-y-4">
              <div>
                <label htmlFor="channel" className="label">Notification Type</label>
                <select
                  id="channel"
                  value={newChannelId}
                  onChange={(e) => setNewChannelId(e.target.value ? Number(e.target.value) : '')}
                  className="input"
                  required
                >
                  <option value="">Select a notification type</option>
                  {channels.map(channel => (
                    <option key={channel.id} value={channel.id}>
                      {channel.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {newChannelId && (
                <>
                  {getChannelName(Number(newChannelId)).toLowerCase() === 'slack' && (
                    <div>
                      <label htmlFor="webhook" className="label">Slack Webhook URL</label>
                      <input
                        id="webhook"
                        type="url"
                        value={newWebhookUrl}
                        onChange={(e) => setNewWebhookUrl(e.target.value)}
                        placeholder="https://hooks.slack.com/services/..."
                        className="input"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Create a webhook URL in your Slack workspace settings
                      </p>
                    </div>
                  )}
                  
                  {getChannelName(Number(newChannelId)).toLowerCase() === 'telegram' && (
                    <>
                      <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Important Setup Step</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <p><strong>You MUST start a conversation with your bot before it can send you messages!</strong></p>
                              <p className="mt-1">After creating your bot with BotFather, search for your bot's username in Telegram and send it a message (like "hello"). This step is required for the bot to be able to message you.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="chatId" className="label">Telegram Chat ID</label>
                        <input
                          id="chatId"
                          type="text"
                          value={newChatId}
                          onChange={(e) => setNewChatId(e.target.value)}
                          placeholder="Your Telegram chat ID"
                          className="input"
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          To get your Chat ID: 
                          <ol className="list-decimal ml-5 mt-1">
                            <li>Start a chat with @userinfobot on Telegram</li>
                            <li>It will reply with your Chat ID</li>
                          </ol>
                        </p>
                      </div>
                      <div>
                        <label htmlFor="botToken" className="label">Bot Token</label>
                        <input
                          id="botToken"
                          type="text"
                          value={newBotToken}
                          onChange={(e) => setNewBotToken(e.target.value)}
                          placeholder="Your Telegram bot token"
                          className="input"
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          To create a bot and get a token:
                          <ol className="list-decimal ml-5 mt-1">
                            <li>Start a chat with @BotFather on Telegram</li>
                            <li>Send /newbot command and follow the instructions</li>
                            <li>You'll receive a token like "123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"</li>
                            <li className="font-bold">Start a chat with your new bot first so it can message you</li>
                          </ol>
                        </p>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <button 
                      type="submit" 
                      className="btn btn-primary w-full flex justify-center items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        'Add Notification Channel'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage; 