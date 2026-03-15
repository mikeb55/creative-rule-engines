# Wayne Shorter Engine Launcher Plan

**Purpose:** Define how the engine will later be triggered via desktop launcher.

---

## LAUNCHER BEHAVIOR

1. User double-clicks **Wayne Shorter Engine** (desktop shortcut or script).
2. Launcher invokes runtime generator.
3. Runtime generates new Shorter-style composition.
4. Validator runs; if pass, export MusicXML.
5. File written to outputs directory.
6. User receives new MusicXML composition.

---

## EXPECTED RESULT

**Double-click:** Wayne Shorter Engine

**Result:** New MusicXML composition generated.

---

## EXPECTED OUTPUT LOCATION

```
creative-engines/engines/wayne-shorter-engine/outputs/
```

---

## FILE NAMING CONVENTION

```
shorter_phrase_YYYY_MM_DD_HHMM.musicxml
```

Example: `shorter_phrase_2026_03_15_1200.musicxml`

---

## LAUNCHER IMPLEMENTATION (Future)

### Option A — PowerShell

- Script: `wayne_shorter_launcher.ps1`
- Invokes: `run_shorter_engine.py` (or equivalent)
- Desktop shortcut: Target = `powershell -File wayne_shorter_launcher.ps1`

### Option B — Python Wrapper

- Script: `run_shorter_engine.py`
- Calls runtime generator
- Writes MusicXML to outputs
- Can be invoked by batch file or PowerShell

### Option C — Batch File

- Script: `run_wayne_shorter_engine.bat`
- Calls Python or PowerShell
- Desktop shortcut: Target = batch file path

---

## DESKTOP ICON

- Name: **Wayne Shorter Engine**
- Icon: Optional (saxophone or custom)
- Double-click → generate → MusicXML in outputs

---

## WORKFLOW

```
User double-clicks
  → Launcher starts
  → Runtime generates phrase
  → Validator checks
  → If pass: export MusicXML
  → File saved to outputs/
  → User notified (optional: open file, show path)
```

---

## STATUS

Plan only. Launcher not implemented. Requires runtime generator first.
