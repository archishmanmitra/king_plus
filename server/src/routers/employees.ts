import { Router } from 'express'
import { createEmployee, getEmployees, getEmployeeByEmployeeId } from '../controllers/employee'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = Router()

// Protected routes - only admins can create employees
router.post('/', authenticateToken, requireAdmin, createEmployee)

// List all employees (protected)
router.get('/', authenticateToken, getEmployees)

// Get employee by external employeeId (protected)
router.get('/:employeeId', authenticateToken, getEmployeeByEmployeeId)

export default router
