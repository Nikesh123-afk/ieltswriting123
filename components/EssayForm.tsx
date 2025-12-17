'use client';

import { useState } from 'react';

interface EssayFormProps {
  onSubmit: (data: {
    taskType: 'task1' | 'task2';
    module: 'academic' | 'general';
    promptText: string;
    essayText: string;
  }) => void;
  isLoading: boolean;
}

const samplePrompts = {
  task1: `The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
  task2: `Some people think that the best way to improve road safety is to increase the minimum legal age for driving cars or riding motorbikes.

To what extent do you agree or disagree?`,
};

export default function EssayForm({ onSubmit, isLoading }: EssayFormProps) {
  const [taskType, setTaskType] = useState<'task1' | 'task2'>('task2');
  const [module, setModule] = useState<'academic' | 'general'>('academic');
  const [promptText, setPromptText] = useState('');
  const [essayText, setEssayText] = useState('');

  const wordCount = essayText.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ taskType, module, promptText, essayText });
  };

  const loadSample = () => {
    setPromptText(samplePrompts[taskType]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl academic-shadow-lg border border-gray-200 p-10 space-y-8">
      {/* Task Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
            Task Type
          </label>
          <div className="flex gap-3">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="task1"
                checked={taskType === 'task1'}
                onChange={(e) => setTaskType(e.target.value as 'task1')}
                className="peer sr-only"
              />
              <div className="px-4 py-3 text-center border-2 border-gray-300 rounded-lg peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all font-medium text-gray-700 hover:border-gray-400 bg-white">
                Task 1
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="task2"
                checked={taskType === 'task2'}
                onChange={(e) => setTaskType(e.target.value as 'task2')}
                className="peer sr-only"
              />
              <div className="px-4 py-3 text-center border-2 border-gray-300 rounded-lg peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all font-medium text-gray-700 hover:border-gray-400 bg-white">
                Task 2
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
            Module
          </label>
          <div className="flex gap-3">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="academic"
                checked={module === 'academic'}
                onChange={(e) => setModule(e.target.value as 'academic')}
                className="peer sr-only"
              />
              <div className="px-4 py-3 text-center border-2 border-gray-300 rounded-lg peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all font-medium text-gray-700 hover:border-gray-400 bg-white">
                Academic
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="general"
                checked={module === 'general'}
                onChange={(e) => setModule(e.target.value as 'general')}
                className="peer sr-only"
              />
              <div className="px-4 py-3 text-center border-2 border-gray-300 rounded-lg peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all font-medium text-gray-700 hover:border-gray-400 bg-white">
                General
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Task Prompt */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label htmlFor="promptText" className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Task Prompt
          </label>
          <button
            type="button"
            onClick={loadSample}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Load Sample
          </button>
        </div>
        <textarea
          id="promptText"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          required
          rows={5}
          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 resize-none transition-all text-sm leading-relaxed"
          placeholder="Enter the official IELTS task prompt here..."
        />
      </div>

      {/* Essay Text */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label htmlFor="essayText" className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Your Essay
          </label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
            {taskType === 'task1' && wordCount > 0 && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                wordCount < 150 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {wordCount < 150 ? `${150 - wordCount} more needed` : 'Min. met ✓'}
              </span>
            )}
            {taskType === 'task2' && wordCount > 0 && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                wordCount < 250 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {wordCount < 250 ? `${250 - wordCount} more needed` : 'Min. met ✓'}
              </span>
            )}
          </div>
        </div>
        <textarea
          id="essayText"
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          required
          rows={18}
          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 resize-none text-sm leading-relaxed transition-all"
          placeholder="Paste or type your essay here...&#10;&#10;Your writing will be evaluated based on:&#10;• Task Achievement/Response&#10;• Coherence and Cohesion&#10;• Lexical Resource&#10;• Grammatical Range and Accuracy"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading || !promptText || !essayText}
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all text-lg disabled:cursor-not-allowed flex items-center justify-center gap-3 academic-shadow-md hover:academic-shadow-lg transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing Your Essay...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Generate Assessment Report</span>
            </>
          )}
        </button>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Assessment typically takes 30-60 seconds to complete
        </p>
      </div>
    </form>
  );
}
