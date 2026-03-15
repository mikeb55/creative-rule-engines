# Wayne Shorter UI Smoke Test V4

**Date:** 2026-03-15

---

## TEST PROCEDURE

1. Launch app via desktop shortcut "Wayne Shorter Engine" or `launcher/WayneShorterEngine.bat`
2. Verify Generate works (one-click default creates one file)
3. Verify Open Output Folder works
4. Verify Run Self-Test works
5. Verify musical menu controls present

---

## RESULTS

| Test | Status | Notes |
|------|--------|-------|
| UI launches | PASS | Tkinter window opens |
| Launcher works | PASS | WayneShorterEngine.bat launches from engine directory |
| Desktop shortcut | PASS | "Wayne Shorter Engine.lnk" on Desktop |
| One-click default (Ideas=1) | PASS | Generate creates exactly one file in output/ |
| Open Output Folder | PASS | Opens output/ directory |
| Run Self-Test | PASS | 5 runs to output/test_runs/; status shown |
| Musical menu | PASS | Generate, Form, Harmony, Phrase structure, Output, Ideas |

---

## VERIFICATION

- **Default Ideas to generate:** 1
- **Single run output:** `output/wayne_shorter_output_NNN.musicxml`
- **Batch run (Ideas ≥ 2):** `output/test_runs/`
- **Self-test output:** `output/test_runs/`
