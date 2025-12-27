@echo off
REM ================================================
REM RHS MDM System V2.0 - Deployment Preparation Script (Windows)
REM This script helps prepare your system for deployment
REM ================================================

echo ========================================
echo RHS MDM System V2.0 - Deployment Preparation
echo ========================================
echo.

REM ========================================
REM Step 1: Check Node.js installation
REM ========================================
echo Step 1: Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% equ 0 (
    node -v
    echo [OK] Node.js is installed
) else (
    echo [ERROR] Node.js is NOT installed
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo.

REM ========================================
REM Step 2: Check npm installation
REM ========================================
echo Step 2: Checking npm installation...
where npm >nul 2>nul
if %errorlevel% equ 0 (
    npm -v
    echo [OK] npm is installed
) else (
    echo [ERROR] npm is NOT installed
    pause
    exit /b 1
)
echo.

REM ========================================
REM Step 3: Check Git installation
REM ========================================
echo Step 3: Checking Git installation...
where git >nul 2>nul
if %errorlevel% equ 0 (
    git --version
    echo [OK] Git is installed
) else (
    echo [ERROR] Git is NOT installed
    echo Please install Git from: https://git-scm.com/
    pause
    exit /b 1
)
echo.

REM ========================================
REM Step 4: Install dependencies
REM ========================================
echo Step 4: Installing dependencies...
if exist "package.json" (
    call npm install
    if %errorlevel% equ 0 (
        echo [OK] Dependencies installed successfully
    ) else (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [ERROR] package.json not found!
    pause
    exit /b 1
)
echo.

REM ========================================
REM Step 5: Check .env file
REM ========================================
echo Step 5: Checking environment configuration...
if exist ".env" (
    echo [OK] .env file exists
    echo [WARNING] Please make sure all variables are configured!
) else (
    echo [WARNING] .env file NOT found
    echo Creating .env from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo [OK] .env file created
        echo [WARNING] IMPORTANT: Edit .env file and add your configuration!
    ) else (
        echo [ERROR] .env.example not found!
        pause
        exit /b 1
    )
)
echo.

REM ========================================
REM Step 6: Generate JWT Secret
REM ========================================
echo Step 6: Generating JWT Secret...
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" > jwt_secret.txt
echo [OK] JWT Secret generated and saved to jwt_secret.txt
echo.
echo ========================================
type jwt_secret.txt
echo ========================================
echo.
echo [WARNING] Copy this and add to your .env file as JWT_SECRET
echo.
del jwt_secret.txt

REM ========================================
REM Step 7: Git initialization
REM ========================================
echo Step 7: Git repository setup...
if exist ".git" (
    echo [OK] Git repository already initialized
) else (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - RHS MDM System V2.0"
    echo [OK] Git repository initialized
)
echo.

REM ========================================
REM Final Instructions
REM ========================================
echo ========================================
echo Preparation Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Edit .env file with your configuration:
echo    - MongoDB Atlas connection string
echo    - JWT secret (shown above)
echo    - Email credentials (optional)
echo.
echo 2. Create GitHub repository:
echo    - Go to: https://github.com/new
echo    - Create repository: rhs-mdm-system-v2
echo.
echo 3. Push to GitHub:
echo    git remote add origin https://github.com/YOUR_USERNAME/rhs-mdm-system-v2.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Deploy to hosting platform:
echo    - Render.com (Recommended): https://render.com/
echo    - Railway.app: https://railway.app/
echo.
echo 5. Read the complete guide:
echo    - Open: FREE_DEPLOYMENT_GUIDE.md
echo.
echo ========================================
echo Good luck with your deployment!
echo ========================================
echo.
pause
