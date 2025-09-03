export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  reviewType: 'annual' | 'quarterly' | 'probation' | '360-degree';
  overallRating: number;
  goals: Goal[];
  feedback: Feedback[];
  status: 'draft' | 'in-progress' | 'completed';
  reviewDate: string;
  reviewer: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'learning' | 'behavioral' | 'project';
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  weight: number;
}

export interface Feedback {
  id: string;
  category: string;
  rating: number;
  comments: string;
  reviewer: string;
  reviewerRole: string;
}

export interface OKR {
  id: string;
  objective: string;
  keyResults: KeyResult[];
  quarter: string;
  year: number;
  owner: string;
  status: 'draft' | 'active' | 'completed';
}

export interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
}