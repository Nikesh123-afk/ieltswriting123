'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { ScoringResponse } from '@/lib/schema/scoring-schema';
import EssayForm from '@/components/EssayForm';
import ScoringResults from '@/components/ScoringResults';

export default function HomePage() {
  const { data: session } = useSession();
  const [results, setResults] = useState<ScoringResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleSubmit = async (data: {
    taskType: 'task1' | 'task2';
    module: 'academic' | 'general';
    promptText: string;
    essayText: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setWarnings([]);
    setResults(null);

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Failed to score essay');
        return;
      }

      setResults(result.data);
      if (result.warnings && result.warnings.length > 0) {
        setWarnings(result.warnings);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setWarnings([]);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f3' }}>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl academic-shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 flex justify-end gap-3">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all academic-shadow"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all academic-shadow"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight" style={{ color: '#1a202c' }}>
            IELTS Writing Assessment
          </h1>
          <p className="text-xl mb-3 font-light" style={{ color: '#2d3748' }}>
            Advanced AI-Powered Scoring System
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-full">
            <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: '#1e40af' }}>Powered by GPT-4 • Aligned with IELTS Band Descriptors</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-red-900">Error</h3>
                  <p className="text-sm text-red-800 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Warnings Display */}
          {warnings.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-yellow-900">Warnings</h3>
                  <ul className="text-sm text-yellow-800 mt-1 list-disc list-inside">
                    {warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Form or Results */}
          {!results ? (
            <EssayForm onSubmit={handleSubmit} isLoading={isLoading} />
          ) : (
            <div className="space-y-6">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 rounded-xl transition-all font-medium academic-shadow hover:academic-shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Score Another Essay
              </button>
              <ScoringResults results={results} />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Important Disclaimer</h4>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    This tool provides AI-estimated band scores for educational purposes only. Scores are not official IELTS results and should be used solely for practice and self-assessment. For accurate evaluation, please consult certified IELTS examiners.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500">
              © 2025 IELTS Writing Assessment Tool • Built for Academic Excellence
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
