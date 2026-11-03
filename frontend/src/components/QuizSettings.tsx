import React, { useId } from 'react';
import type { Difficulty, QuestionCount } from '../types';
import { Settings2, BarChart2, ListChecks } from 'lucide-react';

interface QuizSettingsProps {
  numQuestions: QuestionCount;
  difficulty: Difficulty;
  onNumQuestionsChange: (val: QuestionCount) => void;
  onDifficultyChange: (val: Difficulty) => void;
}

const QUESTION_COUNTS: QuestionCount[] = [5, 10, 15];

const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  { value: 'easy', label: 'Easy', description: 'Recall and basic comprehension' },
  { value: 'medium', label: 'Medium', description: 'Application and analysis' },
  { value: 'hard', label: 'Hard', description: 'Evaluation and synthesis' },
];

interface OptionButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
}

const OptionButton: React.FC<OptionButtonProps> = ({ active, onClick, children, ariaLabel }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    aria-label={ariaLabel}
    className={[
      'px-4 py-2 rounded-md text-sm font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
      active
        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-700',
    ].join(' ')}
  >
    {children}
  </button>
);

/**
 * Quiz configuration panel: question count, difficulty.
 * Question type is fixed to Multiple Choice for this MVP.
 */
export const QuizSettings: React.FC<QuizSettingsProps> = ({
  numQuestions,
  difficulty,
  onNumQuestionsChange,
  onDifficultyChange,
}) => {
  const questionCountId = useId();
  const difficultyId = useId();

  return (
    <section aria-labelledby="quiz-settings-heading" className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-slate-500" aria-hidden="true" />
        <h2
          id="quiz-settings-heading"
          className="text-sm font-semibold text-slate-700 uppercase tracking-wider"
        >
          Quiz Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Number of Questions */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <ListChecks className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <label
              id={`${questionCountId}-label`}
              htmlFor={questionCountId}
              className="text-sm font-medium text-slate-700"
            >
              Number of Questions
            </label>
          </div>
          <div
            id={questionCountId}
            role="group"
            aria-labelledby={`${questionCountId}-label`}
            className="flex gap-2"
          >
            {QUESTION_COUNTS.map((n) => (
              <OptionButton
                key={n}
                active={numQuestions === n}
                onClick={() => onNumQuestionsChange(n)}
                ariaLabel={`${n} questions`}
              >
                {n}
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <BarChart2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <label
              id={`${difficultyId}-label`}
              className="text-sm font-medium text-slate-700"
            >
              Difficulty
            </label>
          </div>
          <div
            role="group"
            aria-labelledby={`${difficultyId}-label`}
            className="flex gap-2 flex-wrap"
          >
            {DIFFICULTIES.map(({ value, label, description }) => (
              <OptionButton
                key={value}
                active={difficulty === value}
                onClick={() => onDifficultyChange(value)}
                ariaLabel={`${label} — ${description}`}
              >
                {label}
              </OptionButton>
            ))}
          </div>
          {/* Contextual hint for selected difficulty */}
          <p className="mt-2 text-xs text-slate-400">
            {DIFFICULTIES.find((d) => d.value === difficulty)?.description}
          </p>
        </div>
      </div>

      {/* Question type — MVP notice */}
      <div className="flex items-start gap-2 rounded-md bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-600">
        <ListChecks className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-500" aria-hidden="true" />
        <span>
          <strong className="font-medium text-slate-700">Question Type: </strong>
          Multiple Choice (4 options) &mdash; the only format supported in this version.
        </span>
      </div>
    </section>
  );
};

