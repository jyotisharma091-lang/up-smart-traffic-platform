@echo off
echo ===================================================
echo    Starting UP Smart Traffic Platform
echo ===================================================

echo [1/2] Starting Backend Server...
start "UP Traffic - Backend" cmd /k "cd backend && npm run dev"

echo [2/2] Starting Frontend Server...
start "UP Traffic - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are booting up in separate windows!
echo - Backend will run on http://localhost:5000
echo - Frontend will run on http://localhost:5173
echo.
echo Keep both command prompt windows open to keep the platform running.
pause
