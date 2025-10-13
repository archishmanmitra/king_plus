import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

// Create a new leave request
export const createLeaveRequest = async (req: Request, res: Response) => {
  try {
    const { employeeId, type, startDate, endDate, reason } = req.body
    const requestingUser = req.user

    if (!employeeId || !type || !startDate || !endDate || !reason) {
      return res.status(400).json({ 
        error: 'employeeId, type, startDate, endDate, and reason are required' 
      })
    }

    // Validate leave type
    const validLeaveTypes = ['earned', 'maternity', 'paternity', 'compoff']
    if (!validLeaveTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid leave type. Must be one of: earned, maternity, paternity, compoff' 
      })
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { official: true }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Authorization: Users can only create leave requests for themselves unless they're admin/hr
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    const isManager = requestingUser?.role === 'manager'
    
    if (!isAdmin && !isManager && requestingUser?.id !== employeeId) {
      return res.status(403).json({ error: 'You can only create leave requests for yourself' })
    }

    // Calculate days between start and end date
    const start = new Date(startDate)
    const end = new Date(endDate)
    const timeDiff = end.getTime() - start.getTime()
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1 // +1 to include both start and end dates

    if (days <= 0) {
      return res.status(400).json({ error: 'End date must be after start date' })
    }

    // Check leave balance if it's an earned leave
    if (type === 'earned') {
      const leaveBalance = await prisma.leaveBalance.findUnique({
        where: { employeeId }
      })

      if (leaveBalance && leaveBalance.vacation < days) {
        return res.status(400).json({ 
          error: `Insufficient leave balance. Available: ${leaveBalance.vacation} days, Requested: ${days} days` 
        })
      }
    }

    // Get employee name from official info
    const employeeName = employee.official 
      ? `${employee.official.firstName} ${employee.official.lastName}`.trim()
      : 'Unknown Employee'

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId,
        employeeName,
        type: type as any,
        startDate: start,
        endDate: end,
        days,
        reason,
        status: 'pending'
      }
    })

    return res.status(201).json({ leaveRequest })
  } catch (err: any) {
    console.error('Create leave request error:', err)
    return res.status(500).json({ error: 'Failed to create leave request', details: err?.message })
  }
}

// Get all leave requests with filtering
export const getLeaveRequests = async (req: Request, res: Response) => {
  try {
    const { employeeId, status, type, startDate, endDate } = req.query
    const requestingUser = req.user

    // Build filter conditions
    const where: any = {}

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (startDate && endDate) {
      where.AND = [
        { startDate: { gte: new Date(startDate as string) } },
        { endDate: { lte: new Date(endDate as string) } }
      ]
    }

    // Authorization: Non-admin users can only see their own requests
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    const isManager = requestingUser?.role === 'manager'
    
    if (!isAdmin && !isManager) {
      // Find employee record for the requesting user
      const user = await prisma.user.findUnique({
        where: { id: requestingUser?.id },
        include: { employee: true }
      })
      
      if (user?.employee) {
        where.employeeId = user.employee.id
      } else {
        return res.status(403).json({ error: 'No employee record found for user' })
      }
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
      where,
      include: {
        employee: {
          include: {
            official: true,
            user: true
          }
        }
      },
      orderBy: { appliedDate: 'desc' }
    })

    return res.json({ leaveRequests })
  } catch (err: any) {
    console.error('Get leave requests error:', err)
    return res.status(500).json({ error: 'Failed to fetch leave requests', details: err?.message })
  }
}

// Get a specific leave request
export const getLeaveRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const requestingUser = req.user

    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            official: true,
            user: true
          }
        }
      }
    })

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' })
    }

    // Authorization: Users can only view their own requests unless they're admin/hr/manager
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    const isManager = requestingUser?.role === 'manager'
    
    if (!isAdmin && !isManager) {
      const user = await prisma.user.findUnique({
        where: { id: requestingUser?.id },
        include: { employee: true }
      })
      
      if (!user?.employee || user.employee.id !== leaveRequest.employeeId) {
        return res.status(403).json({ error: 'You can only view your own leave requests' })
      }
    }

    return res.json({ leaveRequest })
  } catch (err: any) {
    console.error('Get leave request by id error:', err)
    return res.status(500).json({ error: 'Failed to fetch leave request', details: err?.message })
  }
}

// Update leave request status (approve/reject)
export const updateLeaveRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, approver } = req.body
    const requestingUser = req.user

    if (!status || !approver) {
      return res.status(400).json({ error: 'status and approver are required' })
    }

    const validStatuses = ['pending', 'approved', 'rejected']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: pending, approved, rejected' 
      })
    }

    // Only admins, HR managers, and managers can approve/reject leave requests
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    const isManager = requestingUser?.role === 'manager'
    
    if (!isAdmin && !isManager) {
      return res.status(403).json({ error: 'Only admins, HR managers, and managers can approve leave requests' })
    }

    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
      include: { employee: true }
    })

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' })
    }

    // If approving, check leave balance and deduct if it's an earned leave
    if (status === 'approved' && leaveRequest.type === 'earned') {
      const leaveBalance = await prisma.leaveBalance.findUnique({
        where: { employeeId: leaveRequest.employeeId }
      })

      if (leaveBalance && leaveBalance.vacation < leaveRequest.days) {
        return res.status(400).json({ 
          error: `Insufficient leave balance. Available: ${leaveBalance.vacation} days, Requested: ${leaveRequest.days} days` 
        })
      }

      // Deduct from leave balance
      if (leaveBalance) {
        await prisma.leaveBalance.update({
          where: { employeeId: leaveRequest.employeeId },
          data: {
            vacation: leaveBalance.vacation - leaveRequest.days,
            total: leaveBalance.total - leaveRequest.days
          }
        })
      }
    }

    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: status as any,
        approver
      }
    })

    return res.json({ leaveRequest: updatedLeaveRequest })
  } catch (err: any) {
    console.error('Update leave request status error:', err)
    return res.status(500).json({ error: 'Failed to update leave request', details: err?.message })
  }
}

// Update leave request details
export const updateLeaveRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { type, startDate, endDate, reason } = req.body
    const requestingUser = req.user

    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
      include: { employee: true }
    })

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' })
    }

    // Authorization: Users can only update their own pending requests
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    const isManager = requestingUser?.role === 'manager'
    
    if (!isAdmin && !isManager) {
      const user = await prisma.user.findUnique({
        where: { id: requestingUser?.id },
        include: { employee: true }
      })
      
      if (!user?.employee || user.employee.id !== leaveRequest.employeeId) {
        return res.status(403).json({ error: 'You can only update your own leave requests' })
      }

      if (leaveRequest.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending leave requests can be updated' })
      }
    }

    const updateData: any = {}

    if (type) {
      const validLeaveTypes = ['earned', 'maternity', 'paternity', 'compoff']
      if (!validLeaveTypes.includes(type)) {
        return res.status(400).json({ 
          error: 'Invalid leave type. Must be one of: earned, maternity, paternity, compoff' 
        })
      }
      updateData.type = type
    }

    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const timeDiff = end.getTime() - start.getTime()
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1

      if (days <= 0) {
        return res.status(400).json({ error: 'End date must be after start date' })
      }

      updateData.startDate = start
      updateData.endDate = end
      updateData.days = days
    }

    if (reason) {
      updateData.reason = reason
    }

    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: updateData
    })

    return res.json({ leaveRequest: updatedLeaveRequest })
  } catch (err: any) {
    console.error('Update leave request error:', err)
    return res.status(500).json({ error: 'Failed to update leave request', details: err?.message })
  }
}

// Delete leave request
export const deleteLeaveRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const requestingUser = req.user

    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
      include: { employee: true }
    })

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' })
    }

    // Authorization: Users can only delete their own pending requests, admins can delete any
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    
    if (!isAdmin) {
      const user = await prisma.user.findUnique({
        where: { id: requestingUser?.id },
        include: { employee: true }
      })
      
      if (!user?.employee || user.employee.id !== leaveRequest.employeeId) {
        return res.status(403).json({ error: 'You can only delete your own leave requests' })
      }

      if (leaveRequest.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending leave requests can be deleted' })
      }
    }

    await prisma.leaveRequest.delete({
      where: { id }
    })

    return res.json({ message: 'Leave request deleted successfully' })
  } catch (err: any) {
    console.error('Delete leave request error:', err)
    return res.status(500).json({ error: 'Failed to delete leave request', details: err?.message })
  }
}
