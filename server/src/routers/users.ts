import { Router } from 'express'
import { listUsers, getUserByEmployeeId } from '../controllers/users'

const router = Router()

router.get('/', listUsers)
router.get('/:employeeId', getUserByEmployeeId)

export default router


