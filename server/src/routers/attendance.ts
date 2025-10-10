import { Router } from 'express'
import { approve, clockIn, clockOut, getApprovalsForManager, getMyAttendance, pause, resume, submitForApproval, reject } from '../controllers/attendance'

const router = Router()

router.post('/clock-in', clockIn)
router.post('/pause', pause)
router.post('/resume', resume)
router.post('/clock-out', clockOut)
router.post('/submit', submitForApproval)
router.post('/:id/approve', approve)
router.post('/:id/reject', reject)
router.get('/employee/:employeeId', getMyAttendance)
router.get('/approvals/:approverId', getApprovalsForManager)

export default router


