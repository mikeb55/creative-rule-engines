# Wayne Shorter Engine — UI Smoke Test V2

**Date:** 2026-03-15

**Purpose:** Automated smoke test of UI, launcher, and output flow.

---

## 1. FILE EXISTENCE

| File | Status |
|------|--------|
| ui/wayne_shorter_engine_app.py | PASS |
| launcher/WayneShorterEngine.bat | PASS |
| runtime/wayne_shorter_runtime_generator.py | PASS |
| runtime/wayne_shorter_musicxml_exporter.py | PASS |

---

## 2. UI LAUNCH

| Check | Status | Notes |
|-------|--------|-------|
| UI import | PASS | WayneShorterEngineApp imports without error |
| UI instantiation | PASS | App instance created; no crash |
| UI process start | PASS | `py ui/wayne_shorter_engine_app.py` launches process (PID returned) |
| Output dir resolution | PASS | _get_output_dir() returns correct path |

---

## 3. GENERATION (3 runs)

| Export Mode | Status | File |
|-------------|--------|------|
| lead_sheet | PASS | wayne_shorter_output_025.musicxml |
| melody_bass | PASS | wayne_shorter_output_026.musicxml |
| piano | PASS | wayne_shorter_output_027.musicxml |

---

## 4. OUTPUT VERIFICATION

| Check | Status | Notes |
|-------|--------|-------|
| Files in output/ | PASS | 025, 026, 027 created |
| Filenames unique | PASS | Each has distinct NNN |
| MusicXML valid | PASS | lead_sheet has Melody part, single staff, valid structure |
| File sizes | PASS | 8–20 KB; non-empty |

---

## 5. UI BEHAVIOR (programmatic)

| Check | Status | Notes |
|-------|--------|-------|
| generate_shorter_output callable | PASS | Same code path as UI Generate button |
| Success path | PASS | Returns list of Path objects |
| Open Output Folder | N/A | os.startfile() used; path verified correct |

---

## 6. LAUNCHER

| Check | Status | Notes |
|-------|--------|-------|
| Batch file exists | PASS | WayneShorterEngine.bat |
| Launcher starts UI | PASS | cmd /c WayneShorterEngine.bat launches process |
| Repo-relative paths | PASS | cd /d "%~dp0.." then py "%ENGINE_DIR%\ui\..." |

---

## ERRORS FOUND

**None.**

---

## GENERATED FILES (smoke test run)

| File | Mode | Size |
|------|------|------|
| wayne_shorter_output_025.musicxml | lead_sheet | ~8 KB |
| wayne_shorter_output_026.musicxml | melody_bass | ~15 KB |
| wayne_shorter_output_027.musicxml | piano | ~15 KB |

---

## OVERALL VERDICT

**PASS**

All checks passed. UI launches, generations succeed, files are created with unique names, launcher starts the app correctly.
