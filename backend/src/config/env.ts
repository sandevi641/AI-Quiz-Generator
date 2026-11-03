import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

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
  // Support CLIENT_URL, with FRONTEND_URL as backward-compatible fallback
  CLIENT_URL: z
    .string()
    .url('CLIENT_URL must be a valid URL')
    .default(process.env.FRONTEND_URL || 'http://localhost:5173'),
  // Optional at startup for Phase 1-3 foundation
  OPENAI_API_KEY: z.string().optional().default('placeholder_key'),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration:');
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export const env = parsedEnv.data;
export type Env = z.infer<typeof envSchema>;
