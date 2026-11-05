import { z } from 'zod';

export const allowedQuestionCounts = [5, 10, 15] as const;
export const allowedDifficulties = ['Easy', 'Medium', 'Hard'] as const;

/**
 * Zod schema for POST /api/v1/quizzes/generate request body.
 * Validates notes length, allowed question counts, and difficulty levels.
 */
export const generateQuizRequestSchema = z.object({
  notes: z
    .string({ required_error: 'Study notes are required' })
    .trim()
    .min(50, 'Study notes must be at least 50 characters long so the AI has enough content')
    .max(20000, 'Study notes must not exceed 20,000 characters to prevent excessive token usage'),

  questionCount: z
    .union([z.literal(5), z.literal(10), z.literal(15)], {
      errorMap: () => ({ message: 'questionCount must be either 5, 10, or 15' }),
    }),

  difficulty: z
    .enum(allowedDifficulties, {
      errorMap: () => ({ message: 'difficulty must be either Easy, Medium, or Hard' }),
    }),
});

export type GenerateQuizRequest = z.infer<typeof generateQuizRequestSchema>;

/**
 * Zod schema for validating each question in the generated quiz.
 * Enforces exactly 4 options and requires correctAnswer to be one of those 4 options.
 */
export const quizQuestionSchema = z
  .object({
    question: z.string().trim().min(5, 'Question text is too short'),
    options: z
      .array(z.string().trim().min(1, 'Option text cannot be empty'))
      .length(4, 'Each question must contain exactly 4 options'),
    correctAnswer: z.string().trim().min(1, 'Correct answer must be provided'),
    explanation: z.string().trim().min(5, 'Explanation must be at least 5 characters long'),
    difficulty: z.enum(allowedDifficulties),
  })
  .refine((data) => data.options.includes(data.correctAnswer), {
    message: 'correctAnswer must match one of the 4 options exactly',
    path: ['correctAnswer'],
  });

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

/**
 * Zod schema for validating the full quiz object.
 */
export const quizSchema = z.object({
  title: z.string().trim().min(3, 'Quiz title must be at least 3 characters long'),
  questions: z.array(quizQuestionSchema).min(1, 'Quiz must contain at least 1 question'),
});

export type Quiz = z.infer<typeof quizSchema>;

/**
 * Schema passed to OpenAI's structured output helper (zodResponseFormat).
 * Note: OpenAI JSON schema does not support Zod refine clauses directly,
 * so the refine check is executed by our backend validation layer after parsing.
 */
export const aiGeneratedQuizSchema = z.object({
  title: z
    .string()
    .describe('A concise, educational title summarizing the quiz based on the notes'),
  questions: z.array(
    z.object({
      question: z.string().describe('The multiple-choice question text'),
      options: z
        .array(z.string())
        .length(4)
        .describe('Exactly 4 distinct answer choices'),
      correctAnswer: z
        .string()
        .describe('The correct answer. Must be identical to one of the 4 options'),
      explanation: z
        .string()
        .describe('A concise explanation of why the correct answer is right based on the notes'),
      difficulty: z
        .enum(['Easy', 'Medium', 'Hard'])
        .describe('The difficulty level of the question'),
    })
  ),
});
