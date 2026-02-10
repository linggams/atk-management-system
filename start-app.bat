@echo off
cd /d "%~dp0"
REM Gunakan Next.js lokal (tidak bergantung PATH/global pnpm saat jalan sebagai service)
call node_modules\.bin\next.cmd start -p 2000
