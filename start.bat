@echo off
REM English Learning System - Windows Quick Start Script

echo.
echo 🚀 English Learning System - Starting...
echo.

REM Check Node.js installation
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found:
node --version
echo ✅ npm found:
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing server dependencies...
    call npm install --quiet
    echo ✅ Server dependencies installed
)

REM Check if client node_modules exists
if not exist "client\node_modules" (
    echo 📦 Installing client dependencies...
    cd client
    call npm install --quiet
    cd ..
    echo ✅ Client dependencies installed
)

echo.
echo 🎯 Starting the application...
echo.
echo Server will run on: http://localhost:3001
echo Client will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the application
echo.

call npm run dev
pause
