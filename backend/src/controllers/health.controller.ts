import { Request, Response } from 'express';
import { env } from '../config/env.js';

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    message: 'AI Quiz Generator backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
};

