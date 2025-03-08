import { Hono } from 'hono';
import { VersionModel } from '../models/version';
import { Env, Version } from '../types';

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

// RSS Feed endpoint
versionRouter.get('/rss', async (c) => {
  try {
    const db = c.env?.DB as D1Database;
    const versionModel = new VersionModel(db);
    // Get recent versions for the feed (limit to 20 for RSS)
    const versions = await versionModel.getAllVersions(20, 0);
    
    // Create the RSS XML
    const rssXml = generateRssFeed(versions);
    
    // Set the content type header for RSS XML
    c.header('Content-Type', 'application/rss+xml; charset=utf-8');
    
    return c.body(rssXml);
  } catch (error) {
    // For RSS feed, return a proper error in XML format
    const errorXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Cursor Changelog RSS Feed</title>
  <description>Error retrieving RSS feed</description>
  <link>https://cursor-changelog.com</link>
  <item>
    <title>Error</title>
    <description>${error instanceof Error ? error.message : 'Failed to generate RSS feed'}</description>
  </item>
</channel>
</rss>`;
    
    c.header('Content-Type', 'application/rss+xml; charset=utf-8');
    return c.body(errorXml, 500);
  }
});

// Helper function to generate RSS XML from versions
function generateRssFeed(versions: Version[]): string {
  const siteUrl = 'https://cursor-changelog.com';
  
  // Create the RSS header
  let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Cursor Changelog RSS Feed</title>
  <description>Stay updated with the latest Cursor editor releases</description>
  <link>${siteUrl}</link>
  <atom:link href="${siteUrl}/feed" rel="self" type="application/rss+xml" />
  <language>en-us</language>
  <lastBuildDate>${versions.length > 0 ? new Date(versions[0].detected_at).toUTCString() : new Date().toUTCString()}</lastBuildDate>
`;

  // Add items for each version
  for (const version of versions) {
    const pubDate = new Date(version.detected_at).toUTCString();
    const link = `${siteUrl}/versions#${version.version}`;
    
    rss += `
  <item>
    <title>Cursor ${version.version} Released</title>
    <description>Cursor version ${version.version} has been released</description>
    <link>${link}</link>
    <guid isPermaLink="false">cursor-version-${version.version}</guid>
    <pubDate>${pubDate}</pubDate>
  </item>`;
  }

  // Close the RSS feed
  rss += `
</channel>
</rss>`;

  return rss;
} 