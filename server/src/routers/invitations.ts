import { Router } from 'express'
import { getInvitation, acceptInvitation } from '../controllers/invitation'

const router = Router()

// Public routes
router.get('/:token', getInvitation)
router.post('/accept', acceptInvitation)

export default router
