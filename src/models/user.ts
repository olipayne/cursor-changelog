import { User } from '../types';
import { generateUUID } from '../utils/helpers';

export class UserModel {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async createUser(email: string, name?: string): Promise<User> {
    const id = generateUUID();
    const now = new Date().toISOString();

    await this.db.prepare(
      `INSERT INTO users (id, email, name, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(id, email, name || null, now, now)
    .run();

    return {
      id,
      email,
      name,
      created_at: now,
      updated_at: now
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.db.prepare(
      `SELECT * FROM users WHERE id = ?`
    )
    .bind(id)
    .first<User>();
    
    return result || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.db.prepare(
      `SELECT * FROM users WHERE email = ?`
    )
    .bind(email)
    .first<User>();
    
    return result || null;
  }

  async updateUser(id: string, data: Partial<User>): Promise<boolean> {
    const user = await this.getUserById(id);
    if (!user) return false;

    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    
    // Add the id as the last value
    values.push(id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    const result = await this.db.prepare(query).bind(...values).run();
    
    return result.success;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db.prepare(
      `DELETE FROM users WHERE id = ?`
    )
    .bind(id)
    .run();
    
    return result.success;
  }
} 