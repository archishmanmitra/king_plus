# My Profile Page - HRMS System

## Overview
The My Profile page is a comprehensive employee profile management system that provides detailed information about employees in three main categories:

1. **Employee (Personal)** - Personal information, addresses, documents, education, experience
2. **Official** - Employment details, role information, confirmation status
3. **Financial** - Bank account details, retiral benefits

## Features

### 1. Employee Tab - Personal Information
- **Personal Information**: Name, gender, DOB, marital status, nationality, citizenship, contact details
- **Address Information**: Present, primary, and emergency contact addresses with coordinates
- **Passport Information**: Passport details, expiry, issuing office, country
- **Identity Numbers**: Aadhar, PAN, NSR (ITPIN, TIN)
- **Dependents**: Family members with relation, occupation, contact details
- **Education**: Academic qualifications with levels (Secondary, Higher, UG, PG)
- **Experience**: Work history with organization details and document proofs

### 2. Official Tab
- **Personal Level**: Core employment details, role, designation, stream, location
- **Confirmation Details**: Job confirmation status, approval, performance rating
- **Documents**: Employment documents managed by HR/Admin

### 3. Financial Tab
- **Bank Account**: Bank details, account number, IFSC code, country
- **Retiral Benefits**: PF total and other retirement benefits
- **Financial Summary**: Overview of financial information

## Access Control

### Employee Permissions
- Can view all information
- Can edit personal information (Employee tab)
- Can edit bank account details (Financial tab - first half)
- Cannot edit official information or retiral benefits

### HR Manager Permissions
- Can view all employee profiles
- Can edit all information for any employee
- Can manage documents and official details
- Can configure retiral benefits

### Global Admin Permissions
- Full access to all information
- Can edit any field for any employee
- Can manage system-wide configurations

## Navigation

### From Sidebar
- My Profile link is available to all user roles
- Located in the main navigation menu

### From Header
- Profile option in user dropdown menu
- Quick access to personal profile

### From Employee Management
- View Profile buttons on employee cards
- View Profile buttons in employee table
- HR managers can access any employee's profile

## Data Structure

The profile system uses a comprehensive data structure with:
- Nested objects for addresses, documents, and relationships
- Arrays for education, experience, and dependents
- Role-based access control for editing permissions
- Comprehensive validation and error handling

## Technical Implementation

- Built with React and TypeScript
- Uses shadcn/ui components for consistent design
- Responsive design for mobile and desktop
- Tab-based navigation for organized information display
- Role-based permission system
- Mock data integration for demonstration

## Future Enhancements

- Edit forms for each section
- Document upload and management
- Profile picture management
- Export functionality
- Audit trail for changes
- Integration with external HR systems
- Advanced search and filtering
- Bulk operations for HR managers

## Usage

1. Navigate to My Profile from sidebar or header
2. Use tabs to switch between Employee, Official, and Financial information
3. Click Edit buttons (where permitted) to modify information
4. Use View Profile buttons in employee management to view other profiles
5. Export profile data for external use

## Security

- Role-based access control
- Permission validation on all edit operations
- Secure data handling
- Audit logging for sensitive operations
- Input validation and sanitization

