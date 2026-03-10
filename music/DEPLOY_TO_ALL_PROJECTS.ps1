# MusicXML Quality Gate - Deploy to All Projects
# This script automatically sets up the Quality Gate in all projects that generate MusicXML

$ErrorActionPreference = "Stop"

Write-Host "=== MusicXML Quality Gate - Deploy to All Projects ===" -ForegroundColor Cyan
Write-Host ""

# Get the base projects directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
# Script is in: C:\Users\mike\Documents\Cursor AI Projects\creative-rule-engines\music
# Base dir should be: C:\Users\mike\Documents\Cursor AI Projects
$BaseDir = Split-Path -Parent (Split-Path -Parent $ScriptDir)
$TemplateFile = Join-Path $ScriptDir "SYSTEM_CONTROL_TEMPLATE.md"

if (-not (Test-Path $TemplateFile)) {
    Write-Host "ERROR: Template file not found: $TemplateFile" -ForegroundColor Red
    exit 1
}

# Projects that generate MusicXML
$ProjectsToSetup = @(
    "GCE-Jazz",
    "large-ensemble-assistant",
    "Quartet ReVisions",
    "Nocturne PolyChordal"
)

$SuccessCount = 0
$SkipCount = 0
$ErrorCount = 0

foreach ($ProjectName in $ProjectsToSetup) {
    $ProjectPath = Join-Path $BaseDir $ProjectName
    
    if (-not (Test-Path $ProjectPath)) {
        Write-Host "[SKIP] '$ProjectName' (not found)" -ForegroundColor Yellow
        $SkipCount++
        continue
    }
    
    Write-Host "Processing: $ProjectName" -ForegroundColor Cyan
    
    # Check if already has SYSTEM_CONTROL.md with Quality Gate
    $ExistingControl = Join-Path $ProjectPath "_cursor\SYSTEM_CONTROL.md"
    if (Test-Path $ExistingControl) {
        $Content = Get-Content $ExistingControl -Raw -ErrorAction SilentlyContinue
        if ($Content -and $Content -match "MUSICXML QUALITY GATE") {
            Write-Host "  [OK] Already has MusicXML Quality Gate" -ForegroundColor Green
            $SkipCount++
            continue
        }
    }
    
    # Create _cursor directory if needed
    $CursorDir = Join-Path $ProjectPath "_cursor"
    if (-not (Test-Path $CursorDir)) {
        New-Item -ItemType Directory -Path $CursorDir -Force | Out-Null
        Write-Host "  [INFO] Created _cursor directory" -ForegroundColor Gray
    }
    
    # Backup existing file if present
    if (Test-Path $ExistingControl) {
        $BackupFile = "$ExistingControl.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Copy-Item -Path $ExistingControl -Destination $BackupFile -Force
        Write-Host "  [INFO] Backed up existing file" -ForegroundColor Gray
    }
    
    # Copy template
    try {
        Copy-Item -Path $TemplateFile -Destination $ExistingControl -Force
        Write-Host "  [OK] Successfully deployed to $ProjectName" -ForegroundColor Green
        $SuccessCount++
    } catch {
        Write-Host "  [ERROR] Failed to deploy: $($_.Exception.Message)" -ForegroundColor Red
        $ErrorCount++
    }
    
    Write-Host ""
}

Write-Host "=== Deployment Summary ===" -ForegroundColor Cyan
Write-Host "  Success: $SuccessCount" -ForegroundColor Green
Write-Host "  Skipped: $SkipCount" -ForegroundColor Yellow
Write-Host "  Errors:  $ErrorCount" -ForegroundColor $(if ($ErrorCount -gt 0) { "Red" } else { "Green" })
Write-Host ""
Write-Host "The MusicXML Quality Gate is now active in all configured projects." -ForegroundColor Green
