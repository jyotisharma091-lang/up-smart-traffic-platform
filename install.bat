@echo off
echo ===================================================
echo    Installing UP Smart Traffic Platform Dependencies
echo ===================================================
echo.

echo [1/2] Installing Backend Dependencies...
cd backend
call npm install
cd ..
echo Backend install complete!
echo.

echo [2/2] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..
echo Frontend install complete!
echo.

echo ===================================================
echo All dependencies installed successfully!
echo You can now double-click 'start.bat' to run the app.
echo ===================================================
pause
