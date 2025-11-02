# Awards & Celebration Feature Documentation

## Overview
A comprehensive awards and recognition system that allows administrators to issue certificates and words of affirmation to employees. All employees can view these celebrations, but only admins can create, update, and delete awards.

## Features

### Role-Based Access Control

#### Admin (global_admin) Capabilities:
- ✅ Create new awards and recognitions
- ✅ Edit existing awards
- ✅ Delete awards
- ✅ View all awards
- ✅ Issue certificates to any employee
- ✅ Write words of affirmation
- ✅ View award statistics

#### Employee/Manager/HR Capabilities:
- ✅ View all public awards
- ✅ Search and filter awards
- ✅ View awards by employee
- ✅ See celebration timeline
- ❌ Cannot create awards
- ❌ Cannot edit awards
- ❌ Cannot delete awards

## Implementation Details

### Frontend Components

#### 1. Sidebar Navigation (`client/src/components/layout/Sidebar.tsx`)
- Added "Awards & Celebration" menu item
- Visible to all roles: `global_admin`, `hr_manager`, `manager`, `employee`
- Uses `Award` icon from lucide-react
- Route: `/awards`

#### 2. Awards and Celebration Page (`client/src/pages/AwardsAndCelebration.tsx`)
**Features:**
- **Admin View:**
  - Create award dialog with form
  - Employee selection dropdown
  - Award type selection
  - Custom badge icons (emojis)
  - Delete functionality for each award
  
- **Employee View:**
  - Grid view of all awards
  - Beautiful card design with gradients
  - Award details (recipient, issuer, date)
  - Read-only access

**UI Components:**
- Responsive grid layout (1/2/3 columns)
- Color-coded award types
- Gradient headers for visual appeal
- Search functionality
- Filter by award type
- Emoji badge support

**Award Types with Colors:**
- 📜 **Certificate** - Blue gradient
- 💝 **Appreciation** - Pink gradient
- 🏆 **Achievement** - Amber gradient
- 🎯 **Milestone** - Purple gradient
- ⭐ **Recognition** - Green gradient

#### 3. App Routing (`client/src/App.tsx`)
- Added route: `/awards` → `<AwardsAndCelebration />`

### Backend Implementation

#### 1. Database Schema (`server/prisma/schema.prisma`)
```prisma
enum AwardType {
  certificate
  appreciation
  achievement
  milestone
  recognition
}

model Award {
  id               String    @id @default(cuid())
  title            String
  description      String
  awardType        AwardType
  recipientId      String            // Employee ID
  recipientName    String            // Employee name for display
  issuedBy         String            // Admin user ID
  issuedByName     String            // Admin name for display
  certificateUrl   String?           // URL to certificate image/PDF
  badgeIcon        String?           // Icon for the award badge
  isPublic         Boolean   @default(true)
  celebrationDate  DateTime  @default(now())
  metadata         Json?             // Additional award details
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@map("awards")
  @@index([recipientId])
  @@index([celebrationDate])
}
```

#### 2. Controller (`server/src/controllers/awards.ts`)
**Endpoints Implemented:**

1. **GET `/api/awards`** - Get all public awards
   - Returns all awards visible to employees
   - Sorted by celebration date (newest first)

2. **GET `/api/awards/:id`** - Get specific award
   - Returns single award details
   - Checks public/private status

3. **GET `/api/awards/employee/:employeeId`** - Get employee's awards
   - Returns all awards for a specific employee
   - Useful for employee profile pages

4. **POST `/api/awards`** - Create new award (Admin only)
   - Validates all required fields
   - Automatically fetches recipient and issuer names
   - Supports custom badge icons
   - Default visibility: public

5. **PATCH `/api/awards/:id`** - Update award (Admin only)
   - Can update title, description, type, etc.
   - Cannot change recipient

6. **DELETE `/api/awards/:id`** - Delete award (Admin only)
   - Permanent deletion
   - Confirmation required on frontend

7. **GET `/api/awards/statistics/summary`** - Get award statistics (Admin only)
   - Total awards count
   - Awards by type
   - Recent awards
   - Top recipients

#### 3. Router (`server/src/routers/awards.ts`)
- All routes protected with `authenticateToken` middleware
- Admin-only routes use `requireAdmin` middleware
- RESTful API design
- Proper route ordering to avoid conflicts

#### 4. Server Integration (`server/src/index.ts`)
- Registered router at `/api/awards`
- Proper error handling and logging

## Award Types Explained

### 1. Certificate 📜
- Formal recognition
- Often for course completion, training, certifications
- Can include certificate URL/PDF

### 2. Appreciation 💝
- Thank you notes
- Recognition for help and support
- Words of affirmation
- Gratitude expression

### 3. Achievement 🏆
- Major accomplishments
- Project completions
- Goals achieved
- Outstanding performance

### 4. Milestone 🎯
- Work anniversaries
- Years of service
- Career milestones
- Company tenure

### 5. Recognition ⭐
- General recognition
- Team player awards
- Culture fit
- Values alignment

## Security Features

1. **Authentication:** All endpoints require valid JWT token
2. **Authorization:** Strict role-based access control
3. **Data Validation:** Input validation on all create/update operations
4. **Audit Logging:** All actions logged via Winston logger
5. **Privacy Control:** isPublic flag for sensitive awards

## API Request Examples

### Create Award (Admin)
```bash
POST /api/awards
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Employee of the Month",
  "description": "Outstanding performance and dedication throughout October. Consistently went above and beyond to help the team succeed.",
  "awardType": "achievement",
  "recipientId": "clxxx123456",
  "badgeIcon": "🏆"
}
```

### Get All Awards
```bash
GET /api/awards
Authorization: Bearer <token>
```

### Get Employee Awards
```bash
GET /api/awards/employee/clxxx123456
Authorization: Bearer <token>
```

### Delete Award (Admin)
```bash
DELETE /api/awards/:id
Authorization: Bearer <token>
```

### Get Statistics (Admin)
```bash
GET /api/awards/statistics/summary
Authorization: Bearer <token>
```

## Frontend API Calls

All API calls use:
- Base URL: `VITE_API_URL` environment variable (default: `http://localhost:5001/api`)
- Authorization header with JWT token from localStorage
- Error handling with toast notifications
- Optimistic UI updates

## Database Migration

After adding the schema changes, run:
```bash
cd server
npx prisma generate
npx prisma migrate dev --name add_awards_table
```

## Testing the Feature

### As Admin:
1. Login with admin credentials
2. Navigate to "Awards & Celebration" in sidebar
3. Click "Create Award" button
4. Fill in award details:
   - Select recipient employee
   - Choose award type
   - Enter title and description
   - Optionally customize badge icon
5. Submit the form
6. View the award in the grid
7. Click delete icon to remove awards

### As Employee/Manager:
1. Login with employee/manager credentials
2. Navigate to "Awards & Celebration" in sidebar
3. View all published awards in grid format
4. Use search to find specific awards
5. Filter by award type
6. Click on awards to see full details
7. Note: Cannot create or delete awards

## UI/UX Features

### Visual Design:
- **Color-coded headers:** Each award type has a unique gradient
- **Large emoji badges:** Visual recognition at a glance
- **Responsive grid:** Adapts to screen size (1/2/3 columns)
- **Hover effects:** Cards elevate on hover
- **Sparkle indicators:** Shows special awards

### Information Display:
- **Recipient name:** Who received the award
- **Issuer name:** Who gave the award
- **Date:** When the award was issued
- **Award type badge:** Quick identification
- **Description:** Full context and reason

### User Experience:
- **Search:** Find awards by title, recipient, or description
- **Filter:** Filter by award type
- **Empty states:** Helpful messages when no awards exist
- **Loading states:** Smooth loading experience
- **Toast notifications:** Feedback for all actions
- **Confirmation dialogs:** Prevent accidental deletions

## Future Enhancements

### Phase 2 Features:
1. **Certificate Generation:**
   - Auto-generate PDF certificates
   - Customizable certificate templates
   - Download certificates

2. **Email Notifications:**
   - Notify recipients when awarded
   - Send certificate via email
   - Celebration announcements

3. **Social Features:**
   - Congratulations/reactions
   - Comments on awards
   - Share to team channels

4. **Analytics Dashboard:**
   - Award trends over time
   - Department-wise distribution
   - Most recognized employees
   - Recognition heatmap

5. **Nomination System:**
   - Peer-to-peer nominations
   - Manager approval workflow
   - Public voting

6. **Badge Collection:**
   - Employee badge showcase
   - Achievement levels
   - Gamification elements
   - Leaderboards

7. **Calendar Integration:**
   - Work anniversary reminders
   - Milestone alerts
   - Birthday celebrations

8. **Customization:**
   - Custom award types
   - Company-specific badges
   - Branded certificates
   - Custom colors/themes

## Integration Points

### With Other Modules:
- **Employee Profiles:** Display employee awards on their profile page
- **Dashboard:** Show recent awards on the dashboard
- **Reports:** Include recognition data in reports
- **Performance:** Link awards to performance reviews
- **Notifications:** Real-time award notifications

## Best Practices

### For Admins:
1. **Be Specific:** Describe exactly what the employee did
2. **Be Timely:** Issue awards soon after the achievement
3. **Be Sincere:** Make recognition meaningful and personal
4. **Be Public:** Most awards should be visible to all
5. **Be Consistent:** Recognize all team members fairly

### For Writing Descriptions:
- Start with the achievement
- Explain the impact
- Use specific examples
- Keep it positive and encouraging
- Mention team collaboration if applicable

### Example Good Description:
> "Sarah led the Q4 marketing campaign that exceeded our targets by 150%. She coordinated with design, content, and sales teams seamlessly, ensuring timely delivery and exceptional quality. Her innovative approach to social media engagement brought in 500+ new leads."

### Example Poor Description:
> "Good job on the project."

## Notes

- Awards are immediately visible to all employees after creation
- The `isPublic` flag can be used for private recognition
- Badge icons support any emoji (recommended: 🏆 ⭐ 🎖️ 🥇 💎 🌟 ⚡ 🎯 🔥 💪)
- Consider implementing quarterly/monthly award programs
- Regular recognition boosts morale and engagement
- Track award distribution to ensure fairness

## Technical Notes

- Uses Prisma ORM for database operations
- JWT-based authentication
- RESTful API design
- TypeScript for type safety
- React with hooks for state management
- Responsive design with Tailwind CSS
- Accessible UI components from shadcn/ui

## Troubleshooting

### Common Issues:

1. **Awards not showing:**
   - Check if user is authenticated
   - Verify awards are marked as public
   - Check database connection

2. **Cannot create award:**
   - Verify user has admin role
   - Check all required fields are filled
   - Verify recipient employee exists

3. **Employee dropdown empty:**
   - Ensure employees exist in database
   - Check API permissions
   - Verify employee fetch endpoint

4. **Awards not deleting:**
   - Verify admin permissions
   - Check for database constraints
   - Review server logs

