# Payroll System Documentation

## Overview

This payroll system calculates employee salaries based on a **22nd to 21st payroll cycle** with automatic absence deductions.

## Payroll Cycle

- **Cycle Period**: 22nd of previous month to 21st of current month
- **Working Days**: All days except Sundays
- **Example**: August 2025 payroll runs from July 22, 2025 to August 21, 2025

## Absence Deduction Policy

### Rule
- **1.5 days salary** is deducted for each day an employee is absent (no clock-in)
- Approved leaves are NOT counted as absences
- Only working days (excluding Sundays) are considered

### Calculation Formula
```
Per Day Salary = Basic Salary / 30
Absence Deduction = Number of Absent Days × Per Day Salary × 1.5
```

### Example
If an employee has:
- Basic Salary: ₹6000
- Absent Days: 2
- Per Day Salary: ₹6000 / 30 = ₹200
- Absence Deduction: 2 × ₹200 × 1.5 = ₹600

## API Endpoints

### 1. Get Attendance Sheet
```
GET /api/payroll/attendance-sheet/:employeeId?month=8&year=2025
```

**Response:**
```json
{
  "employee": {
    "id": "emp_123",
    "employeeId": "KNGPL/HR/SL/SD061",
    "name": "Keshav Mishra",
    "designation": "System Engineer",
    "basicSalary": 6000
  },
  "cycle": {
    "start": "2025-07-22T00:00:00.000Z",
    "end": "2025-08-21T23:59:59.999Z",
    "month": 8,
    "year": 2025
  },
  "summary": {
    "totalWorkingDays": 20,
    "presentDays": 18,
    "absentDays": 2,
    "leaveDays": 0
  },
  "attendanceSheet": [
    {
      "date": "2025-07-22T00:00:00.000Z",
      "status": "present",
      "clockIn": "2025-07-22T09:00:00.000Z",
      "clockOut": "2025-07-22T18:00:00.000Z",
      "totalHours": 9,
      "isOnLeave": false
    }
  ]
}
```

### 2. Generate Payslip
```
POST /api/payroll/generate/:employeeId
Content-Type: application/json

{
  "month": 8,
  "year": 2025
}
```

**Response:**
```json
{
  "success": true,
  "payslip": {
    "employeeId": "emp_123",
    "employeeName": "Keshav Mishra",
    "month": "08",
    "year": 2025,
    "basicSalary": 6000,
    "allowances": [],
    "deductions": [
      {
        "name": "Absence Deduction (2 days × 1.5)",
        "amount": 600,
        "type": "deduction"
      }
    ],
    "grossPay": 6000,
    "netPay": 5400,
    "taxDeducted": 0,
    "workingDays": 20,
    "presentDays": 18,
    "absentDays": 2,
    "leaveDays": 0,
    "absenceDeduction": 600,
    "cycleStart": "2025-07-22T00:00:00.000Z",
    "cycleEnd": "2025-08-21T23:59:59.999Z"
  }
}
```

### 3. Get Payslip
```
GET /api/payroll/payslip/:employeeId?month=8&year=2025
```

### 4. Get All Payslips
```
GET /api/payroll/payslips/:employeeId
```

## Frontend Components

### 1. AttendanceSheetPayroll Component
Located at: `client/src/components/attendance/AttendanceSheetPayroll.tsx`

**Features:**
- Displays daily attendance for the payroll cycle
- Shows present, absent, and leave days with color coding
- Calculates and displays absence deduction warning
- Shows summary statistics

**Props:**
```typescript
interface AttendanceSheetProps {
  employeeId: string;
  month: number;
  year: number;
}
```

### 2. PayslipView Component
Located at: `client/src/components/payroll/PayslipView.tsx`

**Features:**
- Generates and displays formatted payslip
- Shows detailed salary breakdown
- Highlights absence deductions with warning
- Download/Print functionality
- Matches company payslip format

**Props:**
```typescript
interface PayslipViewProps {
  employeeId: string;
  month: number;
  year: number;
}
```

### 3. PayrollSheet Page
Located at: `client/src/pages/PayrollSheet.tsx`

**Features:**
- Tabbed interface for Attendance Sheet and Payslip
- Month/Year selector
- Refresh functionality
- Information about payroll cycle
- Accessible to all employees

**URL:** `/payroll-sheet`

## Database Schema Updates

### Payslip Model
```prisma
model Payslip {
  id               String    @id @default(cuid())
  employeeId       String
  employeeName     String
  payrollRunId     String?
  month            String
  year             Int
  basicSalary      Float
  allowances       Json
  deductions       Json
  grossPay         Float
  netPay           Float
  taxDeducted      Float
  workingDays      Int?      // NEW
  presentDays      Int?      // NEW
  absentDays       Int?      // NEW
  leaveDays        Int?      // NEW
  absenceDeduction Float?    // NEW
  cycleStart       DateTime? // NEW
  cycleEnd         DateTime? // NEW
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  employee   Employee    @relation(...)
  payrollRun PayrollRun? @relation(...)

  @@unique([employeeId, month, year])
  @@map("payslips")
}
```

## Usage Instructions

### For Employees

1. Navigate to **"My Payslip"** in the sidebar
2. Select the month and year
3. View your attendance sheet in the "Attendance Sheet" tab
4. View your payslip in the "Payslip" tab
5. Download or print your payslip using the buttons

### For HR/Admin

1. Use the existing **"Payroll"** page for payroll processing
2. Access individual employee payslips via `/payroll-sheet` route
3. Process payroll for all employees using the payroll wizard

## Important Notes

1. **Sundays are excluded** from working days calculation
2. **Approved leaves** do not count as absences
3. **Absence deduction** is clearly shown in the payslip with calculation details
4. **Payroll cycle** is fixed: 22nd of previous month to 21st of current month
5. **Per day salary** is calculated as: Basic Salary / 30

## Testing

### Manual Testing Steps

1. **Test Attendance Sheet:**
   ```bash
   # Start the server
   cd server
   npm run dev
   
   # Start the client
   cd client
   npm run dev
   ```

2. **Create test attendance:**
   - Clock in for some days
   - Leave some days without clock-in (these will be marked absent)
   - Apply and approve some leaves

3. **View Payslip:**
   - Navigate to "My Payslip"
   - Select current month
   - Verify absence deduction calculation
   - Test download functionality

### Test Scenarios

1. **No Absences:**
   - Employee clocks in all working days
   - Net pay should equal gross pay minus normal deductions

2. **With Absences:**
   - Employee misses 2 days
   - Absence deduction should be: (Basic Salary / 30) × 2 × 1.5

3. **With Approved Leaves:**
   - Employee has approved leaves
   - Leave days should NOT be counted as absences

## Troubleshooting

### Issue: Payslip not generating
- Check if employee has `retiral` record with `basicSalary`
- Verify authentication token is valid
- Check browser console for errors

### Issue: Incorrect absence count
- Verify attendance records exist in database
- Check if leave requests are approved
- Ensure working date is within payroll cycle

### Issue: Download not working
- Check browser popup settings
- Verify print functionality is enabled
- Try different browser

## Migration Steps

If you need to apply the schema changes:

```bash
cd server
npx prisma migrate dev --name add_payslip_attendance_fields
npx prisma generate
```

## Sample Payslip Format

The payslip follows this format (as shown in the provided sample):

```
Kin-G Technologies
Registered Office: Kolkata, West Bengal

Payslip - August 2025

Employee Name: Keshav Mishra
Employee ID: KNGPL/HR/SL/SD061
Working Period: 28 Aug 2025 - 21 Sep 2025
Total Working Days: 20
Total Absent: 0
Total Leave: 0

┌─────────────────────────┬──────────────┐
│ Particulars             │ Amount (₹)   │
├─────────────────────────┼──────────────┤
│ Basic Salary            │ 6000.00      │
│ HRA                     │ 00.00        │
│ Special Allowance       │ 00.00        │
│ Other Allowance         │ 00.00        │
├─────────────────────────┼──────────────┤
│ Gross Salary            │ 6000.00      │
│ Deductions (PF/ESI/TDS) │ 0.00         │
├─────────────────────────┼──────────────┤
│ Net Salary Payable      │ 4800.00      │
└─────────────────────────┴──────────────┘

Authorised Signature
(HR & Accounts Department)
Kin-G Technologies
```

## Future Enhancements

1. Email payslip to employees automatically
2. Bulk payslip generation for all employees
3. Export payslips to PDF server-side
4. Add more salary components (bonuses, incentives)
5. Integration with payment gateways
6. Payslip history with filtering
7. Year-end tax statements (Form 16)

## Support

For issues or questions, contact:
- HR Department
- Technical Support
- Email: hr@king-technologies.com

