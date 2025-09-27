# Server Fix Guide

## ✅ Issues Fixed

1. **Import Statements** - Changed from `import * as` to default imports
2. **TypeScript Types** - Added proper type annotations for CORS callback
3. **Health Check** - Added `/api/test` endpoint for testing
4. **Simple Server** - Created a database-free test server

## 🚀 How to Start the Server

### Option 1: Full Server (with database)
```bash
cd server
npm install
npm run dev
```

### Option 2: Simple Server (no database required)
```bash
cd server
npm install
npm run simple
```

### Option 3: Use Batch Script
```bash
start-server.bat
```

## 🔧 What Was Fixed

### 1. Import Issues
**Before:**
```typescript
import * as express from 'express'
import * as cors from 'cors'
```

**After:**
```typescript
import express from 'express'
import cors from 'cors'
```

### 2. TypeScript Types
**Before:**
```typescript
origin: (origin, callback) => {
```

**After:**
```typescript
origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
```

### 3. Added Health Check
```typescript
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    port: PORT 
  })
})
```

## 🧪 Testing the Server

### 1. Check if server is running:
Visit: `http://localhost:3000/api/test`

You should see:
```json
{
  "message": "Server is running!",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "port": 3000
}
```

### 2. Test login endpoint:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"password"}'
```

## 🐛 Troubleshooting

### If you get "Cannot find module" errors:
```bash
cd server
npm install
```

### If you get TypeScript errors:
```bash
cd server
npx tsc --noEmit
```

### If you get database connection errors:
Use the simple server instead:
```bash
npm run simple
```

### If port 3000 is busy:
Change the port in your environment or kill the process:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

## 📁 Files Created/Modified

- ✅ `server/src/index.ts` - Fixed import statements and types
- ✅ `server/src/simple-server.ts` - Database-free test server
- ✅ `server/package.json` - Added simple server script
- ✅ `start-server.bat` - Windows batch script
- ✅ `SERVER_FIX_GUIDE.md` - This guide

## 🎯 Next Steps

1. **Start the server** using one of the methods above
2. **Test the connection** by visiting `http://localhost:3000/api/test`
3. **Start the frontend** in another terminal: `cd client && npm run dev`
4. **Test the complete flow** at `http://localhost:8080/test`

The server should now start without errors! 🎉
