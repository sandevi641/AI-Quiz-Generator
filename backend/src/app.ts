import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { notFoundHandler } from './middleware/not-found.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

export interface AppOptions {
  rateLimitMax?: number;
  rateLimitWindowMs?: number;
}

/**
 * Express application factory.
 * Configures security headers (Helmet), CORS, Rate Limiting, body parsers,
 * routes, 404 handler, and centralized error handling.
 */
export const createApp = (options?: AppOptions): Express => {
  const app = express();

  // 1. Security Headers via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // 2. Cross-Origin Resource Sharing (CORS)
  const allowedOrigins = Array.from(
    new Set([env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'])
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. server-to-server, curl, mobile native apps)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 3. Rate Limiting Protection (Prevents automated brute-force / DoS abuse)
  const limiter = rateLimit({
    windowMs: options?.rateLimitWindowMs ?? 15 * 60 * 1000, // 15 minutes default
    max: options?.rateLimitMax ?? (env.NODE_ENV === 'test' ? 1000 : 100), // Max requests per window
    standardHeaders: true, // Returns 'RateLimit-*' headers
    legacyHeaders: false, // Disables 'X-RateLimit-*' headers
    message: {
      status: 'error',
      message: 'Too many requests from this IP address, please try again later.',
    },
  });
  app.use('/api', limiter);

  // 4. Request Body Parsers with safe size limits (prevents payload exhaustion attacks)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root endpoint info
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      name: 'AI Quiz Generator API',
      status: 'active',
      version: 'v1',
      healthCheck: '/api/v1/health',
    });
  });

  // 5. Versioned API v1 Router
  app.use('/api/v1', apiRouter);

  // 6. Catch-all 404 handler for unknown routes
  app.use(notFoundHandler);

  // 7. Centralized Error Handling Middleware (must be last)
  app.use(errorHandler);

  return app;
};
