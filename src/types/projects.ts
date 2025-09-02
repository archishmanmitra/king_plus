export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  budget: number;
  billableHours: number;
  nonBillableHours: number;
  teamMembers: string[];
  manager: string;
  progress: number;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours: number;
  actualHours: number;
  billable: boolean;
  startDate: string;
  dueDate: string;
}

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  projectId: string;
  taskId: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
  status: 'draft' | 'submitted' | 'approved';
}