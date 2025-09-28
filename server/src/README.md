# Server Architecture

This document outlines the clean architecture implemented for the King Plus server.

## Directory Structure

```
src/
├── controllers/          # Business logic controllers
│   ├── auth.ts          # Authentication logic
│   ├── employee.ts      # Employee management logic
│   └── invitation.ts    # Invitation handling logic
├── middleware/          # Express middleware functions
│   └── auth.ts          # Authentication & authorization middleware
├── routes/              # Route definitions
│   ├── auth.ts          # Authentication routes
│   ├── employees.ts     # Employee routes
│   └── invitations.ts   # Invitation routes
├── routers/             # Legacy router files (to be removed)
└── index.ts            # Main server file
```

## Architecture Benefits

### 1. **Separation of Concerns**

- **Controllers**: Handle business logic and database operations
- **Routes**: Define API endpoints and middleware chains
- **Middleware**: Reusable authentication and authorization logic

### 2. **Maintainability**

- Each file has a single responsibility
- Easy to locate and modify specific functionality
- Clear separation between public and protected routes

### 3. **Security**

- Centralized authentication middleware
- Role-based access control
- Consistent security patterns across routes

### 4. **Scalability**

- Easy to add new controllers and routes
- Middleware can be reused across different route groups
- Clear patterns for extending functionality

## Route Protection

### Public Routes

- `POST /api/auth/login` - User login
- `POST /api/auth/setup` - Initial admin setup
- `GET /api/invitations/:token` - Get invitation details
- `POST /api/invitations/accept` - Accept invitation

### Protected Routes

- `GET /api/auth/verify` - Verify JWT token (requires authentication)
- `POST /api/employees` - Create employee (requires admin role)

## Middleware Usage

### Authentication Middleware

```typescript
import { authenticateToken } from "../middleware/auth";

// Protect a route
router.get("/protected", authenticateToken, controller);
```

### Authorization Middleware

```typescript
import { requireAdmin, requireManager } from "../middleware/auth";

// Require admin role
router.post("/admin-only", authenticateToken, requireAdmin, controller);

// Require manager or admin role
router.get("/manager-access", authenticateToken, requireManager, controller);
```

## Migration Notes

The old router files in `/routers/` directory can now be safely removed as all functionality has been moved to the new structure:

- `routers/auth.ts` → `controllers/auth.ts` + `routes/auth.ts`
- `routers/employees.ts` → `controllers/employee.ts` + `routes/employees.ts`
- `routers/invitations.ts` → `controllers/invitation.ts` + `routes/invitations.ts`
