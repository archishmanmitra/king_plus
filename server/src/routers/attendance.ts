import { Router } from 'express'
import { approve, clockIn, clockOut, getMyAttendance, pause, resume, submitForApproval } from '../controllers/attendance'

const router = Router()

router.post('/clock-in', clockIn)
router.post('/pause', pause)
router.post('/resume', resume)
router.post('/clock-out', clockOut)
router.post('/submit', submitForApproval)
router.post('/:id/approve', approve)
router.get('/employee/:employeeId', getMyAttendance)

export default router


