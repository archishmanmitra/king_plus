import { Router } from 'express'
import { 
  assignManager, 
  assignTeamLead, 
  updateEmployeeRole, 
  getEmployeesUnderManager, 
  getTeamLeads, 
  removeManager, 
  removeTeamLead 
} from '../controllers/roleAssignment'
import { authenticateToken, requireAdmin, requireManager } from '../middleware/auth'

const router = Router()

// Manager Assignment Routes
// Assign a manager to an employee - admins and HR only
router.post('/manager', authenticateToken, requireAdmin, assignManager)

// Remove manager assignment - admins and HR only
router.delete('/manager/:employeeId', authenticateToken, requireAdmin, removeManager)

// Get employees under a specific manager
router.get('/manager/:managerId/employees', authenticateToken, getEmployeesUnderManager)

// Team Lead Assignment Routes
// Assign a team lead to an employee - managers and admins only
router.post('/team-lead', authenticateToken, requireManager, assignTeamLead)

// Remove team lead assignment - managers and admins only
router.delete('/team-lead/:employeeId', authenticateToken, requireManager, removeTeamLead)

// Get all team leads and their teams - admins and HR only
router.get('/team-leads', authenticateToken, requireAdmin, getTeamLeads)

// Role Management Routes
// Update employee role - global admins only
router.patch('/role', authenticateToken, updateEmployeeRole)

export default router
