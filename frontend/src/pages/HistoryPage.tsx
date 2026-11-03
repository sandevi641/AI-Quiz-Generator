import { Link } from 'react-router-dom';
import { History, Clock, PlusCircle } from 'lucide-react';

/**
 * Quiz History placeholder page.
 * Routes to: /history
 *
 * Full localStorage-backed history will be implemented in Phase 3.
 */
export default function HistoryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
          <History className="w-8 h-8" aria-hidden="true" />
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quiz History</h1>
          <p className="mt-2 text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
            Your completed quizzes will appear here. This feature will be implemented in
            Phase 3 once the quiz runner is complete.
          </p>
        </div>

        {/* Upcoming features */}
        <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Coming in Phase 3
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-700">
            {[
              'Browse all previously generated quizzes',
              'View your scores and correct/incorrect answers',
              'Retry any quiz to track your improvement',
              'Filter by subject or difficulty',
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Clock
                  className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA back to create */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
          Create Your First Quiz
        </Link>
      </div>
    </div>
  );
}

