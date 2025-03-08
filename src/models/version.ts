import { Version } from '../types';

export class VersionModel {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async createVersion(version: string): Promise<Version> {
    const now = new Date().toISOString();
    
    const result = await this.db.prepare(
      `INSERT INTO versions (version, detected_at) 
       VALUES (?, ?) RETURNING *`
    )
    .bind(version, now)
    .first<Version>();
    
    return result!;
  }

  async getLatestVersion(): Promise<Version | null> {
    const result = await this.db.prepare(
      `SELECT * FROM versions ORDER BY detected_at DESC LIMIT 1`
    )
    .first<Version>();
    
    return result || null;
  }

  async getVersionByString(version: string): Promise<Version | null> {
    const result = await this.db.prepare(
      `SELECT * FROM versions WHERE version = ?`
    )
    .bind(version)
    .first<Version>();
    
    return result || null;
  }

  async getAllVersions(limit: number = 10, offset: number = 0): Promise<Version[]> {
    const result = await this.db.prepare(
      `SELECT * FROM versions ORDER BY detected_at DESC LIMIT ? OFFSET ?`
    )
    .bind(limit, offset)
    .all<Version>();
    
    return result.results;
  }

  // Check if a version exists in the database
  async versionExists(version: string): Promise<boolean> {
    const result = await this.getVersionByString(version);
    return result !== null;
  }
} 