import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()
const router = Router()

// Create employee with official + retiral info and create a 24h invitation
// Expected payload:
// {
//   userDetails: { email: string, role: 'employee'|'manager'|'hr_manager'|'global_admin' },
//   officialInfo: { firstName, lastName, dateOfJoining, designation, ... },
//   financialInfo: { retiral: { ... } },
//   createdByUserId: string
// }
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userDetails, officialInfo, financialInfo, createdByUserId } = req.body || {}

    if (!userDetails?.email || !userDetails?.role) {
      return res.status(400).json({ error: 'email and role are required in userDetails' })
    }
    if (!officialInfo?.firstName || !officialInfo?.lastName || !officialInfo?.dateOfJoining) {
      return res.status(400).json({ error: 'firstName, lastName and dateOfJoining are required in officialInfo' })
    }
    if (!createdByUserId) {
      return res.status(400).json({ error: 'createdByUserId is required' })
    }

    const employee = await prisma.employee.create({
      data: {
        employeeId: `EMP${Date.now()}`,
        joinDate: new Date(officialInfo.dateOfJoining),
        status: 'active',
      },
    })

    await prisma.employeeOfficial.create({
      data: {
        employeeId: employee.id,
        firstName: officialInfo.firstName,
        lastName: officialInfo.lastName,
        knownAs: officialInfo.knownAs ?? null,
        designation: officialInfo.designation ?? null,
        stream: officialInfo.stream ?? null,
        subStream: officialInfo.subStream ?? null,
        baseLocation: officialInfo.baseLocation ?? null,
        currentLocation: officialInfo.currentLocation ?? null,
        unit: officialInfo.unit ?? null,
        unitHead: officialInfo.unitHead ?? null,
        jobConfirmation: !!officialInfo.jobConfirmation,
        confirmationDate: officialInfo.confirmationDetails?.confirmationDate
          ? new Date(officialInfo.confirmationDetails.confirmationDate)
          : null,
        approval: officialInfo.confirmationDetails?.approval ?? null,
        rating: typeof officialInfo.confirmationDetails?.rating === 'number'
          ? officialInfo.confirmationDetails.rating
          : null,
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
    return res.status(500).json({ error: 'Failed to create employee', details: err?.message })
  }
})

export default router


