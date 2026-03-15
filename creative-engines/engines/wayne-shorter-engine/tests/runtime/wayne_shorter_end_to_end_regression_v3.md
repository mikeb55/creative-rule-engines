# Wayne Shorter Engine — End-to-End Regression V3

**Date:** 2026-03-15

**Purpose:** 10-run regression. Mixed forms, mixed export modes, validator pass rate, correct output folder routing.

---

## TEST RUN

- **Runs:** 10
- **Output directory:** output/test_runs/
- **Result:** 10/10 PASS

---

## VERIFICATION

| Check | Result |
|-------|--------|
| Generator does not crash | PASS |
| Validator passes | PASS |
| MusicXML written | PASS |
| Output paths correct | PASS (test_runs) |
| No monophonic collapse | PASS |
| No literal loop failures | PASS |

**Pass rate:** 100%
