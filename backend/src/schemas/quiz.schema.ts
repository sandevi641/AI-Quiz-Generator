import { z } from 'zod';

export const generateQuizSchema = z.object({
  notes: z.string().min(10, 'Study notes must be at least 10 characters long'),
  numQuestions: z.number().int().min(1).max(20).default(5),
  topic: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
});

export type GenerateQuizInput = z.infer<typeof generateQuizSchema>;

export const quizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswerIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
});

export const quizSchema = z.object({
  id: z.string(),
  title: z.string(),
  topic: z.string().optional(),
  questions: z.array(quizQuestionSchema),
  createdAt: z.string(),
});

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type Quiz = z.infer<typeof quizSchema>;

