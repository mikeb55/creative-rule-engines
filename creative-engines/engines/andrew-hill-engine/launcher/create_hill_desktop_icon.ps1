# Create Desktop Shortcut — Andrew Hill Engine
# Automatically places "Andrew Hill Engine.lnk" on the user's Desktop

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$launcherPath = (Resolve-Path $scriptDir).Path
$launcherScript = Join-Path $launcherPath "hill_engine_launcher.ps1"

# Verify launcher exists
if (-not (Test-Path $launcherScript)) {
    Write-Host "FAILURE: hill_engine_launcher.ps1 not found at $launcherScript" -ForegroundColor Red
    exit 1
}

# Detect Desktop path
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "Andrew Hill Engine.lnk"

try {
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($shortcutPath)

    $Shortcut.TargetPath = "powershell.exe"
    $Shortcut.Arguments = "-ExecutionPolicy Bypass -File `"$launcherScript`""
    $Shortcut.WorkingDirectory = $launcherPath
    $Shortcut.Description = "Andrew Hill Engine - Generate Hill phrase, validate, export MusicXML"

    # Use custom icon if it exists, otherwise PowerShell default
    $iconPath = Join-Path $launcherPath "hill_engine_icon.ico"
    if (Test-Path $iconPath) {
        $Shortcut.IconLocation = $iconPath
    } else {
        $Shortcut.IconLocation = "powershell.exe,0"
    }

    $Shortcut.Save()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($WshShell) | Out-Null

    Write-Host "SUCCESS: Desktop shortcut created." -ForegroundColor Green
    Write-Host "  Shortcut path: $shortcutPath" -ForegroundColor Cyan
    Write-Host "  Target: hill_engine_launcher.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Double-click 'Andrew Hill Engine' on your desktop to generate a new Hill phrase." -ForegroundColor White
} catch {
    Write-Host "FAILURE: Could not create shortcut. $_" -ForegroundColor Red
    exit 1
}
