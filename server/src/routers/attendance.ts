import { Router } from 'express'
import { approve, clockIn, clockOut, getApprovalsForManager, getMyAttendance, pause, resume, submitForApproval, reject, getTodayAttendance, getApprovedAttendances, getTodayAttendanceByRole } from '../controllers/attendance'
import { authenticateToken } from '../middleware/auth'

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
router.get('/approved', authenticateToken, getApprovedAttendances)
router.get('/today', getTodayAttendance)
router.get('/today-by-role', authenticateToken, getTodayAttendanceByRole)

export default router


