@echo off
echo Starting KIN-G+ Server with Database...
echo.

cd server

echo Installing dependencies...
call npm install

echo.
echo Generating Prisma client...
call npx prisma generate

echo.
echo Starting server...
echo Server will be available at: http://localhost:3000
echo Test endpoint: http://localhost:3000/api/test
echo.

call npm run dev

pause
