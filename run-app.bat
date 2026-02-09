@echo off
cd /d "%~dp0"

echo Building app...
pnpm build
if errorlevel 1 (
  echo Build failed. Press any key to exit.
  pause >nul
  exit /b 1
)

echo.
echo Starting app...
pnpm start

echo.
echo App has stopped. Press any key to exit.
pause >nul

