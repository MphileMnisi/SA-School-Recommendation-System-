
import React, { useState } from 'react';
import type { SchoolRecommendation, SubjectMarks } from '../types';
import { getSchoolRecommendations } from '../services/geminiService';
import RecommendationCard from './RecommendationCard';
import { LoaderIcon } from './icons/LoaderIcon';
import { TrashIcon } from './icons/TrashIcon';
import { GraduationCapIcon } from './icons/GraduationCapIcon';

interface SubjectEntry {
  id: number;
  name: string;
  mark: string;
  error?: string;
}

const initialSubjects: SubjectEntry[] = [
    { id: 1, name: 'Mathematics', mark: '', error: '' },
    { id: 2, name: 'Physical Sciences', mark: '', error: '' },
    { id: 3, name: 'English FAL', mark: '', error: '' },
    { id: 4, name: 'Life Orientation', mark: '', error: '' },
    { id: 5, name: 'isiXhosa HL', mark: '', error: '' },
];

let nextId = 6;

const DashboardPage: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectEntry[]>(initialSubjects);
  const [averageMark, setAverageMark] = useState('');
  const [averageMarkError, setAverageMarkError] = useState<string | undefined>(undefined);
  const [recommendations, setRecommendations] = useState<SchoolRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateMark = (mark: string) => {
    if (mark === '') return undefined; // No error if empty
    const num = Number(mark);
    if (isNaN(num) || num < 0 || num > 100 || !Number.isInteger(num)) {
      return 'Mark must be a whole number between 0 and 100.';
    }
    return undefined;
  };
  
  const handleAverageMarkChange = (value: string) => {
    setAverageMark(value);
    setAverageMarkError(validateMark(value));
  };

  const handleSubjectChange = (id: number, field: 'name' | 'mark', value: string) => {
    setSubjects(subjects.map(sub => {
      if (sub.id === id) {
        if (field === 'mark') {
          const error = validateMark(value);
          return { ...sub, mark: value, error: error };
        }
        return { ...sub, [field]: value };
      }
      return sub;
    }));
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { id: nextId++, name: '', mark: '' }]);
  };

  const handleRemoveSubject = (id: number) => {
    setSubjects(subjects.filter(sub => sub.id !== id));
  };

  const handleClearAll = () => {
    setSubjects(initialSubjects);
    setAverageMark('');
    setAverageMarkError(undefined);
    setRecommendations([]);
    setError(null);
    setIsLoading(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRecommendations([]);

    const avgMarkError = validateMark(averageMark);
    setAverageMarkError(avgMarkError);

    // Final validation before submitting
    let hasSubjectErrors = false;
    const finalSubjects = subjects.map(sub => {
      const error = validateMark(sub.mark);
      if (error) hasSubjectErrors = true;
      if (!sub.name.trim() && sub.mark.trim()) {
        hasSubjectErrors = true;
      }
      return { ...sub, error };
    });
    setSubjects(finalSubjects);

    const filledSubjects = subjects.filter(s => s.name.trim() && s.mark.trim());
    if (filledSubjects.length < 3) {
      setError("Please provide at least 3 subjects and their marks.");
      return;
    }

    if (hasSubjectErrors || avgMarkError) {
      setError("Please fix the errors in your marks before proceeding.");
      return;
    }
    
    setIsLoading(true);
    
    const subjectMarks: SubjectMarks = filledSubjects.reduce((acc, sub) => {
      acc[sub.name] = Number(sub.mark);
      return acc;
    }, {} as SubjectMarks);

    const averageMarkNumber = averageMark.trim() !== '' ? Number(averageMark) : null;


    try {
      const result = await getSchoolRecommendations(subjectMarks, averageMarkNumber);
      setRecommendations(result);
    // FIX: Corrected catch block syntax from `catch(err) =>` to `catch(err)`.
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
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <GraduationCapIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">SA School Recommender</h1>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">Find Your Ideal School</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-2xl mx-auto">
            Enter your final marks for your high school subjects below. This will help us provide personalized recommendations for South African universities and colleges that match your academic profile.
          </p>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="mb-8">
              <label htmlFor="averageMark" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 text-center">Your Overall Average Mark (%) (Optional)</label>
              <input
                id="averageMark"
                type="number"
                min="0"
                max="100"
                value={averageMark}
                onChange={(e) => handleAverageMarkChange(e.target.value)}
                placeholder="e.g. 82"
                className={`w-full max-w-xs mx-auto block px-3 py-2 text-center bg-gray-50 dark:bg-gray-700 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${averageMarkError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              {averageMarkError && <p className="text-red-500 text-xs mt-1 text-center">{averageMarkError}</p>}
            </div>

            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 text-center">Your Subject Marks (%)</label>
              {subjects.map((subject, index) => (
                <div key={subject.id} className="grid grid-cols-1 md:grid-cols-[1fr_120px_40px] gap-2 items-start">
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(subject.id, 'name', e.target.value)}
                    placeholder="Subject Name"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <div>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={subject.mark}
                        onChange={(e) => handleSubjectChange(subject.id, 'mark', e.target.value)}
                        placeholder="e.g. 75"
                        className={`w-full px-3 py-2 text-center bg-gray-50 dark:bg-gray-700 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${subject.error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        required
                    />
                     {subject.error && <p className="text-red-500 text-xs mt-1">{subject.error}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(subject.id)}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50"
                    aria-label="Remove subject"
                    disabled={subjects.length <= 1}
                  >
                    <TrashIcon className="w-6 h-6"/>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-4 mb-8">
                 <button
                    type="button"
                    onClick={handleAddSubject}
                    className="px-4 py-2 border border-dashed border-gray-400 dark:border-gray-500 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    + Add Subject
                </button>
                <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-4 py-2 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/50 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
                >
                    Clear All
                </button>
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
