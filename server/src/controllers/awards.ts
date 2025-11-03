import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import logger from '../logger/logger'

const prisma = new PrismaClient()

// Get all awards
export const getAwards = async (req: Request, res: Response) => {
  try {
    const requestingUser = req.user

    // All authenticated users can view public awards
    const awards = await prisma.award.findMany({
      where: {
        isPublic: true
      },
      orderBy: { celebrationDate: 'desc' }
    })

    logger.info(`Fetched ${awards.length} awards for user ${requestingUser?.email}`)
    return res.json(awards)
  } catch (err: any) {
    logger.error('Get awards error:', err)
    return res.status(500).json({ error: 'Failed to fetch awards', details: err?.message })
  }
}

// Get a specific award by ID
export const getAwardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const requestingUser = req.user

    const award = await prisma.award.findUnique({
      where: { id }
    })

    if (!award) {
      return res.status(404).json({ error: 'Award not found' })
    }

    // Check if award is public or user is admin
    const isAdmin = requestingUser?.role === 'global_admin'
    
    if (!award.isPublic && !isAdmin) {
      return res.status(403).json({ 
        error: 'This award is not public' 
      })
    }

    logger.info(`Fetched award ${id} by user ${requestingUser?.email}`)
    return res.json(award)
  } catch (err: any) {
    logger.error('Get award by ID error:', err)
    return res.status(500).json({ error: 'Failed to fetch award', details: err?.message })
  }
}

// Get awards for a specific employee
export const getEmployeeAwards = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    const requestingUser = req.user

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        official: true
      }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Get all public awards for this employee
    const awards = await prisma.award.findMany({
      where: {
        recipientId: employeeId,
        isPublic: true
      },
      orderBy: { celebrationDate: 'desc' }
    })

    logger.info(`Fetched ${awards.length} awards for employee ${employeeId}`)
    return res.json(awards)
  } catch (err: any) {
    logger.error('Get employee awards error:', err)
    return res.status(500).json({ error: 'Failed to fetch employee awards', details: err?.message })
  }
}

// Create a new award (Admin only)
export const createAward = async (req: Request, res: Response) => {
  try {
    const requestingUser = req.user
    const { title, description, awardType, recipientId, certificateUrl, badgeIcon, isPublic } = req.body

    // Only admins can create awards
    if (requestingUser?.role !== 'global_admin') {
      return res.status(403).json({ 
        error: 'Only admins can create awards' 
      })
    }

    if (!title || !description || !awardType || !recipientId) {
      return res.status(400).json({ 
        error: 'title, description, awardType, and recipientId are required' 
      })
    }

    // Validate award type
    const validAwardTypes = ['certificate', 'appreciation', 'achievement', 'milestone', 'recognition']
    if (!validAwardTypes.includes(awardType)) {
      return res.status(400).json({ 
        error: `Invalid award type. Must be one of: ${validAwardTypes.join(', ')}` 
      })
    }

    // Check if recipient exists
    const recipient = await prisma.employee.findUnique({
      where: { id: recipientId },
      include: {
        official: true
      }
    })

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient employee not found' })
    }

    // Get recipient name
    const recipientName = recipient.official 
      ? `${recipient.official.firstName} ${recipient.official.lastName}`.trim()
      : 'Unknown Employee'

    // Get admin employee record
    const adminEmployee = await prisma.employee.findFirst({
      where: { user: { id: requestingUser.id } },
      include: {
        official: true
      }
    })

    const issuedByName = adminEmployee?.official 
      ? `${adminEmployee.official.firstName} ${adminEmployee.official.lastName}`.trim()
      : requestingUser.email || 'Unknown Admin'

    const award = await prisma.award.create({
      data: {
        title,
        description,
        awardType: awardType as any,
        recipientId,
        recipientName,
        issuedBy: requestingUser.id,
        issuedByName,
        certificateUrl: certificateUrl || null,
        badgeIcon: badgeIcon || null,
        isPublic: isPublic !== undefined ? isPublic : true
      }
    })

    logger.info(`Award created: ${award.id} by ${requestingUser.email} for ${recipientName}`)
    return res.status(201).json(award)
  } catch (err: any) {
    logger.error('Create award error:', err)
    return res.status(500).json({ error: 'Failed to create award', details: err?.message })
  }
}

// Update award - Admin only
export const updateAward = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const requestingUser = req.user
    const { title, description, awardType, certificateUrl, badgeIcon, isPublic } = req.body

    // Only admins can update awards
    if (requestingUser?.role !== 'global_admin') {
      return res.status(403).json({ 
        error: 'Only admins can update awards' 
      })
    }

    const award = await prisma.award.findUnique({
      where: { id }
    })

    if (!award) {
      return res.status(404).json({ error: 'Award not found' })
    }

    const updateData: any = {}

    if (title) updateData.title = title
    if (description) updateData.description = description
    if (awardType) {
      const validAwardTypes = ['certificate', 'appreciation', 'achievement', 'milestone', 'recognition']
      if (!validAwardTypes.includes(awardType)) {
        return res.status(400).json({ 
          error: `Invalid award type. Must be one of: ${validAwardTypes.join(', ')}` 
        })
      }
      updateData.awardType = awardType
    }
    if (certificateUrl !== undefined) updateData.certificateUrl = certificateUrl
    if (badgeIcon !== undefined) updateData.badgeIcon = badgeIcon
    if (isPublic !== undefined) updateData.isPublic = isPublic

    const updatedAward = await prisma.award.update({
      where: { id },
      data: updateData
    })

    logger.info(`Award updated: ${id} by ${requestingUser.email}`)
    return res.json(updatedAward)
  } catch (err: any) {
    logger.error('Update award error:', err)
    return res.status(500).json({ error: 'Failed to update award', details: err?.message })
  }
}

// Delete award - Admin only
export const deleteAward = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const requestingUser = req.user

    // Only admins can delete awards
    if (requestingUser?.role !== 'global_admin') {
      return res.status(403).json({ 
        error: 'Only admins can delete awards' 
      })
    }

    const award = await prisma.award.findUnique({
      where: { id }
    })

    if (!award) {
      return res.status(404).json({ error: 'Award not found' })
    }

    await prisma.award.delete({
      where: { id }
    })

    logger.info(`Award deleted: ${id} by ${requestingUser.email}`)
    return res.json({ message: 'Award deleted successfully' })
  } catch (err: any) {
    logger.error('Delete award error:', err)
    return res.status(500).json({ error: 'Failed to delete award', details: err?.message })
  }
}

// Get award statistics (Admin only)
export const getAwardStatistics = async (req: Request, res: Response) => {
  try {
    const requestingUser = req.user

    // Only admins can view statistics
    if (requestingUser?.role !== 'global_admin') {
      return res.status(403).json({ 
        error: 'Only admins can view award statistics' 
      })
    }

    const totalAwards = await prisma.award.count()
    
    const awardsByType = await prisma.award.groupBy({
      by: ['awardType'],
      _count: true
    })

    const recentAwards = await prisma.award.findMany({
      take: 5,
      orderBy: { celebrationDate: 'desc' },
      select: {
        id: true,
        title: true,
        recipientName: true,
        awardType: true,
        celebrationDate: true
      }
    })

    const topRecipients = await prisma.award.groupBy({
      by: ['recipientId', 'recipientName'],
      _count: true,
      orderBy: {
        _count: {
          recipientId: 'desc'
        }
      },
      take: 10
    })

    logger.info(`Award statistics fetched by ${requestingUser.email}`)
    return res.json({
      totalAwards,
      awardsByType,
      recentAwards,
      topRecipients
    })
  } catch (err: any) {
    logger.error('Get award statistics error:', err)
    return res.status(500).json({ error: 'Failed to fetch award statistics', details: err?.message })
  }
}

