import { Router } from 'express'
import { getInvitation, acceptInvitation, createInvitation, getAllInvitations, deleteInvitation } from '../controllers/invitation'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Public routes
router.get('/:token', getInvitation)
router.post('/accept', acceptInvitation)

// Protected routes (require authentication)
router.post('/', authenticateToken, createInvitation)
router.get('/', authenticateToken, getAllInvitations)
router.delete('/:id', authenticateToken, deleteInvitation)

export default router
