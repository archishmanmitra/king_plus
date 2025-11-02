import { Router } from 'express'
import {
  getAwards,
  getAwardById,
  getEmployeeAwards,
  createAward,
  updateAward,
  deleteAward,
  getAwardStatistics
} from '../controllers/awards'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = Router()

// Public routes (authenticated users)
// Get all public awards
router.get('/', authenticateToken, getAwards)

// Get a specific award by ID
router.get('/:id', authenticateToken, getAwardById)

// Get awards for a specific employee
router.get('/employee/:employeeId', authenticateToken, getEmployeeAwards)

// Get award statistics (Admin only)
router.get('/statistics/summary', authenticateToken, requireAdmin, getAwardStatistics)

// Admin-only routes
// Create a new award
router.post('/', authenticateToken, requireAdmin, createAward)

// Update award
router.patch('/:id', authenticateToken, requireAdmin, updateAward)

// Delete award
router.delete('/:id', authenticateToken, requireAdmin, deleteAward)

export default router

