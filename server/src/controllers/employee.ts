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

// Helper to map DB rows to frontend-friendly profile shape
const mapEmployeeToProfile = (e: any) => {
  const official = e.official || {}
  const personal = e.personal || {}
  const bank = e.bankAccount || {}
  const retiral = e.retiral || {}
  const passport = e.passport || {}
  const identity = e.identity || {}

  return {
    avatar: e.avatar || '',
    name: [official.firstName, official.lastName].filter(Boolean).join(' ') || '',
    position: official.designation || '',
    department: official.unit || '',
    employeeId: e.employeeId,
    personalInfo: {
      firstName: personal.firstName || '',
      lastName: personal.lastName || '',
      gender: personal.gender || '',
      dateOfBirth: personal.dateOfBirth ? new Date(personal.dateOfBirth).toISOString().slice(0, 10) : '',
      maritalStatus: personal.maritalStatus || '',
      nationality: personal.nationality || '',
      primaryCitizenship: personal.primaryCitizenship || '',
      phoneNumber: personal.phoneNumber || '',
      email: personal.personalEmail || '',
      addresses: {
        present: {
          contactName: '',
          address1: '',
          city: '', state: '', country: '', pinCode: '',
          mobileNumber: '', alternativeMobile: '', area: '', landmark: '', latitude: '', longitude: ''
        },
        primary: {
          contactName: '',
          address1: '',
          city: '', state: '', country: '', pinCode: '',
          mobileNumber: '', alternativeMobile: '', area: '', landmark: '', latitude: '', longitude: ''
        },
        emergency: {
          contactName: '', relation: '', phoneNumber: '',
          address: { address1: '', city: '', state: '', country: '', pinCode: '' }
        }
      },
      passport: {
        passportNumber: passport.passportNumber || '',
        expiryDate: passport.expiryDate ? new Date(passport.expiryDate).toISOString().slice(0, 10) : '',
        issuingOffice: passport.issuingOffice || '',
        issuingCountry: passport.issuingCountry || '',
        contactNumber: passport.contactNumber || '',
        address: passport.address || ''
      },
      identityNumbers: {
        aadharNumber: identity.aadhar || '',
        panNumber: identity.pan || '',
        nsr: { itpin: identity.nsrItpin || '', tin: identity.nsrTin || '' }
      },
      dependents: e.dependents?.map((d: any) => ({
        relation: d.relation || 'other',
        name: d.name || '',
        nationality: d.nationality || '',
        dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth).toISOString().slice(0, 10) : '',
        occupation: d.occupation || '',
        relationEmployeeNumber: d.relationEmployeeNumber || '',
        passport: d.passport || '',
        address: d.address || ''
      })) || [],
      education: e.educations?.map((ed: any) => ({
        branch: ed.branch || '',
        instituteName: ed.instituteName || '',
        passoutYear: ed.passoutYear || '',
        qualification: ed.qualification || '',
        universityName: ed.universityName || '',
        level: ed.level || 'ug'
      })) || [],
      experience: e.experiences?.map((ex: any) => ({
        country: ex.country || '',
        organisationName: ex.organisationName || '',
        fromDate: ex.fromDate ? new Date(ex.fromDate).toISOString().slice(0, 10) : '',
        toDate: ex.toDate ? new Date(ex.toDate).toISOString().slice(0, 10) : '',
        designation: ex.designation || '',
        city: ex.city || '',
        documentProof: ex.documentProof || ''
      })) || []
    },
    officialInfo: {
      firstName: official.firstName || '',
      lastName: official.lastName || '',
      knownAs: official.knownAs || '',
      dateOfJoining: e.joinDate ? new Date(e.joinDate).toISOString().slice(0, 10) : '',
      jobConfirmation: official.jobConfirmation || false,
      role: e.user?.role || '',
      designation: official.designation || '',
      stream: official.stream || '',
      subStream: official.subStream || '',
      baseLocation: official.baseLocation || '',
      currentLocation: official.currentLocation || '',
      unit: official.unit || '',
      unitHead: official.unitHead || '',
      confirmationDetails: official.confirmationDate || official.approval || official.rating ? {
        status: official.jobConfirmation ? 'Confirmed' : 'Pending',
        confirmationDate: official.confirmationDate ? new Date(official.confirmationDate).toISOString().slice(0, 10) : '',
        approval: official.approval || '',
        rating: official.rating ?? 0
      } : {
        status: '', confirmationDate: '', approval: '', rating: 0
      },
      documents: e.documents?.map((d: any) => ({
        name: d.name, type: d.type, uploadDate: d.uploadDate, size: d.size, uploadedBy: d.uploadedBy, url: d.url
      })) || []
    },
    financialInfo: {
      bankAccount: {
        bankName: bank.bankName || '',
        accountNumber: bank.accountNumber || '',
        ifscCode: bank.ifscCode || '',
        branchName: bank.country || ''
      },
      retiral: {
        basicSalary: retiral.basicSalary ?? 0,
        houseRentAllowance: retiral.houseRentAllowance ?? 0,
        specialAllowance: retiral.specialAllowance ?? 0,
        employerPF: retiral.employerPF ?? 0,
        employerESI: retiral.employerESI ?? 0,
        employeePF: retiral.employeePF ?? 0,
        employeeESI: retiral.employeeESI ?? 0,
        professionalTax: retiral.professionalTax ?? 0,
        incomeTax: retiral.incomeTax ?? 0,
        netTakeHome: retiral.netTakeHome ?? 0,
        costToCompany: retiral.costToCompany ?? 0,
        pfTotal: retiral.pfTotal ?? 0,
      }
    }
  }
}

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        official: true,
        user: true,
      }
    })
    const result = employees.map(e => mapEmployeeToProfile(e))
    return res.json({ employees: result })
  } catch (err: any) {
    console.error('Get employees error:', err)
    return res.status(500).json({ error: 'Failed to fetch employees', details: err?.message })
  }
}

export const getEmployeeByEmployeeId = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    if (!employeeId) return res.status(400).json({ error: 'employeeId is required' })

    const employee = await prisma.employee.findUnique({
      where: { employeeId },
      include: {
        user: true,
        official: true,
        personal: true,
        bankAccount: true,
        retiral: true,
        addresses: true,
        passport: true,
        identity: true,
        documents: true,
        dependents: true,
        educations: true,
        experiences: true,
      }
    })

    if (!employee) {
      // Return empty-compatible profile so frontend shows blanks
      return res.status(200).json({ employee: mapEmployeeToProfile({ employeeId, official: {}, personal: {} }) })
    }

    const profile = mapEmployeeToProfile(employee)
    return res.json({ employee: profile })
  } catch (err: any) {
    console.error('Get employee by id error:', err)
    return res.status(500).json({ error: 'Failed to fetch employee', details: err?.message })
  }
}