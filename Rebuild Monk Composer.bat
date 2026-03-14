@echo off
title Rebuild Monk Composer
cd /d "%~dp0\creative-engines\apps\monk-composer"

echo.
echo  Rebuilding Monk Composer (this may take 1-2 minutes)...
echo.

npm run electron:build

echo.
echo  Done. Check your Desktop for "Monk Composer" or "Monk Composer (Latest)".
echo.
pause
