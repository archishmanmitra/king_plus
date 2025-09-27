# Initial Setup Guide

## ✅ **Setup Route Created**

I've created a `/api/auth/setup` endpoint that allows you to create an initial admin user when no users exist in the database.

## 🔧 **What Was Added**

### 1. **Backend Setup Route** (`/api/auth/setup`)
- ✅ Creates initial admin user with `global_admin` role
- ✅ Creates associated employee record
- ✅ Generates JWT token for immediate login
- ✅ Only works when no users exist in database
- ✅ Returns user data and token for frontend

### 2. **Frontend Setup Page** (`/setup`)
- ✅ Beautiful setup form with validation
- ✅ Automatic login after successful setup
- ✅ Redirects to dashboard after completion
- ✅ Accessible at `http://localhost:8080/setup`

## 🚀 **How to Use the Setup**

### Option 1: Use the Frontend Setup Page
1. **Start the server**: `cd server && npm run dev`
2. **Start the frontend**: `cd client && npm run dev`
3. **Visit**: `http://localhost:8080/setup`
4. **Fill the form** with admin details
5. **Submit** to create the initial admin

### Option 2: Use API Directly
```bash
curl -X POST http://localhost:3000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "System Administrator",
    "email": "admin@company.com",
    "password": "password123"
  }'
```

### Option 3: Use the Test Script
```bash
node test-setup.js
```

## 📋 **Setup Requirements**

### Required Fields:
- **name**: Full name of the administrator
- **email**: Email address for login
- **password**: Password (minimum 8 characters)

### Database Requirements:
- Database must be empty (no existing users)
- Prisma client must be generated
- Database migrations must be run

## 🔒 **Security Features**

1. **One-time Setup**: Only works when no users exist
2. **Password Hashing**: Passwords are properly hashed with bcrypt
3. **JWT Tokens**: Secure authentication tokens
4. **Role-based Access**: Creates user with `global_admin` role

## 🧪 **Testing the Setup**

### 1. **Test the Endpoint**
```bash
# Test with curl
curl -X POST http://localhost:3000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"password123"}'
```

### 2. **Test the Frontend**
- Visit `http://localhost:8080/setup`
- Fill out the form
- Check if you're redirected to dashboard

### 3. **Verify Database**
- Check that user was created in database
- Verify employee record was created
- Confirm JWT token works

## 📁 **Files Created/Modified**

- ✅ `server/src/routers/auth.ts` - Added setup endpoint
- ✅ `client/src/pages/Setup.tsx` - Setup page component
- ✅ `client/src/App.tsx` - Added setup route
- ✅ `test-setup.js` - Test script
- ✅ `INITIAL_SETUP_GUIDE.md` - This guide

## 🎯 **Complete Setup Flow**

1. **Start the server** with database connection
2. **Visit** `http://localhost:8080/setup`
3. **Fill out** the admin form
4. **Submit** to create initial admin
5. **Get redirected** to dashboard automatically
6. **Start creating** other employees and users

## 🔄 **After Setup**

Once the initial admin is created:
- You can login with the created credentials
- You can create other users through the employee creation flow
- The setup route will no longer work (returns 403 error)
- You can start using the complete employee management system

## 🚨 **Important Notes**

- **One-time only**: Setup only works when database is empty
- **Secure**: Use a strong password for the admin account
- **Backup**: Keep the admin credentials safe
- **Database**: Ensure your database is properly configured

The setup system is now ready to use! 🎉
