import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        employee: {
          include: {
            official: true,
            personal: true
          }
        }
      }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (!user.password) {
      return res.status(401).json({ error: 'User has not set up password yet' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return res.json({
      token,
      user: userWithoutPassword
    })
  } catch (err: any) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Login failed', details: err?.message })
  }
}

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        employee: {
          include: {
            official: true,
            personal: true
          }
        }
      }
    })

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    const { password: _, ...userWithoutPassword } = user
    return res.json({ user: userWithoutPassword })
  } catch (err: any) {
    console.error('Token verification error:', err)
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export const setup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required' 
      })
    }

    // Check if any users exist
    const userCount = await prisma.user.count()
    
    // If users exist, prevent creating initial admin
    if (userCount > 0) {
      return res.status(403).json({ 
        error: 'Initial admin can only be created when no users exist' 
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the initial admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'global_admin',
        avatar: null,
        employeeId: null
      }
    })

    // Create a basic employee record for the admin
    const employee = await prisma.employee.create({
      data: {
        employeeId: `ADMIN${Date.now()}`,
        joinDate: new Date(),
        status: 'active'
      }
    })

    // Create official information for the admin
    await prisma.employeeOfficial.create({
      data: {
        employeeId: employee.id,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        knownAs: name,
        designation: 'System Administrator',
        stream: 'Administration',
        baseLocation: 'Head Office',
        currentLocation: 'Head Office',
        jobConfirmation: true,
        confirmationDate: new Date()
      }
    })

    // Connect user to employee
    await prisma.user.update({
      where: { id: user.id },
      data: { employeeId: employee.id }
    })

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    return res.status(201).json({
      message: 'Initial admin created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: name,
        employeeId: employee.employeeId
      }
    })
  } catch (err: any) {
    console.error('Setup error:', err)
    return res.status(500).json({ 
      error: 'Failed to create initial admin', 
      details: err?.message 
    })
  }
}
