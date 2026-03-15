# Wayne Shorter Engine — Event Schema Audit

**Date:** 2026-03-15

---

## PASS/FAIL PER SCHEMA AREA

| Area | Pass/Fail | Notes |
|------|-----------|-------|
| Melody events | **PASS** | pitch, duration, beat_position, role=melody |
| Harmony events | **PASS** | pitch_set for chords; harmonic_field; role=harmonic_color |
| Simultaneity | **PASS** | "Simultaneous events share same bar and beat_position"; chord via pitch_set |
| Phrase group identity | **PASS** | phrase_group field (e.g., "3+5", "phrase 1") |
| Motivic lineage | **PASS** | motivic_source, transformation fields |
| Harmonic field assignment | **PASS** | harmonic_field per event |
| Register behavior | **PASS** | register_band (low, middle, high) with MIDI bounds |
| Staff / voice assignment | **PASS** | staff_or_voice (treble, bass, piano_RH, etc.) |
| Counterlines | **PASS** | role=counterline; pitch_set for multi-note |
| Density changes | **FAIL** | No density field. Cannot represent "bar 4 has 2 events, bar 5 has 8 events" as schema-level info. Implicit from event count. |
| Articulation / dynamic role | **PARTIAL** | articulation (accent, staccato, legato, tenuto). No dynamic (pp, mf, ff). |

---

## SCHEMA WEAKNESSES

1. **No density field:** Density is emergent from event count. For validation ("reject monophonic collapse") or narrative ("build = increase density"), schema does not explicitly tag density. Validator would need to compute from events.

2. **No dynamic field:** Articulation present; dynamics absent. Export spec does not mention dynamics. Readability may suffer for expressive output.

3. **pitch vs. pitch_set ambiguity:** Schema allows either. For chord events, pitch_set is correct. For melody, pitch is correct. But "counterline" can be single note or multi-note — which field? Unclear. Example shows pitch for melody; counterline could use pitch_set. Needs clarification.

4. **phrase_group granularity:** "3+5" identifies pattern but not which segment (first 3 or second 5). "phrase 1" vs "phrase 2" could disambiguate. Current schema: phrase_group = "3+5" only. For 8-bar 3+5, events in bars 1–3 vs 4–8 are not distinguished. Consider phrase_segment or phrase_index.

5. **No event grouping for chords:** A chord (harmonic_color) with 4 notes could be 4 events or 1 event with pitch_set. Schema says pitch_set for chord — so 1 event. Good. But simultaneous melody + chord: 2 events same beat_position. Clear.

6. **motivic_source inheritance:** Child event (e.g., transformed fragment) — does it carry parent cell or transformed cell? Schema says motivic_source = "Cell A" etc. Transformation is separate. For "fragment of Cell A" — motivic_source stays "Cell A", transformation = "fragment". Adequate.

---

## REQUIRED REVISIONS

1. **Clarify pitch vs. pitch_set:** Single-note roles (melody, bass, rhythmic_punctuation) use pitch. Multi-note (harmonic_color, counterline when chordal) use pitch_set. Add to schema.

2. **Add phrase_segment (optional):** For 3+5, segment "1" = bars 1–3, segment "2" = bars 4–8. Supports phrase-boundary validation.

3. **Consider density_band (optional):** sparse | medium | dense per bar or phrase. Supports narrative and validator.

4. **Add dynamic (optional):** pp, p, mp, mf, f, ff for export.

---

## STRENGTH FOR RUNTIME GENERATION

**Adequate.** The schema can represent melody, harmony, simultaneity, phrase groups, motivic lineage, and staff assignment. A runtime can produce valid event lists. Gaps (density, dynamics, phrase segment) are not blocking for initial generation. Validator and export can work with current schema; enhancements improve precision.

**Verdict: Schema is strong enough to support runtime generation.** Revisions recommended but not blocking.
