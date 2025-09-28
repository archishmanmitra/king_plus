import { Router } from 'express'
import { createEmployee } from '../controllers/employee'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = Router()

// Protected routes - only admins can create employees
router.post('/', authenticateToken, requireAdmin, createEmployee)

export default router
