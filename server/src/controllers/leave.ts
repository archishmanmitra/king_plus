import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

// Create a new leave request
export const createLeaveRequest = async (req: Request, res: Response) => {
  try {
    const { type, startDate, endDate, reason } = req.body
    const requestingUser = req.user

    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ 
        error: 'type, startDate, endDate, and reason are required' 
      })
    }

    // Get employee ID from the authenticated user
    const employee = await prisma.employee.findFirst({
      where: { user: { id: requestingUser?.id } }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee record not found for this user' })
    }

    const employeeId = employee.id

    // Validate leave type
    const validLeaveTypes = ['earned', 'maternity', 'paternity', 'compoff']
    if (!validLeaveTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid leave type. Must be one of: earned, maternity, paternity, compoff' 
      })
    }

    // Get employee with manager info
    const employeeWithManager = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { 
        official: true,
        user: true,
        manager: {
          include: {
            official: true,
            user: true
          }
        }
      }
    })

    if (!employeeWithManager) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Check if employee has a manager assigned
    if (!employeeWithManager.managerId) {
      return res.status(400).json({ 
        error: 'No manager assigned. Please contact HR to assign a manager before submitting leave requests.' 
      })
    }

    // Authorization: Users can only create leave requests for themselves unless they're admin/hr
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    const isManager = requestingUser?.role === 'manager'
    
    if (!isAdmin && !isManager && requestingUser?.id !== employeeWithManager.user?.id) {
      return res.status(403).json({ error: 'You can only create leave requests for yourself' })
    }

    // Calculate days between start and end date
    const start = new Date(startDate)
    const end = new Date(endDate)
    const timeDiff = end.getTime() - start.getTime()
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1

    if (days <= 0) {
      return res.status(400).json({ error: 'End date must be after start date' })
    }

    // Check leave balance if it's an earned leave
    if (type === 'earned') {
      const leaveBalance = await prisma.leaveBalance.findUnique({
        where: { employeeId }
      })

      if (!leaveBalance) {
        return res.status(400).json({ error: 'Leave balance not found. Please contact HR.' })
      }

      if (leaveBalance.earned < days) {
        return res.status(400).json({ 
          error: `Insufficient earned leave balance. Available: ${leaveBalance.earned} days, Requested: ${days} days` 
        })
      }
    }

    // Get employee name from official info
    const employeeName = employeeWithManager.official 
      ? `${employeeWithManager.official.firstName} ${employeeWithManager.official.lastName}`.trim()
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

    const managerName = employeeWithManager.manager?.official 
      ? `${employeeWithManager.manager.official.firstName} ${employeeWithManager.manager.official.lastName}`.trim()
      : 'your manager'

    return res.status(201).json({ 
      leaveRequest,
      message: `Leave request submitted successfully. Pending approval from ${managerName}.` 
    })
  } catch (err: any) {
    console.error('Create leave request error:', err)
    return res.status(500).json({ error: 'Failed to create leave request', details: err?.message })
  }
}

// Get all leave requests with filtering (enhanced for managers)
export const getLeaveRequests = async (req: Request, res: Response) => {
  try {
    const { employeeId, status, type, startDate, endDate, viewType } = req.query
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

    // Authorization and filtering based on role
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    const isManager = requestingUser?.role === 'manager'
    
    if (isAdmin) {
      // Find the admin's employee record
      const adminEmployee = await prisma.employee.findFirst({
        where: { user: { id: requestingUser?.id } }
      })
      
      if (!adminEmployee) {
        return res.status(403).json({ error: 'Admin employee record not found' })
      }
      
      if (viewType === 'my') {
        // View only admin's own requests
        where.employeeId = adminEmployee.id
      }
      // For other viewTypes, admins can see all requests (no filtering)
    } else if (isManager) {
      // Find the manager's employee record and their direct reports
      const managerEmployee = await prisma.employee.findFirst({
        where: { user: { id: requestingUser?.id } },
        include: {
          directReports: true // This contains all employees where managerId = this manager's id
        }
      })

      if (!managerEmployee) {
        return res.status(403).json({ error: 'Manager employee record not found' })
      }

      // Get all direct report employee IDs
      const directReportIds = managerEmployee.directReports.map(dr => dr.id)

      if (viewType === 'team') {
        // View only team requests (direct reports)
        where.employeeId = { in: directReportIds }
      } else if (viewType === 'my') {
        // View only manager's own requests
        where.employeeId = managerEmployee.id
      } else {
        // Default: View both own and team requests
        where.employeeId = { in: [...directReportIds, managerEmployee.id] }
      }
    } else {
      // Regular employees can only see their own requests
      const userEmployee = await prisma.employee.findFirst({
        where: { user: { id: requestingUser?.id } }
      })
      
      if (userEmployee) {
        where.employeeId = userEmployee.id
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
            user: true,
            manager: {
              include: {
                official: true
              }
            }
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

// Get pending approvals for manager (requests from their direct reports)
export const getPendingApprovals = async (req: Request, res: Response) => {
  try {
    const requestingUser = req.user

    const isManager = requestingUser?.role === 'manager'
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'

    if (!isManager && !isAdmin) {
      return res.status(403).json({ error: 'Only managers and admins can view pending approvals' })
    }

    // Find the manager's employee record and their direct reports
    const managerEmployee = await prisma.employee.findFirst({
      where: { user: { id: requestingUser?.id } },
      include: {
        directReports: {
          include: {
            official: true
          }
        }
      }
    })

    if (!managerEmployee) {
      return res.status(403).json({ error: 'Manager employee record not found' })
    }

    // Get all direct report employee IDs
    const directReportIds = managerEmployee.directReports.map(dr => dr.id)

    if (directReportIds.length === 0) {
      return res.json({ 
        pendingApprovals: [],
        message: 'No direct reports assigned to this manager'
      })
    }

    // Get all pending leave requests from direct reports
    const pendingRequests = await prisma.leaveRequest.findMany({
      where: {
        employeeId: { in: directReportIds },
        status: 'pending'
      },
      include: {
        employee: {
          include: {
            official: true,
            user: true
          }
        }
      },
      orderBy: { appliedDate: 'asc' } // Oldest first for priority handling
    })

    return res.json({ 
      pendingApprovals: pendingRequests,
      directReportsCount: directReportIds.length
    })
  } catch (err: any) {
    console.error('Get pending approvals error:', err)
    return res.status(500).json({ error: 'Failed to fetch pending approvals', details: err?.message })
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
            user: true,
            manager: {
              include: {
                official: true,
                user: true
              }
            }
          }
        }
      }
    })

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' })
    }

    // Authorization: Users can only view their own requests or requests from their direct reports
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    const isManager = requestingUser?.role === 'manager'
    
    if (isAdmin) {
      // Admins can view any request
      return res.json({ leaveRequest })
    }

    const userEmployee = await prisma.employee.findFirst({
      where: { user: { id: requestingUser?.id } },
      include: {
        directReports: true
      }
    })

    if (!userEmployee) {
      return res.status(403).json({ error: 'Employee record not found' })
    }

    // Check if it's their own request
    const isOwnRequest = userEmployee.id === leaveRequest.employeeId

    // Check if it's a request from their direct report
    const isDirectReport = isManager && userEmployee.directReports.some(
      dr => dr.id === leaveRequest.employeeId
    )

    if (!isOwnRequest && !isDirectReport) {
      return res.status(403).json({ 
        error: 'You can only view your own leave requests or requests from your direct reports' 
      })
    }

    return res.json({ leaveRequest })
  } catch (err: any) {
    console.error('Get leave request by id error:', err)
    return res.status(500).json({ error: 'Failed to fetch leave request', details: err?.message })
  }
}

// Update leave request status (approve/reject) - Manager approval
export const updateLeaveRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, approver, comments } = req.body
    const requestingUser = req.user

    if (!status) {
      return res.status(400).json({ error: 'status is required' })
    }

    const validStatuses = ['pending', 'approved', 'rejected']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: pending, approved, rejected' 
      })
    }

    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
      include: { 
        employee: {
          include: {
            official: true,
            manager: {
              include: {
                user: true,
                official: true
              }
            }
          }
        }
      }
    })

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' })
    }

    // Check if the leave request is already processed
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ 
        error: `This leave request has already been ${leaveRequest.status}` 
      })
    }

    // Authorization: Only the designated manager, admins, or HR can approve/reject
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    const isManager = requestingUser?.role === 'manager'
    
    // Find the requesting user's employee record
    const requestingUserEmployee = await prisma.employee.findFirst({
      where: { user: { id: requestingUser?.id } },
      include: {
        directReports: true,
        official: true
      }
    })

    if (!requestingUserEmployee) {
      return res.status(403).json({ error: 'Employee record not found' })
    }

    // Check if the requesting user is the designated manager for this employee
    // The employee's managerId should match the requesting user's employee ID
    const isDesignatedManager = isManager && 
      leaveRequest.employee.managerId === requestingUserEmployee.id

    if (!isAdmin && !isDesignatedManager) {
      return res.status(403).json({ 
        error: 'Only the designated manager, HR managers, or admins can approve/reject this leave request',
        details: `This request must be approved by ${leaveRequest.employee.manager?.official?.firstName} ${leaveRequest.employee.manager?.official?.lastName}`
      })
    }

    // If approving, check leave balance and deduct if it's an earned leave
    if (status === 'approved' && leaveRequest.type === 'earned') {
      const leaveBalance = await prisma.leaveBalance.findUnique({
        where: { employeeId: leaveRequest.employeeId }
      })

      if (!leaveBalance) {
        return res.status(400).json({ error: 'Leave balance not found. Please contact HR.' })
      }

      if (leaveBalance.earned < leaveRequest.days) {
        return res.status(400).json({ 
          error: `Insufficient earned leave balance. Available: ${leaveBalance.earned} days, Requested: ${leaveRequest.days} days` 
        })
      }

      // Deduct from leave balance
      await prisma.leaveBalance.update({
        where: { employeeId: leaveRequest.employeeId },
        data: {
          earned: leaveBalance.earned - leaveRequest.days,
          total: leaveBalance.total - leaveRequest.days
        }
      })
    }

    // Set approver name
    const approverName = approver || (
      requestingUserEmployee.official 
        ? `${requestingUserEmployee.official.firstName} ${requestingUserEmployee.official.lastName}`.trim()
        : 'Unknown Approver'
    )

    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: status as any,
        approver: approverName
      }
    })

    return res.json({ 
      leaveRequest: updatedLeaveRequest,
      message: `Leave request ${status} successfully`
    })
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
      include: { 
        employee: {
          include: {
            user: true
          }
        }
      }
    })

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' })
    }

    // Authorization: Users can only update their own pending requests (unless admin/hr)
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    
    if (!isAdmin) {
      // Check if it's their own request
      if (leaveRequest.employee.user?.id !== requestingUser?.id) {
        return res.status(403).json({ error: 'You can only update your own leave requests' })
      }

      // Check if it's still pending
      if (leaveRequest.status !== 'pending') {
        return res.status(400).json({ 
          error: `Only pending leave requests can be updated. This request is ${leaveRequest.status}.` 
        })
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

      // Check leave balance if changing to earned leave or updating dates for earned leave
      if ((type === 'earned' || leaveRequest.type === 'earned') && days !== leaveRequest.days) {
        const leaveBalance = await prisma.leaveBalance.findUnique({
          where: { employeeId: leaveRequest.employeeId }
        })

        if (leaveBalance && leaveBalance.earned < days) {
          return res.status(400).json({ 
            error: `Insufficient earned leave balance. Available: ${leaveBalance.earned} days, Requested: ${days} days` 
          })
        }
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

    return res.json({ 
      leaveRequest: updatedLeaveRequest,
      message: 'Leave request updated successfully'
    })
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
      include: { 
        employee: {
          include: {
            user: true
          }
        }
      }
    })

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' })
    }

    // Authorization: Users can only delete their own pending requests, admins can delete any
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    
    if (!isAdmin) {
      // Check if it's their own request
      if (leaveRequest.employee.user?.id !== requestingUser?.id) {
        return res.status(403).json({ error: 'You can only delete your own leave requests' })
      }

      // Check if it's still pending
      if (leaveRequest.status !== 'pending') {
        return res.status(400).json({ 
          error: `Only pending leave requests can be deleted. This request is ${leaveRequest.status}.` 
        })
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

// Get team members' leave requests (for managers to view their direct reports)
export const getTeamLeaveRequests = async (req: Request, res: Response) => {
  try {
    const { status, startDate, endDate } = req.query
    const requestingUser = req.user

    const isManager = requestingUser?.role === 'manager'
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'

    if (!isManager && !isAdmin) {
      return res.status(403).json({ error: 'Only managers and admins can view team leave requests' })
    }

    // Find the manager's employee record and their direct reports
    const managerEmployee = await prisma.employee.findFirst({
      where: { user: { id: requestingUser?.id } },
      include: {
        directReports: {
          include: {
            official: true
          }
        }
      }
    })

    if (!managerEmployee) {
      return res.status(403).json({ error: 'Manager employee record not found' })
    }

    // Get all direct report employee IDs
    const directReportIds = managerEmployee.directReports.map(dr => dr.id)

    if (directReportIds.length === 0) {
      return res.json({ 
        teamLeaveRequests: [],
        message: 'No direct reports assigned to this manager'
      })
    }

    // Build filter conditions
    const where: any = {
      employeeId: { in: directReportIds }
    }

    if (status) {
      where.status = status
    }

    if (startDate && endDate) {
      where.AND = [
        { startDate: { gte: new Date(startDate as string) } },
        { endDate: { lte: new Date(endDate as string) } }
      ]
    }

    const teamLeaveRequests = await prisma.leaveRequest.findMany({
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

    return res.json({ 
      teamLeaveRequests,
      directReportsCount: directReportIds.length
    })
  } catch (err: any) {
    console.error('Get team leave requests error:', err)
    return res.status(500).json({ error: 'Failed to fetch team leave requests', details: err?.message })
  }
}