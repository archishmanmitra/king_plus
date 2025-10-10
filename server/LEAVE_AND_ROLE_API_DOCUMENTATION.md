# Leave Management and Role Assignment API Documentation

This document describes the new API endpoints for leave management and role assignment functionality in the King Plus HR system.

## Table of Contents

1. [Leave Management API](#leave-management-api)
2. [Role Assignment API](#role-assignment-api)
3. [Authentication & Authorization](#authentication--authorization)
4. [Error Handling](#error-handling)
5. [Examples](#examples)

## Leave Management API

### Leave Requests

#### Create Leave Request

- **POST** `/api/leave/requests`
- **Authentication**: Required
- **Authorization**: Users can create requests for themselves, admins/HR can create for anyone
- **Body**:
  ```json
  {
    "employeeId": "string",
    "type": "earned|maternity|paternity|compoff",
    "startDate": "2024-01-15",
    "endDate": "2024-01-17",
    "reason": "Personal emergency"
  }
  ```
- **Response**: `201` - Leave request created successfully

#### Get Leave Requests

- **GET** `/api/leave/requests`
- **Authentication**: Required
- **Query Parameters**:
  - `employeeId` (optional): Filter by employee ID
  - `status` (optional): Filter by status (pending, approved, rejected)
  - `type` (optional): Filter by leave type
  - `startDate` (optional): Filter by start date range
  - `endDate` (optional): Filter by end date range
- **Authorization**: Users see only their own requests, admins/HR see all
- **Response**: `200` - List of leave requests

#### Get Specific Leave Request

- **GET** `/api/leave/requests/:id`
- **Authentication**: Required
- **Authorization**: Users can view their own requests, admins/HR can view any
- **Response**: `200` - Leave request details

#### Update Leave Request Status

- **PATCH** `/api/leave/requests/:id/status`
- **Authentication**: Required
- **Authorization**: Managers and admins only
- **Body**:
  ```json
  {
    "status": "approved|rejected",
    "approver": "Manager Name"
  }
  ```
- **Response**: `200` - Leave request status updated

#### Update Leave Request

- **PATCH** `/api/leave/requests/:id`
- **Authentication**: Required
- **Authorization**: Users can update their own pending requests, admins can update any
- **Body**:
  ```json
  {
    "type": "earned|maternity|paternity|compoff",
    "startDate": "2024-01-15",
    "endDate": "2024-01-17",
    "reason": "Updated reason"
  }
  ```
- **Response**: `200` - Leave request updated

#### Delete Leave Request

- **DELETE** `/api/leave/requests/:id`
- **Authentication**: Required
- **Authorization**: Users can delete their own pending requests, admins can delete any
- **Response**: `200` - Leave request deleted

### Leave Balance Management

#### Get Leave Balance

- **GET** `/api/leave/balance/:employeeId`
- **Authentication**: Required
- **Authorization**: Users can view their own balance, admins/HR can view any
- **Response**: `200` - Employee leave balance

#### Update Leave Balance

- **PATCH** `/api/leave/balance/:employeeId`
- **Authentication**: Required
- **Authorization**: Admins and HR managers only
- **Body**:
  ```json
  {
    "sick": 12,
    "vacation": 21,
    "personal": 5,
    "maternity": 90,
    "paternity": 15
  }
  ```
- **Response**: `200` - Leave balance updated

#### Get All Leave Balances

- **GET** `/api/leave/balance`
- **Authentication**: Required
- **Authorization**: Admins and HR managers only
- **Response**: `200` - All employee leave balances

#### Reset Leave Balance

- **POST** `/api/leave/balance/:employeeId/reset`
- **Authentication**: Required
- **Authorization**: Admins and HR managers only
- **Body**:
  ```json
  {
    "year": 2024
  }
  ```
- **Response**: `200` - Leave balance reset for new year

#### Add Leave Days

- **POST** `/api/leave/balance/:employeeId/add`
- **Authentication**: Required
- **Authorization**: Admins and HR managers only
- **Body**:
  ```json
  {
    "type": "sick|vacation|personal|maternity|paternity",
    "days": 5,
    "reason": "Bonus days for good performance"
  }
  ```
- **Response**: `200` - Leave days added successfully

## Role Assignment API

### Manager Assignment

#### Assign Manager

- **POST** `/api/roles/manager`
- **Authentication**: Required
- **Authorization**: Admins and HR managers only
- **Body**:
  ```json
  {
    "employeeId": "employee-id",
    "managerId": "manager-user-id"
  }
  ```
- **Response**: `200` - Manager assigned successfully

#### Remove Manager

- **DELETE** `/api/roles/manager/:employeeId`
- **Authentication**: Required
- **Authorization**: Admins and HR managers only
- **Response**: `200` - Manager assignment removed

#### Get Employees Under Manager

- **GET** `/api/roles/manager/:managerId/employees`
- **Authentication**: Required
- **Authorization**: Users can view their own team, admins can view any
- **Response**: `200` - List of employees under the manager

### Team Lead Assignment

#### Assign Team Lead

- **POST** `/api/roles/team-lead`
- **Authentication**: Required
- **Authorization**: Managers and admins only
- **Body**:
  ```json
  {
    "employeeId": "employee-id",
    "leadId": "team-lead-user-id"
  }
  ```
- **Response**: `200` - Team lead assigned successfully

#### Remove Team Lead

- **DELETE** `/api/roles/team-lead/:employeeId`
- **Authentication**: Required
- **Authorization**: Managers and admins only
- **Response**: `200` - Team lead assignment removed

#### Get All Team Leads

- **GET** `/api/roles/team-leads`
- **Authentication**: Required
- **Authorization**: Admins and HR managers only
- **Response**: `200` - All team leads and their teams

### Role Management

#### Update Employee Role

- **PATCH** `/api/roles/role`
- **Authentication**: Required
- **Authorization**: Global admins only
- **Body**:
  ```json
  {
    "employeeId": "employee-id",
    "newRole": "global_admin|hr_manager|manager|employee"
  }
  ```
- **Response**: `200` - Employee role updated

## Authentication & Authorization

### User Roles

- **global_admin**: Full system access
- **hr_manager**: HR management access
- **manager**: Team management access
- **employee**: Basic employee access

### Permission Matrix

| Action                          | Employee | Manager | HR Manager | Global Admin |
| ------------------------------- | -------- | ------- | ---------- | ------------ |
| Create own leave request        | ✅       | ✅      | ✅         | ✅           |
| Create leave request for others | ❌       | ❌      | ✅         | ✅           |
| View own leave requests         | ✅       | ✅      | ✅         | ✅           |
| View all leave requests         | ❌       | ❌      | ✅         | ✅           |
| Approve/reject leave requests   | ❌       | ✅      | ✅         | ✅           |
| Update own leave balance        | ❌       | ❌      | ✅         | ✅           |
| Assign managers                 | ❌       | ❌      | ✅         | ✅           |
| Assign team leads               | ❌       | ✅      | ✅         | ✅           |
| Change employee roles           | ❌       | ❌      | ❌         | ✅           |

## Error Handling

### Common Error Responses

#### 400 Bad Request

```json
{
  "error": "Invalid leave type. Must be one of: earned, maternity, paternity, compoff"
}
```

#### 401 Unauthorized

```json
{
  "error": "No token provided"
}
```

#### 403 Forbidden

```json
{
  "error": "Only admins and HR managers can update leave balances"
}
```

#### 404 Not Found

```json
{
  "error": "Employee not found"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Failed to create leave request",
  "details": "Specific error message"
}
```

## Examples

### Creating a Leave Request

```bash
curl -X POST http://localhost:5001/api/leave/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "employeeId": "emp-123",
    "type": "earned",
    "startDate": "2024-01-15",
    "endDate": "2024-01-17",
    "reason": "Family vacation"
  }'
```

### Approving a Leave Request

```bash
curl -X PATCH http://localhost:5001/api/leave/requests/req-123/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "status": "approved",
    "approver": "John Manager"
  }'
```

### Assigning a Manager

```bash
curl -X POST http://localhost:5001/api/roles/manager \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "employeeId": "emp-123",
    "managerId": "mgr-456"
  }'
```

### Getting Leave Balance

```bash
curl -X GET http://localhost:5001/api/leave/balance/emp-123 \
  -H "Authorization: Bearer your-jwt-token"
```

## Database Schema Updates

The following models are used by the new API endpoints:

### LeaveRequest

- `id`: Unique identifier
- `employeeId`: Reference to employee
- `employeeName`: Employee's full name
- `type`: Leave type (earned, maternity, paternity, compoff)
- `startDate`: Leave start date
- `endDate`: Leave end date
- `days`: Number of leave days
- `reason`: Leave reason
- `status`: Request status (pending, approved, rejected)
- `approver`: Name of approver
- `appliedDate`: When request was applied

### LeaveBalance

- `employeeId`: Reference to employee
- `sick`: Sick leave days
- `vacation`: Vacation days
- `personal`: Personal leave days
- `maternity`: Maternity leave days
- `paternity`: Paternity leave days
- `total`: Total leave days

### EmployeeOfficial (Updated)

- `unitHead`: Manager's name
- `reportingManager`: Team lead's name

## Notes

1. All dates should be in ISO format (YYYY-MM-DD)
2. Leave balances are automatically deducted when earned leave requests are approved
3. Timeline events are automatically created for role assignments and leave balance changes
4. The system validates leave balances before approving earned leave requests
5. Only pending leave requests can be updated or deleted by employees
6. Managers and admins can approve/reject leave requests
7. Global admins have the highest level of access and can change employee roles
