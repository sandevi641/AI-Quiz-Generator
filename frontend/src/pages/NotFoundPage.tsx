import { Link } from 'react-router-dom';
import { MapPin, Home } from 'lucide-react';

/**
 * Fallback page for all unmatched routes.
 * Routes to: * (catch-all)
 */
export default function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center gap-6">
      <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center">
        <MapPin className="w-8 h-8" aria-hidden="true" />
      </div>

      <div>
        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="mt-2 text-slate-500 text-sm max-w-xs mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        <Home className="w-4 h-4" aria-hidden="true" />
        Back to Home
      </Link>
    </div>
  );
}

