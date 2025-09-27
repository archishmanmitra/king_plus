@echo off
echo Starting KIN-G+ Backend Server...
echo.

cd server

echo Installing dependencies...
call npm install

echo.
echo Starting server...
call npm run dev

pause
