
export interface Requirement {
  subject: string;
  minimumMark: number;
}

export interface RecommendedCourse {
  courseName: string;
  apsScore?: number;
  requirements: Requirement[];
}

export interface SchoolRecommendation {
  institutionName: string;
  institutionType: 'University' | 'TVET College' | 'Private College';
  website: string;
  recommendedCourses: RecommendedCourse[];
}

export interface SubjectMarks {
    [subject: string]: number | null;
}
