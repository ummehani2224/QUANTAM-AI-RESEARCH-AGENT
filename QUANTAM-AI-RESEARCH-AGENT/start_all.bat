@echo off
:: start_all.bat — Start both backend and frontend servers in separate windows
echo.
echo  ╔══════════════════════════════════════╗
echo  ║      QUANTUM AGENT — Launcher        ║
echo  ║      Booting Backend and Frontend    ║
echo  ╚══════════════════════════════════════╝
echo.
echo Starting backend server in a separate window...
start "QUANTUM AGENT - Backend" cmd /c call "%~dp0start_backend.bat"
echo Starting frontend server in a separate window...
start "QUANTUM AGENT - Frontend" cmd /c call "%~dp0start_frontend.bat"
echo.
echo Both servers have been initiated. Please check their respective console windows.
timeout /t 5
