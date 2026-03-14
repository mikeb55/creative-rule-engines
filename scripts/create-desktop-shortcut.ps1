# Create Monk Barry Composer desktop shortcut
$ErrorActionPreference = "Stop"
$desktop = [Environment]::GetFolderPath("Desktop")
$exePath = Join-Path $PSScriptRoot "..\apps\monk-barry-desktop\release\Monk Barry Composer 1.0.0.exe"
$shortcutPath = Join-Path $desktop "Monk Barry Composer.lnk"

if (-not (Test-Path $exePath)) {
  Write-Host "Executable not found: $exePath"
  exit 1
}

$WshShell = New-Object -ComObject WScript.Shell
$shortcut = $WshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $exePath
$shortcut.WorkingDirectory = Split-Path $exePath
$shortcut.Description = "Monk Barry Composer v1.0 Clean Rebuild"
$shortcut.Save()
Write-Host "Desktop shortcut created: $shortcutPath"
