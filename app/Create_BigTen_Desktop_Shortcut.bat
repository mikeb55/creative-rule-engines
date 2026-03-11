@echo off
echo Creating Big Ten Composer Workbench desktop shortcut...
echo.

cd /d "%~dp0"

REM Create icon if PNG exists and Pillow is available
if exist bigten_icon.png (
    py -c "from PIL import Image; img=Image.open('bigten_icon.png').convert('RGBA'); img.save('bigten_icon.ico', format='ICO', sizes=[(256,256),(48,48),(32,32),(16,16)])" 2>nul
)

set TARGET=%~dp0run_big_ten_workbench.bat
set SHORTCUT=%USERPROFILE%\Desktop\Big Ten Composer Workbench.lnk

if exist bigten_icon.ico (
    powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT%'); $s.TargetPath = '%TARGET%'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'Big Ten Composer Workbench'; $s.IconLocation = '%~dp0bigten_icon.ico'; $s.Save()"
    echo Shortcut created with custom icon.
) else (
    powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT%'); $s.TargetPath = '%TARGET%'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'Big Ten Composer Workbench'; $s.Save()"
    echo Shortcut created with default icon.
)

echo.
echo Desktop shortcut: Big Ten Composer Workbench
echo Double-click it on your Desktop to run the app.
echo.
pause
