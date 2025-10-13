import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

// Get leave balance for an employee
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
      where: { employeeId },
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
      // Create default leave balance if it doesn't exist
      const defaultBalance = await prisma.leaveBalance.create({
        data: {
          employeeId,
          sick: 12, // Default 12 sick days per year
          vacation: 21, // Default 21 vacation days per year
          personal: 5, // Default 5 personal days per year
          maternity: 90, // Default 90 maternity days
          paternity: 15, // Default 15 paternity days
          total: 133 // Total of all leave types
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
      return res.json({ leaveBalance: defaultBalance })
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
    const { sick, vacation, personal, maternity, paternity } = req.body
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
    
    if (sick !== undefined) updateData.sick = sick
    if (vacation !== undefined) updateData.vacation = vacation
    if (personal !== undefined) updateData.personal = personal
    if (maternity !== undefined) updateData.maternity = maternity
    if (paternity !== undefined) updateData.paternity = paternity

    // Calculate total if any values are provided
    if (Object.keys(updateData).length > 0) {
      const currentBalance = await prisma.leaveBalance.findUnique({
        where: { employeeId }
      })

      const newSick = sick !== undefined ? sick : (currentBalance?.sick || 0)
      const newVacation = vacation !== undefined ? vacation : (currentBalance?.vacation || 0)
      const newPersonal = personal !== undefined ? personal : (currentBalance?.personal || 0)
      const newMaternity = maternity !== undefined ? maternity : (currentBalance?.maternity || 0)
      const newPaternity = paternity !== undefined ? paternity : (currentBalance?.paternity || 0)
      
      updateData.total = newSick + newVacation + newPersonal + newMaternity + newPaternity
    }

    const updatedBalance = await prisma.leaveBalance.upsert({
      where: { employeeId },
      update: updateData,
      create: {
        employeeId,
        sick: sick || 12,
        vacation: vacation || 21,
        personal: personal || 5,
        maternity: maternity || 90,
        paternity: paternity || 15,
        total: (sick || 12) + (vacation || 21) + (personal || 5) + (maternity || 90) + (paternity || 15)
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
        sick: 12,
        vacation: 21,
        personal: 5,
        maternity: 90,
        paternity: 15,
        total: 143 // 12 + 21 + 5 + 90 + 15
      },
      create: {
        employeeId,
        sick: 12,
        vacation: 21,
        personal: 5,
        maternity: 90,
        paternity: 15,
        total: 143
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

    const validTypes = ['sick', 'vacation', 'personal', 'maternity', 'paternity']
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid leave type. Must be one of: sick, vacation, personal, maternity, paternity' 
      })
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Get current balance or create default
    const currentBalance = await prisma.leaveBalance.findUnique({
      where: { employeeId }
    })

    const updateData: any = {}
    updateData[type] = (currentBalance?.[type as keyof typeof currentBalance] || 0) + days
    updateData.total = (currentBalance?.total || 0) + days

    const updatedBalance = await prisma.leaveBalance.upsert({
      where: { employeeId },
      update: updateData,
      create: {
        employeeId,
        sick: type === 'sick' ? days : 12,
        vacation: type === 'vacation' ? days : 21,
        personal: type === 'personal' ? days : 5,
        maternity: type === 'maternity' ? days : 90,
        paternity: type === 'paternity' ? days : 15,
        total: days + (type === 'sick' ? 0 : 12) + (type === 'vacation' ? 0 : 21) + 
               (type === 'personal' ? 0 : 5) + (type === 'maternity' ? 0 : 90) + 
               (type === 'paternity' ? 0 : 15)
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
