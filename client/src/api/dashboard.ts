const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function authHeaders() {
  const token = localStorage.getItem('hrms_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Dashboard Statistics API
export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  monthlyPayroll: number;
  myLeaveBalance: number;
  hoursThisWeek: number;
}

// Get total employees count
export async function getTotalEmployees(): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/employees`, { 
      credentials: 'include', 
      headers: { ...authHeaders() } 
    });
    if (!res.ok) throw new Error('Failed to fetch employees');
    const data = await res.json();
    return data.employees?.length || 0;
  } catch (error) {
    console.error('Error fetching total employees:', error);
    return 0;
  }
}

// Get present today count (employees who clocked in today)
export async function getPresentToday(): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/attendance/today`, { 
      credentials: 'include', 
      headers: { ...authHeaders() } 
    });
    if (!res.ok) {
      // If endpoint doesn't exist, return 0
      return 0;
    }
    const data = await res.json();
    return data.presentCount || 0;
  } catch (error) {
    console.error('Error fetching present today:', error);
    return 0;
  }
}

// Get pending leave requests count
export async function getPendingLeaves(): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/leave/requests?status=pending`, { 
      credentials: 'include', 
      headers: { ...authHeaders() } 
    });
    if (!res.ok) throw new Error('Failed to fetch leave requests');
    const data = await res.json();
    return data.leaveRequests?.length || 0;
  } catch (error) {
    console.error('Error fetching pending leaves:', error);
    return 0;
  }
}

// Get monthly payroll amount (placeholder - would need payroll API)
export async function getMonthlyPayroll(): Promise<number> {
  try {
    // This would need a payroll API endpoint
    // For now, return 0 as this data is not available
    return 0;
  } catch (error) {
    console.error('Error fetching monthly payroll:', error);
    return 0;
  }
}

// Get my leave balance
export async function getMyLeaveBalance(): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/leave/balance/me`, { 
      credentials: 'include', 
      headers: { ...authHeaders() } 
    });
    if (!res.ok) throw new Error('Failed to fetch leave balance');
    const data = await res.json();
    return data.leaveBalance?.total || 0;
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    return 0;
  }
}

// Get hours this week for current user
export async function getHoursThisWeek(employeeId: string): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/attendance/employee/${employeeId}`, { 
      credentials: 'include', 
      headers: { ...authHeaders() } 
    });
    if (!res.ok) throw new Error('Failed to fetch attendance');
    const data = await res.json();
    
    // Calculate hours for current week
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    const thisWeekAttendance = data.attendances?.filter((attendance: any) => {
      const attendanceDate = new Date(attendance.workDate);
      return attendanceDate >= startOfWeek && attendanceDate <= endOfWeek;
    }) || [];
    
    const totalHours = thisWeekAttendance.reduce((sum: number, attendance: any) => {
      return sum + (attendance.totalHours || 0);
    }, 0);
    
    return Math.round(totalHours * 10) / 10; // Round to 1 decimal place
  } catch (error) {
    console.error('Error fetching hours this week:', error);
    return 0;
  }
}

// Get all dashboard stats
export async function getDashboardStats(employeeId?: string): Promise<DashboardStats> {
  try {
    const [totalEmployees, presentToday, pendingLeaves, monthlyPayroll, myLeaveBalance, hoursThisWeek] = await Promise.all([
      getTotalEmployees(),
      getPresentToday(),
      getPendingLeaves(),
      getMonthlyPayroll(),
      getMyLeaveBalance(),
      employeeId ? getHoursThisWeek(employeeId) : Promise.resolve(0)
    ]);

    return {
      totalEmployees,
      presentToday,
      pendingLeaves,
      monthlyPayroll,
      myLeaveBalance,
      hoursThisWeek
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalEmployees: 0,
      presentToday: 0,
      pendingLeaves: 0,
      monthlyPayroll: 0,
      myLeaveBalance: 0,
      hoursThisWeek: 0
    };
  }
}

// Get recent activities (placeholder - would need activity log API)
export async function getRecentActivities(): Promise<any[]> {
  try {
    // This would need an activity log API endpoint
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
}

// Get upcoming tasks (placeholder - would need task API)
export async function getUpcomingTasks(): Promise<any[]> {
  try {
    // This would need a task API endpoint
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching upcoming tasks:', error);
    return [];
  }
}
