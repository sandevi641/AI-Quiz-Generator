import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { notFoundHandler } from './middleware/not-found.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

/**
 * Express application factory.
 * Configures middleware, security, routes, and error handling.
 * Kept separate from server.ts to enable testing with supertest without port collisions.
 */
export const createApp = (): Express => {
  const app = express();

  // Configure CORS allowing requests from the configured frontend origin
  const allowedOrigins = Array.from(
    new Set([env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'])
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
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

  // Parse JSON payloads with reasonable size limit (10MB for text/notes)
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

  // Versioned API v1 Router
  app.use('/api/v1', apiRouter);

  // Catch-all 404 handler for unknown routes
  app.use(notFoundHandler);

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
