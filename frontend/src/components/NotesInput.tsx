import React, { useId } from 'react';
import { X } from 'lucide-react';

const MIN_CHARS = 50;
const MAX_CHARS = 20_000;

interface NotesInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * Textarea panel for pasting study notes.
 * Shows live character count and validation feedback.
 */
export const NotesInput: React.FC<NotesInputProps> = ({ value, onChange, error }) => {
  const id = useId();
  const charCount = value.length;
  const isTooShort = charCount > 0 && charCount < MIN_CHARS;
  const isNearLimit = charCount > MAX_CHARS * 0.9;
  const isOverLimit = charCount > MAX_CHARS;

  const handleClear = () => onChange('');

  return (
    <div
      role="tabpanel"
      id="tabpanel-notes"
      aria-labelledby="tab-notes"
      className="flex flex-col gap-2"
    >
      <div className="relative">
        <label htmlFor={id} className="sr-only">
          Paste your study notes here
        </label>
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your lecture notes, textbook excerpts, or any study material here…

Example:
The mitochondria is the powerhouse of the cell. It produces ATP through oxidative phosphorylation. The inner membrane contains cristae which increase the surface area for ATP production…"
          rows={12}
          maxLength={MAX_CHARS}
          aria-invalid={!!(error || isTooShort || isOverLimit)}
          aria-describedby={`${id}-count ${error ? `${id}-error` : ''}`}
          className={[
            'w-full resize-y rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 leading-relaxed',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:border-indigo-500 transition-colors',
            error || isTooShort || isOverLimit
              ? 'border-red-300'
              : 'border-slate-200 hover:border-slate-300',
          ].join(' ')}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear notes"
            className="absolute top-3 right-3 p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Character count */}
      <div
        id={`${id}-count`}
        className={[
          'text-xs text-right tabular-nums',
          isOverLimit
            ? 'text-red-600 font-medium'
            : isNearLimit
            ? 'text-amber-600'
            : 'text-slate-400',
        ].join(' ')}
        aria-live="polite"
      >
        {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
      </div>

      {/* Validation messages */}
      {(error || isTooShort) && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error ?? `Please enter at least ${MIN_CHARS} characters so the AI has enough content to work with.`}
        </p>
      )}
    </div>
  );
};

