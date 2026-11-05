import axios, { AxiosError } from 'axios';
import type {
  GenerateQuizTextRequest,
  GenerateQuizResponse,
  HealthStatus,
  ApiError,
} from '../types';

// ─── Axios Client ─────────────────────────────────────────────────────────────

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60_000, // 60 s — AI calls can take time
});

// ─── Error Normalizer ─────────────────────────────────────────────────────────

/** Converts any thrown error into a clean, user-friendly ApiError */
export const normalizeApiError = (err: unknown): ApiError => {
  if (err instanceof AxiosError) {
    const status = err.response?.status;
    const serverMessage =
      (err.response?.data as { message?: string } | undefined)?.message;
    if (serverMessage) return { message: serverMessage, status };
    if (err.code === 'ECONNABORTED')
      return { message: 'The request timed out. Please try again.', status: 408 };
    if (!err.response)
      return {
        message: 'Cannot connect to backend server. Make sure the backend is running on port 5000.',
        status: 503,
      };
    return { message: `Server error (${status ?? 'unknown'}).`, status };
  }
  if (err instanceof Error) return { message: err.message };
  return { message: 'An unexpected error occurred.' };
};

// ─── Endpoints ────────────────────────────────────────────────────────────────

/** GET /api/v1/health */
export const checkHealth = async (): Promise<HealthStatus> => {
  const response = await apiClient.get<HealthStatus>('/health');
  return response.data;
};

/**
 * POST /api/v1/quizzes/generate
 * Calls the backend to generate structured multiple choice questions from study notes.
 */
export const generateQuizFromText = async (
  payload: GenerateQuizTextRequest
): Promise<GenerateQuizResponse> => {
  const response = await apiClient.post<GenerateQuizResponse>(
    '/quizzes/generate',
    payload
  );
  return response.data;
};
