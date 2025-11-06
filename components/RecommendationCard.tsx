import React from 'react';
import type { SchoolRecommendation } from '../types';

interface RecommendationCardProps {
  recommendation: SchoolRecommendation;
}

const getInstitutionTypeColor = (type: string) => {
    switch(type) {
        case 'University':
            return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
        case 'TVET College':
            return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
        case 'Private College':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{recommendation.institutionName}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getInstitutionTypeColor(recommendation.institutionType)}`}>
                {recommendation.institutionType}
            </span>
        </div>
        
        <div className="mb-6">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Recommended Courses & Requirements:</h4>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {recommendation.recommendedCourses.map((course, i) => (
                    <div key={i} className="p-3 bg-gray-50/70 dark:bg-gray-800/70 rounded-lg">
                        <p className="font-bold text-gray-800 dark:text-gray-100">{course.courseName}</p>
                        {course.apsScore && <p className="text-sm text-gray-600 dark:text-gray-400">Min APS: {course.apsScore}</p>}
                        <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {course.requirements.map((req, j) => (
                                <li key={j}>
                                    <span className="font-medium">{req.subject}:</span> {req.minimumMark}%
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
      </div>
       <div className="p-6 pt-0 mt-auto">
         <a
          href={recommendation.website}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-semibold"
        >
          Visit Website
        </a>
      </div>
    </div>
  );
};

export default RecommendationCard;