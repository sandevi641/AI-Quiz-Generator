import React, { useRef, useState, useCallback, useId } from 'react';
import { Upload, FileText, X, AlertTriangle } from 'lucide-react';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_MIME = 'application/pdf';
const ACCEPTED_EXTENSION = '.pdf';

interface PDFUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

interface FileValidationResult {
  valid: boolean;
  message?: string;
}

const validateFile = (file: File): FileValidationResult => {
  if (!file.name.toLowerCase().endsWith(ACCEPTED_EXTENSION) && file.type !== ACCEPTED_MIME) {
    return { valid: false, message: 'Only PDF files are supported. Please choose a .pdf file.' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      message: `This file is ${(file.size / 1024 / 1024).toFixed(1)} MB, which exceeds the ${MAX_FILE_SIZE_MB} MB limit. Please compress or split your PDF.`,
    };
  }
  return { valid: true };
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

/**
 * Drag-and-drop + file-picker PDF upload panel.
 * Validates file type and size on the frontend immediately.
 * Does not perform any text extraction — that happens on the backend.
 */
export const PDFUpload: React.FC<PDFUploadProps> = ({ file, onChange, error }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const dropZoneId = useId();

  const handleFile = useCallback(
    (incoming: File) => {
      const result = validateFile(incoming);
      if (!result.valid) {
        setLocalError(result.message ?? 'Invalid file.');
        onChange(null);
        return;
      }
      setLocalError(null);
      onChange(incoming);
    },
    [onChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
    // Reset the input so the same file can be re-selected after removal
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const displayedError = error || localError;

  return (
    <div
      role="tabpanel"
      id="tabpanel-pdf"
      aria-labelledby="tab-pdf"
      className="flex flex-col gap-3"
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSION}
        className="sr-only"
        aria-label="Choose PDF file"
        id={`${dropZoneId}-input`}
        onChange={handleInputChange}
      />

      {file ? (
        /* ── Selected file preview ── */
        <div className="flex items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3">
          <FileText className="w-6 h-6 text-indigo-600 shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setLocalError(null);
            }}
            aria-label={`Remove ${file.name}`}
            className="shrink-0 p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload PDF — click or drag and drop a file here"
          aria-describedby={displayedError ? `${dropZoneId}-error` : undefined}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onKeyDown={handleKeyDown}
          onClick={() => inputRef.current?.click()}
          className={[
            'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-12 text-center cursor-pointer transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
            isDragging
              ? 'border-indigo-400 bg-indigo-50'
              : displayedError
              ? 'border-red-300 bg-red-50'
              : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50',
          ].join(' ')}
        >
          <Upload
            className={`w-8 h-8 ${isDragging ? 'text-indigo-500' : 'text-slate-400'}`}
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-medium text-slate-700">
              Drag &amp; drop your PDF here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              or{' '}
              <span className="text-indigo-600 font-medium underline underline-offset-2">
                browse to choose a file
              </span>
            </p>
          </div>
          <p className="text-xs text-slate-400">
            PDF only &bull; Maximum {MAX_FILE_SIZE_MB} MB
          </p>
          <p className="mt-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
            Note: PDF text extraction will be processed by the server in Phase 2.
            Scanned-image PDFs are not yet supported.
          </p>
        </div>
      )}

      {/* Validation error */}
      {displayedError && (
        <div
          id={`${dropZoneId}-error`}
          role="alert"
          className="flex items-start gap-2 text-xs text-red-700"
        >
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{displayedError}</span>
        </div>
      )}
    </div>
  );
};

