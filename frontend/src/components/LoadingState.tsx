import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  /** Message shown below the spinner */
  message?: string;
  /** Additional Tailwind classes for the container */
  className?: string;
}

/**
 * Full-width centered loading state used while the backend generates a quiz.
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Generating your quiz…',
  className = '',
}) => (
  <div
    role="status"
    aria-live="polite"
    aria-label={message}
    className={`flex flex-col items-center justify-center gap-4 py-16 text-slate-500 ${className}`}
  >
    <Loader2
      className="w-10 h-10 animate-spin text-indigo-600"
      aria-hidden="true"
    />
    <p className="text-sm font-medium">{message}</p>
    <p className="text-xs text-slate-400 max-w-xs text-center">
      The AI is reading your notes and writing questions. This may take up to 30
      seconds.
    </p>
  </div>
);

