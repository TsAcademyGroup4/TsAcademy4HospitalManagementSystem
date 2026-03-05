@echo off
REM Install Swagger packages for Hospital Management System
echo Installing Swagger documentation packages...
npm install swagger-ui-express swagger-jsdoc
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Packages installed successfully!
    echo.
    echo Next steps:
    echo 1. Start the server: npm run dev
    echo 2. Open your browser: http://localhost:5050/api-docs
    echo.
) else (
    echo.
    echo ✗ Installation failed. Please ensure npm is installed and try again.
    echo.
)
pause
