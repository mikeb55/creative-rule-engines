# Wayne Shorter Engine — Output Behavior Fix Report V2

**Date:** 2026-03-15

---

## ROOT CAUSE OF MULTI-FILE FLOODING

1. **Test runner wrote to main output/** — Previously, the 20-run test runner wrote to `output/`, mixing test output with user files.
2. **No output directory separation** — UI and test runner both used `output/` with no isolation for batch runs.
3. **UI run count** — Default was 1, but batch (2+) had no separate destination.

---

## FILES CHANGED

| File | Change |
|------|--------|
| runtime/wayne_shorter_runtime_test_runner.py | Output dir: `output/test_runs/` (unchanged from V1 fix) |
| ui/wayne_shorter_engine_app.py | Pass `output_dir`; run_count 1 → `output/`, run_count 2+ → `output/test_runs/` |
| runtime/wayne_shorter_runtime_generator.py | Accepts `output_dir` param; no change to logic |

---

## NORMAL OUTPUT VS TEST OUTPUT SEPARATION CONFIRMED

| Source | Output Directory | When |
|--------|------------------|------|
| UI (Generate, Ideas=1) | `output/` | Single-file generation |
| UI (Generate, Ideas≥2) | `output/test_runs/` | Batch exploration |
| Test runner (20 runs) | `output/test_runs/` | Automated regression |
| CLI (main) | `output/` | Manual single run |

---

## BEHAVIOR SUMMARY

- **Single generation** returns one file path to `output/`
- **Batch generation** returns multiple paths only when Ideas to generate > 1; writes to `output/test_runs/`
- **Test runner** never writes to `output/`; always uses `output/test_runs/`
