@echo off
cd /d "%~dp0"

echo ==========================================
echo  ATK App - Build and Start (pnpm)
echo ==========================================
echo.

echo Building app...
call pnpm build
if errorlevel 1 (
  echo.
  echo Build failed. See messages above.
  goto end
)

echo.
echo Starting app...
echo (Window will stay open after server stops.)
echo.
call pnpm start

:end
echo.
echo Done. Press any key to close this window.
pause >nul
