import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { NotificationModel } from '../models/notification';
import { AuthService } from '../services/auth';
import { ChannelType } from '../types';
import { UserModel } from '../models/user';
import { NotifierService } from '../services/notifier';

// Create a router for notification endpoints
export const notificationRouter = new Hono();

// Middleware to authenticate requests
const authenticate = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      error: 'Unauthorized'
    }, 401);
  }
  
  const token = authHeader.replace('Bearer ', '');
  const db = c.env?.DB as D1Database;
  const jwtSecret = c.env?.JWT_SECRET || 'default-super-secret-key-please-change-in-production';
  
  const authService = new AuthService(db, jwtSecret);
  const user = await authService.validateToken(token);
  
  if (!user) {
    return c.json({
      success: false,
      error: 'Invalid or expired token'
    }, 401);
  }
  
  c.set('user', user);
  await next();
};

// Schema for creating notification preferences
const notificationPreferenceSchema = z.object({
  channelId: z.number(),
  channelConfig: z.object({}).passthrough(),
  isActive: z.boolean().default(true)
});

// Get available notification channels
notificationRouter.get('/channels', async (c) => {
  try {
    const db = c.env?.DB as D1Database;
    const notificationModel = new NotificationModel(db);
    const channels = await notificationModel.getNotificationChannels();
    
    return c.json({
      success: true,
      data: channels
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get notification channels'
    }, 500);
  }
});

// Get user notification preferences
notificationRouter.get('/preferences', authenticate, async (c) => {
  try {
    const user = c.get('user');
    const db = c.env?.DB as D1Database;
    const notificationModel = new NotificationModel(db);
    const preferences = await notificationModel.getUserNotificationPreferences(user.id);
    
    return c.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get notification preferences'
    }, 500);
  }
});

// Create a new notification preference
notificationRouter.post('/preferences', authenticate, zValidator('json', notificationPreferenceSchema), async (c) => {
  try {
    const user = c.get('user');
    const { channelId, channelConfig, isActive } = c.req.valid('json');
    
    const db = c.env?.DB as D1Database;
    const notificationModel = new NotificationModel(db);
    
    // Verify that the channel exists
    const channel = await notificationModel.getNotificationChannel(channelId);
    if (!channel) {
      return c.json({
        success: false,
        error: 'Notification channel not found'
      }, 404);
    }
    
    // Validate channel-specific configuration
    if (channel.name.toLowerCase() === 'slack') {
      // Validate Slack webhook URL
      if (!channelConfig.webhook || typeof channelConfig.webhook !== 'string' || 
          !channelConfig.webhook.startsWith('https://hooks.slack.com/')) {
        return c.json({
          success: false,
          error: 'Invalid Slack webhook URL. Must start with https://hooks.slack.com/'
        }, 400);
      }
    } else if (channel.name.toLowerCase() === 'telegram') {
      // Validate Telegram config
      if (!channelConfig.chatId || !channelConfig.botToken) {
        return c.json({
          success: false,
          error: 'Telegram configuration requires both chatId and botToken'
        }, 400);
      }
    }
    
    // Create the preference
    const preference = await notificationModel.createUserNotificationPreference(
      user.id,
      channelId,
      JSON.stringify(channelConfig)
    );
    
    // If isActive is false, update the preference
    if (!isActive) {
      await notificationModel.updateUserNotificationPreference(preference.id, { is_active: false });
      preference.is_active = false;
    }
    
    return c.json({
      success: true,
      data: preference
    }, 201);
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create notification preference'
    }, 500);
  }
});

// Update a notification preference
notificationRouter.put('/preferences/:id', authenticate, async (c) => {
  try {
    const user = c.get('user');
    const preferenceId = parseInt(c.req.param('id'));
    const data = await c.req.json();
    
    const db = c.env?.DB as D1Database;
    const notificationModel = new NotificationModel(db);
    
    // Get the preference to verify ownership
    const preferences = await notificationModel.getUserNotificationPreferences(user.id);
    const preference = preferences.find(p => p.id === preferenceId);
    
    if (!preference) {
      return c.json({
        success: false,
        error: 'Notification preference not found or not owned by user'
      }, 404);
    }
    
    // Update the preference
    const updateData: any = {};
    
    if (data.channelConfig !== undefined) {
      updateData.channel_config = JSON.stringify(data.channelConfig);
    }
    
    if (data.isActive !== undefined) {
      updateData.is_active = data.isActive;
    }
    
    const success = await notificationModel.updateUserNotificationPreference(preferenceId, updateData);
    
    return c.json({
      success,
      data: { id: preferenceId }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update notification preference'
    }, 500);
  }
});

// Delete a notification preference
notificationRouter.delete('/preferences/:id', authenticate, async (c) => {
  try {
    const user = c.get('user');
    const preferenceId = parseInt(c.req.param('id'));
    
    const db = c.env?.DB as D1Database;
    const notificationModel = new NotificationModel(db);
    
    // Get the preference to verify ownership
    const preferences = await notificationModel.getUserNotificationPreferences(user.id);
    const preference = preferences.find(p => p.id === preferenceId);
    
    if (!preference) {
      return c.json({
        success: false,
        error: 'Notification preference not found or not owned by user'
      }, 404);
    }
    
    // Delete the preference
    const success = await notificationModel.deleteUserNotificationPreference(preferenceId);
    
    return c.json({
      success,
      data: { id: preferenceId }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete notification preference'
    }, 500);
  }
});

// Get notification history for the user
notificationRouter.get('/history', authenticate, async (c) => {
  try {
    const user = c.get('user');
    
    const db = c.env?.DB as D1Database;
    const notificationModel = new NotificationModel(db);
    const history = await notificationModel.getUserNotificationHistory(user.id);
    
    return c.json({
      success: true,
      data: history
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get notification history'
    }, 500);
  }
});

// Test notification for a specific channel
notificationRouter.post('/test/:id', authenticate, async (c) => {
  try {
    const user = c.get('user');
    const preferenceId = parseInt(c.req.param('id'));
    
    const db = c.env?.DB as D1Database;
    const notificationModel = new NotificationModel(db);
    const userModel = new UserModel(db);
    
    // Get the preference to verify ownership
    const preferences = await notificationModel.getUserNotificationPreferences(user.id);
    const preference = preferences.find(p => p.id === preferenceId);
    
    if (!preference) {
      return c.json({
        success: false,
        error: 'Notification preference not found or not owned by user'
      }, 404);
    }
    
    // Get the channel
    const channel = await notificationModel.getNotificationChannel(preference.channel_id);
    if (!channel) {
      return c.json({
        success: false,
        error: 'Notification channel not found'
      }, 404);
    }
    
    // Get user details
    const userData = await userModel.getUserById(user.id);
    if (!userData) {
      return c.json({
        success: false,
        error: 'User not found'
      }, 404);
    }
    
    // Send a test notification
    const notifierService = new NotifierService(db);
    await notifierService.sendTestNotification(channel, userData, preference.channel_config);
    
    return c.json({
      success: true,
      message: 'Test notification sent successfully'
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send test notification'
    }, 500);
  }
}); 