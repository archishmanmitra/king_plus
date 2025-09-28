import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { userDetails, officialInfo, financialInfo, createdByUserId } = req.body || {}

    if (!userDetails?.email || !userDetails?.role) {
      return res.status(400).json({ error: 'email and role are required in userDetails' })
    }
    if (!officialInfo?.firstName || !officialInfo?.lastName) {
      return res.status(400).json({ error: 'firstName and lastName are required in officialInfo' })
    }
    if (!createdByUserId) {
      return res.status(400).json({ error: 'createdByUserId is required' })
    }

    // Ensure createdBy user exists to satisfy foreign key on invitation
    const existingCreator = await prisma.user.findUnique({ where: { id: createdByUserId } })
    if (!existingCreator) {
      await prisma.user.create({
        data: {
          id: createdByUserId,
          email: `${createdByUserId}@example.local`,
          name: 'System User',
          role: 'global_admin',
        },
      })
    }

    const employee = await prisma.employee.create({
      data: {
        employeeId: `EMP${Date.now()}`,
        joinDate: new Date(),
        status: 'pending',
      },
    })

    await prisma.employeeOfficial.create({
      data: {
        employeeId: employee.id,
        firstName: officialInfo.firstName,
        lastName: officialInfo.lastName,
        knownAs: officialInfo.knownAs ?? null,
        designation: null,
        stream: null,
        subStream: null,
        baseLocation: null,
        currentLocation: null,
        unit: null,
        unitHead: null,
        jobConfirmation: false,
        confirmationDate: null,
        approval: null,
        rating: null,
      },
    })

    if (financialInfo?.retiral) {
      await prisma.employeeRetiral.create({
        data: {
          employeeId: employee.id,
          pfTotal: financialInfo.retiral.pfTotal ?? 0,
          employeePF: financialInfo.retiral.employeePF ?? 0,
          employerPF: financialInfo.retiral.employerPF ?? 0,
          employeeESI: financialInfo.retiral.employeeESI ?? 0,
          employerESI: financialInfo.retiral.employerESI ?? 0,
          professionalTax: financialInfo.retiral.professionalTax ?? 0,
          incomeTax: financialInfo.retiral.incomeTax ?? 0,
          netTakeHome: financialInfo.retiral.netTakeHome ?? 0,
          costToCompany: financialInfo.retiral.costToCompany ?? 0,
          basicSalary: financialInfo.retiral.basicSalary ?? 0,
          houseRentAllowance: financialInfo.retiral.houseRentAllowance ?? 0,
          specialAllowance: financialInfo.retiral.specialAllowance ?? 0,
        },
      })
    }

    const token = randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const invitation = await prisma.userInvitation.create({
      data: {
        token,
        email: userDetails.email,
        role: userDetails.role,
        employeeId: employee.id,
        createdById: createdByUserId,
        expiresAt,
      },
    })

    return res.status(201).json({ employee, invitation })
  } catch (err: any) {
    console.error('Employee creation error:', err)
    return res.status(500).json({ error: 'Failed to create employee', details: err?.message })
  }
}
