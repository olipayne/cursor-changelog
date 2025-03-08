export interface Env {
  DB: D1Database;
  // Add other environment variables and bindings here
  JWT_SECRET?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface Version {
  id: number;
  version: string;
  detected_at: string;
}

export interface NotificationChannel {
  id: number;
  name: string;
  config: string; // JSON string
}

export interface UserNotificationPreference {
  id: number;
  user_id: string;
  channel_id: number;
  channel_config: string; // JSON string
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationHistory {
  id: number;
  user_id: string;
  channel_id: number;
  version_id: number;
  sent_at: string;
  status: string;
  error_message?: string;
}

// Define notification channel types
export enum ChannelType {
  SLACK = 'slack',
  TELEGRAM = 'telegram'
}

// Auth types
export interface TokenPayload {
  sub: string; // user ID
  email: string;
  name?: string;
  exp: number;
} 