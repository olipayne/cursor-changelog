import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { AuthService } from '../services/auth';
import { Env } from '../types';

// Create a router for auth endpoints
export const authRouter = new Hono();

// Schema for registration
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

// Schema for login
const loginSchema = z.object({
  email: z.string().email(),
});

// Register endpoint
authRouter.post('/register', zValidator('json', registerSchema), async (c) => {
  const { email, name } = c.req.valid('json');
  
  try {
    // Create a JWT secret if not provided in environment
    const jwtSecret = c.env.JWT_SECRET || 'default-super-secret-key-please-change-in-production';
    
    const authService = new AuthService(c.env.DB, jwtSecret);
    const { user, token } = await authService.registerUser(email, name);
    
    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      }
    }, 201);
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to register user'
    }, 400);
  }
});

// Login endpoint
authRouter.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email } = c.req.valid('json');
  
  try {
    // Create a JWT secret if not provided in environment
    const jwtSecret = c.env.JWT_SECRET || 'default-super-secret-key-please-change-in-production';
    
    const authService = new AuthService(c.env.DB, jwtSecret);
    const { user, token } = await authService.loginUser(email);
    
    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to login'
    }, 401);
  }
}); 