'use client';

import type { ScoringResponse } from '@/lib/schema/scoring-schema';

interface ScoringResultsProps {
  results: ScoringResponse;
}

export default function ScoringResults({ results }: ScoringResultsProps) {
  const { meta, scores, feedback } = results;

  const criteriaLabels = {
    task_achievement_or_response: meta.task_type === 'task1' ? 'Task Achievement' : 'Task Response',
    coherence_and_cohesion: 'Coherence and Cohesion',
    lexical_resource: 'Lexical Resource',
    grammatical_range_and_accuracy: 'Grammatical Range and Accuracy',
  };

  const getBandColor = (band: number) => {
    if (band >= 7.0) return 'text-green-600';
    if (band >= 6.0) return 'text-blue-600';
    if (band >= 5.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactColor = (impact: string) => {
    if (impact === 'high') return 'bg-red-100 text-red-800 border border-red-200';
    if (impact === 'medium') return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    return 'bg-green-100 text-green-800 border border-green-200';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      grammar: 'bg-purple-100 text-purple-800 border border-purple-200',
      vocabulary: 'bg-blue-100 text-blue-800 border border-blue-200',
      cohesion: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      task_response: 'bg-pink-100 text-pink-800 border border-pink-200',
      other: 'bg-gray-100 text-gray-800 border border-gray-200',
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="space-y-8">
      {/* Overall Score Card */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl academic-shadow-lg p-10 text-white">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-wider">IELTS Band Score</span>
          </div>
          <div className="text-8xl md:text-9xl font-bold mb-4 tracking-tight">
            {scores.overall.rounded_band.toFixed(1)}
          </div>
          <p className="text-2xl opacity-95 font-light mb-8">
            Overall Assessment Score
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all">
              <div className="text-4xl font-bold mb-2">{scores.task_achievement_or_response.rounded_band.toFixed(1)}</div>
              <div className="text-sm opacity-90 font-medium">{criteriaLabels.task_achievement_or_response}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all">
              <div className="text-4xl font-bold mb-2">{scores.coherence_and_cohesion.rounded_band.toFixed(1)}</div>
              <div className="text-sm opacity-90 font-medium">Coherence & Cohesion</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all">
              <div className="text-4xl font-bold mb-2">{scores.lexical_resource.rounded_band.toFixed(1)}</div>
              <div className="text-sm opacity-90 font-medium">Lexical Resource</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all">
              <div className="text-4xl font-bold mb-2">{scores.grammatical_range_and_accuracy.rounded_band.toFixed(1)}</div>
              <div className="text-sm opacity-90 font-medium">Grammar & Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl academic-shadow-lg border border-gray-200 p-8">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Executive Summary</h3>
            <p className="text-gray-600 text-sm">Overall assessment of your writing performance</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed text-base mb-6">
          {feedback.summary_comment}
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{meta.task_type === 'task1' ? 'Task 1' : 'Task 2'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <span className="font-medium">{meta.module === 'academic' ? 'Academic' : 'General Training'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">~{meta.approx_word_count} words</span>
          </div>
        </div>
      </div>

      {/* Detailed Criterion Feedback */}
      <div className="bg-white rounded-2xl academic-shadow-lg border border-gray-200 p-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Detailed Assessment by Criterion</h3>
            <p className="text-gray-600 text-sm">Individual scores for each IELTS assessment criterion</p>
          </div>
        </div>
        <div className="space-y-6">
          {(Object.keys(criteriaLabels) as Array<keyof typeof criteriaLabels>).map((key) => (
            <div key={key} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {criteriaLabels[key]}
                </h4>
                <div className="flex flex-col items-end">
                  <span className={`text-3xl font-bold ${getBandColor(scores[key].rounded_band)}`}>
                    {scores[key].rounded_band.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Band Score</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full transition-all ${scores[key].rounded_band >= 7 ? 'bg-green-500' : scores[key].rounded_band >= 6 ? 'bg-blue-500' : scores[key].rounded_band >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${(scores[key].rounded_band / 9) * 100}%` }}
                ></div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {feedback.criterion_feedback[key].comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights (Errors & Issues) */}
      {feedback.highlights.length > 0 && (
        <div className="bg-white rounded-2xl academic-shadow-lg border border-gray-200 p-8">
          <div className="flex items-start gap-3 mb-6">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Key Issues Identified
              </h3>
              <p className="text-gray-600 text-sm">
                {feedback.highlights.length} {feedback.highlights.length === 1 ? 'issue' : 'issues'} requiring attention
              </p>
            </div>
          </div>
          <div className="space-y-5">
            {feedback.highlights.map((highlight, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-gray-600 border-2 border-gray-300">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${getTypeColor(highlight.type)}`}>
                        {highlight.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 mb-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-mono text-red-900 flex-1">
                          "{highlight.text_snippet}"
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <span className="font-semibold text-gray-900">Issue:</span> {highlight.issue_explanation}
                      </p>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-green-900 flex-1">
                          <span className="font-semibold">Suggested:</span> {highlight.suggested_correction}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revision Plan */}
      {feedback.revision_plan.length > 0 && (
        <div className="bg-white rounded-2xl academic-shadow-lg border border-gray-200 p-8">
          <div className="flex items-start gap-3 mb-6">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Actionable Revision Plan
              </h3>
              <p className="text-gray-600 text-sm">
                Prioritized steps to improve your essay score
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {feedback.revision_plan.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold rounded-full flex items-center justify-center text-lg academic-shadow">
                      {idx + 1}
                    </div>
                    {idx < feedback.revision_plan.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide flex-shrink-0 ml-3 ${getImpactColor(item.estimated_impact)}`}>
                        {item.estimated_impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues Warning */}
      {results.issues.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-orange-900 mb-3">Important Notes</h4>
              <ul className="space-y-2">
                {results.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-orange-800">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="leading-relaxed">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Notes */}
      {results.notes_for_teacher && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-blue-900 mb-2">Educator's Insight</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                {results.notes_for_teacher}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
