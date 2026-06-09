@echo off
:: start_frontend.bat — One-click frontend launcher for QUANTUM AGENT

echo.
echo  ╔══════════════════════════════════════╗
echo  ║      QUANTUM AGENT — Frontend        ║
echo  ║      Starting React on port 5173     ║
echo  ╚══════════════════════════════════════╝
echo.

cd /d "%~dp0frontend"

echo Verifying and installing frontend dependencies...
call npm install

echo Starting React dev server...
call npm run dev

pause
