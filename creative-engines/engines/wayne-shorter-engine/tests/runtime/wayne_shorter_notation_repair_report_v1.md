# Wayne Shorter Engine — Notation Repair Report V1

**Date:** 2026-03-15

---

## ROOT CAUSE OF INACCURATE TREBLE NOTATION

1. **Key signature from first event** — Bass events could be first; key was taken from wrong role.
2. **Spelling consistency across phrase boundaries** — `recent_spellings` persisted across phrases, causing inconsistent respelling when harmonic field changed.
3. **No phrase-boundary reset** — Same pitch class could be spelled differently (e.g. Eb vs D#) within adjacent phrases without clear musical reason.

---

## FILES CHANGED

| File | Change |
|------|--------|
| runtime/wayne_shorter_musicxml_exporter.py | Phrase-boundary spelling reset; key from first melody event; context-aware spelling retained |
| runtime/wayne_shorter_runtime_generator.py | No change (event structure already has phrase_group, harmonic_field) |

---

## SPELLING / MAPPING RULES ADDED

1. **Phrase-boundary reset** — `recent_spellings` cleared when `phrase_group` changes. Ensures consistency within phrase; allows field-appropriate spelling per phrase.
2. **Key signature from melody** — First melody (or counterline/harmonic_color) event's `harmonic_field` used for key, not first event (which could be bass).
3. **Existing rules retained** — Field A/B prefer flats; Field C prefers F# for pc 6; `recent_spellings` maintains consistency within phrase.

---

## PIANO EXPORT IMPROVED

- **Treble staff** — Melody, counterline, harmonic_color on staff 1. Range clamped to G3–G6.
- **Bass staff** — Bass on staff 2. Range clamped to E2–E4.
- **Simultaneity** — Preserved when intended (melody and bass in same measure).
- **Staff labels** — Part name "Piano"; single part with 2 staves. No duplicate "Full Score".

---

## REMAINING ISSUES

- **Chord symbols** — Not implemented. "Chord progression" and "Melody + chord progression" map to lead_sheet/melody_bass; no chord symbols in output.
- **Counterline / harmonic_color** — Generator produces melody + bass; piano mode ready for future counterline when generator adds it.
