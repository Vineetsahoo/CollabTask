@echo off
echo Starting CollabTask Desktop App...
echo.
echo This will build the React app and launch the desktop application.
echo Press Ctrl+C to stop the application.
echo.

npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)

echo Build successful! Launching desktop app...
npm run electron
