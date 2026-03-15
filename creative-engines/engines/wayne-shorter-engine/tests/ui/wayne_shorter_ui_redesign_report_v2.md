# Wayne Shorter UI Redesign Report V2

**Date:** 2026-03-15

**Purpose:** Document musical-intent UI redesign. Seed moved to Advanced. Default single-file behavior confirmed.

---

## CONTROLS ADDED

| Section | Controls |
|--------|----------|
| **Generate** | Melody only, Chord progression, Melody + chord progression, Motif idea, Full sketch (melody + bass) |
| **Form** | Episodic, Motif-driven sectional, Asymmetrical AABA, Free phrase chain |
| **Harmony** | Mixed Shorter style, Modal, Chromatic planing, Pedal-based |
| **Phrase structure** | Asymmetrical, 4+4 variation, 5+3, 3+5, Random asymmetry |
| **Output** | Lead sheet, Melody + bass, Piano sketch |
| **Ideas to generate** | 1–10 (default 1) |
| **Advanced** | Seed (optional integer) — collapsible |

---

## SEED MOVED TO ADVANCED

- Seed removed from main UI
- Placed in collapsible "Advanced ▸" section
- Click "Advanced ▸" to expand; "Advanced ▾" to collapse
- Seed remains optional; empty = random

---

## DEFAULT SINGLE-FILE BEHAVIOR CONFIRMED

- **Ideas to generate** default: 1
- When 1: one file written to `output/`
- When 2+: batch written to `output/test_runs/`
- Hint: "(1 = one file, default. 2+ = batch for exploration.)"
- Generate button creates exactly one file unless user explicitly sets Ideas > 1

---

## BUTTONS

- **Generate** — Runs generator; shows success/fail and filename(s)
- **Open Output Folder** — Opens `output/` (normal output)
- **Quit** — Exits app

---

## FILES CHANGED

| File | Change |
|------|--------|
| ui/wayne_shorter_engine_app.py | Full redesign: musical-intent controls, Advanced collapsible, Output/Form/Harmony/Phrase dropdowns |
