# Wayne Shorter Engine — Self-Test Report V1

**Date:** 2026-03-15

---

## SELF-TEST SCOPE

The Run Self-Test button in the UI triggers a controlled automated test that checks:

1. **UI launches** — Verified by user (button present)
2. **Runtime generator works** — 5 runs of run()
3. **Validator passes** — GCE ≥ 9.0 per run
4. **MusicXML export works** — Files written to output/test_runs/
5. **Output paths correct** — test_runs only; no output/ pollution
6. **Launcher path valid** — launcher/WayneShorterEngine.bat exists

---

## RESULTS

| Check | Status |
|-------|--------|
| Launcher path | OK |
| Run 1–5 | PASS |
| MusicXML structure | OK |
| Output directory | output/test_runs |

**Summary:** 5 passed, 0 failed
