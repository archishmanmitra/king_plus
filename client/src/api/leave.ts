const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function authHeaders() {
  const token = localStorage.getItem('hrms_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Leave Balance APIs
export async function getMyLeaveBalance() {
  const res = await fetch(`${API_URL}/leave/balance/me`, { 
    method: 'GET', 
    credentials: 'include', 
    headers: { ...authHeaders() } 
  })
  if (!res.ok) throw new Error('Failed to fetch leave balance')
  return res.json()
}

export async function getLeaveBalance(employeeId: string) {
  const res = await fetch(`${API_URL}/leave/balance/${employeeId}`, { 
    method: 'GET', 
    credentials: 'include', 
    headers: { ...authHeaders() } 
  })
  if (!res.ok) throw new Error('Failed to fetch leave balance')
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

export async function updateLeaveBalance(employeeId: string, balanceData: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/leave/balance/${employeeId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(balanceData)
  })
  if (!res.ok) throw new Error('Failed to update leave balance')
  return res.json()
}

export async function resetLeaveBalance(employeeId: string) {
  const res = await fetch(`${API_URL}/leave/balance/${employeeId}/reset`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({})
  })
  if (!res.ok) throw new Error('Failed to reset leave balance')
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

// Leave Request APIs
export async function createLeaveRequest(leaveData: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/leave/requests`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(leaveData)
  })
  if (!res.ok) throw new Error('Failed to create leave request')
  return res.json()
}

export async function getLeaveRequests(filters?: Record<string, unknown>) {
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

export async function getLeaveRequestById(requestId: string) {
  const res = await fetch(`${API_URL}/leave/requests/${requestId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error('Failed to fetch leave request')
  return res.json()
}

export async function getPendingApprovals() {
  const res = await fetch(`${API_URL}/leave/requests/pending-approvals`, {
    method: 'GET',
    credentials: 'include',
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error('Failed to fetch pending approvals')
  return res.json()
}

export async function getTeamLeaveRequests() {
  const res = await fetch(`${API_URL}/leave/requests/team`, {
    method: 'GET',
    credentials: 'include',
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error('Failed to fetch team leave requests')
  return res.json()
}

export async function updateLeaveRequestStatus(requestId: string, status: string, approver?: string) {
  const res = await fetch(`${API_URL}/leave/requests/${requestId}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status, approver })
  })
  if (!res.ok) throw new Error('Failed to update leave request status')
  return res.json()
}

export async function updateLeaveRequest(requestId: string, leaveData: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/leave/requests/${requestId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(leaveData)
  })
  if (!res.ok) throw new Error('Failed to update leave request')
  return res.json()
}

export async function deleteLeaveRequest(requestId: string) {
  const res = await fetch(`${API_URL}/leave/requests/${requestId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error('Failed to delete leave request')
  return res.json()
}

