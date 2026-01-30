@echo off
REM Paddle Panic - Start Script (Windows)
REM This script stops any existing server and starts a fresh one

echo 🏓 Paddle Panic - Starting...
echo.

REM First, stop any existing server
call "%~dp0stop.bat" 2>nul

REM Change to the results directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

REM Start the server
echo 🚀 Launching server...
echo.
npm start
