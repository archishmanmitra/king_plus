function authHeaders() {
  const token = localStorage.getItem('hrms_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getEmployeeByEmployeeId(employeeId: string) {
  const res = await fetch(`/api/employees/${employeeId}`, { credentials: 'include', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch employee')
  return res.json()
}

export async function getEmployees() {
  const res = await fetch(`/api/employees`, { credentials: 'include', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch employees')
  return res.json()
}

export async function updateEmployeeProfile(employeeId: string, payload: any) {
  const res = await fetch(`/api/employees/${employeeId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to update employee')
  return res.json()
}


// Attendance APIs
export async function attendanceClockIn(employeeId: string) {
  const res = await fetch(`/api/attendance/clock-in`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ employeeId })
  })
  if (!res.ok) throw new Error('Clock-in failed')
  return res.json()
}

export async function attendancePause(employeeId: string) {
  const res = await fetch(`/api/attendance/pause`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ employeeId })
  })
  if (!res.ok) throw new Error('Pause failed')
  return res.json()
}

export async function attendanceResume(employeeId: string) {
  const res = await fetch(`/api/attendance/resume`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ employeeId })
  })
  if (!res.ok) throw new Error('Resume failed')
  return res.json()
}

export async function attendanceClockOut(employeeId: string) {
  const res = await fetch(`/api/attendance/clock-out`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ employeeId })
  })
  if (!res.ok) throw new Error('Clock-out failed')
  return res.json()
}

export async function attendanceSubmit(employeeId: string, approverUserId: string) {
  const res = await fetch(`/api/attendance/submit`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ employeeId, approverUserId })
  })
  if (!res.ok) throw new Error('Submit failed')
  return res.json()
}

export async function getMyAttendance(employeeId: string) {
  const res = await fetch(`/api/attendance/employee/${employeeId}`, {
    method: 'GET', credentials: 'include', headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error('Failed to fetch attendance')
  return res.json()
}

export async function getPendingApprovals(approverUserId: string) {
  const res = await fetch(`/api/attendance/approvals/${approverUserId}`, {
    method: 'GET', credentials: 'include', headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error('Failed to fetch approvals')
  return res.json()
}

export async function approveAttendance(attendanceId: string) {
  const res = await fetch(`/api/attendance/${attendanceId}/approve`, {
    method: 'POST', credentials: 'include', headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error('Failed to approve attendance')
  return res.json()
}

export async function rejectAttendance(attendanceId: string) {
  const res = await fetch(`/api/attendance/${attendanceId}/reject`, {
    method: 'POST', credentials: 'include', headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error('Failed to reject attendance')
  return res.json()
}


