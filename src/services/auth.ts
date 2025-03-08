import { TokenPayload, User } from '../types';
import { UserModel } from '../models/user';
import JWT from '@tsndr/cloudflare-worker-jwt';

export class AuthService {
  private db: D1Database;
  private jwtSecret: string;
  private tokenExpiration: number = 60 * 60 * 24 * 7; // 7 days in seconds

  constructor(db: D1Database, jwtSecret: string) {
    this.db = db;
    this.jwtSecret = jwtSecret;
  }

  async registerUser(email: string, name?: string): Promise<{ user: User; token: string }> {
    const userModel = new UserModel(this.db);
    
    // Check if user already exists
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const user = await userModel.createUser(email, name);
    
    // Generate JWT token
    const token = await this.generateToken(user);
    
    return { user, token };
  }

  async loginUser(email: string): Promise<{ user: User; token: string }> {
    const userModel = new UserModel(this.db);
    
    // Find user by email
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Generate JWT token
    const token = await this.generateToken(user);
    
    return { user, token };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      // Verify the token
      const isValid = await JWT.verify(token, this.jwtSecret);
      if (!isValid) {
        return null;
      }
      
      // Decode the token
      const { payload } = JWT.decode(token);
      const jwtPayload = payload as TokenPayload;
      
      // Check if the token is expired
      const now = Math.floor(Date.now() / 1000);
      if (jwtPayload.exp < now) {
        return null;
      }
      
      // Get the user
      const userModel = new UserModel(this.db);
      const user = await userModel.getUserById(jwtPayload.sub);
      
      return user;
    } catch (error) {
      return null;
    }
  }

  private async generateToken(user: User): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      exp: now + this.tokenExpiration
    };
    
    return await JWT.sign(payload, this.jwtSecret);
  }
} 