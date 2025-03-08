import { NotificationChannel, UserNotificationPreference, NotificationHistory } from '../types';

export class NotificationModel {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  // Get all available notification channels
  async getNotificationChannels(): Promise<NotificationChannel[]> {
    const result = await this.db.prepare(
      `SELECT * FROM notification_channels`
    ).all<NotificationChannel>();
    
    return result.results;
  }

  // Get a specific notification channel
  async getNotificationChannel(id: number): Promise<NotificationChannel | null> {
    const result = await this.db.prepare(
      `SELECT * FROM notification_channels WHERE id = ?`
    )
    .bind(id)
    .first<NotificationChannel>();
    
    return result || null;
  }

  // Get a notification channel by name
  async getNotificationChannelByName(name: string): Promise<NotificationChannel | null> {
    const result = await this.db.prepare(
      `SELECT * FROM notification_channels WHERE name = ?`
    )
    .bind(name)
    .first<NotificationChannel>();
    
    return result || null;
  }

  // Create a user notification preference
  async createUserNotificationPreference(
    userId: string, 
    channelId: number, 
    channelConfig: string
  ): Promise<UserNotificationPreference> {
    const now = new Date().toISOString();
    
    const result = await this.db.prepare(
      `INSERT INTO user_notification_preferences 
        (user_id, channel_id, channel_config, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?) RETURNING *`
    )
    .bind(userId, channelId, channelConfig, now, now)
    .first<UserNotificationPreference>();
    
    return result!;
  }

  // Get user notification preferences
  async getUserNotificationPreferences(userId: string): Promise<UserNotificationPreference[]> {
    const result = await this.db.prepare(
      `SELECT * FROM user_notification_preferences WHERE user_id = ?`
    )
    .bind(userId)
    .all<UserNotificationPreference>();
    
    return result.results;
  }

  // Update user notification preference
  async updateUserNotificationPreference(
    id: number, 
    data: Partial<UserNotificationPreference>
  ): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.channel_config !== undefined) {
      updates.push('channel_config = ?');
      values.push(data.channel_config);
    }
    
    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(data.is_active ? 1 : 0);
    }

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    
    // Add the id as the last value
    values.push(id);

    const query = `UPDATE user_notification_preferences SET ${updates.join(', ')} WHERE id = ?`;
    const result = await this.db.prepare(query).bind(...values).run();
    
    return result.success;
  }

  // Delete user notification preference
  async deleteUserNotificationPreference(id: number): Promise<boolean> {
    const result = await this.db.prepare(
      `DELETE FROM user_notification_preferences WHERE id = ?`
    )
    .bind(id)
    .run();
    
    return result.success;
  }

  // Record notification history
  async recordNotification(
    userId: string, 
    channelId: number, 
    versionId: number, 
    status: string,
    errorMessage?: string
  ): Promise<NotificationHistory> {
    const result = await this.db.prepare(
      `INSERT INTO notification_history 
        (user_id, channel_id, version_id, status, error_message) 
       VALUES (?, ?, ?, ?, ?) RETURNING *`
    )
    .bind(userId, channelId, versionId, status, errorMessage || null)
    .first<NotificationHistory>();
    
    return result!;
  }

  // Get notification history for a user
  async getUserNotificationHistory(userId: string): Promise<NotificationHistory[]> {
    const result = await this.db.prepare(
      `SELECT * FROM notification_history 
       WHERE user_id = ? 
       ORDER BY sent_at DESC`
    )
    .bind(userId)
    .all<NotificationHistory>();
    
    return result.results;
  }

  // Get all users who have active notifications for a specific channel
  async getUsersForNotification(channelId: number): Promise<string[]> {
    const result = await this.db.prepare(
      `SELECT DISTINCT user_id FROM user_notification_preferences 
       WHERE channel_id = ? AND is_active = TRUE`
    )
    .bind(channelId)
    .all<{ user_id: string }>();
    
    return result.results.map(row => row.user_id);
  }
} 