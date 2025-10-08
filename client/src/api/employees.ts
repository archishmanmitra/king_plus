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


