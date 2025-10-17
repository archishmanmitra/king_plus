import { Router } from 'express'
import { 
  createLeaveRequest, 
  getLeaveRequests, 
  getLeaveRequestById, 
  updateLeaveRequestStatus, 
  updateLeaveRequest, 
  deleteLeaveRequest,
  getPendingApprovals,
  getTeamLeaveRequests
} from '../controllers/leave'
import { 
  getLeaveBalance, 
  updateLeaveBalance, 
  getAllLeaveBalances, 
  resetLeaveBalance, 
  addLeaveDays 
} from '../controllers/leaveBalance'
import { authenticateToken, requireAdmin, requireManager } from '../middleware/auth'

const router = Router()

// Leave Request Routes
// Create a new leave request
router.post('/requests', authenticateToken, createLeaveRequest)

// Get all leave requests with optional filtering
router.get('/requests', authenticateToken, getLeaveRequests)

// Get pending approvals for managers (requests from their direct reports)
router.get('/requests/pending-approvals', authenticateToken, requireManager, getPendingApprovals)

// Get team members' leave requests (for managers to view their direct reports)
router.get('/requests/team', authenticateToken, requireManager, getTeamLeaveRequests)

// Get a specific leave request
router.get('/requests/:id', authenticateToken, getLeaveRequestById)

// Update leave request status (approve/reject) - managers and admins only
router.patch('/requests/:id/status', authenticateToken, requireManager, updateLeaveRequestStatus)

// Update leave request details
router.patch('/requests/:id', authenticateToken, updateLeaveRequest)

// Delete leave request
router.delete('/requests/:id', authenticateToken, deleteLeaveRequest)

// Leave Balance Routes
// Get leave balance for a specific employee
router.get('/balance/:employeeId', authenticateToken, getLeaveBalance)

// Update leave balance for a specific employee - admins and HR only
router.patch('/balance/:employeeId', authenticateToken, requireAdmin, updateLeaveBalance)

// Get all leave balances - admins and HR only
router.get('/balance', authenticateToken, requireAdmin, getAllLeaveBalances)

// Reset leave balance for a new year - admins and HR only
router.post('/balance/:employeeId/reset', authenticateToken, requireAdmin, resetLeaveBalance)

// Add leave days to an employee's balance - admins and HR only
router.post('/balance/:employeeId/add', authenticateToken, requireAdmin, addLeaveDays)

export default router
