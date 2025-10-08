import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

async function resolveEmployeeDbId(employeeIdOrCode: string): Promise<string | null> {
  // Try as internal id first
  const byId = await prisma.employee.findUnique({ where: { id: employeeIdOrCode } })
  if (byId) return byId.id
  // Fallback to business code `employeeId`
  const byCode = await prisma.employee.findUnique({ where: { employeeId: employeeIdOrCode } })
  return byCode ? byCode.id : null
}

export const clockIn = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body || {}
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' })
    const dbEmployeeId = await resolveEmployeeDbId(employeeId)
    if (!dbEmployeeId) return res.status(404).json({ error: 'Employee not found' })

    const workDate = startOfDay(new Date())
    let attendance = await (prisma as any).attendance.findUnique({
      where: { employeeId_workDate: { employeeId: dbEmployeeId, workDate } },
    })
    if (!attendance) {
      attendance = await (prisma as any).attendance.create({
        data: { employeeId: dbEmployeeId, workDate, clockIn: new Date() },
      })
    }

    const fresh = await (prisma as any).attendance.findUnique({ where: { id: attendance.id } })
    return res.json({ attendance: fresh })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Clock-in failed' })
  }
}

export const pause = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body || {}
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' })
    const dbEmployeeId = await resolveEmployeeDbId(employeeId)
    if (!dbEmployeeId) return res.status(404).json({ error: 'Employee not found' })
    const workDate = startOfDay(new Date())
    const attendance = await (prisma as any).attendance.findUnique({ where: { employeeId_workDate: { employeeId: dbEmployeeId, workDate } } })
    if (!attendance) return res.status(404).json({ error: 'No active attendance' })
    return res.json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Pause failed' })
  }
}

export const resume = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body || {}
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' })
    const dbEmployeeId = await resolveEmployeeDbId(employeeId)
    if (!dbEmployeeId) return res.status(404).json({ error: 'Employee not found' })
    const workDate = startOfDay(new Date())
    const attendance = await (prisma as any).attendance.findUnique({ where: { employeeId_workDate: { employeeId: dbEmployeeId, workDate } } })
    if (!attendance) return res.status(404).json({ error: 'No active attendance' })
    return res.json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Resume failed' })
  }
}

export const clockOut = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body || {}
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' })
    const dbEmployeeId = await resolveEmployeeDbId(employeeId)
    if (!dbEmployeeId) return res.status(404).json({ error: 'Employee not found' })
    const workDate = startOfDay(new Date())
    const attendance = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId: dbEmployeeId, date: workDate } } })
    if (!attendance) return res.status(404).json({ error: 'No active attendance' })
    const end = new Date()
    const totalMs = Math.max(0, end.getTime() - new Date(attendance.clockIn).getTime())
    const totalHours = Math.round((totalMs / 1000 / 3600) * 100) / 100

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: ({ clockOut: new Date(), totalHours } as any),
    })
    return res.json({ attendance: updated })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Clock-out failed' })
  }
}

export const submitForApproval = async (req: Request, res: Response) => {
  try {
    const { employeeId, approverUserId } = req.body || {}
    if (!employeeId || !approverUserId) return res.status(400).json({ error: 'employeeId and approverUserId required' })
    const dbEmployeeId = await resolveEmployeeDbId(employeeId)
    if (!dbEmployeeId) return res.status(404).json({ error: 'Employee not found' })
    const workDate = startOfDay(new Date())
    const attendance = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId: dbEmployeeId, date: workDate } } })
    if (!attendance) return res.status(404).json({ error: 'No attendance to submit' })

    const updated = await (prisma as any).attendance.update({
      where: { id: attendance.id },
      data: { approverId: approverUserId, status: 'submitted', submittedAt: new Date() },
    })
    return res.json({ attendance: updated })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Submit failed' })
  }
}

export const approve = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updated = await (prisma as any).attendance.update({ where: { id }, data: { status: 'approved', approvedAt: new Date() } })
    return res.json({ attendance: updated })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Approve failed' })
  }
}

export const getMyAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params as any
    const dbEmployeeId = await resolveEmployeeDbId(employeeId)
    if (!dbEmployeeId) return res.status(404).json({ error: 'Employee not found' })
    const list = await prisma.attendance.findMany({ where: { employeeId: dbEmployeeId }, orderBy: { date: 'desc' } })
    return res.json({ attendances: list })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Fetch failed' })
  }
}

export const getApprovalsForManager = async (req: Request, res: Response) => {
  try {
    const { approverId } = req.params as any
    if (!approverId) return res.status(400).json({ error: 'approverId required' })
    const list = await (prisma as any).attendance.findMany({ where: { approverId, status: 'submitted' }, orderBy: { workDate: 'desc' } })
    return res.json({ attendances: list })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Fetch failed' })
  }
}


