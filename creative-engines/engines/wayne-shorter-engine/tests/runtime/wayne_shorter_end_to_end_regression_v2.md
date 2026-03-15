# Wayne Shorter Engine — End-to-End Regression V2

**Date:** 2026-03-15

**Purpose:** 10-run (and 20-run) regression. Generator does not crash; validator passes; MusicXML written; paths correct; no monophonic collapse; no literal loop failures.

---

## TEST RUN

- **Test runner:** 20 runs (wayne_shorter_runtime_test_runner.py)
- **Output directory:** output/test_runs/
- **Result:** 20/20 PASS

---

## VERIFICATION

| Check | Result |
|-------|--------|
| Generator does not crash | PASS |
| Validator passes outputs | PASS (GCE ≥ 9.0) |
| MusicXML files written | PASS (20 files) |
| Output paths correct | PASS (test_runs only; not output/) |
| No monophonic collapse | PASS (melody + bass roles) |
| No literal loop failures | PASS (transformations used) |
| MusicXML structure valid | PASS (XML declaration, score-partwise, part-list, part, measure, note, pitch) |

---

## SUMMARY

- **Pass rate:** 100%
- **Output isolation:** Test runner writes to output/test_runs/; main output/ untouched
