export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours: number;
  overtimeHours: number;
  status: 'present' | 'absent';
  method: 'biometric' | 'geo' | 'selfie' | 'manual';
  location?: string;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'sick' | 'vacation' | 'personal' | 'maternity' | 'paternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approver?: string;
  appliedDate: string;
}

export interface LeaveBalance {
  employeeId: string;
  sick: number;
  vacation: number;
  personal: number;
  maternity: number;
  paternity: number;
  total: number;
}