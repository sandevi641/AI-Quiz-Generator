import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized Express error-handling middleware.
 * Ensures consistent, safe JSON responses for all error conditions.
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Handle invalid JSON payload from express.json parser
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid JSON payload received in request body',
    });
    return;
  }

  // Handle Zod schema validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const isProduction = env.NODE_ENV === 'production';

  // Log unexpected server errors
  if (statusCode >= 500) {
    logger.error(`Internal server error: ${err.message}`, isProduction ? undefined : err.stack);
  }

  // Hide internal server error details in production to prevent leaking sensitive system details
  const responseMessage =
    statusCode >= 500 && isProduction
      ? 'An unexpected internal server error occurred.'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message: responseMessage,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

