@echo off
cd /d "%~dp0"
echo Mo ung dung tai http://127.0.0.1:3100/chart
echo Giu cua so nay mo trong khi su dung. Nhan Ctrl+C de dung.
call npm.cmd run dev -- --port 3100
pause
