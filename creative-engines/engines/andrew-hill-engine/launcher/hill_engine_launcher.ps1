# Andrew Hill Engine Launcher — Windows PowerShell wrapper
# V4.1 — Executes run_hill_engine.py and closes after generation

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$pythonScript = Join-Path $scriptDir "run_hill_engine.py"

if (-not (Test-Path $pythonScript)) {
    Write-Host "Error: run_hill_engine.py not found at $pythonScript"
    exit 1
}

try {
    # Prefer py (Windows launcher), fallback to python
    $py = Get-Command py -ErrorAction SilentlyContinue
    if ($py) { py $pythonScript } else { python $pythonScript }
} catch {
    Write-Host "Error running Hill engine: $_"
    exit 1
}
