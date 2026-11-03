import { useState } from 'react';
import { Header } from './components/Header';
import { checkHealth } from './services/api';
import { 
  FileText, 
  BrainCircuit, 
  CheckCircle2, 
  History, 
  Server, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function App() {
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleTestBackend = async () => {
    setIsChecking(true);
    try {
      const data = await checkHealth();
      setHealthStatus(`Online: ${data.message || 'Server OK'} (v${data.version || '1.0.0'})`);
    } catch {
      setHealthStatus('Backend offline or unreachable at http://localhost:5000/api/v1/health');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-4">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Study Tool
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            Generate Interactive Quizzes from Your Study Materials
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Turn your lecture notes and PDF documents into high-yield practice quizzes in seconds.
            Master your subjects with instant scoring and detailed explanations.
          </p>
        </div>

        {/* System Foundation Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-12 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Backend API Connectivity</h3>
                <p className="text-sm text-slate-500">Test health endpoint (GET /api/v1/health)</p>
              </div>
            </div>
            <button
              onClick={handleTestBackend}
              disabled={isChecking}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {isChecking ? 'Checking...' : 'Check Status'}
            </button>
          </div>

          {healthStatus && (
            <div className={`p-3 rounded-lg text-sm border ${
              healthStatus.startsWith('Online') 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {healthStatus}
            </div>
          )}
        </div>

        {/* Feature Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Study Notes & PDFs</h3>
            <p className="text-sm text-slate-600">
              Paste raw notes or upload PDF lectures with robust server-side text extraction.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">AI Generation</h3>
            <p className="text-sm text-slate-600">
              Create structured multiple-choice questions powered by OpenAI and validated by Zod.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Instant Assessment</h3>
            <p className="text-sm text-slate-600">
              Interactive quiz testing with real-time feedback, grading, and in-depth answer explanations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
              <History className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Progress History</h3>
            <p className="text-sm text-slate-600">
              Browser-based quiz persistence designed to seamlessly transition to PostgreSQL & Prisma.
            </p>
          </div>
        </div>

        {/* Architecture & Security Notice */}
        <div className="bg-slate-100 rounded-xl p-5 border border-slate-200 flex items-start space-x-3 text-slate-700 text-sm">
          <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-slate-900">Security Architecture: </span>
            All AI API keys and model credentials remain strictly within the backend service. No secrets are ever exposed to the client application.
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 bg-white text-center text-sm text-slate-500">
        AI Quiz Generator &copy; {new Date().getFullYear()} — Built with React, Vite, Tailwind CSS, Express, and TypeScript.
      </footer>
    </div>
  );
}
