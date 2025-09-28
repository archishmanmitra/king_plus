import { Router } from 'express'
import { login, verifyToken, setup } from '../controllers/auth'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Public routes
router.post('/login', login)
router.post('/setup', setup)

// Protected routes
router.get('/verify', authenticateToken, verifyToken)

export default router
