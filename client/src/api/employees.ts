const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
function authHeaders() {
  const token = localStorage.getItem('hrms_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getEmployeeByEmployeeId(employeeId: string) {
  const res = await fetch(`${API_URL}/employees/${employeeId}`, { credentials: 'include', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch employee')
  return res.json()
}

export async function getEmployeeByUserId(userId: string) {
  const res = await fetch(`${API_URL}/employees/user/${userId}`, { credentials: 'include', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch employee by user ID')
  return res.json()
}

export async function getEmployees() {
  const res = await fetch(`${API_URL}/employees`, { credentials: 'include', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch employees')
  return res.json()
}

export async function updateEmployeeProfile(employeeId: string, payload: any) {
  const res = await fetch(`${API_URL}/employees/${employeeId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to update employee')
  return res.json()
}

// Team/Org APIs
export async function assignEmployeeManager(id: string, managerId: string | null) {
  const res = await fetch(`${API_URL}/employees/${id}/manager`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ managerId })
  })
  if (!res.ok) throw new Error('Failed to assign manager')
  return res.json()
}

export async function getDirectReports(id: string) {
  const res = await fetch(`${API_URL}/employees/${id}/direct-reports`, { credentials: 'include', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch direct reports')
  return res.json()
}

export async function getTeamTree(id: string) {
  const res = await fetch(`${API_URL}/employees/${id}/team-tree`, { credentials: 'include', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch team tree')
  return res.json()
}

export async function getOrgChart() {
  const res = await fetch(`${API_URL}/employees/org/chart`, { credentials: 'include', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch org chart')
  return res.json()
}

export async function getAllTeamMembers(id: string) {
  const res = await fetch(`${API_URL}/employees/${id}/team-members`, { credentials: 'include', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch team members')
  return res.json()
}

// New team reassignment API
export async function reassignTeam(managerId: string | null, directReportIds: string[]) {
  const res = await fetch(`${API_URL}/employees/reassign-team`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ managerId, directReportIds })
  })
  if (!res.ok) throw new Error('Failed to reassign team')
  return res.json()
}

// Users
export async function listUsers() {
  const res = await fetch(`${API_URL}/users`, { credentials: 'include', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export async function listUsersByEmployeeId(employeeId: string) {
  const res = await fetch(`${API_URL}/users/${employeeId}`, { credentials: 'include', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}


// Attendance APIs
export async function attendanceClockIn(employeeId: string) {
  const res = await fetch(`${API_URL}/attendance/clock-in`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ employeeId })
  })
  if (!res.ok) throw new Error('Clock-in failed')
  return res.json()
}

export async function attendancePause(employeeId: string) {
  const res = await fetch(`${API_URL}/attendance/pause`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ employeeId })
  })
  if (!res.ok) throw new Error('Pause failed')
  return res.json()
}

export async function attendanceResume(employeeId: string) {
  const res = await fetch(`${API_URL}/attendance/resume`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ employeeId })
  })
  if (!res.ok) throw new Error('Resume failed')
  return res.json()
}

export async function attendanceClockOut(employeeId: string) {
  const res = await fetch(`${API_URL}/attendance/clock-out`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ employeeId })
  })
  if (!res.ok) throw new Error('Clock-out failed')
  return res.json()
}

export async function attendanceSubmit(employeeId: string, approverUserId: string) {
  const res = await fetch(`${API_URL}/attendance/submit`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ employeeId, approverUserId })
  })
  if (!res.ok) throw new Error('Submit failed')
  return res.json()
}

export async function getMyAttendance(employeeId: string) {
  const res = await fetch(`${API_URL}/attendance/employee/${employeeId}`, {
    method: 'GET', credentials: 'include', headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error('Failed to fetch attendance')
  return res.json()
}

export async function getPendingApprovals(approverUserId: string) {
  const res = await fetch(`${API_URL}/attendance/approvals/${approverUserId}`, {
    method: 'GET', credentials: 'include', headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error('Failed to fetch approvals')
  return res.json()
}

export async function approveAttendance(attendanceId: string) {
  const res = await fetch(`${API_URL}/attendance/${attendanceId}/approve`, {
    method: 'POST', credentials: 'include', headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error('Failed to approve attendance')
  return res.json()
}

export async function rejectAttendance(attendanceId: string) {
  const res = await fetch(`${API_URL}/attendance/${attendanceId}/reject`, {
    method: 'POST', credentials: 'include', headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error('Failed to reject attendance')
  return res.json()
}

// Leave Assignment APIs
export async function getAllEmployees() {
  const res = await fetch(`${API_URL}/employees`, { 
    method: 'GET', 
    credentials: 'include', 
    headers: { ...authHeaders() } 
  })
  if (!res.ok) throw new Error('Failed to fetch employees')
  return res.json()
}

export async function getEmployeeLeaveBalance(employeeId: string) {
  const res = await fetch(`${API_URL}/leave/balance/${employeeId}`, { 
    method: 'GET', 
    credentials: 'include', 
    headers: { ...authHeaders() } 
  })
  if (!res.ok) throw new Error('Failed to fetch leave balance')
  return res.json()
}

export async function addLeaveDays(employeeId: string, type: string, days: number, reason: string) {
  const res = await fetch(`${API_URL}/leave/balance/${employeeId}/add`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ type, days, reason })
  })
  if (!res.ok) throw new Error('Failed to add leave days')
  return res.json()
}

export async function updateLeaveBalance(employeeId: string, balanceData: any) {
  const res = await fetch(`${API_URL}/leave/balance/${employeeId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(balanceData)
  })
  if (!res.ok) throw new Error('Failed to update leave balance')
  return res.json()
}

export async function getAllLeaveBalances() {
  const res = await fetch(`${API_URL}/leave/balance`, { 
    method: 'GET', 
    credentials: 'include', 
    headers: { ...authHeaders() } 
  })
  if (!res.ok) throw new Error('Failed to fetch leave balances')
  return res.json()
}

// Leave Request APIs
export async function createLeaveRequest(leaveData: any) {
  const res = await fetch(`${API_URL}/leave/requests`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(leaveData)
  })
  if (!res.ok) throw new Error('Failed to create leave request')
  return res.json()
}

export async function getLeaveRequests(filters?: any) {
  const queryParams = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })
  }
  
  const url = `${API_URL}/leave/requests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const res = await fetch(url, { 
    method: 'GET', 
    credentials: 'include', 
    headers: { ...authHeaders() } 
  })
  if (!res.ok) throw new Error('Failed to fetch leave requests')
  return res.json()
}

export async function updateLeaveRequestStatus(requestId: string, status: string, approver: string) {
  const res = await fetch(`${API_URL}/leave/requests/${requestId}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status, approver })
  })
  if (!res.ok) throw new Error('Failed to update leave request status')
  return res.json()
}


