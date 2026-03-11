@echo off
echo Big Ten Composer Workbench
echo.
cd /d "%~dp0"
start /b py -m streamlit run big_ten_workbench.py --server.port 8502 --server.headless true
timeout /t 6 /nobreak > nul
start http://localhost:8502
echo.
echo If you see Modulation Menu Engine, close it and go to: http://localhost:8502
echo Close this window when done.
pause
