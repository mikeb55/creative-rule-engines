@echo off
title Monk Composer
cd /d "%~dp0\creative-engines\apps\monk-composer"

echo.
echo  Starting Monk Composer...
echo  (Keep this window open while using the app)
echo.

npm run electron:dev

pause
