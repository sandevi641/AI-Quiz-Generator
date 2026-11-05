import { Router } from 'express';
import { generateQuizController } from '../controllers/quiz.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { generateQuizRequestSchema } from '../schemas/quiz.schema.js';

const router = Router();

/**
 * Route: POST /api/v1/quizzes/generate
 * Description: Generates a multiple-choice educational quiz from submitted study notes.
 * Middleware: Validates body using generateQuizRequestSchema.
 */
router.post(
  '/generate',
  validateRequest({ body: generateQuizRequestSchema }),
  generateQuizController
);

export default router;

