import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';
import { setGeminiClient } from './services/gemini.service.js';
import { AppError } from './middleware/error.middleware.js';
import { GoogleGenAI, ApiError } from '@google/genai';

describe('Quiz Generation API (POST /api/v1/quizzes/generate)', () => {
  const app = createApp();

  const validNotes =
    'Cellular respiration is a metabolic pathway that breaks down glucose and produces ATP. ' +
    'The stages of cellular respiration include glycolysis, the Krebs cycle, and oxidative phosphorylation. ' +
    'Glycolysis occurs in the cytoplasm and is anaerobic. The Krebs cycle occurs in the mitochondrial matrix. ' +
    'Oxidative phosphorylation occurs across the inner mitochondrial membrane and generates the vast majority of ATP.';

  afterEach(() => {
    // Reset any mock client after each test
    setGeminiClient(null);
  });

  describe('Request Validation', () => {
    it('should reject request missing notes with HTTP 400', async () => {
      const response = await request(app)
        .post('/api/v1/quizzes/generate')
        .send({
          questionCount: 10,
          difficulty: 'Medium',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('errors');
      const errors = response.body.errors.map((e: { message: string }) => e.message);
      expect(errors[0]).toContain('Study notes are required');
    });

    it('should reject notes shorter than 50 characters with HTTP 400', async () => {
      const response = await request(app)
        .post('/api/v1/quizzes/generate')
        .send({
          notes: 'Too short note',
          questionCount: 5,
          difficulty: 'Easy',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      const errors = response.body.errors.map((e: { message: string }) => e.message);
      expect(errors[0]).toContain('at least 50 characters');
    });

    it('should reject notes longer than 20,000 characters with HTTP 400', async () => {
      const longNotes = 'A'.repeat(20001);

      const response = await request(app)
        .post('/api/v1/quizzes/generate')
        .send({
          notes: longNotes,
          questionCount: 5,
          difficulty: 'Easy',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      const errors = response.body.errors.map((e: { message: string }) => e.message);
      expect(errors[0]).toContain('must not exceed 20,000 characters');
    });

    it('should reject question counts other than 5, 10, or 15 with HTTP 400', async () => {
      const response = await request(app)
        .post('/api/v1/quizzes/generate')
        .send({
          notes: validNotes,
          questionCount: 7, // Invalid count
          difficulty: 'Easy',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      const errors = response.body.errors.map((e: { message: string }) => e.message);
      expect(errors[0]).toContain('questionCount must be either 5, 10, or 15');
    });

    it('should reject invalid difficulty values with HTTP 400', async () => {
      const response = await request(app)
        .post('/api/v1/quizzes/generate')
        .send({
          notes: validNotes,
          questionCount: 5,
          difficulty: 'Extreme', // Invalid difficulty
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      const errors = response.body.errors.map((e: { message: string }) => e.message);
      expect(errors[0]).toContain('difficulty must be either Easy, Medium, or Hard');
    });
  });

  describe('Gemini Configuration & Key Check', () => {
    it('should return HTTP 500 when GEMINI_API_KEY is not configured', async () => {
      const mockBrokenClient = {
        models: {
          generateContent: async () => {
            throw new AppError(
              'GEMINI_API_KEY is not configured. Please supply a valid Gemini API key in your backend/.env file to use AI features.',
              500
            );
          },
        },
      } as unknown as GoogleGenAI;

      setGeminiClient(mockBrokenClient);

      const response = await request(app)
        .post('/api/v1/quizzes/generate')
        .send({
          notes: validNotes,
          questionCount: 5,
          difficulty: 'Easy',
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('GEMINI_API_KEY is not configured');
    });
  });

  describe('Successful Generation & AI Output Validation (Mocked Gemini)', () => {
    it('should return HTTP 200 with structured quiz when Gemini returns valid quiz', async () => {
      const mockParsedQuiz = {
        title: 'Cellular Respiration Fundamentals',
        questions: [
          {
            question: 'Where does glycolysis take place within the cell?',
            options: [
              'Cytoplasm',
              'Mitochondrial matrix',
              'Inner mitochondrial membrane',
              'Nucleus',
            ],
            correctAnswer: 'Cytoplasm',
            explanation:
              'Glycolysis occurs directly in the cytoplasm of the cell and does not require oxygen.',
            difficulty: 'Easy' as const,
          },
        ],
      };

      const mockClient = {
        models: {
          generateContent: async () => ({
            text: JSON.stringify(mockParsedQuiz),
          }),
        },
      } as unknown as GoogleGenAI;

      setGeminiClient(mockClient);

      const response = await request(app)
        .post('/api/v1/quizzes/generate')
        .send({
          notes: validNotes,
          questionCount: 5,
          difficulty: 'Easy',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toEqual(mockParsedQuiz);
      expect(response.body.data.questions[0].options).toHaveLength(4);
      expect(
        response.body.data.questions[0].options.includes(
          response.body.data.questions[0].correctAnswer
        )
      ).toBe(true);
    });

    it('should reject with HTTP 502 if AI generates options that do not include correctAnswer', async () => {
      const invalidMockQuiz = {
        title: 'Invalid Quiz',
        questions: [
          {
            question: 'What is ATP?',
            options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            correctAnswer: 'Non-existent answer', // Violates refine check
            explanation: 'This answer is not in options',
            difficulty: 'Easy' as const,
          },
        ],
      };

      const mockClient = {
        models: {
          generateContent: async () => ({
            text: JSON.stringify(invalidMockQuiz),
          }),
        },
      } as unknown as GoogleGenAI;

      setGeminiClient(mockClient);

      const response = await request(app)
        .post('/api/v1/quizzes/generate')
        .send({
          notes: validNotes,
          questionCount: 5,
          difficulty: 'Easy',
        });

      expect(response.status).toBe(502);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('invalid quiz structure');
    });

    it('should reject with HTTP 502 if Gemini returns an empty response', async () => {
      const mockClient = {
        models: {
          generateContent: async () => ({
            text: '',
          }),
        },
      } as unknown as GoogleGenAI;

      setGeminiClient(mockClient);

      const response = await request(app)
        .post('/api/v1/quizzes/generate')
        .send({
          notes: validNotes,
          questionCount: 5,
          difficulty: 'Easy',
        });

      expect(response.status).toBe(502);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Failed to generate quiz content');
    });
  });

  describe('Google Gemini Error Handling', () => {
    it('should map invalid API key error (API_KEY_INVALID) to HTTP 401', async () => {
      const apiKeyError = new ApiError({
        message: 'API_KEY_INVALID: API key not valid. Please pass a valid API key.',
        status: 400,
      });

      const mockClient = {
        models: {
          generateContent: async () => {
            throw apiKeyError;
          },
        },
      } as unknown as GoogleGenAI;

      setGeminiClient(mockClient);

      const response = await request(app)
        .post('/api/v1/quizzes/generate')
        .send({
          notes: validNotes,
          questionCount: 5,
          difficulty: 'Easy',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Google Gemini authentication failed');
    });

    it('should map Gemini quota / rate limit error (RESOURCE_EXHAUSTED) to HTTP 429', async () => {
      const quotaError = new ApiError({
        message: 'RESOURCE_EXHAUSTED: Quota exceeded for quota metric "GenerateContent requests".',
        status: 429,
      });

      const mockClient = {
        models: {
          generateContent: async () => {
            throw quotaError;
          },
        },
      } as unknown as GoogleGenAI;

      setGeminiClient(mockClient);

      const response = await request(app)
        .post('/api/v1/quizzes/generate')
        .send({
          notes: validNotes,
          questionCount: 5,
          difficulty: 'Easy',
        });

      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('rate limit or quota exceeded');
    });

    it('should map Gemini network failure to HTTP 503', async () => {
      const networkError = new Error('fetch failed: connect ECONNREFUSED');

      const mockClient = {
        models: {
          generateContent: async () => {
            throw networkError;
          },
        },
      } as unknown as GoogleGenAI;

      setGeminiClient(mockClient);

      const response = await request(app)
        .post('/api/v1/quizzes/generate')
        .send({
          notes: validNotes,
          questionCount: 5,
          difficulty: 'Easy',
        });

      expect(response.status).toBe(503);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Unable to connect to Google Gemini');
    });
  });
});
