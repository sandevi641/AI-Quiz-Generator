import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

// Ensure dotenv loads from the backend's directory location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed <= 0 || parsed > 65535) {
        throw new Error('PORT must be a valid integer between 1 and 65535');
      }
      return parsed;
    }),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Support CLIENT_URL, with FRONTEND_URL as fallback for backward compatibility
  CLIENT_URL: z
    .string()
    .url('CLIENT_URL must be a valid URL (e.g. http://localhost:5173)')
    .default(process.env.FRONTEND_URL || 'http://localhost:5173'),
  // OpenAI key is optional (legacy provider)
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  // Gemini Configuration (primary provider)
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-3.1-flash-lite'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // Never print raw process.env or secret values
  console.error('[Config Error] Invalid backend environment configuration:');
  const formattedErrors = parsedEnv.error.format();
  for (const [key, value] of Object.entries(formattedErrors)) {
    if (key !== '_errors') {
      console.error(` - ${key}: ${(value as { _errors: string[] })._errors.join(', ')}`);
    }
  }
  process.exit(1);
}

export const env = parsedEnv.data;
export type Env = z.infer<typeof envSchema>;

/**
 * Validates and retrieves the OpenAI API key on demand when the AI service is called.
 * This guarantees that:
 *  1) The backend starts up cleanly without requiring an API key in early stages.
 *  2) Real AI operations fail early and informatively if the key is missing or a placeholder.
 *  3) Secrets are never invented or printed to console logs.
 */
export const getValidatedOpenAIApiKey = (): string => {
  const key = env.OPENAI_API_KEY?.trim();
  if (
    !key ||
    key === 'your_openai_api_key_here' ||
    key === 'placeholder_for_phase_2' ||
    key === 'placeholder_key'
  ) {
    throw new Error(
      'OPENAI_API_KEY is not configured. Please supply a valid OpenAI API key in your backend/.env file to use AI features.'
    );
  }
  return key;
};

/**
 * Validates and retrieves the Google Gemini API key on demand when the AI service is called.
 */
export const getValidatedGeminiApiKey = (): string => {
  const key = env.GEMINI_API_KEY?.trim();
  if (
    !key ||
    key === 'your_gemini_api_key_here' ||
    key === 'placeholder_for_phase_2' ||
    key === 'placeholder_key'
  ) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please supply a valid Gemini API key in your backend/.env file to use AI features.'
    );
  }
  return key;
};
