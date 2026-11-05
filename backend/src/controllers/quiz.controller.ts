import { Request, Response, NextFunction } from 'express';
import { generateQuiz } from '../services/ai.service.js';
import { GenerateQuizRequest } from '../schemas/quiz.schema.js';

/**
 * Controller handling POST /api/v1/quizzes/generate.
 * Coordinates request processing between validation middleware and the OpenAI service.
 */
export const generateQuizController = async (
  req: Request<unknown, unknown, GenerateQuizRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const quiz = await generateQuiz(req.body);

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

