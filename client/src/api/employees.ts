export async function getEmployeeByEmployeeId(employeeId: string) {
  const res = await fetch(`/api/employees/${employeeId}`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch employee')
  return res.json()
}

export async function getEmployees() {
  const res = await fetch(`/api/employees`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch employees')
  return res.json()
}


