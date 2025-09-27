# KIN-G+ Setup Guide

## Quick Start

### 1. Backend Server Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   - Copy `env-template.txt` to `.env`
   - Update the database URL and JWT secret as needed

4. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

### 3. Alternative: Use the Batch Script

On Windows, you can use the provided batch script:
```bash
start-servers.bat
```

## Troubleshooting

### Backend Connection Issues

If you see `ECONNREFUSED` errors:

1. **Check if backend is running:**
   - Visit `http://localhost:3000/api/test` in your browser
   - You should see a JSON response

2. **Check backend logs:**
   - Look for any error messages in the terminal where you started the server

3. **Verify port 3000 is free:**
   ```bash
   netstat -an | findstr :3000
   ```

### Database Issues

If you see Prisma errors:

1. **Check your database connection:**
   - Ensure PostgreSQL is running
   - Verify the DATABASE_URL in your .env file

2. **Run database migrations:**
   ```bash
   cd server
   npx prisma migrate dev
   ```

### Frontend Issues

If the frontend can't connect to backend:

1. **Check Vite proxy configuration:**
   - The `vite.config.ts` should proxy `/api` to `http://localhost:3000`

2. **Verify backend is running:**
   - Backend must be running on port 3000 before starting frontend

## Testing the Flow

1. **Start both servers**
2. **Navigate to:** `http://localhost:8080/test`
3. **Follow the test flow:**
   - Create a test employee
   - Test invitation flow
   - Test login functionality

## Default Login Credentials

For testing, you can use these demo credentials:
- Email: `admin@company.com`
- Password: `password`

## API Endpoints

- **Backend:** `http://localhost:3000`
- **Frontend:** `http://localhost:8080`
- **Test Page:** `http://localhost:8080/test`

## Environment Variables

Create a `.env` file in the `server` directory with:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/king_plus_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
CORS_ORIGINS="http://localhost:8080,http://localhost:5173"
```

## Common Issues

1. **Port already in use:** Change the PORT in .env file
2. **Database connection failed:** Check PostgreSQL is running and credentials are correct
3. **CORS errors:** Verify CORS_ORIGINS includes your frontend URL
4. **Module not found:** Run `npm install` in both directories
