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

/** Converts any thrown value into a structured ApiError */
export const normalizeApiError = (err: unknown): ApiError => {
  if (err instanceof AxiosError) {
    const status = err.response?.status;
    const serverMessage =
      (err.response?.data as { message?: string } | undefined)?.message;
    if (serverMessage) return { message: serverMessage, status };
    if (err.code === 'ECONNABORTED') return { message: 'The request timed out. Please try again.' };
    if (!err.response) return { message: 'Cannot reach the server. Check your connection.' };
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
 * POST /api/v1/quizzes/generate (text input variant)
 *
 * NOTE: This endpoint will be implemented in Phase 2. The function
 * signature and types are ready so the UI can integrate immediately
 * once the backend route exists.
 */
export const generateQuizFromText = async (
  payload: GenerateQuizTextRequest,
): Promise<GenerateQuizResponse> => {
  const response = await apiClient.post<GenerateQuizResponse>(
    '/quizzes/generate',
    payload,
  );
  return response.data;
};

/**
 * POST /api/v1/quizzes/generate (PDF upload variant)
 *
 * Uses multipart/form-data so the server can read the binary file.
 * NOTE: Backend implementation pending Phase 2.
 */
export const generateQuizFromPdf = async (
  file: File,
  numQuestions: number,
  difficulty: string,
): Promise<GenerateQuizResponse> => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('numQuestions', String(numQuestions));
  formData.append('difficulty', difficulty);

  const response = await apiClient.post<GenerateQuizResponse>(
    '/quizzes/generate',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data;
};
