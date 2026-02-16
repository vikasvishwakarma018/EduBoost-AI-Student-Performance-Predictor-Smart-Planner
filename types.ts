
export interface StudentData {
  studyHours: number;
  sleepHours: number;
  attendance: number;
  prevMarks: number;
  assignmentRate: number;
  internetUsage: number;
  stressLevel: number;
  goalMarks: number;
}

export interface PredictionResult {
  predictedMarks: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  riskLevel: 'Low' | 'Medium' | 'High';
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface StudyPlanItem {
  day: string;
  tasks: {
    time: string;
    activity: string;
    focus: string;
  }[];
}

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
}
