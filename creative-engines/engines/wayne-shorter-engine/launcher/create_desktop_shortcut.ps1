# Wayne Shorter Engine — Create Desktop Shortcut
# Creates a Windows desktop shortcut named "Wayne Shorter Engine"
# Points to launcher/WayneShorterEngine.bat with engine dir as working directory

$batPath = Join-Path $PSScriptRoot "WayneShorterEngine.bat"
$launcherDir = Split-Path $batPath -Parent
$engineDir = Split-Path $launcherDir -Parent
$desktop = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktop "Wayne Shorter Engine.lnk"

if (-not (Test-Path $batPath)) {
    Write-Host "Error: WayneShorterEngine.bat not found at $batPath"
    exit 1
}

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $batPath
$shortcut.WorkingDirectory = $engineDir
$shortcut.Description = "Wayne Shorter Engine - Generate Shorter-style MusicXML"
$shortcut.Save()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($shell) | Out-Null

Write-Host "Desktop shortcut created: $shortcutPath"
