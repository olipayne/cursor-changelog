-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create versions table to track Cursor releases
CREATE TABLE versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version TEXT NOT NULL UNIQUE,
  download_url TEXT NOT NULL,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notification_channels table for different notification methods
CREATE TABLE notification_channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  config TEXT NOT NULL -- JSON configuration for the channel
);

-- Create user_notification_preferences to link users to their notification channels
CREATE TABLE user_notification_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  channel_id INTEGER NOT NULL,
  channel_config TEXT NOT NULL, -- JSON configuration specific to the user (webhook URLs, etc.)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (channel_id) REFERENCES notification_channels(id)
);

-- Insert default notification channels
INSERT INTO notification_channels (name, config) VALUES 
  ('slack', '{}'),
  ('telegram', '{}');

-- Create index on user notification preferences
CREATE INDEX idx_user_notifications ON user_notification_preferences(user_id, channel_id);

-- Create notification_history to track sent notifications
CREATE TABLE notification_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  channel_id INTEGER NOT NULL,
  version_id INTEGER NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL, -- 'success', 'failed', etc.
  error_message TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (channel_id) REFERENCES notification_channels(id),
  FOREIGN KEY (version_id) REFERENCES versions(id)
); 