import { Router } from 'express'
import { createEmployee, getEmployees, getEmployeeByEmployeeId, getEmployeeByUserId, updateEmployeeProfile, assignManager, reassignTeam, getDirectReports, getTeamTree, getOrgChart, getAllTeamMembers } from '../controllers/employee'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = Router()

// Protected routes - only admins can create employees
router.post('/', authenticateToken, requireAdmin, createEmployee)

// List all employees (protected)
router.get('/', authenticateToken, getEmployees)

// Get employee by external employeeId (protected)
router.get('/:employeeId', authenticateToken, getEmployeeByEmployeeId)

// Get employee by user ID (protected)
router.get('/user/:userId', authenticateToken, getEmployeeByUserId)

// Partial update profile (supports sub-sections); mixed permissions handled inside controller
router.patch('/:employeeId', authenticateToken, updateEmployeeProfile)

// Manager assignment and team/org endpoints
router.patch('/:id/manager', authenticateToken, requireAdmin, assignManager)
router.post('/reassign-team', authenticateToken, requireAdmin, reassignTeam)
router.get('/:id/direct-reports', authenticateToken, getDirectReports)
router.get('/:id/team-tree', authenticateToken, getTeamTree)
router.get('/org/chart', authenticateToken, getOrgChart)
router.get('/:id/team-members', authenticateToken, getAllTeamMembers)

export default router
