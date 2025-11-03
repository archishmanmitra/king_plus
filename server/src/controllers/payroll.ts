import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import logger from '../logger/logger'

const prisma = new PrismaClient()

// Helper: Get payroll cycle dates (22nd of previous month to 21st of current month)
function getPayrollCycleDates(month: number, year: number) {
  // Cycle runs from 22nd of previous month to 21st of current month
  const cycleStartMonth = month === 1 ? 12 : month - 1
  const cycleStartYear = month === 1 ? year - 1 : year
  
  const cycleStart = new Date(cycleStartYear, cycleStartMonth - 1, 22, 0, 0, 0, 0)
  const cycleEnd = new Date(year, month - 1, 21, 23, 59, 59, 999)
  
  return { cycleStart, cycleEnd }
}

// Helper: Get all working days in payroll cycle (excluding Sundays)
function getWorkingDaysInCycle(cycleStart: Date, cycleEnd: Date): Date[] {
  const workingDays: Date[] = []
  const current = new Date(cycleStart)
  
  while (current <= cycleEnd) {
    // Exclude Sundays (0 = Sunday)
    if (current.getDay() !== 0) {
      workingDays.push(new Date(current.setHours(0, 0, 0, 0)))
    }
    current.setDate(current.getDate() + 1)
  }
  
  return workingDays
}

// Helper: Normalize date to start of day
function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// Get attendance sheet for an employee for a specific payroll cycle
export const getAttendanceSheet = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    const { month, year } = req.query
    
    if (!employeeId || !month || !year) {
      return res.status(400).json({ error: 'employeeId, month, and year are required' })
    }
    
    const payrollMonth = parseInt(month as string)
    const payrollYear = parseInt(year as string)
    
    const { cycleStart, cycleEnd } = getPayrollCycleDates(payrollMonth, payrollYear)
    const workingDays = getWorkingDaysInCycle(cycleStart, cycleEnd)
    
    // Get employee
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        user: true,
        official: true,
        retiral: true
      }
    })
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }
    
    // Get all attendance records for the cycle
    const attendances = await (prisma as any).attendance.findMany({
      where: {
        employeeId,
        workDate: {
          gte: cycleStart,
          lte: cycleEnd
        }
      },
      include: {
        timestamps: true
      },
      orderBy: { workDate: 'asc' }
    })
    
    // Get approved leaves in this cycle
    const approvedLeaves = await prisma.leaveRequest.findMany({
      where: {
        employeeId,
        status: 'approved',
        OR: [
          {
            AND: [
              { startDate: { lte: cycleEnd } },
              { endDate: { gte: cycleStart } }
            ]
          }
        ]
      }
    })
    
    // Create a map of attendance records by date
    const attendanceMap = new Map(
      attendances.map((att: any) => [
        startOfDay(new Date(att.workDate)).getTime(),
        att
      ])
    )
    
    // Create a set of leave dates
    const leaveDates = new Set<number>()
    approvedLeaves.forEach(leave => {
      const start = startOfDay(new Date(leave.startDate))
      const end = startOfDay(new Date(leave.endDate))
      const current = new Date(start)
      
      while (current <= end) {
        if (current.getDay() !== 0) { // Exclude Sundays
          leaveDates.add(current.getTime())
        }
        current.setDate(current.getDate() + 1)
      }
    })
    
    // Build attendance sheet
    const attendanceSheet = workingDays.map(day => {
      const dayTime = day.getTime()
      const attendance = attendanceMap.get(dayTime)
      const isOnLeave = leaveDates.has(dayTime)
      
      let status: 'present' | 'absent' | 'leave' = 'absent'
      const attendanceRecord = attendance as any
      if (isOnLeave) {
        status = 'leave'
      } else if (attendanceRecord && attendanceRecord.clockIn) {
        status = 'present'
      }
      
      return {
        date: day,
        status,
        clockIn: attendanceRecord?.clockIn || null,
        clockOut: attendanceRecord?.clockOut || null,
        totalHours: attendanceRecord?.totalHours || 0,
        isOnLeave
      }
    })
    
    // Calculate absent days (days without clock-in and not on leave)
    const absentDays = attendanceSheet.filter(day => day.status === 'absent').length
    const presentDays = attendanceSheet.filter(day => day.status === 'present').length
    const leaveDaysCount = attendanceSheet.filter(day => day.status === 'leave').length
    
    return res.json({
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        name: employee.user?.name || 'Unknown',
        designation: employee.official?.designation,
        basicSalary: employee.retiral?.basicSalary || 0
      },
      cycle: {
        start: cycleStart,
        end: cycleEnd,
        month: payrollMonth,
        year: payrollYear
      },
      summary: {
        totalWorkingDays: workingDays.length,
        presentDays,
        absentDays,
        leaveDays: leaveDaysCount
      },
      attendanceSheet
    })
  } catch (error) {
    logger.error("Error getting attendance sheet:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// Generate payslip with absence deductions
export const generatePayslip = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    const { month, year } = req.body
    
    if (!employeeId || !month || !year) {
      return res.status(400).json({ error: 'employeeId, month, and year are required' })
    }
    
    const payrollMonth = parseInt(month)
    const payrollYear = parseInt(year)
    
    const { cycleStart, cycleEnd } = getPayrollCycleDates(payrollMonth, payrollYear)
    const workingDays = getWorkingDaysInCycle(cycleStart, cycleEnd)
    
    // Get employee with financial info
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        user: true,
        official: true,
        retiral: true
      }
    })
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }
    
    const basicSalary = employee.retiral?.basicSalary || 0
    const hra = employee.retiral?.houseRentAllowance || 0
    const specialAllowance = employee.retiral?.specialAllowance || 0
    
    // Get attendance for the cycle
    const attendances = await (prisma as any).attendance.findMany({
      where: {
        employeeId,
        workDate: {
          gte: cycleStart,
          lte: cycleEnd
        }
      }
    })
    
    // Get approved leaves
    const approvedLeaves = await prisma.leaveRequest.findMany({
      where: {
        employeeId,
        status: 'approved',
        OR: [
          {
            AND: [
              { startDate: { lte: cycleEnd } },
              { endDate: { gte: cycleStart } }
            ]
          }
        ]
      }
    })
    
    // Calculate leave dates
    const leaveDates = new Set<number>()
    approvedLeaves.forEach(leave => {
      const start = startOfDay(new Date(leave.startDate))
      const end = startOfDay(new Date(leave.endDate))
      const current = new Date(start)
      
      while (current <= end) {
        if (current.getDay() !== 0) {
          leaveDates.add(startOfDay(current).getTime())
        }
        current.setDate(current.getDate() + 1)
      }
    })
    
    // Create attendance map
    const attendanceMap = new Map(
      attendances.map((att: any) => [
        startOfDay(new Date(att.workDate)).getTime(),
        att
      ])
    )
    
    // Calculate absent days (excluding leaves)
    let absentDays = 0
    workingDays.forEach(day => {
      const dayTime = day.getTime()
      const hasAttendance = attendanceMap.has(dayTime)
      const isOnLeave = leaveDates.has(dayTime)
      
      if (!hasAttendance && !isOnLeave) {
        absentDays++
      }
    })
    
    // Calculate deductions
    const grossSalary = basicSalary + hra + specialAllowance
    const perDaySalary = grossSalary / 30 // Assuming 30 days per month
    const absenceDeduction = absentDays * perDaySalary * 1.5 // 1.5 days salary per absent day
    
    // PF, ESI, Professional Tax, Income Tax
    const pfDeduction = employee.retiral?.employeePF || 0
    const esiDeduction = employee.retiral?.employeeESI || 0
    const professionalTax = employee.retiral?.professionalTax || 0
    const incomeTax = employee.retiral?.incomeTax || 0
    
    // Allowances
    const allowances = [
      { name: 'HRA', amount: hra, type: 'allowance' },
      { name: 'Special Allowance', amount: specialAllowance, type: 'allowance' }
    ].filter(a => a.amount > 0)
    
    // Deductions
    const deductions = [
      { name: 'PF', amount: pfDeduction, type: 'deduction' },
      { name: 'ESI', amount: esiDeduction, type: 'deduction' },
      { name: 'Professional Tax', amount: professionalTax, type: 'deduction' },
      { name: 'Income Tax (TDS)', amount: incomeTax, type: 'deduction' }
    ].filter(d => d.amount > 0)
    
    // Add absence deduction if applicable
    if (absentDays > 0) {
      deductions.push({
        name: `Absence Deduction (${absentDays} days × 1.5)`,
        amount: absenceDeduction,
        type: 'deduction'
      })
    }
    
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0)
    const netPay = grossSalary - totalDeductions
    
    // Create or update payslip
    const payslipData = {
      employeeId,
      employeeName: employee.user?.name || 'Unknown',
      month: `${payrollMonth < 10 ? '0' : ''}${payrollMonth}`,
      year: payrollYear,
      basicSalary,
      allowances: JSON.stringify(allowances),
      deductions: JSON.stringify(deductions),
      grossPay: grossSalary,
      netPay,
      taxDeducted: incomeTax,
      workingDays: workingDays.length,
      presentDays: workingDays.length - absentDays - leaveDates.size,
      absentDays,
      leaveDays: leaveDates.size,
      absenceDeduction,
      cycleStart,
      cycleEnd
    }
    
    return res.json({
      success: true,
      payslip: payslipData
    })
  } catch (error) {
    logger.error("Error generating payslip:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// Get payslip for an employee
export const getPayslip = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    const { month, year } = req.query
    
    if (!employeeId || !month || !year) {
      return res.status(400).json({ error: 'employeeId, month, and year are required' })
    }
    
    // Generate payslip on-the-fly
    req.body = { month: parseInt(month as string), year: parseInt(year as string) }
    return generatePayslip(req, res)
  } catch (error) {
    logger.error("Error getting payslip:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// Get all payslips for an employee
export const getAllPayslips = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params
    
    const payslips = await prisma.payslip.findMany({
      where: { employeeId },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    })
    
    return res.json({ payslips })
  } catch (error) {
    logger.error("Error getting payslips:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

