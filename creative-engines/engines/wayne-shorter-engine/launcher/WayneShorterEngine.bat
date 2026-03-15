@echo off
REM Wayne Shorter Engine — Windows Launcher
REM Launches the Tkinter UI from the Wayne Shorter engine directory.

cd /d "%~dp0.."
set ENGINE_DIR=%CD%

REM Use py launcher (Python 3)
py "%ENGINE_DIR%\ui\wayne_shorter_engine_app.py"

if errorlevel 1 (
    echo.
    echo Failed to start. Ensure Python 3 is installed and tkinter is available.
    pause
)
