import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config';

// Create an Axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API service functions
const ApiService = {
  // Authentication endpoints
  auth: {
    register: (email: string, name?: string) => 
      api.post('/api/auth/register', { email, name }),
    
    login: (email: string) => 
      api.post('/api/auth/login', { email }),
  },
  
  // Version endpoints
  versions: {
    getLatest: () => 
      api.get('/api/versions/latest'),
    
    getHistory: (limit = 10, offset = 0) => 
      api.get(`/api/versions/history?limit=${limit}&offset=${offset}`),
  },
  
  // Notification channels and preferences
  notifications: {
    getChannels: () => 
      api.get('/api/notifications/channels'),
    
    getPreferences: () => 
      api.get('/api/notifications/preferences'),
    
    createPreference: (channelId: number, channelConfig: any, isActive = true) => 
      api.post('/api/notifications/preferences', { channelId, channelConfig, isActive }),
    
    updatePreference: (id: number, data: any) => 
      api.put(`/api/notifications/preferences/${id}`, data),
    
    deletePreference: (id: number) => 
      api.delete(`/api/notifications/preferences/${id}`),
    
    getHistory: () => 
      api.get('/api/notifications/history'),
      
    testNotification: (id: number) =>
      api.post(`/api/notifications/test/${id}`),
  },
};

export default ApiService; 