# Wayne Shorter Engine — Single-Output UX Fix Report V1

**Date:** 2026-03-15

---

## ROOT CAUSE

1. **Label ambiguity** — "Run count" did not clearly convey that 1 = normal, single-file behavior.
2. **Batch mixed with normal** — When user generated 2+ ideas from UI, files went to `output/`, flooding the main folder.
3. **No mode distinction** — UI did not distinguish normal (one idea) from batch (exploration/testing).

---

## FILES CHANGED

| File | Changes |
|------|---------|
| ui/wayne_shorter_engine_app.py | "Ideas to generate" label; default 1; batch hint; single→output/, batch→output/test_runs/ |
| tests/ui/wayne_shorter_single_output_fix_report_v1.md | Created (this file) |

---

## CONFIRMATION: NORMAL GENERATE CREATES ONE FILE ONLY

- **Default:** "Ideas to generate" = 1
- **Behavior:** Generate button with default 1 creates exactly 1 file in `output/`
- **Hint:** "(1 = one file, default. 2+ = batch for exploration.)"
- **Success message:** "Success. One file created." when run_count=1

---

## CONFIRMATION: BATCH/TEST OUTPUT GOES TO output/test_runs/

- **UI batch (2+ ideas):** `output_dir = output/test_runs/` when run_count > 1
- **Test runner:** Already writes to `output/test_runs/` (unchanged)
- **Separation:** Normal output in `output/`; batch/test in `output/test_runs/`
- **Open Output Folder:** Opens `output/` (normal output)

---

## MODE LABELS

| Mode | Ideas | Output | Behavior |
|------|-------|--------|----------|
| Normal | 1 | output/ | One file, default |
| Batch | 2–20 | output/test_runs/ | Optional, for exploration/testing |
