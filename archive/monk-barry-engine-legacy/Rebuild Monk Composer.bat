@echo off
title Rebuild Monk Composer
cd /d "%~dp0"

echo.
echo  Rebuilding Monk Composer (this may take 1-2 minutes)...
echo.

npm run electron:build

echo.
echo  Done. You can now run Monk Composer from your Desktop shortcut.
echo.
pause
