import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getHealth } from '../controllers/health.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = Router();

// GET /api/v1/health
router.get('/health', getHealth);

// POST /api/v1/validate-demo (Demonstrates reusable Zod request validation)
const demoValidationSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  numQuestions: z.number().int().min(1).max(20),
});

router.post(
  '/validate-demo',
  validateRequest({ body: demoValidationSchema }),
  (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      message: 'Payload passed Zod schema validation',
      data: req.body,
    });
  }
);

export default router;
