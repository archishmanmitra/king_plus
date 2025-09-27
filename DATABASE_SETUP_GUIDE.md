# Database Setup Guide

## ✅ **Database Integration Restored**

I've restored all the routers to use the real database with Prisma instead of mock data. The server now works with your configured database.

## 🔧 **What Was Restored**

### 1. **Auth Router** (`server/src/routers/auth.ts`)
- ✅ Restored Prisma database connection
- ✅ Real user authentication with database
- ✅ JWT token verification with database lookup

### 2. **Employees Router** (`server/src/routers/employees.ts`)
- ✅ Restored Prisma database connection
- ✅ Real employee creation with database storage
- ✅ Invitation generation with database storage

### 3. **Invitations Router** (`server/src/routers/invitations.ts`)
- ✅ Restored Prisma database connection
- ✅ Real invitation management with database
- ✅ User account creation with database storage

## 🚀 **How to Start the Server**

### Option 1: Use the Database Script
```bash
start-server-with-db.bat
```

### Option 2: Manual Start
```bash
cd server
npm install
npx prisma generate
npm run dev
```

## 🗄️ **Database Requirements**

Make sure your database is set up with:

1. **Environment Variables** (create `server/.env`):
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   CORS_ORIGINS="http://localhost:8080,http://localhost:5173"
   ```

2. **Database Migration**:
   ```bash
   cd server
   npx prisma migrate dev
   ```

3. **Prisma Client Generation**:
   ```bash
   npx prisma generate
   ```

## 🧪 **Test the Server**

1. **Health Check:**
   - Visit: `http://localhost:3000/api/test`
   - Should return: `{"message":"Server is running!","timestamp":"...","port":3000}`

2. **Database Connection Test:**
   - The server will automatically test the database connection on startup
   - Check the console for any database connection errors

3. **Complete Flow Test:**
   - Start frontend: `cd client && npm run dev`
   - Visit: `http://localhost:8080/test`
   - Test the complete employee creation and invitation flow

## 📊 **Database Schema**

The server uses the following key models:
- `User` - User accounts with authentication
- `Employee` - Employee records
- `UserInvitation` - Invitation tokens and status
- `EmployeeOfficial` - Official employee information
- `EmployeePersonal` - Personal employee information
- `BankAccount` - Employee bank account details

## 🔍 **Troubleshooting**

### Database Connection Issues
1. **Check your DATABASE_URL** in the `.env` file
2. **Ensure PostgreSQL is running**
3. **Verify database credentials**

### Prisma Issues
1. **Generate Prisma client**: `npx prisma generate`
2. **Run migrations**: `npx prisma migrate dev`
3. **Reset database**: `npx prisma migrate reset`

### Server Issues
1. **Check console for error messages**
2. **Verify all dependencies are installed**: `npm install`
3. **Check port 3000 is available**

## 🎯 **Next Steps**

1. **Set up your database** with the correct connection string
2. **Run database migrations** to create the schema
3. **Start the server** using `start-server-with-db.bat`
4. **Test the complete flow** at `http://localhost:8080/test`

The server now works with your real database configuration! 🎉

## 📁 **Files Modified**

- ✅ `server/src/routers/auth.ts` - Restored database authentication
- ✅ `server/src/routers/employees.ts` - Restored database employee creation
- ✅ `server/src/routers/invitations.ts` - Restored database invitation system
- ✅ `start-server-with-db.bat` - Database startup script
- ✅ `DATABASE_SETUP_GUIDE.md` - This guide
