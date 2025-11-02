import { Router } from 'express'
import {
  getAuditReports,
  getAuditReportById,
  createAuditReport,
  generateAuditReport,
  publishAuditReport,
  updateAuditReport,
  deleteAuditReport,
  downloadAuditReport
} from '../controllers/auditReport'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = Router()

// Public routes (authenticated users)
// Get all audit reports (admins see all, others see only published/generated)
router.get('/', authenticateToken, getAuditReports)

// Get a specific audit report by ID
router.get('/:id', authenticateToken, getAuditReportById)

// Download audit report (all authenticated users can download published reports)
router.get('/:id/download', authenticateToken, downloadAuditReport)

// Admin-only routes
// Create a new audit report
router.post('/', authenticateToken, requireAdmin, createAuditReport)

// Generate report (convert from draft to generated)
router.post('/:id/generate', authenticateToken, requireAdmin, generateAuditReport)

// Publish report (convert from generated to published)
router.post('/:id/publish', authenticateToken, requireAdmin, publishAuditReport)

// Update audit report (only drafts can be updated)
router.patch('/:id', authenticateToken, requireAdmin, updateAuditReport)

// Delete audit report (only drafts can be deleted)
router.delete('/:id', authenticateToken, requireAdmin, deleteAuditReport)

export default router

