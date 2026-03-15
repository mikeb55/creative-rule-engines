# Wayne Shorter Engine — Output Behavior Fix Report V1

**Date:** 2026-03-15

---

## ROOT CAUSE

1. **Test runner wrote to main output/** — The runtime test runner (20 runs) wrote MusicXML files to `output/`, the same folder used by the UI. This mixed test output with user-generated files.

2. **No output directory separation** — UI and test runner both used `output/` with no way to isolate batch/test runs.

3. **Run count visibility** — UI default was already 1, but the label "Run count" did not clearly indicate that 1 = single file.

---

## FILES CHANGED

| File | Change |
|------|--------|
| runtime/wayne_shorter_runtime_test_runner.py | Output dir changed from `output/` to `output/test_runs/` |
| ui/wayne_shorter_engine_app.py | Pass `output_dir` explicitly to generator; label "Run count (1 = single file)" |
| tests/runtime/wayne_shorter_output_behavior_fix_report_v1.md | Created (this report) |

---

## CONFIRMATION: UI GENERATES ONE FILE BY DEFAULT

- **Run count default:** 1 (unchanged; now clearly labeled)
- **Label:** "Run count (1 = single file)" — user sees that 1 produces a single file
- **Verification:** `generate_shorter_output(run_count=1, output_dir=output/)` returns list of 1 path
- **Output location:** `output/` (not test_runs)

---

## CONFIRMATION: BATCH TESTS WRITE TO output/test_runs/

- **Test runner output_dir:** `engine_dir / "output" / "test_runs"`
- **Verification:** Running test runner creates wayne_shorter_output_001–020 in `output/test_runs/`
- **Main output folder:** `output/` remains clean of test runner output

---

## BEHAVIOR SUMMARY

| Source | Output Directory | Default Run Count |
|--------|------------------|-------------------|
| UI (Generate button) | output/ | 1 |
| Test runner (20 runs) | output/test_runs/ | 20 |
| CLI (wayne_shorter_runtime_generator.py) | output/ | 1 |
