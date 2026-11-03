import React from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => (
  <footer
    className={`border-t border-slate-200 bg-white py-6 ${className}`}
    role="contentinfo"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
      <p>
        AI Quiz Generator &copy; {new Date().getFullYear()} &mdash; Smart Study Companion
      </p>
      <p>
        Built with React, Vite, Tailwind CSS &amp; Express
      </p>
    </div>
  </footer>
);

