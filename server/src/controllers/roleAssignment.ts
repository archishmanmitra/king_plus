import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

// Assign a manager to an employee
export const assignManager = async (req: Request, res: Response) => {
  try {
    const { employeeId, managerId } = req.body
    const requestingUser = req.user

    if (!employeeId || !managerId) {
      return res.status(400).json({ error: 'employeeId and managerId are required' })
    }

    // Only admins and HR managers can assign managers
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins and HR managers can assign managers' })
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { official: true, user: true }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Check if manager exists and has manager role
    const manager = await prisma.user.findUnique({
      where: { id: managerId },
      include: { employee: { include: { official: true } } }
    })

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' })
    }

    if (manager.role !== 'manager' && manager.role !== 'hr_manager' && manager.role !== 'global_admin') {
      return res.status(400).json({ error: 'Assigned user must have manager, HR manager, or admin role' })
    }

    // Update employee's unit head (manager)
    const updatedEmployee = await prisma.employeeOfficial.update({
      where: { employeeId },
      data: {
        unitHead: manager.employee?.official?.firstName 
          ? `${manager.employee.official.firstName} ${manager.employee.official.lastName}`.trim()
          : manager.name
      }
    })

    // Log this action in timeline
    await prisma.timelineEvent.create({
      data: {
        employeeId,
        date: new Date(),
        type: 'note',
        title: 'Manager Assigned',
        description: `Manager assigned: ${manager.name}`,
        isPrivate: false
      }
    })

    return res.json({ 
      message: 'Manager assigned successfully',
      employee: updatedEmployee 
    })
  } catch (err: any) {
    console.error('Assign manager error:', err)
    return res.status(500).json({ error: 'Failed to assign manager', details: err?.message })
  }
}

// Assign a team lead to an employee
export const assignTeamLead = async (req: Request, res: Response) => {
  try {
    const { employeeId, leadId } = req.body
    const requestingUser = req.user

    if (!employeeId || !leadId) {
      return res.status(400).json({ error: 'employeeId and leadId are required' })
    }

    // Only admins, HR managers, and managers can assign team leads
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    const isManager = requestingUser?.role === 'manager'
    
    if (!isAdmin && !isManager) {
      return res.status(403).json({ error: 'Only admins, HR managers, and managers can assign team leads' })
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { official: true, user: true }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Check if team lead exists
    const lead = await prisma.user.findUnique({
      where: { id: leadId },
      include: { employee: { include: { official: true } } }
    })

    if (!lead) {
      return res.status(404).json({ error: 'Team lead not found' })
    }

    // Update employee's manager relationship (handled via Employee.managerId)
    // Note: Reporting manager info is stored via the managerId relationship on Employee model
    const updatedEmployee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        official: true,
        manager: {
          include: {
            official: true
          }
        }
      }
    })

    // Log this action in timeline
    await prisma.timelineEvent.create({
      data: {
        employeeId,
        date: new Date(),
        type: 'note',
        title: 'Team Lead Assigned',
        description: `Team lead assigned: ${lead.name}`,
        isPrivate: false
      }
    })

    return res.json({ 
      message: 'Team lead assigned successfully',
      employee: updatedEmployee 
    })
  } catch (err: any) {
    console.error('Assign team lead error:', err)
    return res.status(500).json({ error: 'Failed to assign team lead', details: err?.message })
  }
}

// Update employee role
export const updateEmployeeRole = async (req: Request, res: Response) => {
  try {
    const { employeeId, newRole } = req.body
    const requestingUser = req.user

    if (!employeeId || !newRole) {
      return res.status(400).json({ error: 'employeeId and newRole are required' })
    }

    // Only global admins can change roles
    if (requestingUser?.role !== 'global_admin') {
      return res.status(403).json({ error: 'Only global admins can change employee roles' })
    }

    const validRoles = ['global_admin', 'hr_manager', 'manager', 'employee']
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be one of: global_admin, hr_manager, manager, employee' 
      })
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { user: true, official: true }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    if (!employee.user) {
      return res.status(404).json({ error: 'Employee user account not found' })
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: employee.user.id },
      data: { role: newRole as any }
    })

    // Log this action in timeline
    await prisma.timelineEvent.create({
      data: {
        employeeId,
        date: new Date(),
        type: 'note',
        title: 'Role Updated',
        description: `Role changed to: ${newRole}`,
        isPrivate: false
      }
    })

    return res.json({ 
      message: 'Employee role updated successfully',
      user: updatedUser 
    })
  } catch (err: any) {
    console.error('Update employee role error:', err)
    return res.status(500).json({ error: 'Failed to update employee role', details: err?.message })
  }
}

// Get employees under a manager
export const getEmployeesUnderManager = async (req: Request, res: Response) => {
  try {
    const { managerId } = req.params
    const requestingUser = req.user

    // Check if manager exists
    const manager = await prisma.user.findUnique({
      where: { id: managerId },
      include: { employee: { include: { official: true } } }
    })

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' })
    }

    // Authorization: Users can only view their own team unless they're admin/hr
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    
    if (!isAdmin && requestingUser?.id !== managerId) {
      return res.status(403).json({ error: 'You can only view your own team' })
    }

    const managerName = manager.employee?.official?.firstName 
      ? `${manager.employee.official.firstName} ${manager.employee.official.lastName}`.trim()
      : manager.name

    // Find employees under this manager
    const employees = await prisma.employee.findMany({
      where: {
        official: {
          unitHead: managerName
        }
      },
      include: {
        official: true,
        user: true,
        personal: true
      }
    })

    return res.json({ 
      manager: {
        id: manager.id,
        name: managerName,
        role: manager.role
      },
      employees: employees.map(emp => ({
        id: emp.id,
        employeeId: emp.employeeId,
        name: emp.official?.firstName 
          ? `${emp.official.firstName} ${emp.official.lastName}`.trim()
          : 'Unknown',
        designation: emp.official?.designation || '',
        role: emp.user?.role || 'employee',
        email: emp.user?.email || '',
        phone: emp.personal?.phoneNumber || ''
      }))
    })
  } catch (err: any) {
    console.error('Get employees under manager error:', err)
    return res.status(500).json({ error: 'Failed to fetch employees under manager', details: err?.message })
  }
}

// Get team leads and their teams
export const getTeamLeads = async (req: Request, res: Response) => {
  try {
    const requestingUser = req.user

    // Only admins and HR managers can view all team leads
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins and HR managers can view all team leads' })
    }

    // Get all users with manager or higher roles
    const teamLeads = await prisma.user.findMany({
      where: {
        role: {
          in: ['manager', 'hr_manager', 'global_admin']
        }
      },
      include: {
        employee: {
          include: {
            official: true
          }
        }
      }
    })

    // Get teams for each team lead using managerId relationship
    const teamsWithLeads = await Promise.all(
      teamLeads.map(async (lead) => {
        // Find team members where this user is the manager
        const teamMembers = await prisma.employee.findMany({
          where: {
            managerId: lead.employee?.id
          },
          include: {
            official: true,
            user: true
          }
        })

        return {
          lead: {
            id: lead.id,
            name: lead.employee?.official?.firstName 
              ? `${lead.employee.official.firstName} ${lead.employee.official.lastName}`.trim()
              : lead.name,
            role: lead.role,
            email: lead.email
          },
          teamMembers: teamMembers.map((member: any) => ({
            id: member.id,
            employeeId: member.employeeId,
            name: member.official?.firstName 
              ? `${member.official.firstName} ${member.official.lastName}`.trim()
              : 'Unknown',
            designation: member.official?.designation || '',
            role: member.user?.role || 'employee'
          }))
        }
      })
    )

    return res.json({ teamsWithLeads })
  } catch (err: any) {
    console.error('Get team leads error:', err)
    return res.status(500).json({ error: 'Failed to fetch team leads', details: err?.message })
  }
}

// Remove manager assignment
export const removeManager = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    const requestingUser = req.user

    // Only admins and HR managers can remove manager assignments
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins and HR managers can remove manager assignments' })
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { official: true }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Remove manager assignment
    const updatedEmployee = await prisma.employeeOfficial.update({
      where: { employeeId },
      data: {
        unitHead: null
      }
    })

    // Log this action in timeline
    await prisma.timelineEvent.create({
      data: {
        employeeId,
        date: new Date(),
        type: 'note',
        title: 'Manager Removed',
        description: 'Manager assignment removed',
        isPrivate: false
      }
    })

    return res.json({ 
      message: 'Manager assignment removed successfully',
      employee: updatedEmployee 
    })
  } catch (err: any) {
    console.error('Remove manager error:', err)
    return res.status(500).json({ error: 'Failed to remove manager assignment', details: err?.message })
  }
}

// Remove team lead assignment
export const removeTeamLead = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    const requestingUser = req.user

    // Only admins, HR managers, and managers can remove team lead assignments
    const isAdmin = requestingUser?.role === 'global_admin' || requestingUser?.role === 'hr_manager'
    const isManager = requestingUser?.role === 'manager'
    
    if (!isAdmin && !isManager) {
      return res.status(403).json({ error: 'Only admins, HR managers, and managers can remove team lead assignments' })
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { official: true }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Remove team lead assignment by setting managerId to null
    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        managerId: null
      },
      include: {
        official: true,
        manager: true
      }
    })

    // Log this action in timeline
    await prisma.timelineEvent.create({
      data: {
        employeeId,
        date: new Date(),
        type: 'note',
        title: 'Team Lead Removed',
        description: 'Team lead assignment removed',
        isPrivate: false
      }
    })

    return res.json({ 
      message: 'Team lead assignment removed successfully',
      employee: updatedEmployee 
    })
  } catch (err: any) {
    console.error('Remove team lead error:', err)
    return res.status(500).json({ error: 'Failed to remove team lead assignment', details: err?.message })
  }
}
