@echo off
set SCRIPT_DIR=%~dp0
set TARGET=%SCRIPT_DIR%run_app.bat
set SHORTCUT=%USERPROFILE%\Desktop\Modulation Menu Engine.lnk

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT%'); $s.TargetPath = '%TARGET%'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'Modulation Menu Engine'; $s.Save()"

echo.
echo Desktop shortcut created: Modulation Menu Engine
echo You can now double-click it on your Desktop to run the app.
echo.
pause
