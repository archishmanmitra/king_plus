import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const router = Router()

// Accept invitation: create/update user with password; fill personal and bank info
// Expected payload:
// {
//   token: string,
//   password: string,
//   personalInfo: { firstName?, lastName?, gender?, dateOfBirth?, maritalStatus?, nationality?, primaryCitizenship?, phoneNumber?, personalEmail? },
//   bankAccount: { bankName?, accountNumber?, ifscCode?, country? }
// }
router.post('/accept', async (req: Request, res: Response) => {
  try {
    const { token, password, personalInfo, bankAccount } = req.body || {}
    if (!token || !password) {
      return res.status(400).json({ error: 'token and password are required' })
    }

    const invitation = await prisma.userInvitation.findUnique({ where: { token } })
    if (!invitation) return res.status(404).json({ error: 'Invitation not found' })
    if (invitation.status !== 'pending') return res.status(400).json({ error: 'Invitation not pending' })
    if (invitation.expiresAt < new Date()) return res.status(400).json({ error: 'Invitation expired' })

    const hashed = await bcrypt.hash(password, 10)

    // Upsert user by email
    const user = await prisma.user.upsert({
      where: { email: invitation.email },
      update: { password: hashed, role: invitation.role },
      create: { email: invitation.email, password: hashed, role: invitation.role },
    })

    if (invitation.employeeId) {
      // connect user to employee
      await prisma.user.update({
        where: { id: user.id },
        data: { employee: { connect: { id: invitation.employeeId } } },
      })

      // create personal info
      await prisma.employeePersonal.upsert({
        where: { employeeId: invitation.employeeId },
        update: {
          firstName: personalInfo?.firstName ?? undefined,
          lastName: personalInfo?.lastName ?? undefined,
          gender: personalInfo?.gender ?? undefined,
          dateOfBirth: personalInfo?.dateOfBirth ? new Date(personalInfo.dateOfBirth) : undefined,
          maritalStatus: personalInfo?.maritalStatus ?? undefined,
          nationality: personalInfo?.nationality ?? undefined,
          primaryCitizenship: personalInfo?.primaryCitizenship ?? undefined,
          phoneNumber: personalInfo?.phoneNumber ?? undefined,
          personalEmail: personalInfo?.personalEmail ?? undefined,
        },
        create: {
          employeeId: invitation.employeeId,
          firstName: personalInfo?.firstName ?? null,
          lastName: personalInfo?.lastName ?? null,
          gender: personalInfo?.gender ?? null,
          dateOfBirth: personalInfo?.dateOfBirth ? new Date(personalInfo.dateOfBirth) : null,
          maritalStatus: personalInfo?.maritalStatus ?? null,
          nationality: personalInfo?.nationality ?? null,
          primaryCitizenship: personalInfo?.primaryCitizenship ?? null,
          phoneNumber: personalInfo?.phoneNumber ?? null,
          personalEmail: personalInfo?.personalEmail ?? null,
        },
      })

      if (bankAccount) {
        await prisma.bankAccount.upsert({
          where: { employeeId: invitation.employeeId },
          update: {
            bankName: bankAccount.bankName ?? undefined,
            accountNumber: bankAccount.accountNumber ?? undefined,
            ifscCode: bankAccount.ifscCode ?? undefined,
            country: bankAccount.country ?? undefined,
            modifiedDate: new Date(),
          },
          create: {
            employeeId: invitation.employeeId,
            bankName: bankAccount.bankName ?? null,
            accountNumber: bankAccount.accountNumber ?? null,
            ifscCode: bankAccount.ifscCode ?? null,
            country: bankAccount.country ?? null,
            modifiedDate: new Date(),
          },
        })
      }
    }

    await prisma.userInvitation.update({ where: { id: invitation.id }, data: { status: 'used', usedAt: new Date() } })

    return res.json({ message: 'Invitation accepted', userId: user.id })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to accept invitation', details: err?.message })
  }
})

export default router


