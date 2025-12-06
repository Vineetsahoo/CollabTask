@echo off
echo Starting CollabTask in Development Mode...
echo.
echo This will start both the React dev server and Electron with hot reload.
echo Keep this window open while developing.
echo Press Ctrl+C to stop both processes.
echo.

npx concurrently "npm run dev" "npx wait-on http://localhost:5173 && npx electron ."
