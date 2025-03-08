/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRouter } from './api/auth';
import { versionRouter } from './api/version';
import { notificationRouter } from './api/notification';
import { adminRouter } from './api/admin';
import { VersionCheckerService } from './services/versionChecker';
import { NotifierService } from './services/notifier';
import { Env } from './types';

// Create the main application
const app = new Hono();

// Add CORS middleware
app.use('*', cors());

// Add API routes
app.route('/api/auth', authRouter);
app.route('/api/versions', versionRouter);
app.route('/api/notifications', notificationRouter);
app.route('/api/admin', adminRouter);

// Add RSS feed redirects
app.get('/feed', (c) => c.redirect('/api/versions/rss'));
app.get('/feed.xml', (c) => c.redirect('/api/versions/rss'));
app.get('/rss', (c) => c.redirect('/api/versions/rss'));
app.get('/rss.xml', (c) => c.redirect('/api/versions/rss'));

// Add a simple home route
app.get('/', (c) => {
	return c.json({
		name: 'Cursor Changelog API',
		version: '0.1.0',
		description: 'Track and get notified about Cursor editor updates',
		rss_feed: '/feed',
		documentation: {
			description: 'API endpoints for tracking Cursor versions',
			endpoints: [
				{ path: '/api/versions/latest', description: 'Get the latest Cursor version' },
				{ path: '/api/versions/history', description: 'Get version history with pagination' },
				{ path: '/feed', description: 'RSS feed of Cursor version updates' }
			]
		}
	});
});

// Define the scheduled task to check for updates
export interface Scheduled {
	cron: string;
	scheduled?: boolean;
}

// Export the fetch handler for HTTP requests
export default {
	// Handle HTTP requests
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return app.fetch(request, env, ctx);
	},

	// Handle scheduled events
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		console.log('Running scheduled version check');
		
		try {
			// Check for new versions
			const versionChecker = new VersionCheckerService(env.DB);
			const result = await versionChecker.checkForUpdates();
			
			console.log('Version check result:', result);
			
			// If a new version was found, notify users
			if (result.isNewVersion && result.version) {
				console.log(`New version detected: ${result.version}`);
				
				// Get the latest version from the database to get its ID
				const notifier = new NotifierService(env.DB);
				await notifier.notifyUsers(0); // The ID will be determined inside the notifier
				
				console.log('Notifications sent');
			} else {
				console.log('No new version detected');
			}
		} catch (error) {
			console.error('Error in scheduled task:', error);
		}
	}
};
