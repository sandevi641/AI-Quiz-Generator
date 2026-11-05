import type { Quiz } from '../types';

const STORAGE_KEY = 'ai_quiz_generator_quizzes';

export const saveQuizToLocalStorage = (quiz: Quiz): void => {
  try {
    const existing = getStoredQuizzes();
    const updated = [quiz, ...existing.filter((q) => (q.id && quiz.id ? q.id !== quiz.id : q.title !== quiz.title))];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save quiz to local storage:', err);
  }
};

export const getStoredQuizzes = (): Quiz[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as Quiz[]) : [];
  } catch (err) {
    console.error('Failed to read quizzes from local storage:', err);
    return [];
  }
};

export const clearStoredQuizzes = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear stored quizzes:', err);
  }
};
