import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorMessageProps {
  /** Human-readable error message to display */
  message: string;
  /** Optional callback to dismiss / retry */
  onDismiss?: () => void;
  className?: string;
}

/**
 * Displays an accessible inline error banner.
 * Uses both color and an icon so the message is never conveyed by color alone.
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  className = '',
}) => (
  <div
    role="alert"
    aria-live="assertive"
    className={`flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 ${className}`}
  >
    <AlertTriangle
      className="w-4 h-4 mt-0.5 shrink-0 text-red-500"
      aria-hidden="true"
    />
    <p className="flex-1 leading-relaxed">{message}</p>
    {onDismiss && (
      <button
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="ml-auto shrink-0 text-red-400 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

