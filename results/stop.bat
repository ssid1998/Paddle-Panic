@echo off
REM Paddle Panic - Stop Script (Windows)
REM This script kills any process running on port 3000

set PORT=3000

echo 🛑 Stopping Paddle Panic server on port %PORT%...

REM Find and kill process using port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
    taskkill /F /PID %%a 2>nul
    echo ✅ Server stopped (PID: %%a)
    goto :done
)

echo ℹ️  No server running on port %PORT%

:done
