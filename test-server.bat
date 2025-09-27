@echo off
echo Testing KIN-G+ Server...
echo.

cd server

echo Installing dependencies...
call npm install

echo.
echo Starting server with mock data...
echo Server will be available at: http://localhost:3000
echo Test endpoint: http://localhost:3000/api/test
echo.

call npm run dev

pause
