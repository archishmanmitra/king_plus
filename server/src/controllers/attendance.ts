import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import logger from '../logger/logger'

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
    // Create or fetch today's attendance
    let attendance = await (prisma as any).attendance.findUnique({
      where: { employeeId_workDate: { employeeId: dbEmployeeId, workDate } },
      include: { timestamps: true },
    })
    if (!attendance) {
      attendance = await (prisma as any).attendance.create({
        data: { employeeId: dbEmployeeId, workDate, clockIn: new Date() },
        include: { timestamps: true },
      })
    } else if (!attendance.clockIn) {
      attendance = await (prisma as any).attendance.update({
        where: { id: attendance.id },
        data: { clockIn: new Date() },
        include: { timestamps: true },
      })
    }

    // Ensure an open timestamp exists (start segment)
    const hasOpen = attendance.timestamps?.some((t: any) => !t.endTime)
    if (!hasOpen) {
      await (prisma as any).attendanceTimestamp.create({
        data: { attendanceId: attendance.id, startTime: new Date() },
      })
    }

    const fresh = await (prisma as any).attendance.findUnique({ where: { id: attendance.id }, include: { timestamps: true } })
    return res.json({ attendance: fresh })
  } catch (error) {
    logger.error("Error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const pause = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body || {}
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' })
    const dbEmployeeId = await resolveEmployeeDbId(employeeId)
    if (!dbEmployeeId) return res.status(404).json({ error: 'Employee not found' })
    const workDate = startOfDay(new Date())
    const attendance = await (prisma as any).attendance.findUnique({ where: { employeeId_workDate: { employeeId: dbEmployeeId, workDate } }, include: { timestamps: true } })
    if (!attendance) return res.status(404).json({ error: 'No active attendance' })
    const open = attendance.timestamps?.find((t: any) => !t.endTime)
    if (open) {
      await (prisma as any).attendanceTimestamp.update({ where: { id: open.id }, data: { endTime: new Date() } })
    }
    const fresh = await (prisma as any).attendance.findUnique({ where: { id: attendance.id }, include: { timestamps: true } })
    return res.json({ attendance: fresh })
  } catch (error) {
    logger.error("Error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const resume = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body || {}
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' })
    const dbEmployeeId = await resolveEmployeeDbId(employeeId)
    if (!dbEmployeeId) return res.status(404).json({ error: 'Employee not found' })
    const workDate = startOfDay(new Date())
    const attendance = await (prisma as any).attendance.findUnique({ where: { employeeId_workDate: { employeeId: dbEmployeeId, workDate } }, include: { timestamps: true } })
    if (!attendance) return res.status(404).json({ error: 'No active attendance' })
    const hasOpen = attendance.timestamps?.some((t: any) => !t.endTime)
    if (!hasOpen) {
      await (prisma as any).attendanceTimestamp.create({ data: { attendanceId: attendance.id, startTime: new Date() } })
    }
    const fresh = await (prisma as any).attendance.findUnique({ where: { id: attendance.id }, include: { timestamps: true } })
    return res.json({ attendance: fresh })
  } catch (error) {
    logger.error("Error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const clockOut = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body || {}
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' })
    const dbEmployeeId = await resolveEmployeeDbId(employeeId)
    if (!dbEmployeeId) return res.status(404).json({ error: 'Employee not found' })
    const workDate = startOfDay(new Date())
    const attendance = await (prisma as any).attendance.findUnique({ where: { employeeId_workDate: { employeeId: dbEmployeeId, workDate } }, include: { timestamps: true } })
    if (!attendance) return res.status(404).json({ error: 'No active attendance' })
    // Close any open timestamp
    const open = attendance.timestamps?.find((t: any) => !t.endTime)
    if (open) {
      await (prisma as any).attendanceTimestamp.update({ where: { id: open.id }, data: { endTime: new Date() } })
    }
    // Recompute total hours from timestamps
    const withTimestamps = await (prisma as any).attendance.findUnique({ where: { id: attendance.id }, include: { timestamps: true } })
    const totalMs = (withTimestamps.timestamps || []).reduce((acc: number, t: any) => {
      if (!t.endTime) return acc
      const diff = new Date(t.endTime).getTime() - new Date(t.startTime).getTime()
      return acc + Math.max(0, diff)
    }, 0)
    const totalHours = Math.round((totalMs / 1000 / 3600) * 100) / 100

    const updated = await (prisma as any).attendance.update({
      where: { id: attendance.id },
      data: ({ clockOut: new Date(), totalHours } as any),
      include: { timestamps: true },
    })
    return res.json({ attendance: updated })
  } catch (error) {
    logger.error("Error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const submitForApproval = async (req: Request, res: Response) => {
  try {
    const { employeeId, approverUserId } = req.body || {}
    if (!employeeId || !approverUserId) return res.status(400).json({ error: 'employeeId and approverUserId required' })
    const dbEmployeeId = await resolveEmployeeDbId(employeeId)
    if (!dbEmployeeId) return res.status(404).json({ error: 'Employee not found' })
    const workDate = startOfDay(new Date())
    const attendance = await (prisma as any).attendance.findUnique({ where: { employeeId_workDate: { employeeId: dbEmployeeId, workDate } } })
    if (!attendance) return res.status(404).json({ error: 'No attendance to submit' })

    const updated = await (prisma as any).attendance.update({
      where: { id: attendance.id },
      data: { approverId: approverUserId, status: 'submitted', submittedAt: new Date() },
    })
    return res.json({ attendance: updated })
  } catch (error) {
    logger.error("Error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const approve = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updated = await (prisma as any).attendance.update({ where: { id }, data: { status: 'approved', approvedAt: new Date() } })
    return res.json({ attendance: updated })
  } catch (error) {
    logger.error("Error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const reject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updated = await (prisma as any).attendance.update({ where: { id }, data: { status: 'rejected', approvedAt: null } })
    return res.json({ attendance: updated })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Reject failed' })
  }
}

export const getMyAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params as any
    const dbEmployeeId = await resolveEmployeeDbId(employeeId)
    if (!dbEmployeeId) return res.status(404).json({ error: 'Employee not found' })
    const list = await (prisma as any).attendance.findMany({
      where: { employeeId: dbEmployeeId },
      orderBy: { workDate: 'desc' },
      include: { timestamps: true }
    })
    return res.json({ attendances: list })
  } catch (error) {
    logger.error("Error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const getTodayAttendance = async (req: Request, res: Response) => {
  try {
    const today = startOfDay(new Date());
    const presentCount = await (prisma as any).attendance.count({
      where: {
        workDate: today,
        clockIn: { not: null }
      }
    });
    return res.json({ presentCount });
  } catch (error) {
    logger.error("Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getApprovalsForManager = async (req: Request, res: Response) => {
  try {
    const { approverId } = req.params as any
    if (!approverId) return res.status(400).json({ error: 'approverId required' })
    const list = await (prisma as any).attendance.findMany({ where: { approverId, status: 'submitted' }, orderBy: { workDate: 'desc' } })
    return res.json({ attendances: list })
  } catch (error) {
    logger.error("Error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}


