import { Hono } from 'hono';
import { VersionCheckerService } from '../services/versionChecker';
import { NotifierService } from '../services/notifier';

// Create a router for admin endpoints
export const adminRouter = new Hono();

// Manually trigger version check
adminRouter.post('/check-version', async (c) => {
  try {
    const db = c.env?.DB as D1Database;
    const versionChecker = new VersionCheckerService(db);
    const result = await versionChecker.checkForUpdates();
    
    return c.json({
      success: true,
      data: result
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check for updates'
    }, 500);
  }
});

// Manually trigger notifications
adminRouter.post('/notify', async (c) => {
  try {
    const db = c.env?.DB as D1Database;
    const notifier = new NotifierService(db);
    await notifier.notifyUsers(0); // The ID will be determined inside the notifier
    
    return c.json({
      success: true,
      message: 'Notifications sent'
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send notifications'
    }, 500);
  }
}); 