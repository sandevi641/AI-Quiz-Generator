import React from 'react';
import { BookOpen, Sparkles, ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

/**
 * Landing hero section — explains the product, guides the user to the form.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => (
  <section
    aria-labelledby="hero-heading"
    className="text-center max-w-3xl mx-auto py-10 flex flex-col items-center gap-6"
  >
    {/* Badge */}
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
      aria-label="AI-powered study tool badge"
    >
      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
      AI-Powered Study Tool
    </div>

    {/* Heading */}
    <h1
      id="hero-heading"
      className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
    >
      Turn Your Study Notes{' '}
      <span className="text-indigo-600">Into Quizzes</span>
    </h1>

    {/* Explanation */}
    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
      Paste your lecture notes or upload a PDF and let AI generate multiple-choice
      questions tailored to your material. Get instant feedback, understand your
      mistakes, and revise more effectively.
    </p>

    {/* How it works — 3 simple steps */}
    <ol
      aria-label="How it works — three steps"
      className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 mt-2 w-full max-w-xl"
    >
      {[
        { step: '1', icon: BookOpen, text: 'Paste notes or upload a PDF' },
        { step: '2', icon: Sparkles, text: 'AI generates quiz questions' },
        { step: '3', icon: ArrowDown, text: 'Answer, get scored & review' },
      ].map(({ step, icon: Icon, text }, i) => (
        <React.Fragment key={step}>
          <li className="flex flex-col items-center gap-1 text-center flex-1">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Icon className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="text-xs text-slate-400 font-medium">Step {step}</span>
            <span className="text-sm text-slate-700 font-medium max-w-[120px]">{text}</span>
          </li>
          {i < 2 && (
            <li
              aria-hidden="true"
              className="hidden sm:block w-8 h-px bg-slate-300 shrink-0 mx-2 mt-4"
            />
          )}
        </React.Fragment>
      ))}
    </ol>

    {/* CTA */}
    <button
      type="button"
      onClick={onGetStarted}
      aria-label="Scroll to the quiz creation form"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.99]"
    >
      Get Started
      <ArrowDown className="w-4 h-4" aria-hidden="true" />
    </button>
  </section>
);

