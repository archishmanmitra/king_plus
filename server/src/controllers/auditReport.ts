import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import logger from '../logger/logger'

const prisma = new PrismaClient()

// Get all audit reports
export const getAuditReports = async (req: Request, res: Response) => {
  try {
    const requestingUser = req.user

    // Regular employees and managers can view published and generated reports
    // Admins can view all reports including drafts
    const isAdmin = requestingUser?.role === 'global_admin'

    const where: any = {}
    
    if (!isAdmin) {
      // Non-admins can only see generated and published reports
      where.status = { in: ['generated', 'published'] }
    }

    const reports = await prisma.auditReport.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    logger.info(`Fetched ${reports.length} audit reports for user ${requestingUser?.email}`)
    return res.json(reports)
  } catch (err: any) {
    logger.error('Get audit reports error:', err)
    return res.status(500).json({ error: 'Failed to fetch audit reports', details: err?.message })
  }
}

// Get a specific audit report by ID
export const getAuditReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const requestingUser = req.user

    const report = await prisma.auditReport.findUnique({
      where: { id }
    })

    if (!report) {
      return res.status(404).json({ error: 'Audit report not found' })
    }

    // Check permissions: only admins can view draft reports
    const isAdmin = requestingUser?.role === 'global_admin'
    
    if (!isAdmin && report.status === 'draft') {
      return res.status(403).json({ 
        error: 'Only admins can view draft reports' 
      })
    }

    logger.info(`Fetched audit report ${id} by user ${requestingUser?.email}`)
    return res.json(report)
  } catch (err: any) {
    logger.error('Get audit report by ID error:', err)
    return res.status(500).json({ error: 'Failed to fetch audit report', details: err?.message })
  }
}

// Create a new audit report (Admin only)
export const createAuditReport = async (req: Request, res: Response) => {
  try {
    const requestingUser = req.user
    const { title, description, reportType, startDate, endDate, metadata } = req.body

    // Only admins can create audit reports
    if (requestingUser?.role !== 'global_admin') {
      return res.status(403).json({ 
        error: 'Only admins can create audit reports' 
      })
    }

    if (!title || !reportType) {
      return res.status(400).json({ 
        error: 'title and reportType are required' 
      })
    }

    // Validate report type
    const validReportTypes = ['attendance', 'payroll', 'leave', 'performance', 'general']
    if (!validReportTypes.includes(reportType)) {
      return res.status(400).json({ 
        error: `Invalid report type. Must be one of: ${validReportTypes.join(', ')}` 
      })
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (end < start) {
        return res.status(400).json({ 
          error: 'End date must be after start date' 
        })
      }
    }

    const report = await prisma.auditReport.create({
      data: {
        title,
        description: description || null,
        reportType,
        status: 'draft',
        generatedBy: requestingUser.id,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        metadata: metadata || null
      }
    })

    logger.info(`Audit report created: ${report.id} by ${requestingUser.email}`)
    return res.status(201).json(report)
  } catch (err: any) {
    logger.error('Create audit report error:', err)
    return res.status(500).json({ error: 'Failed to create audit report', details: err?.message })
  }
}

// Generate report (change status from draft to generated) - Admin only
export const generateAuditReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const requestingUser = req.user

    // Only admins can generate reports
    if (requestingUser?.role !== 'global_admin') {
      return res.status(403).json({ 
        error: 'Only admins can generate audit reports' 
      })
    }

    const report = await prisma.auditReport.findUnique({
      where: { id }
    })

    if (!report) {
      return res.status(404).json({ error: 'Audit report not found' })
    }

    if (report.status !== 'draft') {
      return res.status(400).json({ 
        error: `Report is already ${report.status}. Only draft reports can be generated.` 
      })
    }

    // In a real implementation, this would:
    // 1. Fetch the relevant data based on reportType, startDate, endDate
    // 2. Generate a PDF/Excel file
    // 3. Upload to storage (S3, etc.)
    // 4. Save the file URL
    // For now, we'll just update the status and create a mock file URL

    const fileUrl = `/reports/${id}_${Date.now()}.pdf`

    const updatedReport = await prisma.auditReport.update({
      where: { id },
      data: {
        status: 'generated',
        fileUrl: fileUrl
      }
    })

    logger.info(`Audit report generated: ${id} by ${requestingUser.email}`)
    return res.json(updatedReport)
  } catch (err: any) {
    logger.error('Generate audit report error:', err)
    return res.status(500).json({ error: 'Failed to generate audit report', details: err?.message })
  }
}

// Publish report (change status from generated to published) - Admin only
export const publishAuditReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const requestingUser = req.user

    // Only admins can publish reports
    if (requestingUser?.role !== 'global_admin') {
      return res.status(403).json({ 
        error: 'Only admins can publish audit reports' 
      })
    }

    const report = await prisma.auditReport.findUnique({
      where: { id }
    })

    if (!report) {
      return res.status(404).json({ error: 'Audit report not found' })
    }

    if (report.status !== 'generated') {
      return res.status(400).json({ 
        error: `Only generated reports can be published. Current status: ${report.status}` 
      })
    }

    const updatedReport = await prisma.auditReport.update({
      where: { id },
      data: {
        status: 'published'
      }
    })

    logger.info(`Audit report published: ${id} by ${requestingUser.email}`)
    return res.json(updatedReport)
  } catch (err: any) {
    logger.error('Publish audit report error:', err)
    return res.status(500).json({ error: 'Failed to publish audit report', details: err?.message })
  }
}

// Update audit report - Admin only
export const updateAuditReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const requestingUser = req.user
    const { title, description, reportType, startDate, endDate, metadata } = req.body

    // Only admins can update reports
    if (requestingUser?.role !== 'global_admin') {
      return res.status(403).json({ 
        error: 'Only admins can update audit reports' 
      })
    }

    const report = await prisma.auditReport.findUnique({
      where: { id }
    })

    if (!report) {
      return res.status(404).json({ error: 'Audit report not found' })
    }

    // Can only edit draft reports
    if (report.status !== 'draft') {
      return res.status(400).json({ 
        error: 'Only draft reports can be edited' 
      })
    }

    const updateData: any = {}

    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (reportType) {
      const validReportTypes = ['attendance', 'payroll', 'leave', 'performance', 'general']
      if (!validReportTypes.includes(reportType)) {
        return res.status(400).json({ 
          error: `Invalid report type. Must be one of: ${validReportTypes.join(', ')}` 
        })
      }
      updateData.reportType = reportType
    }
    if (startDate) updateData.startDate = new Date(startDate)
    if (endDate) updateData.endDate = new Date(endDate)
    if (metadata !== undefined) updateData.metadata = metadata

    // Validate dates if both are present
    if (updateData.startDate && updateData.endDate) {
      if (updateData.endDate < updateData.startDate) {
        return res.status(400).json({ 
          error: 'End date must be after start date' 
        })
      }
    }

    const updatedReport = await prisma.auditReport.update({
      where: { id },
      data: updateData
    })

    logger.info(`Audit report updated: ${id} by ${requestingUser.email}`)
    return res.json(updatedReport)
  } catch (err: any) {
    logger.error('Update audit report error:', err)
    return res.status(500).json({ error: 'Failed to update audit report', details: err?.message })
  }
}

// Delete audit report - Admin only
export const deleteAuditReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const requestingUser = req.user

    // Only admins can delete reports
    if (requestingUser?.role !== 'global_admin') {
      return res.status(403).json({ 
        error: 'Only admins can delete audit reports' 
      })
    }

    const report = await prisma.auditReport.findUnique({
      where: { id }
    })

    if (!report) {
      return res.status(404).json({ error: 'Audit report not found' })
    }

    // Can only delete draft reports
    if (report.status !== 'draft') {
      return res.status(400).json({ 
        error: 'Only draft reports can be deleted. Published reports should be archived instead.' 
      })
    }

    await prisma.auditReport.delete({
      where: { id }
    })

    logger.info(`Audit report deleted: ${id} by ${requestingUser.email}`)
    return res.json({ message: 'Audit report deleted successfully' })
  } catch (err: any) {
    logger.error('Delete audit report error:', err)
    return res.status(500).json({ error: 'Failed to delete audit report', details: err?.message })
  }
}

// Download audit report
export const downloadAuditReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const requestingUser = req.user

    const report = await prisma.auditReport.findUnique({
      where: { id }
    })

    if (!report) {
      return res.status(404).json({ error: 'Audit report not found' })
    }

    // Check permissions: only admins can download draft reports
    const isAdmin = requestingUser?.role === 'global_admin'
    
    if (!isAdmin && report.status === 'draft') {
      return res.status(403).json({ 
        error: 'Draft reports cannot be downloaded' 
      })
    }

    if (!report.fileUrl) {
      return res.status(400).json({ 
        error: 'Report file not available. Please generate the report first.' 
      })
    }

    // In a real implementation, this would:
    // 1. Fetch the file from storage (S3, etc.)
    // 2. Stream it to the response
    // For now, we'll return mock data

    logger.info(`Audit report downloaded: ${id} by ${requestingUser?.email}`)
    
    // Mock PDF content for demonstration
    // In production, you would stream the actual file
    const mockPdfContent = Buffer.from('Mock PDF content for audit report: ' + report.title)
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${report.title.replace(/\s+/g, '_')}.pdf"`)
    return res.send(mockPdfContent)
  } catch (err: any) {
    logger.error('Download audit report error:', err)
    return res.status(500).json({ error: 'Failed to download audit report', details: err?.message })
  }
}

