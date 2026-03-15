# Wayne Shorter UI Smoke Test V3

**Date:** 2026-03-15

---

## TEST PROCEDURE

1. Launch app via `launcher/WayneShorterEngine.bat` or `py ui/wayne_shorter_engine_app.py`
2. Verify one-click default generation creates one file only
3. Verify Open Output Folder works
4. Verify Advanced section (seed) is collapsible

---

## RESULTS

| Test | Status | Notes |
|------|--------|-------|
| UI launches | PASS | Tkinter window opens with title "Wayne Shorter Engine" |
| Launcher works | PASS | WayneShorterEngine.bat launches from engine directory |
| One-click default (Ideas=1) | PASS | Generate creates exactly one file in output/ |
| Open Output Folder | PASS | Opens output/ directory |
| Advanced collapsible | PASS | Seed in Advanced ▸; click to expand/collapse |
| Musical-intent controls | PASS | Generate, Form, Harmony, Phrase structure, Output dropdowns present |

---

## VERIFICATION

- **Default Ideas to generate:** 1
- **Single run output:** `output/wayne_shorter_output_NNN.musicxml`
- **Batch run (Ideas ≥ 2):** `output/test_runs/`
