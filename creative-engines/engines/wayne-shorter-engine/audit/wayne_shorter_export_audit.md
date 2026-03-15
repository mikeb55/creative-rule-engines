# Wayne Shorter Engine — Export and Readability Audit

**Date:** 2026-03-15

---

## EXPORT MODE SUPPORT

| Mode | Supported | Notes |
|------|-----------|-------|
| Melody-only | ✓ | role=melody → treble; pitch, beat_position, duration, articulation |
| Lead sheet | ✓ | Melody + chord symbols from harmonic_field or chord root |
| Piano reduction | ✓ | melody, counterline → RH; harmonic_color, bass → LH; register_band split |
| Ensemble sketch | ✓ | staff_or_voice → staff; simultaneity preserved |

---

## READABILITY ELEMENTS

| Element | Defined | Notes |
|---------|---------|-------|
| Readable ranges | ✓ | Treble G3–G6; Bass E2–E4 |
| Simultaneity preservation | ✓ | Same bar + beat_position → vertical alignment; `<chord>` for chords |
| Role-to-staff mapping | ✓ | role + staff_or_voice; ensemble config |
| Phrase labeling | ✗ | **MISSING.** No phrase marks, rehearsal letters, or section labels in export spec. |
| Chord symbol handling | Partial | "harmonic_field or chord root → chord symbol" — no rule for converting Field A (Dorian) to "Cm7" vs "C-" vs "Cmin9". |
| Post-export validation | ✗ | **MISSING.** No check that exported MusicXML is valid, readable, or within range. |

---

## DURATION AND ARTICULATION

| Element | Mapping |
|---------|---------|
| Duration | 0.25→16th, 0.5→8th, 1.0→quarter, 2.0→half, 4.0→whole; dots for 1.5, 3.0 |
| Articulation | accent, staccato, legato, tenuto → MusicXML elements |
| Legato | `<slur>` — but slur connects notes; which notes? Adjacent melody notes? Undefined. |

---

## FLAGGED READABILITY RISKS

1. **Chord symbol ambiguity:** Field A = Dorian on C. Is chord "Cm7"? "C-7"? "Cmin9"? "C Dorian"? Export spec does not specify. Lead sheet output may be inconsistent.

2. **Piano reduction overlap:** "melody, counterline → right hand" — if both present, how are they voiced? Two voices on treble? Which top? Range conflict possible.

3. **Middle register split:** "register_band: high/middle → treble; low → bass" — middle can go either way. C4 (MIDI 60) — treble or bass? Overlap at middle C can cause awkward notation.

4. **Phrase marks:** No phrase marking (brackets, slurs over phrases) in spec. Readers may not see phrase boundaries.

5. **6/4 time:** Spec mentions "6/4 for Footprints-style" but no rule for when to use 4/4 vs 6/4. Form archetype? User choice?

6. **Key signature:** "Key signature (from harmonic field)" — Field A (Dorian C) = 2 flats? 1 flat? Dorian is mode, not key. C minor vs C Dorian — different. Needs clarification.

---

## RECOMMENDATIONS

1. Add chord symbol conversion table: Field → chord symbol (e.g., Field A C = "Cm7" or "C-7").
2. Define piano reduction voice priority: melody top, counterline below; or interleave by register.
3. Define middle C assignment: e.g., C4 and above → treble; below → bass.
4. Add optional phrase marks / rehearsal letters for form sections.
5. Define key signature logic: root + mode → key (e.g., C Dorian = Bb major key? Or no key for modal?).
6. Add post-export validation: check for out-of-range notes, invalid durations, empty measures.
