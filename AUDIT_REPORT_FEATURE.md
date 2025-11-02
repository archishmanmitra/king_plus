# Audit Report Feature Documentation

## Overview
A comprehensive audit reporting system has been implemented that allows administrators to create and generate audit reports, while all employees can view and download published reports.

## Features

### Role-Based Access Control

#### Admin (global_admin) Capabilities:
- ✅ Create new audit reports
- ✅ View all reports (including drafts)
- ✅ Edit draft reports
- ✅ Generate reports (convert draft to generated)
- ✅ Publish reports (make them available to all users)
- ✅ Delete draft reports
- ✅ Download any report

#### Employee/Manager/HR Capabilities:
- ✅ View published and generated reports only
- ✅ Download published and generated reports
- ✅ Search and filter reports
- ❌ Cannot create reports
- ❌ Cannot edit reports
- ❌ Cannot view draft reports

## Implementation Details

### Frontend Components

#### 1. Sidebar Navigation (`client/src/components/layout/Sidebar.tsx`)
- Added "Audit Report" menu item
- Visible to all roles: `global_admin`, `hr_manager`, `manager`, `employee`
- Uses `FileText` icon
- Route: `/audit-report`

#### 2. Audit Report Page (`client/src/pages/AuditReport.tsx`)
**Features:**
- **Admin View:**
  - Create form for new reports
  - Generate button for draft reports
  - Full CRUD operations
  
- **Employee/Manager View:**
  - List of published/generated reports
  - Download functionality
  - Search and filter capabilities

**Components Used:**
- Card, Table, Button, Input, Select
- Form validation
- Toast notifications
- Search and filter functionality

#### 3. App Routing (`client/src/App.tsx`)
- Added route: `/audit-report` → `<AuditReport />`

### Backend Implementation

#### 1. Database Schema (`server/prisma/schema.prisma`)
The `AuditReport` model already exists with the following structure:
```prisma
model AuditReport {
  id          String            @id @default(cuid())
  title       String
  description String?
  reportType  String            // 'attendance' | 'payroll' | 'leave' | 'performance' | 'general'
  status      AuditReportStatus @default(draft)
  generatedBy String            // Admin user ID
  fileUrl     String?           // URL to the generated report file
  startDate   DateTime?
  endDate     DateTime?
  metadata    Json?             // Additional report parameters
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

enum AuditReportStatus {
  draft
  generated
  published
}
```

#### 2. Controller (`server/src/controllers/auditReport.ts`)
**Endpoints Implemented:**

1. **GET `/api/audit-reports`** - Get all audit reports
   - Admins: See all reports
   - Others: See only generated/published reports

2. **GET `/api/audit-reports/:id`** - Get specific report
   - Authorization checks based on role and status

3. **POST `/api/audit-reports`** - Create new report (Admin only)
   - Validates report type and dates
   - Creates report in "draft" status

4. **POST `/api/audit-reports/:id/generate`** - Generate report (Admin only)
   - Converts draft → generated
   - Creates file URL (mock implementation)
   - In production: Would generate PDF/Excel and upload to storage

5. **POST `/api/audit-reports/:id/publish`** - Publish report (Admin only)
   - Converts generated → published
   - Makes report visible to all users

6. **PATCH `/api/audit-reports/:id`** - Update report (Admin only)
   - Can only update draft reports
   - Validates all fields

7. **DELETE `/api/audit-reports/:id`** - Delete report (Admin only)
   - Can only delete draft reports

8. **GET `/api/audit-reports/:id/download`** - Download report
   - All authenticated users can download generated/published reports
   - Returns file as PDF attachment
   - Currently returns mock data (implement actual file generation in production)

#### 3. Router (`server/src/routers/auditReport.ts`)
- All routes protected with `authenticateToken` middleware
- Admin-only routes use `requireAdmin` middleware
- RESTful API design

#### 4. Server Integration (`server/src/index.ts`)
- Registered router at `/api/audit-reports`

## Report Types

The system supports the following report types:
- **attendance** - Attendance tracking reports
- **payroll** - Payroll and salary reports
- **leave** - Leave management reports
- **performance** - Performance review reports
- **general** - General audit reports

## Report Lifecycle

```
1. DRAFT (Admin creates) 
   ↓
2. GENERATED (Admin generates - creates file)
   ↓
3. PUBLISHED (Admin publishes - visible to all)
```

## Security Features

1. **Authentication:** All endpoints require valid JWT token
2. **Authorization:** Role-based access control
3. **Data Filtering:** Non-admins automatically filtered to see only appropriate reports
4. **Validation:** Input validation on all create/update operations
5. **Audit Logging:** All actions logged via Winston logger

## API Request Examples

### Create Report (Admin)
```bash
POST /api/audit-reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Q4 2024 Attendance Report",
  "description": "Comprehensive attendance report for Q4",
  "reportType": "attendance",
  "startDate": "2024-10-01",
  "endDate": "2024-12-31"
}
```

### Generate Report (Admin)
```bash
POST /api/audit-reports/:id/generate
Authorization: Bearer <token>
```

### Download Report (All Users)
```bash
GET /api/audit-reports/:id/download
Authorization: Bearer <token>
```

## Frontend API Calls

All API calls use:
- Base URL: `VITE_API_URL` environment variable (default: `http://localhost:5001/api`)
- Authorization header with JWT token from localStorage
- Error handling with toast notifications

## Testing the Feature

### As Admin:
1. Login with admin credentials
2. Navigate to "Audit Report" in sidebar
3. Click "Create Report" button
4. Fill in report details and submit
5. Click "Generate" to generate the report
6. Click "Download" to download the generated report
7. (Optional) Publish the report to make it visible to all users

### As Employee/Manager:
1. Login with employee/manager credentials
2. Navigate to "Audit Report" in sidebar
3. View list of published/generated reports
4. Search and filter reports
5. Click "Download" to download any available report
6. Note: Cannot see draft reports or create new reports

## Future Enhancements

1. **File Generation:**
   - Implement actual PDF/Excel generation
   - Integrate with AWS S3 or similar for file storage
   - Add preview functionality

2. **Report Templates:**
   - Pre-defined report templates
   - Custom report builder

3. **Scheduling:**
   - Automated report generation
   - Email notifications when reports are published

4. **Analytics:**
   - Report access logs
   - Download statistics
   - Usage metrics

5. **Advanced Filters:**
   - Department-specific reports
   - Employee-specific reports
   - Date range presets

## Notes

- The current implementation uses mock file generation
- In production, integrate with actual file generation library (e.g., PDFKit, ExcelJS)
- Consider adding file storage service (S3, Azure Blob, etc.)
- Add rate limiting for download endpoints
- Implement pagination for large report lists
- Add bulk operations for admins

