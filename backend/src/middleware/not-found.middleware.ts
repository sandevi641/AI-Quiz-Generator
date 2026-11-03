import { Request, Response } from 'express';

/**
 * Middleware handling requests that do not match any defined route.
 * Returns a consistent JSON 404 response.
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
};

