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

    const newEmpId = randomUUID()
    const employee = await prisma.employee.create({
      data: {
        id: newEmpId,
        employeeId: newEmpId,
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
  const user = e.user || {}
  const bank = e.bankAccount || {}
  const retiral = e.retiral || {}
  const passport = e.passport || {}
  const identity = e.identity || {}
  const manager = e.manager || {}
  const directReports = e.directReports || []

  return {
    id: e.id,
    avatar: e.avatar || '',
    name: [official.firstName, official.lastName].filter(Boolean).join(' ') || user.name || '',
    email: user.email || personal.personalEmail || '',
    phone: personal.phoneNumber || '',
    position: official.designation || '',
    department: official.unit || '', // unit from EmployeeOfficial
    manager: manager.official ? [manager.official.firstName, manager.official.lastName].filter(Boolean).join(' ') : '',
    managerId: e.managerId || null,
    joinDate: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
    status: 'active',
    employeeId: e.employeeId,
    directReports: directReports.map((report: any) => ({
      id: report.id,
      employeeId: report.employeeId,
      name: [report.official?.firstName, report.official?.lastName].filter(Boolean).join(' ') || report.user?.name || '',
      email: report.user?.email || report.personal?.personalEmail || '',
      position: report.official?.designation || '',
      department: report.official?.unit || '',
      avatar: report.avatar || ''
    })),
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
        personal: true,
        manager: {
          include: {
            official: true,
            user: true
          }
        },
        directReports: {
          include: {
            official: true,
            user: true,
            personal: true
          }
        }
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

// Assign or change an employee's manager (set managerId or null)
export const assignManager = async (req: Request, res: Response) => {
  try {
    const { id } = req.params // employees.id
    const { managerId } = req.body as { managerId?: string | null }

    if (!id) return res.status(400).json({ error: 'Employee id is required' })

    const employee = await prisma.employee.findUnique({ where: { id } })
    if (!employee) return res.status(404).json({ error: 'Employee not found' })

    if (managerId) {
      if (managerId === id) return res.status(400).json({ error: 'Employee cannot be their own manager' })
      const manager = await prisma.employee.findUnique({ where: { id: managerId } })
      if (!manager) return res.status(404).json({ error: 'Manager not found' })
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: { managerId: managerId ?? null },
      include: { 
        official: true, 
        user: true,
        manager: {
          include: {
            official: true,
            user: true
          }
        },
        directReports: {
          include: {
            official: true,
            user: true,
            personal: true
          }
        }
      }
    })

    const profile = mapEmployeeToProfile(updated)
    return res.json({ employee: profile })
  } catch (err: any) {
    console.error('Assign manager error:', err)
    return res.status(500).json({ error: 'Failed to assign manager', details: err?.message })
  }
}

// Team reassignment - assign multiple direct reports to a manager
export const reassignTeam = async (req: Request, res: Response) => {
  try {
    const { managerId, directReportIds } = req.body as { 
      managerId: string | null, 
      directReportIds: string[] 
    }

    if (!directReportIds || !Array.isArray(directReportIds)) {
      return res.status(400).json({ error: 'directReportIds array is required' })
    }

    // Validate manager exists if provided
    let manager = null
    if (managerId) {
      manager = await prisma.employee.findUnique({ 
        where: { id: managerId },
        include: {
          official: true,
          user: true
        }
      })
      if (!manager) return res.status(404).json({ error: 'Manager not found' })
    }

    // Validate all direct reports exist
    const directReports = await prisma.employee.findMany({
      where: { id: { in: directReportIds } },
      include: {
        official: true,
        user: true,
        personal: true
      }
    })

    if (directReports.length !== directReportIds.length) {
      return res.status(404).json({ error: 'One or more direct reports not found' })
    }

    // Check for circular references
    if (managerId && directReportIds.includes(managerId)) {
      return res.status(400).json({ error: 'Manager cannot be assigned as their own direct report' })
    }

    // Update all direct reports to have the new manager
    // This sets the managerId field to point to the manager's employee ID
    await prisma.employee.updateMany({
      where: { id: { in: directReportIds } },
      data: { managerId: managerId ?? null }
    })

    // Return updated manager with their complete team
    let result = null
    if (managerId) {
      result = await prisma.employee.findUnique({
        where: { id: managerId },
        include: {
          official: true,
          user: true,
          personal: true,
          manager: {
            include: {
              official: true,
              user: true
            }
          },
          directReports: {
            include: {
              official: true,
              user: true,
              personal: true
            }
          }
        }
      })
    }

    // Also return the updated direct reports with their new manager information
    const updatedDirectReports = await prisma.employee.findMany({
      where: { id: { in: directReportIds } },
      include: {
        official: true,
        user: true,
        personal: true,
        manager: {
          include: {
            official: true,
            user: true
          }
        },
        directReports: {
          include: {
            official: true,
            user: true,
            personal: true
          }
        }
      }
    })

    return res.json({ 
      manager: result ? mapEmployeeToProfile(result) : null,
      directReports: updatedDirectReports.map(emp => mapEmployeeToProfile(emp)),
      message: `Successfully reassigned ${directReportIds.length} employees`
    })
  } catch (err: any) {
    console.error('Team reassignment error:', err)
    return res.status(500).json({ error: 'Failed to reassign team', details: err?.message })
  }
}

// Get direct reports for a given manager (employees where managerId == id)
export const getDirectReports = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) return res.status(400).json({ error: 'Manager id is required' })

    const reports = await prisma.employee.findMany({
      where: { managerId: id },
      include: { user: true, official: true, personal: true },
    })
    return res.json({ employees: reports })
  } catch (err: any) {
    console.error('Get direct reports error:', err)
    return res.status(500).json({ error: 'Failed to fetch direct reports', details: err?.message })
  }
}

// Get a team tree up to 3 levels deep for a manager
export const getTeamTree = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) return res.status(400).json({ error: 'Manager id is required' })

    const tree = await prisma.employee.findUnique({
      where: { id },
      include: {
        official: true,
        user: true,
        personal: true,
        directReports: {
          include: {
            official: true,
            user: true,
            personal: true,
            directReports: {
              include: {
                official: true,
                user: true,
                personal: true,
                directReports: {
                  include: { 
                    official: true,
                    user: true,
                    personal: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!tree) return res.status(404).json({ error: 'Manager not found' })
    return res.json({ team: tree })
  } catch (err: any) {
    console.error('Get team tree error:', err)
    return res.status(500).json({ error: 'Failed to fetch team tree', details: err?.message })
  }
}

// Get org chart starting from top-level employees (managerId == null)
export const getOrgChart = async (_req: Request, res: Response) => {
  try {
    const org = await prisma.employee.findMany({
      where: { managerId: null },
      include: {
        official: true,
        user: true,
        personal: true,
        directReports: {
          include: {
            official: true,
            user: true,
            personal: true,
            directReports: {
              include: {
                official: true,
                user: true,
                personal: true,
                directReports: { 
                  include: { 
                    official: true,
                    user: true,
                    personal: true
                  } 
                }
              }
            }
          }
        }
      }
    })
    return res.json({ org })
  } catch (err: any) {
    console.error('Get org chart error:', err)
    return res.status(500).json({ error: 'Failed to fetch org chart', details: err?.message })
  }
}

// Get all team member IDs under a manager using recursive SQL
export const getAllTeamMembers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) return res.status(400).json({ error: 'Manager id is required' })

    const result = await prisma.$queryRaw<Array<{ id: string }>>`
      WITH RECURSIVE team_tree AS (
        SELECT id, "managerId"
        FROM employees
        WHERE "managerId" = ${id}
        UNION ALL
        SELECT e.id, e."managerId"
        FROM employees e
        INNER JOIN team_tree tt ON e."managerId" = tt.id
      )
      SELECT id FROM team_tree;
    `
    return res.json({ memberIds: result.map(r => r.id) })
  } catch (err: any) {
    console.error('Get all team members error:', err)
    return res.status(500).json({ error: 'Failed to fetch team members', details: err?.message })
  }
}

// Get employee by user ID - returns employee data if linked, otherwise returns user data only
export const getEmployeeByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    if (!userId) return res.status(400).json({ error: 'userId is required' })

    // First, find the user
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: {
        employee: {
          include: {
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
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // If user has no linked employee, return user data only
    if (!user.employeeId || !user.employee) {
      return res.json({ 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        employee: null
      })
    }

    // If user has linked employee, return full employee profile
    const profile = mapEmployeeToProfile(user.employee)
    return res.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      employee: profile
    })
  } catch (err: any) {
    console.error('Get employee by user ID error:', err)
    return res.status(500).json({ error: 'Failed to fetch employee by user ID', details: err?.message })
  }
}

export const updateEmployeeProfile = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    if (!employeeId) return res.status(400).json({ error: 'employeeId is required' })

    // Resolve target by users.id only (contract: route param is the user id).
    const asUser = await prisma.user.findUnique({ where: { id: employeeId } })
    if (!asUser) return res.status(404).json({ error: 'User not found' })

    let employee = null as any
    if (asUser.employeeId) {
      employee = await prisma.employee.findUnique({ where: { id: asUser.employeeId } })
    }
    if (!employee) {
      // Create minimal employee and link to user; use user.id as business employeeId
      employee = await prisma.employee.create({ data: { employeeId: asUser.id } })
      await prisma.user.update({ where: { id: asUser.id }, data: { employeeId: employee.id } })
    }

    // Authorization: non-admins can only update their own profile and only certain sections
    const requestingUser = req.user
    let isAdmin = false
    if (requestingUser) {
      isAdmin = requestingUser.role === 'global_admin' || requestingUser.role === 'hr_manager'
    }

    if (!isAdmin) {
      const user = await prisma.user.findUnique({ where: { id: requestingUser?.id } })
      if (!user || user.employeeId !== employee.id) {
        return res.status(403).json({ error: 'You can only update your own profile' })
      }
    }

    const body = req.body || {}
    const updates: any = {}

    // Official info - admin only or self with admin role per business rule
    if (body.officialInfo) {
      if (!isAdmin) {
        return res.status(403).json({ error: 'Only HR/Admin can update official information' })
      }
      const o = body.officialInfo
      await prisma.employeeOfficial.upsert({
        where: { employeeId: employee.id },
        update: {
          firstName: o.firstName ?? undefined,
          lastName: o.lastName ?? undefined,
          knownAs: o.knownAs ?? undefined,
          designation: o.designation ?? undefined,
          stream: o.stream ?? undefined,
          subStream: o.subStream ?? undefined,
          baseLocation: o.baseLocation ?? undefined,
          currentLocation: o.currentLocation ?? undefined,
          unit: o.unit ?? undefined,
          unitHead: o.unitHead ?? undefined,
          jobConfirmation: o.jobConfirmation ?? undefined,
          confirmationDate: o.confirmationDetails?.confirmationDate ? new Date(o.confirmationDetails.confirmationDate) : undefined,
          approval: o.confirmationDetails?.approval ?? undefined,
          rating: o.confirmationDetails?.rating ?? undefined,
        },
        create: {
          employeeId: employee.id,
          firstName: o.firstName || '',
          lastName: o.lastName || '',
          knownAs: o.knownAs || null,
          designation: o.designation || null,
          stream: o.stream || null,
          subStream: o.subStream || null,
          baseLocation: o.baseLocation || null,
          currentLocation: o.currentLocation || null,
          unit: o.unit || null,
          unitHead: o.unitHead || null,
          jobConfirmation: !!o.jobConfirmation,
          confirmationDate: o.confirmationDetails?.confirmationDate ? new Date(o.confirmationDetails.confirmationDate) : null,
          approval: o.confirmationDetails?.approval || null,
          rating: typeof o.confirmationDetails?.rating === 'number' ? o.confirmationDetails.rating : null,
        }
      })
    }

    // Personal info - self editable by any user; HR/Admin can edit anyone
    if (body.personalInfo) {
      const p = body.personalInfo
      await prisma.employeePersonal.upsert({
        where: { employeeId: employee.id },
        update: {
          firstName: p.firstName ?? undefined,
          lastName: p.lastName ?? undefined,
          gender: p.gender ?? undefined,
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : undefined,
          maritalStatus: p.maritalStatus ?? undefined,
          nationality: p.nationality ?? undefined,
          primaryCitizenship: p.primaryCitizenship ?? undefined,
          phoneNumber: p.phoneNumber ?? undefined,
          personalEmail: p.email ?? undefined,
        },
        create: {
          employeeId: employee.id,
          firstName: p.firstName || null,
          lastName: p.lastName || null,
          gender: p.gender || null,
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : null,
          maritalStatus: p.maritalStatus || null,
          nationality: p.nationality || null,
          primaryCitizenship: p.primaryCitizenship || null,
          phoneNumber: p.phoneNumber || null,
          personalEmail: p.email || null,
        }
      })
    }

    // Bank Account - self editable
    if (body.financialInfo?.bankAccount) {
      const b = body.financialInfo.bankAccount
      await prisma.bankAccount.upsert({
        where: { employeeId: employee.id },
        update: {
          bankName: b.bankName ?? undefined,
          accountNumber: b.accountNumber ?? undefined,
          ifscCode: b.ifscCode ?? undefined,
          country: b.branchName ?? undefined,
          modifiedDate: new Date(),
        },
        create: {
          employeeId: employee.id,
          bankName: b.bankName || null,
          accountNumber: b.accountNumber || null,
          ifscCode: b.ifscCode || null,
          country: b.branchName || null,
          modifiedDate: new Date(),
        }
      })
    }

    // Retiral - admin only
    if (body.financialInfo?.retiral) {
      if (!isAdmin) {
        return res.status(403).json({ error: 'Only HR/Admin can update retiral information' })
      }
      const r = body.financialInfo.retiral
      await prisma.employeeRetiral.upsert({
        where: { employeeId: employee.id },
        update: {
          pfTotal: r.pfTotal ?? undefined,
          employeePF: r.employeePF ?? undefined,
          employerPF: r.employerPF ?? undefined,
          employeeESI: r.employeeESI ?? undefined,
          employerESI: r.employerESI ?? undefined,
          professionalTax: r.professionalTax ?? undefined,
          incomeTax: r.incomeTax ?? undefined,
          netTakeHome: r.netTakeHome ?? undefined,
          costToCompany: r.costToCompany ?? undefined,
          basicSalary: r.basicSalary ?? undefined,
          houseRentAllowance: r.houseRentAllowance ?? undefined,
          specialAllowance: r.specialAllowance ?? undefined,
        },
        create: {
          employeeId: employee.id,
          pfTotal: r.pfTotal ?? 0,
          employeePF: r.employeePF ?? 0,
          employerPF: r.employerPF ?? 0,
          employeeESI: r.employeeESI ?? 0,
          employerESI: r.employerESI ?? 0,
          professionalTax: r.professionalTax ?? 0,
          incomeTax: r.incomeTax ?? 0,
          netTakeHome: r.netTakeHome ?? 0,
          costToCompany: r.costToCompany ?? 0,
          basicSalary: r.basicSalary ?? 0,
          houseRentAllowance: r.houseRentAllowance ?? 0,
          specialAllowance: r.specialAllowance ?? 0,
        }
      })
    }

    // Passport
    if (body.personalInfo?.passport) {
      const pp = body.personalInfo.passport
      await prisma.passport.upsert({
        where: { employeeId: employee.id },
        update: {
          passportNumber: pp.passportNumber ?? undefined,
          expiryDate: pp.expiryDate ? new Date(pp.expiryDate) : undefined,
          issuingOffice: pp.issuingOffice ?? undefined,
          issuingCountry: pp.issuingCountry ?? undefined,
          contactNumber: pp.contactNumber ?? undefined,
          address: pp.address ?? undefined,
        },
        create: {
          employeeId: employee.id,
          passportNumber: pp.passportNumber || null,
          expiryDate: pp.expiryDate ? new Date(pp.expiryDate) : null,
          issuingOffice: pp.issuingOffice || null,
          issuingCountry: pp.issuingCountry || null,
          contactNumber: pp.contactNumber || null,
          address: pp.address || null,
        }
      })
    }

    // Identity Numbers
    if (body.personalInfo?.identityNumbers) {
      const idn = body.personalInfo.identityNumbers
      await prisma.identityNumbers.upsert({
        where: { employeeId: employee.id },
        update: {
          aadhar: idn.aadharNumber ?? undefined,
          pan: idn.panNumber ?? undefined,
          nsrItpin: idn.nsr?.itpin ?? undefined,
          nsrTin: idn.nsr?.tin ?? undefined,
        },
        create: {
          employeeId: employee.id,
          aadhar: idn.aadharNumber || null,
          pan: idn.panNumber || null,
          nsrItpin: idn.nsr?.itpin || null,
          nsrTin: idn.nsr?.tin || null,
        }
      })
    }

    // Addresses (present, primary, emergency) — replace-or-upsert by type when provided
    if (body.personalInfo?.addresses) {
      const a = body.personalInfo.addresses
      const saveAddr = async (type: 'present'|'primary'|'emergency', payload?: any) => {
        if (!payload) return
        const existing = await prisma.address.findFirst({ where: { employeeId: employee.id, type } })
        if (existing) {
          await prisma.address.update({
            where: { id: existing.id },
            data: {
              contactName: payload.contactName ?? undefined,
              address1: payload.address1 ?? undefined,
              city: payload.city ?? undefined,
              state: payload.state ?? undefined,
              country: payload.country ?? undefined,
              pinCode: payload.pinCode ?? undefined,
              mobileNumber: payload.mobileNumber ?? undefined,
              alternativeMobile: payload.alternativeMobile ?? undefined,
              area: payload.area ?? undefined,
              landmark: payload.landmark ?? undefined,
              latitude: payload.latitude ? Number(payload.latitude) : undefined,
              longitude: payload.longitude ? Number(payload.longitude) : undefined,
              relation: type === 'emergency' ? (payload.relation ?? undefined) : undefined,
              emergencyPhone: type === 'emergency' ? (payload.phoneNumber ?? undefined) : undefined,
            }
          })
        } else {
          await prisma.address.create({
            data: {
              employeeId: employee.id,
              type,
              contactName: payload.contactName || null,
              address1: payload.address1 || null,
              city: payload.city || null,
              state: payload.state || null,
              country: payload.country || null,
              pinCode: payload.pinCode || null,
              mobileNumber: payload.mobileNumber || null,
              alternativeMobile: payload.alternativeMobile || null,
              area: payload.area || null,
              landmark: payload.landmark || null,
              latitude: payload.latitude ? Number(payload.latitude) : null,
              longitude: payload.longitude ? Number(payload.longitude) : null,
              relation: type === 'emergency' ? (payload.relation || null) : null,
              emergencyPhone: type === 'emergency' ? (payload.phoneNumber || null) : null,
            }
          })
        }
      }
      await saveAddr('present', a.present)
      await saveAddr('primary', a.primary)
      await saveAddr('emergency', a.emergency)
    }

    // For arrays like dependents/education/experience, support full replace when provided
    if (Array.isArray(body.personalInfo?.dependents)) {
      await prisma.dependent.deleteMany({ where: { employeeId: employee.id } })
      if (body.personalInfo.dependents.length) {
        await prisma.dependent.createMany({ data: body.personalInfo.dependents.map((d: any) => ({
          employeeId: employee.id,
          relation: d.relation || 'other',
          name: d.name || '',
          nationality: d.nationality || '',
          dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth) : new Date(),
          occupation: d.occupation || null,
          relationEmployeeNumber: d.relationEmployeeNumber || null,
          passport: d.passport || null,
          address: d.address || null,
        })) })
      }
    }

    if (Array.isArray(body.personalInfo?.education)) {
      await prisma.education.deleteMany({ where: { employeeId: employee.id } })
      if (body.personalInfo.education.length) {
        await prisma.education.createMany({ data: body.personalInfo.education.map((ed: any) => ({
          employeeId: employee.id,
          branch: ed.branch || '',
          instituteName: ed.instituteName || '',
          passoutYear: ed.passoutYear || '',
          qualification: ed.qualification || '',
          universityName: ed.universityName || '',
          level: ed.level || 'ug',
        })) })
      }
    }

    if (Array.isArray(body.personalInfo?.experience)) {
      await prisma.experience.deleteMany({ where: { employeeId: employee.id } })
      if (body.personalInfo.experience.length) {
        await prisma.experience.createMany({ data: body.personalInfo.experience.map((ex: any) => ({
          employeeId: employee.id,
          country: ex.country || '',
          organisationName: ex.organisationName || '',
          fromDate: ex.fromDate ? new Date(ex.fromDate) : new Date(),
          toDate: ex.toDate ? new Date(ex.toDate) : null,
          designation: ex.designation || '',
          city: ex.city || '',
          documentProof: ex.documentProof || null,
        })) })
      }
    }

    // Return fresh copy
    const fresh = await prisma.employee.findUnique({
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
    const profile = mapEmployeeToProfile(fresh)
    return res.json({ employee: profile })
  } catch (err: any) {
    console.error('Update employee error:', err)
    return res.status(500).json({ error: 'Failed to update employee', details: err?.message })
  }
}