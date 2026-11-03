import OpenAI from 'openai';
import { getValidatedOpenAIApiKey } from '../config/env.js';

let openaiClient: OpenAI | null = null;

export const getOpenAIClient = (): OpenAI => {
  if (!openaiClient) {
    const apiKey = getValidatedOpenAIApiKey();
    openaiClient = new OpenAI({
      apiKey,
    });
  }
  return openaiClient;
};
