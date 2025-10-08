import { Router } from 'express'
import { getInvitation, acceptInvitation, createInvitation } from '../controllers/invitation'

const router = Router()

// Public routes
router.get('/:token', getInvitation)
router.post('/accept', acceptInvitation)
router.post('/', createInvitation)

export default router
