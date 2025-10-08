import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import * as bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

export const getInvitation = async (req: Request, res: Response) => {
  try {
    const { token } = req.params
    if (!token) {
      return res.status(400).json({ error: 'Token is required' })
    }

    const invitation = await prisma.userInvitation.findUnique({
      where: { token }
    })

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' })
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation already used or expired' })
    }

    if (invitation.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invitation expired' })
    }

    const user = await prisma.user.findUnique({ where: { email: invitation.email }, select: { name: true } })
    return res.json({
      name:user?.name,
      email: invitation.email,
      role: invitation.role,
    })
  } catch (err: any) {
    console.error('Get invitation error:', err)
    return res.status(500).json({ error: 'Failed to fetch invitation', details: err?.message })
  }
}

export const acceptInvitation = async (req: Request, res: Response) => {
  try {
    const { token, password, name } = req.body || {}
    // Original payload (commented out to preserve for future use):
    // const { token, password, personalInfo, bankAccount } = req.body || {}
    if (!token || !password) {
      return res.status(400).json({ error: 'token and password are required' })
    }

    const invitation = await prisma.userInvitation.findUnique({ where: { token } })
    if (!invitation) return res.status(404).json({ error: 'Invitation not found' })
    if (invitation.status !== 'pending') return res.status(400).json({ error: 'Invitation not pending' })
    if (invitation.expiresAt < new Date()) return res.status(400).json({ error: 'Invitation expired' })

    const hashed = await bcrypt.hash(password, 10)

    // Upsert user by email - Only user details (name, email, role, password)
    const user = await prisma.user.upsert({
      where: { email: invitation.email },
      update: { password: hashed, role: invitation.role, name: name ?? undefined },
      create: {
        email: invitation.email,
        password: hashed,
        role: invitation.role,
        name: name ?? 'New User',
      },
    })

    // Employee-related updates are intentionally disabled in this flow
    // Full original implementation preserved below (commented out):
    // if (invitation.employeeId) {
    //   // connect user to employee
    //   await prisma.user.update({
    //     where: { id: user.id },
    //     data: { employee: { connect: { id: invitation.employeeId } } },
    //   })
    //
    //   // create personal info
    //   await prisma.employeePersonal.upsert({
    //     where: { employeeId: invitation.employeeId },
    //     update: {
    //       firstName: personalInfo?.firstName ?? undefined,
    //       lastName: personalInfo?.lastName ?? undefined,
    //       gender: personalInfo?.gender ?? undefined,
    //       dateOfBirth: personalInfo?.dateOfBirth ? new Date(personalInfo.dateOfBirth) : undefined,
    //       maritalStatus: personalInfo?.maritalStatus ?? undefined,
    //       nationality: personalInfo?.nationality ?? undefined,
    //       primaryCitizenship: personalInfo?.primaryCitizenship ?? undefined,
    //       phoneNumber: personalInfo?.phoneNumber ?? undefined,
    //       personalEmail: personalInfo?.personalEmail ?? undefined,
    //     },
    //     create: {
    //       employeeId: invitation.employeeId,
    //       firstName: personalInfo?.firstName ?? null,
    //       lastName: personalInfo?.lastName ?? null,
    //       gender: personalInfo?.gender ?? null,
    //       dateOfBirth: personalInfo?.dateOfBirth ? new Date(personalInfo.dateOfBirth) : null,
    //       maritalStatus: personalInfo?.maritalStatus ?? null,
    //       nationality: personalInfo?.nationality ?? null,
    //       primaryCitizenship: personalInfo?.primaryCitizenship ?? null,
    //       phoneNumber: personalInfo?.phoneNumber ?? null,
    //       personalEmail: personalInfo?.personalEmail ?? null,
    //     },
    //   })
    //
    //   if (bankAccount) {
    //     await prisma.bankAccount.upsert({
    //       where: { employeeId: invitation.employeeId },
    //       update: {
    //         bankName: bankAccount.bankName ?? undefined,
    //         accountNumber: bankAccount.accountNumber ?? undefined,
    //         ifscCode: bankAccount.ifscCode ?? undefined,
    //         country: bankAccount.country ?? undefined,
    //         modifiedDate: new Date(),
    //       },
    //       create: {
    //         employeeId: invitation.employeeId,
    //         bankName: bankAccount.bankName ?? null,
    //         accountNumber: bankAccount.accountNumber ?? null,
    //         ifscCode: bankAccount.ifscCode ?? null,
    //         country: bankAccount.country ?? null,
    //         modifiedDate: new Date(),
    //       },
    //     })
    //   }
    // }

    await prisma.userInvitation.update({ where: { id: invitation.id }, data: { status: 'used', usedAt: new Date() } })

    return res.json({
      message: 'Invitation accepted',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
  } catch (err: any) {
    console.error('Accept invitation error:', err)
    return res.status(500).json({ error: 'Failed to accept invitation', details: err?.message })
  }
}

export const createInvitation = async (req: Request, res: Response) => {
  try {
    const { email, role, createdByUserId } = req.body || {}
    if (!email || !role || !createdByUserId) {
      return res.status(400).json({ error: 'email, role, createdByUserId are required' })
    }

    // Ensure creator exists (FK constraint)
    const creator = await prisma.user.findUnique({ where: { id: createdByUserId } })
    if (!creator) {
      await prisma.user.create({
        data: {
          id: createdByUserId,
          email: `${createdByUserId}@example.local`,
          name: 'System User',
          role: 'global_admin',
        },
      })
    }

    const token = randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const invitation = await prisma.userInvitation.create({
      data: {
        token,
        email,
        role,
        createdById: createdByUserId,
        expiresAt,
      },
    })

    return res.status(201).json({ invitation })
  } catch (err: any) {
    console.error('Create invitation error:', err)
    return res.status(500).json({ error: 'Failed to create invitation', details: err?.message })
  }
}
