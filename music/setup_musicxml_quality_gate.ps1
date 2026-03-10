# MusicXML Quality Gate - System-Wide Setup Script
# This script sets up the MusicXML Quality Gate in any project
# Run this from within a project root directory

$ErrorActionPreference = "Stop"

Write-Host "=== MusicXML Quality Gate - System-Wide Setup ===" -ForegroundColor Cyan
Write-Host ""

# Get the project root (where script is run from)
$ProjectRoot = $PSScriptRoot
if ($ProjectRoot -eq "") {
    $ProjectRoot = Get-Location
}

# Paths
$CursorDir = Join-Path $ProjectRoot "_cursor"
$SystemControlFile = Join-Path $CursorDir "SYSTEM_CONTROL.md"
$TemplateFile = Join-Path $ProjectRoot "..\creative-rule-engines\music\SYSTEM_CONTROL_TEMPLATE.md"

# Check if template exists
if (-not (Test-Path $TemplateFile)) {
    Write-Host "ERROR: Template file not found: $TemplateFile" -ForegroundColor Red
    Write-Host "Expected location: ..\creative-rule-engines\music\SYSTEM_CONTROL_TEMPLATE.md" -ForegroundColor Yellow
    Write-Host "Make sure you're running this from a project in 'Cursor AI Projects' folder" -ForegroundColor Yellow
    exit 1
}

# Check if creative-rule-engines exists
$CreativeRuleEnginesPath = Join-Path $ProjectRoot "..\creative-rule-engines\music"
if (-not (Test-Path $CreativeRuleEnginesPath)) {
    Write-Host "WARNING: creative-rule-engines folder not found at expected location" -ForegroundColor Yellow
    Write-Host "Expected: $CreativeRuleEnginesPath" -ForegroundColor Gray
    Write-Host "The template will be copied, but path references may need adjustment" -ForegroundColor Yellow
}

# Create _cursor directory if it doesn't exist
if (-not (Test-Path $CursorDir)) {
    Write-Host "Creating _cursor directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $CursorDir -Force | Out-Null
}

# Check if SYSTEM_CONTROL.md already exists
if (Test-Path $SystemControlFile) {
    Write-Host "WARNING: SYSTEM_CONTROL.md already exists at:" -ForegroundColor Yellow
    Write-Host "  $SystemControlFile" -ForegroundColor Gray
    $overwrite = Read-Host "Overwrite? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled. Existing file preserved." -ForegroundColor Yellow
        exit 0
    }
    Write-Host "Backing up existing file..." -ForegroundColor Yellow
    $BackupFile = "$SystemControlFile.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item -Path $SystemControlFile -Destination $BackupFile -Force
    Write-Host "Backup saved to: $BackupFile" -ForegroundColor Gray
}

# Copy template to SYSTEM_CONTROL.md
Write-Host "Installing SYSTEM_CONTROL.md..." -ForegroundColor Yellow
Copy-Item -Path $TemplateFile -Destination $SystemControlFile -Force

# Verify installation
if (Test-Path $SystemControlFile) {
    Write-Host ""
    Write-Host "✓ MusicXML Quality Gate is now active!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Location: $SystemControlFile" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Active Features:" -ForegroundColor Cyan
    Write-Host "  ✓ 8/10 minimum quality requirement for MusicXML export" -ForegroundColor Green
    Write-Host "  ✓ DTE Framework for jazz double-time material" -ForegroundColor Green
    Write-Host "  ✓ DTE-ARC Framework for multi-chorus solos" -ForegroundColor Green
    Write-Host "  ✓ Universal excellence-criteria for all styles" -ForegroundColor Green
    Write-Host "  ✓ Folder discipline and naming conventions" -ForegroundColor Green
    Write-Host ""
    Write-Host "The quality gate will apply to all MusicXML generation in this project." -ForegroundColor Green
} else {
    Write-Host "ERROR: Installation failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Setup complete! MusicXML Quality Gate is now system-wide for this project." -ForegroundColor Cyan











