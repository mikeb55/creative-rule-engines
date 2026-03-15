# Wayne Shorter Engine Launcher Plan

**Purpose:** Define how the engine will later be triggered via desktop launcher.

---

## Launcher Behavior

1. User double-clicks **Wayne Shorter Engine** (desktop shortcut or script).
2. Launcher invokes runtime generator.
3. Runtime generates new Shorter-style composition.
4. Validator runs; if pass, export MusicXML.
5. File written to outputs directory.
6. User receives new MusicXML composition.

---

## Expected Result

**Double-click:** Wayne Shorter Engine

**Result:** New MusicXML composition generated.

---

## Expected Output Location

```
creative-engines/engines/wayne-shorter-engine/outputs/
```

---

## File Naming Convention

```
shorter_phrase_YYYY_MM_DD_HHMM.musicxml
```

Example: `shorter_phrase_2026_03_15_1200.musicxml`

---

## Launcher Implementation (Future)

- PowerShell script (e.g., `wayne_shorter_launcher.ps1`)
- Python wrapper (e.g., `run_shorter_engine.py`)
- Batch file for Windows desktop shortcut
- Desktop icon: "Wayne Shorter Engine"

---

## Status

Launcher not implemented. Plan only. See launcher/wayne_shorter_launcher_plan.md for launcher-specific details.
