# Wayne Shorter Validator Tests

**Purpose:** Verify validator correctly accepts Shorter-like output and rejects generic output. Each rule has PASS/FAIL examples with explanation.

---

## RULE 1 — Motivic Trace

### PASS Example

**Phrase:** 8 bars, Cell A (m3→tt: C Eb A). Bars 1–3: C–Eb–A (exact). Bars 4–6: F–Ab–D (transposed P4). Bars 7–8: A–Eb–C (inverted). 12 melodic events; 11 trace to cell. 70%+ ✓; motif appears 3× in transformed form ✓.

**Explanation:** Motif appears as exact cell, transposition, and inversion. ≥70% of events trace; ≥2 transformed appearances.

### FAIL Example

**Phrase:** 8 bars. Bars 1–4: C–D–E–F–G (scalar run). Bars 5–8: G–A–B–C–D (scalar run). No interval cell. 0% trace; motif appears 0×.

**Explanation:** Stepwise scalar material. No cell logic. Fails motivic continuity.

---

## RULE 2 — Harmonic Ambiguity

### PASS Example

**Phrase:** 8 bars. Field A (Dorian C) bars 1–4; Field D (chromatic planing C→C♯→D) bars 5–8. No ii–V–I. 0 dominant-tonic resolutions per 8 bars ✓.

**Explanation:** Modal + planing. No functional cadence. Passes.

### FAIL Example

**Phrase:** 8 bars. Bars 1–2: Dm7–G7–Cm7. Bars 3–4: Am7–D7–Gm7. Bars 5–6: Em7–A7–Dm7. Bars 7–8: Bm7♭5–E7–Am7. Four ii–V–I in 8 bars.

**Explanation:** ii–V–I as default. Predictable cadences. Fails harmonic ambiguity.

---

## RULE 3 — Phrase Asymmetry

### PASS Example

**Phrase:** 8 bars. Phrase structure 3+5 (bars 1–3, bars 4–8). Irregular grouping ✓.

**Explanation:** 3+5 is an acceptable asymmetric shape. Not 4+4.

### FAIL Example

**Phrase:** 16 bars. Phrase structure 4+4+4+4. All groups equal length. No harmonic or motivic asymmetry between 4-bar blocks.

**Explanation:** Strict 4+4+4+4 for 8+ bars. No variation. Fails phrase asymmetry.

---

## RULE 4 — Interval Logic Consistency

### PASS Example

**Phrase:** 8 bars. All melodic intervals from Cell B (P4→m2: C F Gb). No scalar runs of 4+ notes. Intervals: P4, m2, P4, m2, etc.

**Explanation:** Intervals align with cell. No arbitrary scalar runs. Passes.

### FAIL Example

**Phrase:** 8 bars. Melody: C–D–E–F–G–A–B–C (diatonic scale). Then G–F–E–D–C (descending scale). Random intervals; bebop-style scalar run.

**Explanation:** 4+ stepwise notes. Intervals violate cell logic. Fails interval consistency.

---

## RULE 5 — Harmonic Color Diversity

### PASS Example

**Phrase:** 8 bars. Bars 1–4: Field A (modal Dorian). Bars 5–8: Field D (chromatic planing). Two distinct field types ✓.

**Explanation:** Modal vs. chromatic planing = distinct. Passes.

### FAIL Example

**Phrase:** 8 bars. Bars 1–8: Field A (Dorian C) throughout. No field change. No transformation (inversion, bass shift, extension).

**Explanation:** Single field type. No transformation. Fails harmonic color diversity.

---

## RULE 6 — Loop / Narrative

### PASS Example

**Form:** AABA, 16 bars. A (bars 1–4): Cell A, Field A. A' (bars 13–16): Cell A transposed up P4, Field A. Same harmony but motif transformed.

**Explanation:** A' is not literal repeat. Motif transposed. Passes loop/narrative check.

### FAIL Example

**Form:** AABA, 16 bars. A (bars 1–4): C–Eb–A, Field A, 3+5. A' (bars 13–16): Identical — C–Eb–A, same rhythm, same harmony.

**Explanation:** Literal repeat. No motivic or harmonic transformation. Fails loop/narrative.

---

## RULE 7 — Monophonic Collapse (Simultaneity / Texture)

### PASS Example

**Output:** 8 bars. Events include: melody (treble), harmonic_color (chord voicings, bass staff), bass (pedal C). Roles: melody + harmonic_color + bass. ≥2 roles ✓.

**Explanation:** Multiple roles. Not melody-only. Passes monophonic collapse check.

### FAIL Example

**Output:** 8 bars. All events have role=melody. No counterline, no harmonic_color, no bass, no rhythmic_punctuation.

**Explanation:** Only melody. Monophonic collapse. Fails.

---

## RULE 8 — GCE Threshold

### PASS Example

**Phrase:** Cell A, Field A, 3+5. Melody + counterline + harmonic_color. No ii–V–I. Motivic 2, Harmonic 2, Phrase 2, Interval 2, Ensemble 2. Sum=10. GCE=10.0 ✓.

**Explanation:** All dimensions at 2. GCE ≥ 9.0. Passes.

### FAIL Example

**Phrase:** Scalar run, ii–V–I, 4+4, melody only. Motivic 0, Harmonic 0, Phrase 0, Interval 0, Ensemble 0. Sum=0. GCE=0.0 ✗.

**Explanation:** All dimensions at 0. GCE < 9.0. Fails.

---

## TEST MATRIX — Quick Reference

| Rule | PASS condition | FAIL condition |
|------|----------------|----------------|
| 1. Motivic trace | ≥70% trace; motif ≥2× transformed | Scalar; no cell; motif 0–1× |
| 2. Harmonic ambiguity | ≤1 V–I per 8 bars; planing/modal | ii–V–I default |
| 3. Phrase asymmetry | Irregular grouping (3+5, etc.) | 4+4+4+4 for 8+ bars |
| 4. Interval consistency | Cell-aligned; no 4+ scalar | Scalar runs; bebop clichés |
| 5. Harmonic color | ≥2 distinct field types | Single type; no transformation |
| 6. Loop/narrative | No literal repeat | A' = A identically |
| 7. Monophonic collapse | ≥2 roles | Melody only |
| 8. GCE | ≥ 9.0 | < 9.0 |

---

## VALIDATOR ORDER TEST

Verify validator stops at first failure.

| Test | Intentionally fail at | Expected |
|------|-----------------------|----------|
| O1 | Check 1 (motivic) | Reject immediately; no export |
| O2 | Check 2 (harmonic) | Reject immediately; no export |
| O3 | Check 7 (monophonic) | Reject immediately; no export |
| O4 | Check 8 (GCE) | Reject immediately; no export |

---

## RECOMMENDED ACTIONS

- If positive case fails: relax validator or fix output generation.
- If negative case passes: tighten validator or fix output generation.
- Document edge cases for future rule refinement.
- Run tests before runtime development.
