@echo off
REM Create Andrew Hill Engine desktop shortcut
REM Double-click this file to place the shortcut on your Desktop

powershell.exe -ExecutionPolicy Bypass -File "%~dp0create_hill_desktop_icon.ps1"
pause
