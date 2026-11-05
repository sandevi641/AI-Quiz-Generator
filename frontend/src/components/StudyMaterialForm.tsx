import React, { useState } from 'react';
import type { QuizFormValues, InputMode, Difficulty, QuestionCount, Quiz } from '../types';
import { generateQuizFromText, normalizeApiError } from '../services/api';
import { InputModeTabs } from './InputModeTabs';
import { NotesInput } from './NotesInput';
import { PDFUpload } from './PDFUpload';
import { QuizSettings } from './QuizSettings';
import { GenerateQuizButton } from './GenerateQuizButton';
import { ErrorMessage } from './ErrorMessage';
import { LoadingState } from './LoadingState';
import { CheckCircle2, RotateCcw, Sparkles, BookOpen } from 'lucide-react';

// ─── Default form state ───────────────────────────────────────────────────────

const DEFAULT_FORM: QuizFormValues = {
  inputMode: 'notes',
  notes: '',
  pdfFile: null,
  questionCount: 5,
  difficulty: 'Medium',
};

// ─── Validation ───────────────────────────────────────────────────────────────

interface ValidationErrors {
  notes?: string;
  pdf?: string;
}

const validate = (form: QuizFormValues): ValidationErrors => {
  const errors: ValidationErrors = {};
  if (form.inputMode === 'notes') {
    if (!form.notes.trim()) {
      errors.notes = 'Please paste your study notes before generating a quiz.';
    } else if (form.notes.trim().length < 50) {
      errors.notes = 'Please enter at least 50 characters so the AI has enough content.';
    } else if (form.notes.length > 20000) {
      errors.notes = 'Study notes exceed the 20,000 character limit.';
    }
  } else {
    errors.pdf =
      'PDF text extraction will be implemented in Prompt 6. Please switch to the "Paste Notes" tab to generate a quiz.';
  }
  return errors;
};

// ─── Component ────────────────────────────────────────────────────────────────

export const StudyMaterialForm: React.FC = () => {
  const [form, setForm] = useState<QuizFormValues>(DEFAULT_FORM);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);

  // ── Typed field setters ───────────────────────────────────────────────────

  const setMode = (inputMode: InputMode) => {
    setForm((f) => ({ ...f, inputMode }));
    setValidationErrors({});
    setApiError(null);
  };

  const setNotes = (notes: string) => {
    setForm((f) => ({ ...f, notes }));
    if (validationErrors.notes) setValidationErrors((e) => ({ ...e, notes: undefined }));
  };

  const setPdfFile = (pdfFile: File | null) => {
    setForm((f) => ({ ...f, pdfFile }));
    if (validationErrors.pdf) setValidationErrors((e) => ({ ...e, pdf: undefined }));
  };

  const setQuestionCount = (questionCount: QuestionCount) =>
    setForm((f) => ({ ...f, questionCount }));

  const setDifficulty = (difficulty: Difficulty) =>
    setForm((f) => ({ ...f, difficulty }));

  // ── Submit handler ────────────────────────────────────────────────────────

  const handleGenerate = async () => {
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setApiError(null);
    setIsGenerating(true);

    try {
      const response = await generateQuizFromText({
        notes: form.notes,
        questionCount: form.questionCount,
        difficulty: form.difficulty,
      });

      if (response.success && response.data) {
        setGeneratedQuiz(response.data);
      } else {
        setApiError('The server did not return valid quiz data. Please try again.');
      }
    } catch (err: unknown) {
      const normalized = normalizeApiError(err);
      setApiError(normalized.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetQuiz = () => {
    setGeneratedQuiz(null);
    setApiError(null);
  };

  // ── Render Generated Quiz View ────────────────────────────────────────────

  if (generatedQuiz) {
    return (
      <section
        aria-label="Generated Quiz Result"
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/50 to-white">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Quiz Generated Successfully
            </div>
            <h2 className="text-xl font-bold text-slate-900">{generatedQuiz.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              {generatedQuiz.questions.length} questions &bull; Difficulty: {form.difficulty}
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetQuiz}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <RotateCcw className="w-4 h-4" />
            Create Another Quiz
          </button>
        </div>

        {/* Informative notice for next prompt */}
        <div className="px-6 py-3 bg-indigo-50/80 border-b border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>AI Generation Complete:</strong> Below is your structured quiz preview. The
            interactive quiz-taking screen with timer and scoring will be enabled in the next
            stage!
          </span>
        </div>

        {/* Questions list */}
        <div className="p-6 flex flex-col gap-6 divide-y divide-slate-100">
          {generatedQuiz.questions.map((q, qIndex) => (
            <div key={qIndex} className={qIndex > 0 ? 'pt-6' : ''}>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {qIndex + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900">{q.question}</h3>

                  {/* 4 Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5">
                    {q.options.map((option, optIndex) => {
                      const isCorrect = option === q.correctAnswer;
                      return (
                        <div
                          key={optIndex}
                          className={[
                            'px-3.5 py-2.5 rounded-lg border text-sm font-medium flex items-center justify-between',
                            isCorrect
                              ? 'border-emerald-300 bg-emerald-50/70 text-emerald-900'
                              : 'border-slate-200 bg-slate-50/50 text-slate-700',
                          ].join(' ')}
                        >
                          <span>{option}</span>
                          {isCorrect && (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                    <strong className="text-slate-800">Explanation: </strong>
                    {q.explanation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ── Render Form View ──────────────────────────────────────────────────────

  return (
    <section
      aria-label="Create a new quiz"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Card header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">Create a New Quiz</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Paste notes or upload a PDF, configure your quiz, then click Generate.
        </p>
      </div>

      <div className="px-6 py-6 flex flex-col gap-8">
        {/* ── Input Mode Tabs ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <InputModeTabs value={form.inputMode} onChange={setMode} />

          {form.inputMode === 'notes' ? (
            <NotesInput
              value={form.notes}
              onChange={setNotes}
              error={validationErrors.notes}
            />
          ) : (
            <div className="flex flex-col gap-3">
              <PDFUpload
                file={form.pdfFile}
                onChange={setPdfFile}
                error={validationErrors.pdf}
              />
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> PDF parsing and text extraction will be implemented in{' '}
                  <strong>Prompt 6</strong>. To test the live quiz generation right now,
                  please use the <strong>Paste Notes</strong> tab!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Divider ──────────────────────────────────────────────── */}
        <hr className="border-slate-100" />

        {/* ── Quiz Settings ────────────────────────────────────────── */}
        <QuizSettings
          questionCount={form.questionCount}
          difficulty={form.difficulty}
          onQuestionCountChange={setQuestionCount}
          onDifficultyChange={setDifficulty}
        />

        {/* ── Loading State ─────────────────────────────────────────── */}
        {isGenerating && <LoadingState message="Google Gemini is analyzing your notes and crafting multiple-choice questions..." />}

        {/* ── API Error ─────────────────────────────────────────────── */}
        {apiError && !isGenerating && (
          <ErrorMessage
            message={apiError}
            onDismiss={() => setApiError(null)}
          />
        )}

        {/* ── Generate Button ──────────────────────────────────────── */}
        <GenerateQuizButton
          onClick={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>
    </section>
  );
};
