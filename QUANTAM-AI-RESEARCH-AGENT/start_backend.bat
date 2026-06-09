@echo off
:: start_backend.bat — One-click backend launcher for QUANTUM AGENT
:: Detects default python capability and uses Python 3.12 fallback if necessary.

echo.
echo  ╔══════════════════════════════════════╗
echo  ║      QUANTUM AGENT — Backend         ║
echo  ║      Starting FastAPI on port 8000   ║
echo  ╚══════════════════════════════════════╝
echo.

cd /d "%~dp0backend"

:: Check if default python works
python -c "import encodings" >nul 2>&1
if %errorlevel% equ 0 (
    set PY_CMD=python
) else (
    echo [WARNING] Default system Python (3.14) is broken (missing 'encodings' module).
    echo Falling back to Python 3.12...
    if exist "C:\Users\DELL\AppData\Local\Programs\Python\Python312\python.exe" (
        set PY_CMD="C:\Users\DELL\AppData\Local\Programs\Python\Python312\python.exe"
    ) else (
        echo [ERROR] Working Python 3.12 installation not found at C:\Users\DELL\AppData\Local\Programs\Python\Python312\python.exe.
        echo Please repair your Python installation or install Python 3.12.
        pause
        exit /b 1
    )
)

echo Using Python environment: %PY_CMD%

echo Installing and verifying requirements...
%PY_CMD% -m pip install -r requirements.txt

echo Starting FastAPI server...
%PY_CMD% main.py

pause
