import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export const clockIn = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body || {}
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' })

    const workDate = startOfDay(new Date())
    let attendance = await prisma.attendance.findUnique({
      where: { employeeId_workDate: { employeeId, workDate } },
    })
    if (!attendance) {
      attendance = await prisma.attendance.create({
        data: { employeeId, workDate, clockIn: new Date(), status: 'pending' },
      })
    }

    await prisma.attendanceTimestamp.create({
      data: { attendanceId: attendance.id, startTime: new Date(), type: 'work' },
    })

    const fresh = await prisma.attendance.findUnique({
      where: { id: attendance.id },
      include: { timestamps: true },
    })
    return res.json({ attendance: fresh })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Clock-in failed' })
  }
}

export const pause = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body || {}
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' })
    const workDate = startOfDay(new Date())
    const attendance = await prisma.attendance.findUnique({ where: { employeeId_workDate: { employeeId, workDate } } })
    if (!attendance) return res.status(404).json({ error: 'No active attendance' })

    const open = await prisma.attendanceTimestamp.findFirst({
      where: { attendanceId: attendance.id, endTime: null, type: 'work' },
      orderBy: { startTime: 'desc' },
    })
    if (open) {
      await prisma.attendanceTimestamp.update({ where: { id: open.id }, data: { endTime: new Date() } })
    }
    const pauseTs = await prisma.attendanceTimestamp.create({
      data: { attendanceId: attendance.id, startTime: new Date(), type: 'pause' },
    })
    return res.json({ timestamp: pauseTs })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Pause failed' })
  }
}

export const resume = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body || {}
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' })
    const workDate = startOfDay(new Date())
    const attendance = await prisma.attendance.findUnique({ where: { employeeId_workDate: { employeeId, workDate } } })
    if (!attendance) return res.status(404).json({ error: 'No active attendance' })

    const pauseOpen = await prisma.attendanceTimestamp.findFirst({
      where: { attendanceId: attendance.id, endTime: null, type: 'pause' },
      orderBy: { startTime: 'desc' },
    })
    if (pauseOpen) {
      await prisma.attendanceTimestamp.update({ where: { id: pauseOpen.id }, data: { endTime: new Date() } })
    }
    const workTs = await prisma.attendanceTimestamp.create({
      data: { attendanceId: attendance.id, startTime: new Date(), type: 'work' },
    })
    return res.json({ timestamp: workTs })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Resume failed' })
  }
}

export const clockOut = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body || {}
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' })
    const workDate = startOfDay(new Date())
    const attendance = await prisma.attendance.findUnique({ where: { employeeId_workDate: { employeeId, workDate } } })
    if (!attendance) return res.status(404).json({ error: 'No active attendance' })

    const openTs = await prisma.attendanceTimestamp.findFirst({ where: { attendanceId: attendance.id, endTime: null }, orderBy: { startTime: 'desc' } })
    if (openTs) await prisma.attendanceTimestamp.update({ where: { id: openTs.id }, data: { endTime: new Date() } })

    const stamps = await prisma.attendanceTimestamp.findMany({ where: { attendanceId: attendance.id } })
    const totalMs = stamps
      .filter(s => s.type === 'work')
      .reduce((acc, s) => acc + Math.max(0, (s.endTime ? new Date(s.endTime).getTime() : Date.now()) - new Date(s.startTime).getTime()), 0)
    const totalHours = Math.round((totalMs / 1000 / 3600) * 100) / 100

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { clockOut: new Date(), totalHours },
      include: { timestamps: true },
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
    const workDate = startOfDay(new Date())
    const attendance = await prisma.attendance.findUnique({ where: { employeeId_workDate: { employeeId, workDate } } })
    if (!attendance) return res.status(404).json({ error: 'No attendance to submit' })

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { approverId: approverUserId, status: 'submitted', submittedAt: new Date() },
      include: { timestamps: true, approver: true },
    })
    return res.json({ attendance: updated })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Submit failed' })
  }
}

export const approve = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updated = await prisma.attendance.update({ where: { id }, data: { status: 'approved', approvedAt: new Date() } })
    return res.json({ attendance: updated })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Approve failed' })
  }
}

export const getMyAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    const list = await prisma.attendance.findMany({ where: { employeeId }, orderBy: { workDate: 'desc' }, include: { timestamps: true, approver: true } })
    return res.json({ attendances: list })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Fetch failed' })
  }
}


