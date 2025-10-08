import { Router } from 'express'
import { createEmployee, getEmployees, getEmployeeByEmployeeId, updateEmployeeProfile } from '../controllers/employee'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = Router()

// Protected routes - only admins can create employees
router.post('/', authenticateToken, requireAdmin, createEmployee)

// List all employees (protected)
router.get('/',  getEmployees)

// Get employee by external employeeId (protected)
router.get('/:employeeId', authenticateToken, getEmployeeByEmployeeId)

// Partial update profile (supports sub-sections); mixed permissions handled inside controller
router.patch('/:employeeId', authenticateToken, updateEmployeeProfile)

export default router
