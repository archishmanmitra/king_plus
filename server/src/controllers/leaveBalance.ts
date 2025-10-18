import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

// Get leave balance for current user
export const getMyLeaveBalance = async (req: Request, res: Response) => {
  try {
    const requestingUser = req.user

    // Get employee record for the current user
    const employee = await prisma.employee.findFirst({
      where: { user: { id: requestingUser?.id } }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee record not found for this user' })
    }

    const leaveBalance = await prisma.leaveBalance.findUnique({
      where: { employeeId: employee.id },
      include: {
        employee: {
          include: {
            official: true,
            user: true
          }
        }
      }
    })

    if (!leaveBalance) {
      return res.status(404).json({ error: 'Leave balance not found. Please contact HR to set up your leave balance.' })
    }

    return res.json({ leaveBalance })
  } catch (err: any) {
    console.error('Get my leave balance error:', err)
    return res.status(500).json({ error: 'Failed to fetch leave balance', details: err?.message })
  }
}

// Get leave balance for an employee (admin/manager only)
export const getLeaveBalance = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    const requestingUser = req.user

    // Authorization: Users can only view their own balance unless they're admin/hr
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    const isManager = requestingUser?.role === 'manager'
    
    if (!isAdmin && !isManager) {
      const user = await prisma.user.findUnique({
        where: { id: requestingUser?.id },
        include: { employee: true }
      })
      
      if (!user?.employee || user.employee.id !== employeeId) {
        return res.status(403).json({ error: 'You can only view your own leave balance' })
      }
    }

    const leaveBalance = await prisma.leaveBalance.findUnique({
      where: { employeeId: employeeId },
      include: {
        employee: {
          include: {
            official: true,
            user: true
          }
        }
      }
    })

    if (!leaveBalance) {
      return res.status(404).json({ error: 'Leave balance not found. Please contact HR to set up leave balance.' })
    }

    return res.json({ leaveBalance })
  } catch (err: any) {
    console.error('Get leave balance error:', err)
    return res.status(500).json({ error: 'Failed to fetch leave balance', details: err?.message })
  }
}

// Update leave balance for an employee
export const updateLeaveBalance = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    const { earned, compoff, maternity, paternity } = req.body
    const requestingUser = req.user

    // Only admins and HR managers can update leave balances
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins and HR managers can update leave balances' })
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    const updateData: any = {}
    
    if (earned !== undefined) updateData.earned = earned
    if (compoff !== undefined) updateData.compoff = compoff
    if (maternity !== undefined) updateData.maternity = maternity
    if (paternity !== undefined) updateData.paternity = paternity

    // Calculate total if any values are provided
    if (Object.keys(updateData).length > 0) {
      const currentBalance = await prisma.leaveBalance.findUnique({
        where: { employeeId }
      })

      const newEarned = earned !== undefined ? earned : (currentBalance?.earned || 0)
      const newCompoff = compoff !== undefined ? compoff : (currentBalance?.compoff || 0)
      const newMaternity = maternity !== undefined ? maternity : (currentBalance?.maternity || 0)
      const newPaternity = paternity !== undefined ? paternity : (currentBalance?.paternity || 0)
      
      updateData.total = newEarned + newCompoff + newMaternity + newPaternity
    }

    const updatedBalance = await prisma.leaveBalance.upsert({
      where: { employeeId },
      update: updateData,
      create: {
        employeeId,
        earned: earned || 0,
        compoff: compoff || 0,
        maternity: maternity || 0,
        paternity: paternity || 0,
        total: (earned || 0) + (compoff || 0) + (maternity || 0) + (paternity || 0)
      },
      include: {
        employee: {
          include: {
            official: true,
            user: true
          }
        }
      }
    })

    return res.json({ leaveBalance: updatedBalance })
  } catch (err: any) {
    console.error('Update leave balance error:', err)
    return res.status(500).json({ error: 'Failed to update leave balance', details: err?.message })
  }
}

// Get all leave balances (admin/HR only)
export const getAllLeaveBalances = async (req: Request, res: Response) => {
  try {
    const requestingUser = req.user

    // Only admins and HR managers can view all leave balances
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins and HR managers can view all leave balances' })
    }

    const leaveBalances = await prisma.leaveBalance.findMany({
      include: {
        employee: {
          include: {
            official: true,
            user: true
          }
        }
      },
      orderBy: {
        employee: {
          official: {
            firstName: 'asc'
          }
        }
      }
    })

    return res.json({ leaveBalances })
  } catch (err: any) {
    console.error('Get all leave balances error:', err)
    return res.status(500).json({ error: 'Failed to fetch leave balances', details: err?.message })
  }
}

// Reset leave balance for a new year
export const resetLeaveBalance = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    const { year } = req.body
    const requestingUser = req.user

    // Only admins and HR managers can reset leave balances
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins and HR managers can reset leave balances' })
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Reset to default values for the new year
    const resetBalance = await prisma.leaveBalance.upsert({
      where: { employeeId },
      update: {
        earned: 0,
        compoff: 0,
        maternity: 0,
        paternity: 0,
        total: 0
      },
      create: {
        employeeId,
        earned: 0,
        compoff: 0,
        maternity: 0,
        paternity: 0,
        total: 0
      },
      include: {
        employee: {
          include: {
            official: true,
            user: true
          }
        }
      }
    })

    return res.json({ 
      message: `Leave balance reset for year ${year || new Date().getFullYear()}`,
      leaveBalance: resetBalance 
    })
  } catch (err: any) {
    console.error('Reset leave balance error:', err)
    return res.status(500).json({ error: 'Failed to reset leave balance', details: err?.message })
  }
}

// Add leave days to an employee's balance
export const addLeaveDays = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    const { type, days, reason } = req.body
    const requestingUser = req.user

    // Only admins and HR managers can add leave days
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins and HR managers can add leave days' })
    }

    if (!type || !days || days <= 0) {
      return res.status(400).json({ error: 'type and positive days are required' })
    }

    const validTypes = ['earned', 'maternity', 'paternity', 'compoff']
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid leave type. Must be one of: earned, maternity, paternity, compoff' 
      })
    }

    // Check if employee exists - try both id and employeeId fields
    let employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    })
    
    if (!employee) {
      // Try with employeeId field as fallback
      employee = await prisma.employee.findUnique({
        where: { employeeId: employeeId }
      })
    }

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Get current balance or create default
    const currentBalance = await prisma.leaveBalance.findUnique({
      where: { employeeId: employee.id }
    })

    const updateData: any = {}
    updateData[type] = (currentBalance?.[type as keyof typeof currentBalance] || 0) + days
    updateData.total = (currentBalance?.total || 0) + days

    const updatedBalance = await prisma.leaveBalance.upsert({
      where: { employeeId: employee.id },
      update: updateData,
      create: {
        employeeId: employee.id,
        earned: type === 'earned' ? days : 0,
        compoff: type === 'compoff' ? days : 0,
        maternity: type === 'maternity' ? days : 0,
        paternity: type === 'paternity' ? days : 0,
        total: days
      },
      include: {
        employee: {
          include: {
            official: true,
            user: true
          }
        }
      }
    })

    // Log this action in timeline
    await prisma.timelineEvent.create({
      data: {
        employeeId,
        date: new Date(),
        type: 'leave',
        title: `Leave Days Added`,
        description: `Added ${days} ${type} days. ${reason ? `Reason: ${reason}` : ''}`,
        isPrivate: false
      }
    })

    return res.json({ 
      message: `Added ${days} ${type} days successfully`,
      leaveBalance: updatedBalance 
    })
  } catch (err: any) {
    console.error('Add leave days error:', err)
    return res.status(500).json({ error: 'Failed to add leave days', details: err?.message })
  }
}
