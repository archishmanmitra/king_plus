import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import logger from '../logger/logger'
import '../middleware/auth' // Import to ensure types are available

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
    
    // Get employee with manager information
    const employee = await (prisma as any).employee.findUnique({
      where: { id: dbEmployeeId },
      include: {
        manager: {
          include: {
            user: true
          }
        }
      }
    })
    
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

    // Prepare update data
    const updateData: any = { clockOut: new Date(), totalHours }
    
    // If employee has a manager, automatically assign them as approver
    if (employee?.manager?.user?.id) {
      updateData.approverId = employee.manager.user.id
      updateData.status = 'submitted'
      updateData.submittedAt = new Date()
    }

    const updated = await (prisma as any).attendance.update({
      where: { id: attendance.id },
      data: updateData,
      include: { timestamps: true },
    })
    
    return res.json({ 
      attendance: updated,
      hasManager: !!employee?.manager?.user?.id,
      managerId: employee?.manager?.user?.id || null
    })
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

// Get today's attendance data based on user role
export const getTodayAttendanceByRole = async (req: Request, res: Response) => {
  try {
    const requestingUser = req.user
    if (!requestingUser) return res.status(401).json({ error: 'Unauthorized' })

    const today = startOfDay(new Date());
    const isAdmin = requestingUser.role === 'global_admin' || requestingUser.role === 'hr_manager'
    const isManager = requestingUser.role === 'manager'

    let whereClause: any = { workDate: today }

    if (isAdmin) {
      // Admins can see all today's attendances
      // No additional filtering needed
    } else if (isManager) {
      // Managers can only see their direct reports' attendances
      const managerEmployee = await (prisma as any).employee.findFirst({
        where: { user: { id: requestingUser.id } },
        include: { directReports: true }
      })

      if (!managerEmployee) {
        return res.status(403).json({ error: 'Manager employee record not found' })
      }

      const directReportIds = managerEmployee.directReports.map((dr: any) => dr.id)
      if (directReportIds.length === 0) {
        return res.json({ 
          presentCount: 0,
          totalCount: 0,
          absentCount: 0,
          attendances: []
        })
      }

      whereClause.employeeId = { in: directReportIds }
    } else {
      // Regular employees can only see their own attendances
      const userEmployee = await (prisma as any).employee.findFirst({
        where: { user: { id: requestingUser.id } }
      })

      if (!userEmployee) {
        return res.status(403).json({ error: 'Employee record not found' })
      }

      whereClause.employeeId = userEmployee.id
    }

    // Get present count (employees who clocked in today)
    const presentCount = await (prisma as any).attendance.count({
      where: {
        ...whereClause,
        clockIn: { not: null }
      }
    })

    // Get total count (all employees in scope)
    let totalCount = 0
    if (isAdmin) {
      // For admins, count all employees
      totalCount = await (prisma as any).employee.count()
    } else if (isManager) {
      // For managers, count their direct reports
      const managerEmployee = await (prisma as any).employee.findFirst({
        where: { user: { id: requestingUser.id } },
        include: { directReports: true }
      })
      totalCount = managerEmployee?.directReports?.length || 0
    } else {
      // For employees, total is 1 (themselves)
      totalCount = 1
    }

    const absentCount = totalCount - presentCount

    // Get detailed attendance records for today
    const attendances = await (prisma as any).attendance.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            official: true,
            user: true
          }
        }
      },
      orderBy: { clockIn: 'desc' }
    })

    return res.json({ 
      presentCount,
      totalCount,
      absentCount,
      attendances
    })
  } catch (error) {
    logger.error("Error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const getApprovalsForManager = async (req: Request, res: Response) => {
  try {
    const { approverId } = req.params as any
    if (!approverId) return res.status(400).json({ error: 'approverId required' })
    
    // Get attendances with employee information for better display
    const list = await (prisma as any).attendance.findMany({ 
      where: { approverId, status: 'submitted' }, 
      include: {
        employee: {
          include: {
            official: true,
            user: true
          }
        }
      },
      orderBy: { workDate: 'desc' } 
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

// Get approved attendances based on user role
export const getApprovedAttendances = async (req: Request, res: Response) => {
  try {
    const requestingUser = req.user
    if (!requestingUser) return res.status(401).json({ error: 'Unauthorized' })

    const isAdmin = requestingUser.role === 'global_admin' || requestingUser.role === 'hr_manager'
    const isManager = requestingUser.role === 'manager'

    let whereClause: any = { status: 'approved' }

    if (isAdmin) {
      // Admins can see all approved attendances
      // No additional filtering needed
    } else if (isManager) {
      // Managers can only see their direct reports' attendances
      const managerEmployee = await (prisma as any).employee.findFirst({
        where: { user: { id: requestingUser.id } },
        include: { directReports: true }
      })

      if (!managerEmployee) {
        return res.status(403).json({ error: 'Manager employee record not found' })
      }

      const directReportIds = managerEmployee.directReports.map((dr: any) => dr.id)
      if (directReportIds.length === 0) {
        return res.json({ attendances: [] })
      }

      whereClause.employeeId = { in: directReportIds }
    } else {
      // Regular employees can only see their own attendances
      const userEmployee = await (prisma as any).employee.findFirst({
        where: { user: { id: requestingUser.id } }
      })

      if (!userEmployee) {
        return res.status(403).json({ error: 'Employee record not found' })
      }

      whereClause.employeeId = userEmployee.id
    }

    const attendances = await (prisma as any).attendance.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            official: true,
            user: true
          }
        }
      },
      orderBy: { workDate: 'desc' }
    })

    return res.json({ attendances })
  } catch (error) {
    logger.error("Error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}


