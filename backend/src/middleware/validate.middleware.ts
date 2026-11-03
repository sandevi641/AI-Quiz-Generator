import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export interface RequestValidationSchemas {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

/**
 * Reusable Express middleware that validates incoming HTTP request data
 * (body, query, or params) against Zod schemas before reaching the controller.
 *
 * If validation fails, it forwards the ZodError to the centralized error middleware,
 * which responds with HTTP 400 Bad Request and field-level validation messages.
 */
export const validateRequest = (schemas: RequestValidationSchemas) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

