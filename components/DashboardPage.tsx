import React, { useState } from 'react';
import type { SchoolRecommendation } from '../types';
import { getSchoolRecommendations } from '../services/geminiService';
import RecommendationCard from './RecommendationCard';
import { LoaderIcon } from './icons/LoaderIcon';

const DashboardPage: React.FC = () => {
  const [averageMark, setAverageMark] = useState<string>('');
  const [recommendations, setRecommendations] = useState<SchoolRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarkChange = (value: string) => {
    // Allow empty string to clear input, otherwise validate
    if (value === '') {
        setAverageMark('');
        return;
    }
    const mark = parseInt(value, 10);
    // Only update state if the value is a valid number within the range 0-100
    if (!isNaN(mark) && mark >= 0 && mark <= 100 && value.length <= 3) {
        setAverageMark(value);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    if (averageMark.trim() === '') {
        setError("Please enter your average mark.");
        setIsLoading(false);
        return;
    }
    
    const markValue = parseInt(averageMark, 10);
     if (isNaN(markValue) || markValue < 0 || markValue > 100) {
        setError("Please enter a valid average mark between 0 and 100.");
        setIsLoading(false);
        return;
    }

    try {
      const result = await getSchoolRecommendations(markValue);
      setRecommendations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-center items-center">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">SA School Recommender</h1>
        </nav>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Find Your Ideal School</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Enter your overall average mark (%) below to get personalized school recommendations.</p>
          <form onSubmit={handleSubmit}>
            <div className="max-w-xs mx-auto mb-6">
                 <div>
                  <label htmlFor="averageMark" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 text-center">Your Average Mark</label>
                  <input
                    id="averageMark"
                    type="number"
                    min="0"
                    max="100"
                    value={averageMark}
                    onChange={(e) => handleMarkChange(e.target.value)}
                    placeholder="e.g. 75"
                    className="w-full px-3 py-2 text-center text-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    aria-describedby="mark-description"
                  />
                  <p id="mark-description" className="sr-only">Enter your average mark as a percentage from 0 to 100.</p>
                </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 transition-all duration-300"
              >
                {isLoading && <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                {isLoading ? 'Analyzing...' : 'Get Recommendations'}
              </button>
            </div>
          </form>
        </div>

        {error && <div className="text-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">{error}</div>}
        
        {isLoading && (
            <div className="text-center py-10 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg">
                <div role="status" className="inline-block">
                    <LoaderIcon className="w-12 h-12 text-indigo-500 animate-spin"/>
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Consulting with our virtual education advisors...</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment.</p>
            </div>
        )}

        {!isLoading && recommendations.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-md">Your Recommendations</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {recommendations.map((rec, index) => (
                <RecommendationCard key={index} recommendation={rec} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;