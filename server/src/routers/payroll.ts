import { Router } from 'express'
import { 
  getAttendanceSheet, 
  generatePayslip, 
  getPayslip,
  getAllPayslips 
} from '../controllers/payroll'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// All routes require authentication
router.use(authenticateToken)

// Get attendance sheet for payroll cycle (22nd prev month to 21st current month)
// GET /api/payroll/attendance-sheet/:employeeId?month=8&year=2025
router.get('/attendance-sheet/:employeeId', getAttendanceSheet)

// Generate payslip with absence deductions
// POST /api/payroll/generate/:employeeId
router.post('/generate/:employeeId', generatePayslip)

// Get payslip
// GET /api/payroll/payslip/:employeeId?month=8&year=2025
router.get('/payslip/:employeeId', getPayslip)

// Get all payslips for an employee
// GET /api/payroll/payslips/:employeeId
router.get('/payslips/:employeeId', getAllPayslips)

export default router

