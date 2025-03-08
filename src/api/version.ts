import { Hono } from 'hono';
import { VersionModel } from '../models/version';
import { Env } from '../types';

// Create a router for version endpoints
export const versionRouter = new Hono();

// Get latest version
versionRouter.get('/latest', async (c) => {
  try {
    const db = c.env?.DB as D1Database;
    const versionModel = new VersionModel(db);
    const latestVersion = await versionModel.getLatestVersion();
    
    if (!latestVersion) {
      return c.json({
        success: false,
        error: 'No versions found'
      }, 404);
    }
    
    return c.json({
      success: true,
      data: latestVersion
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get latest version'
    }, 500);
  }
});

// Get version history
versionRouter.get('/history', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = parseInt(c.req.query('offset') || '0');
    
    const db = c.env?.DB as D1Database;
    const versionModel = new VersionModel(db);
    const versions = await versionModel.getAllVersions(limit, offset);
    
    return c.json({
      success: true,
      data: versions
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get version history'
    }, 500);
  }
}); 