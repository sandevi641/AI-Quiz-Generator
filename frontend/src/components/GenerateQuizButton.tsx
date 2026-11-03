import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateQuizButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

/**
 * Primary CTA button that triggers quiz generation.
 * Visually shows loading state and prevents double-clicks.
 */
export const GenerateQuizButton: React.FC<GenerateQuizButtonProps> = ({
  onClick,
  isGenerating,
  disabled = false,
}) => {
  const isDisabled = disabled || isGenerating;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isGenerating}
      className={[
        'w-full inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-4',
        'text-base font-semibold text-white transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        isDisabled
          ? 'bg-slate-300 cursor-not-allowed'
          : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-[0.99]',
      ].join(' ')}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          Generating Quiz…
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" aria-hidden="true" />
          Generate Quiz
        </>
      )}
    </button>
  );
};

