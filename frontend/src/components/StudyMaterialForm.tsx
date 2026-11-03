import React, { useState } from 'react';
import type { QuizFormValues, InputMode, Difficulty, QuestionCount } from '../types';
import { generateQuizFromText, generateQuizFromPdf, normalizeApiError } from '../services/api';
import { InputModeTabs } from './InputModeTabs';
import { NotesInput } from './NotesInput';
import { PDFUpload } from './PDFUpload';
import { QuizSettings } from './QuizSettings';
import { GenerateQuizButton } from './GenerateQuizButton';
import { ErrorMessage } from './ErrorMessage';
import { LoadingState } from './LoadingState';

// ─── Default form state ───────────────────────────────────────────────────────

const DEFAULT_FORM: QuizFormValues = {
  inputMode: 'notes',
  notes: '',
  pdfFile: null,
  numQuestions: 5,
  difficulty: 'medium',
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
    }
  } else {
    if (!form.pdfFile) {
      errors.pdf = 'Please select a PDF file before generating a quiz.';
    }
  }
  return errors;
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * The main quiz creation form.
 * Manages all form state locally; delegates API calls to the service layer.
 * Shows a clear "not yet available" message since the backend endpoint is Phase 2.
 */
export const StudyMaterialForm: React.FC = () => {
  const [form, setForm] = useState<QuizFormValues>(DEFAULT_FORM);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [generationMessage, setGenerationMessage] = useState<string | null>(null);

  // ── Typed field setters ───────────────────────────────────────────────────

  const setMode = (inputMode: InputMode) => {
    setForm((f) => ({ ...f, inputMode }));
    setValidationErrors({});
    setApiError(null);
    setGenerationMessage(null);
  };

  const setNotes = (notes: string) => {
    setForm((f) => ({ ...f, notes }));
    if (validationErrors.notes) setValidationErrors((e) => ({ ...e, notes: undefined }));
  };

  const setPdfFile = (pdfFile: File | null) => {
    setForm((f) => ({ ...f, pdfFile }));
    if (validationErrors.pdf) setValidationErrors((e) => ({ ...e, pdf: undefined }));
  };

  const setNumQuestions = (numQuestions: QuestionCount) =>
    setForm((f) => ({ ...f, numQuestions }));

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
    setGenerationMessage(null);
    setIsGenerating(true);

    try {
      if (form.inputMode === 'notes') {
        await generateQuizFromText({
          notes: form.notes,
          numQuestions: form.numQuestions,
          difficulty: form.difficulty,
        });
      } else if (form.pdfFile) {
        await generateQuizFromPdf(form.pdfFile, form.numQuestions, form.difficulty);
      }
      // Phase 2: navigate to quiz results page here
      setGenerationMessage('Quiz generation API is not yet available. The backend endpoint (POST /api/v1/quizzes/generate) will be implemented in Phase 2.');
    } catch (err: unknown) {
      const normalized = normalizeApiError(err);
      if (normalized.status === 404) {
        setApiError('The quiz generation endpoint has not been implemented yet. This feature will be available in Phase 2 of the project.');
      } else {
        setApiError(normalized.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

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
            <PDFUpload
              file={form.pdfFile}
              onChange={setPdfFile}
              error={validationErrors.pdf}
            />
          )}
        </div>

        {/* ── Divider ──────────────────────────────────────────────── */}
        <hr className="border-slate-100" />

        {/* ── Quiz Settings ────────────────────────────────────────── */}
        <QuizSettings
          numQuestions={form.numQuestions}
          difficulty={form.difficulty}
          onNumQuestionsChange={setNumQuestions}
          onDifficultyChange={setDifficulty}
        />

        {/* ── Loading State ─────────────────────────────────────────── */}
        {isGenerating && <LoadingState />}

        {/* ── Informational message (endpoint not yet available) ───── */}
        {generationMessage && !isGenerating && (
          <div
            role="status"
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            <strong className="font-medium">Phase 2 Required: </strong>
            {generationMessage}
          </div>
        )}

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

