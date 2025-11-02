# Payroll System Setup Guide

## Quick Start

### 1. Database Migration

First, apply the schema changes to add payslip attendance fields:

```bash
cd server
npx prisma migrate dev --name add_payslip_attendance_fields
npx prisma generate
```

### 2. Start the Backend Server

```bash
cd server
npm run dev
```

The server should start on `http://localhost:5001`

### 3. Start the Frontend Client

```bash
cd client
npm run dev
```

The client should start on `http://localhost:5173`

## Accessing the Payroll System

### For Employees

1. Login to the system
2. Click on **"My Payslip"** in the sidebar menu
3. Select the desired month and year
4. View your attendance sheet and payslip
5. Download/Print your payslip

### For HR/Admin

1. Access the **"Payroll"** page for payroll management
2. Use **"My Payslip"** to view individual payslips
3. Process payroll using the wizard

## Features Overview

### Attendance Sheet
- Shows attendance from 22nd of previous month to 21st of current month
- Color-coded status: Green (Present), Red (Absent), Blue (Leave)
- Summary statistics
- Export functionality

### Payslip
- Detailed salary breakdown
- Absence deduction calculation with explanation
- Download as PDF
- Print functionality
- Matches company format

## Absence Deduction Rules

- **1.5 days salary** deducted per absent day
- Calculation: `(Basic Salary / 30) × Absent Days × 1.5`
- Approved leaves are NOT counted as absences
- Only working days (excluding Sundays) are considered

## API Endpoints

### Get Attendance Sheet
```
GET /api/payroll/attendance-sheet/:employeeId?month=8&year=2025
Authorization: Bearer <token>
```

### Generate Payslip
```
POST /api/payroll/generate/:employeeId
Authorization: Bearer <token>
Content-Type: application/json

{
  "month": 8,
  "year": 2025
}
```

### Get Payslip
```
GET /api/payroll/payslip/:employeeId?month=8&year=2025
Authorization: Bearer <token>
```

### Get All Payslips
```
GET /api/payroll/payslips/:employeeId
Authorization: Bearer <token>
```

## Testing the System

### Test Scenario 1: No Absences

1. Clock in every working day for the cycle
2. Generate payslip
3. Verify net pay = gross pay - normal deductions (no absence deduction)

### Test Scenario 2: With Absences

1. Skip clock-in for 2 days
2. Generate payslip
3. Verify absence deduction appears:
   - Should show: "Absence Deduction (2 days × 1.5)"
   - Amount: (Basic Salary / 30) × 2 × 1.5

### Test Scenario 3: With Approved Leaves

1. Apply for leave and get it approved
2. Don't clock in on leave days
3. Generate payslip
4. Verify leave days are NOT counted as absences

## Troubleshooting

### Issue: "Employee not found"
**Solution:** Ensure the employee has:
- A valid employee record
- Basic salary configured in retiral section
- User account linked

### Issue: Payslip shows 0 working days
**Solution:** 
- Check if the date range is correct
- Verify the month and year parameters
- Ensure attendance records exist in the database

### Issue: Download button not working
**Solution:**
- Check browser popup blocker settings
- Try a different browser
- Check browser console for errors

### Issue: Absence deduction seems incorrect
**Solution:**
- Verify basic salary is set correctly
- Check attendance records for the cycle
- Ensure approved leaves are in the system
- Calculate manually: (Basic Salary / 30) × Absent Days × 1.5

## Database Schema

### Key Tables

#### Attendance
- `employeeId`: Employee reference
- `workDate`: Normalized to start of day
- `clockIn`: Clock-in timestamp
- `clockOut`: Clock-out timestamp
- `status`: submitted | approved | rejected

#### LeaveRequest
- `employeeId`: Employee reference
- `startDate`: Leave start date
- `endDate`: Leave end date
- `status`: pending | approved | rejected

#### Payslip (Updated)
- `workingDays`: Total working days in cycle
- `presentDays`: Days employee was present
- `absentDays`: Days employee was absent
- `leaveDays`: Days employee was on approved leave
- `absenceDeduction`: Total absence deduction amount
- `cycleStart`: Payroll cycle start date
- `cycleEnd`: Payroll cycle end date

## Configuration

### Payroll Cycle Settings

The payroll cycle is currently hardcoded:
- Start: 22nd of previous month
- End: 21st of current month

To modify, update the `getPayrollCycleDates` function in:
`server/src/controllers/payroll.ts`

### Absence Deduction Multiplier

Current multiplier: **1.5**

To change, update this line in `server/src/controllers/payroll.ts`:
```typescript
const absenceDeduction = absentDays * perDaySalary * 1.5 // Change 1.5 to desired value
```

### Working Days

Currently excludes:
- Sundays (day 0)

To exclude other days, modify the `getWorkingDaysInCycle` function.

## File Structure

```
king_plus/
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── payroll.ts          # Payroll logic
│   │   └── routers/
│   │       └── payroll.ts          # API routes
│   └── prisma/
│       └── schema.prisma           # Database schema
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── attendance/
│   │   │   │   └── AttendanceSheetPayroll.tsx
│   │   │   └── payroll/
│   │   │       └── PayslipView.tsx
│   │   ├── pages/
│   │   │   └── PayrollSheet.tsx    # Main page
│   │   └── types/
│   │       └── payroll.ts          # TypeScript types
└── PAYROLL_SYSTEM_DOCUMENTATION.md
```

## Next Steps

1. **Test with real data:**
   - Create test employees
   - Add attendance records
   - Generate payslips

2. **Customize:**
   - Adjust company name and logo
   - Modify payslip format if needed
   - Configure deduction rules

3. **Deploy:**
   - Set up production database
   - Configure environment variables
   - Deploy backend and frontend

4. **Train users:**
   - Show employees how to view payslips
   - Train HR on payroll processing
   - Document internal procedures

## Support

For technical support:
- Check logs in `server/logs/`
- Review browser console for frontend errors
- Consult `PAYROLL_SYSTEM_DOCUMENTATION.md` for detailed info

## Important Notes

⚠️ **Before using in production:**

1. Backup your database
2. Test thoroughly with sample data
3. Verify all calculations are correct
4. Review payslip format with HR
5. Get approval from management

✅ **Best Practices:**

- Run payroll on the same day each month
- Keep backup of all payslips
- Maintain attendance records properly
- Regularly audit absence deductions
- Keep employees informed about policies

## Version History

- **v1.0.0** (2025-10-30): Initial release
  - Attendance sheet with payroll cycle (22nd-21st)
  - Automatic absence detection
  - 1.5x salary deduction per absent day
  - Payslip generation with detailed breakdown
  - Download/Print functionality

