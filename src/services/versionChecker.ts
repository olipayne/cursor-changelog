import { VersionModel } from '../models/version';
import { extractVersionFromURL, isNewerVersion } from '../utils/helpers';

interface CursorApiResponse {
  downloadUrl: string;
}

export class VersionCheckerService {
  private db: D1Database;
  private apiUrl: string = 'https://www.cursor.com/api/download?platform=linux-x64&releaseTrack=latest';

  constructor(db: D1Database) {
    this.db = db;
  }

  async checkForUpdates(): Promise<{ isNewVersion: boolean; version: string | null }> {
    try {
      // Fetch the latest version from Cursor API
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch from Cursor API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json<CursorApiResponse>();
      
      // Extract version number from download URL
      const version = extractVersionFromURL(data.downloadUrl);
      if (!version) {
        throw new Error(`Could not extract version from URL: ${data.downloadUrl}`);
      }
      
      // Get the latest version from our database
      const versionModel = new VersionModel(this.db);
      const latestStoredVersion = await versionModel.getLatestVersion();
      
      let isNewVersion = false;
      
      // If we have no versions in the database, this is a new version
      if (!latestStoredVersion) {
        isNewVersion = true;
      } else {
        // Compare versions to see if this is newer
        isNewVersion = isNewerVersion(latestStoredVersion.version, version);
      }
      
      // If this is a new version, store it in the database
      if (isNewVersion) {
        await versionModel.createVersion(version);
      }
      
      return {
        isNewVersion,
        version
      };
    } catch (error) {
      console.error('Error checking for updates:', error);
      return {
        isNewVersion: false,
        version: null
      };
    }
  }
} 