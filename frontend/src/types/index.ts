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

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

