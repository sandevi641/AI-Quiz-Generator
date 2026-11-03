// ─── Quiz Domain Types ───────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic?: string;
  questions: QuizQuestion[];
  createdAt: string;
}

// ─── Form / Input Types ───────────────────────────────────────────────────────

/** Which tab the user has selected for their study material input */
export type InputMode = 'notes' | 'pdf';

/** Available difficulty levels */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** Available question counts */
export type QuestionCount = 5 | 10 | 15;

/** All values that drive the quiz generation form */
export interface QuizFormValues {
  inputMode: InputMode;
  notes: string;
  pdfFile: File | null;
  numQuestions: QuestionCount;
  difficulty: Difficulty;
}

// ─── API Types ────────────────────────────────────────────────────────────────

/** Shape sent to POST /api/v1/quizzes/generate for text-based input */
export interface GenerateQuizTextRequest {
  notes: string;
  numQuestions: number;
  difficulty: Difficulty;
}

/** Shape of the backend's quiz generation response (when implemented) */
export interface GenerateQuizResponse {
  quiz: Quiz;
}

/** Standard API error shape */
export interface ApiError {
  message: string;
  status?: number;
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

export interface HealthStatus {
  status: string;
  message: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}
