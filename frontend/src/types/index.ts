// ─── Quiz Domain Types ───────────────────────────────────────────────────────

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
}

export interface Quiz {
  id?: string;
  title: string;
  questions: QuizQuestion[];
  createdAt?: string;
}

// ─── Form / Input Types ───────────────────────────────────────────────────────

/** Which tab the user has selected for their study material input */
export type InputMode = 'notes' | 'pdf';

/** Available question counts */
export type QuestionCount = 5 | 10 | 15;

/** All values that drive the quiz generation form */
export interface QuizFormValues {
  inputMode: InputMode;
  notes: string;
  pdfFile: File | null;
  questionCount: QuestionCount;
  difficulty: Difficulty;
}

// ─── API Types ────────────────────────────────────────────────────────────────

/** Shape sent to POST /api/v1/quizzes/generate */
export interface GenerateQuizTextRequest {
  notes: string;
  questionCount: QuestionCount;
  difficulty: Difficulty;
}

/** Shape of the backend's quiz generation response */
export interface GenerateQuizResponse {
  success: boolean;
  data: Quiz;
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
