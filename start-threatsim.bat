@echo off
echo Starting ThreatSim...

:: Start the server in a new terminal window
start "ThreatSim Server" cmd /k "cd /d %~dp0server && npm run dev"

:: Wait a moment for the server to initialize
timeout /t 3 /nobreak >nul

:: Start the client in a new terminal window
start "ThreatSim Client" cmd /k "cd /d %~dp0client && npm run dev"

echo Both server and client are starting in separate windows.
