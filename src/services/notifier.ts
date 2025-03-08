import { NotificationModel } from '../models/notification';
import { UserModel } from '../models/user';
import { VersionModel } from '../models/version';
import { ChannelType, NotificationChannel, User, Version } from '../types';

export class NotifierService {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async notifyUsers(versionId: number): Promise<void> {
    const notificationModel = new NotificationModel(this.db);
    const userModel = new UserModel(this.db);
    const versionModel = new VersionModel(this.db);
    
    // Get the version details
    const version = await versionModel.getLatestVersion();
    if (!version) {
      throw new Error('Version not found');
    }
    
    // Get all notification channels
    const channels = await notificationModel.getNotificationChannels();
    
    // For each channel, get users who have subscribed to it and notify them
    for (const channel of channels) {
      try {
        const userIds = await notificationModel.getUsersForNotification(channel.id);
        
        for (const userId of userIds) {
          try {
            // Get user details
            const user = await userModel.getUserById(userId);
            if (!user) continue;
            
            // Get user's preference for this channel
            const preferences = await notificationModel.getUserNotificationPreferences(userId);
            const preference = preferences.find(p => p.channel_id === channel.id);
            
            if (!preference || !preference.is_active) continue;
            
            // Send notification based on channel type
            await this.sendNotification(channel, user, version, preference.channel_config);
            
            // Record success
            await notificationModel.recordNotification(
              userId, 
              channel.id, 
              version.id, 
              'success'
            );
          } catch (error) {
            // Record failure
            await notificationModel.recordNotification(
              userId, 
              channel.id, 
              version.id, 
              'failed',
              error instanceof Error ? error.message : 'Unknown error'
            );
          }
        }
      } catch (error) {
        console.error(`Error processing channel ${channel.name}:`, error);
      }
    }
  }

  private async sendNotification(
    channel: NotificationChannel, 
    user: User, 
    version: Version, 
    channelConfig: string
  ): Promise<void> {
    // Parse the channel configuration
    const config = JSON.parse(channelConfig);
    const downloadUrl = `https://www.cursor.com/downloads`;
    const message = `🚀 New Cursor Update! Version ${version.version} is now available. Download it here: ${downloadUrl}`;
    
    switch (channel.name) {
      case ChannelType.SLACK:
        await this.sendSlackNotification(config.webhook, message);
        break;
        
      case ChannelType.TELEGRAM:
        await this.sendTelegramNotification(config.chatId, message, config.botToken);
        break;
        
      default:
        throw new Error(`Unsupported notification channel: ${channel.name}`);
    }
  }

  private async sendSlackNotification(webhookUrl: string, message: string): Promise<void> {
    console.log(`Sending Slack notification to webhook: ${webhookUrl}`);
    
    if (!webhookUrl || !webhookUrl.startsWith('https://hooks.slack.com/')) {
      throw new Error('Invalid Slack webhook URL');
    }
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: message,
          blocks: [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "*Cursor Update Alert* 🚀"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": message
              }
            },
            {
              "type": "actions",
              "elements": [
                {
                  "type": "button",
                  "text": {
                    "type": "plain_text",
                    "text": "Download Now",
                    "emoji": true
                  },
                  "url": "https://www.cursor.com/downloads",
                  "style": "primary"
                }
              ]
            }
          ]
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Slack API error: ${response.status} - ${errorText}`);
      }
      
      console.log('Slack notification sent successfully');
    } catch (error: any) {
      console.error('Error sending Slack notification:', error);
      throw new Error(`Failed to send Slack notification: ${error.message || 'Unknown error'}`);
    }
  }

  private async sendTelegramNotification(chatId: string, message: string, botToken: string): Promise<void> {
    console.log(`Sending Telegram notification to chat ID: ${chatId}`);
    
    if (!chatId || !botToken) {
      throw new Error('Missing Telegram chat ID or bot token');
    }
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ description: 'Unknown error' })) as { description?: string };
        
        // Provide more helpful error messages for common issues
        if (errorData.description?.includes('chat not found')) {
          throw new Error(
            'Chat not found. Please make sure you have started a conversation with your bot. ' +
            'Open Telegram, search for your bot by username, and send it a message first.'
          );
        } else if (errorData.description?.includes('bot was blocked by the user')) {
          throw new Error('The bot was blocked by the user. Please unblock the bot in Telegram and try again.');
        } else if (errorData.description?.includes('wrong bot token')) {
          throw new Error('Invalid bot token. Please check your bot token and try again.');
        }
        
        throw new Error(`Telegram API error: ${response.status} - ${errorData.description || 'Unknown error'}`);
      }
      
      console.log('Telegram notification sent successfully');
    } catch (error: any) {
      console.error('Error sending Telegram notification:', error);
      throw new Error(`Failed to send Telegram notification: ${error.message || 'Unknown error'}`);
    }
  }

  // Send a test notification to verify the channel works
  async sendTestNotification(
    channel: NotificationChannel,
    user: User,
    channelConfig: string
  ): Promise<void> {
    // Parse the channel configuration
    const config = JSON.parse(channelConfig);
    const message = `👋 Hello from Cursor Changelog! This is a test notification to verify your setup works correctly.`;
    
    switch (channel.name) {
      case ChannelType.SLACK:
        await this.sendSlackNotification(config.webhook, message);
        break;
        
      case ChannelType.TELEGRAM:
        await this.sendTelegramNotification(config.chatId, message, config.botToken);
        break;
        
      default:
        throw new Error(`Unsupported notification channel: ${channel.name}`);
    }
  }
} 