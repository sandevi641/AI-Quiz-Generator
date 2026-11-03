import React from 'react';
import type { InputMode } from '../types';
import { FileText, Upload } from 'lucide-react';

interface InputModeTabsProps {
  value: InputMode;
  onChange: (mode: InputMode) => void;
}

const TABS: { mode: InputMode; label: string; icon: React.FC<{ className?: string }> }[] = [
  { mode: 'notes', label: 'Paste Notes', icon: FileText },
  { mode: 'pdf', label: 'Upload PDF', icon: Upload },
];

/**
 * Segmented-control tab selector.
 * Follows WAI-ARIA tab pattern with keyboard navigation.
 */
export const InputModeTabs: React.FC<InputModeTabsProps> = ({ value, onChange }) => (
  <div
    role="tablist"
    aria-label="Study material input mode"
    className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 gap-1"
  >
    {TABS.map(({ mode, label, icon: Icon }) => {
      const active = value === mode;
      return (
        <button
          key={mode}
          role="tab"
          type="button"
          id={`tab-${mode}`}
          aria-selected={active}
          aria-controls={`tabpanel-${mode}`}
          onClick={() => onChange(mode)}
          className={[
            'inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
            active
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
          ].join(' ')}
        >
          <Icon className="w-4 h-4" aria-hidden="true" />
          {label}
        </button>
      );
    })}
  </div>
);

