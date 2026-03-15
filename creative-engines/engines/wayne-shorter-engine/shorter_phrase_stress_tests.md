# Wayne Shorter Phrase Stress Tests

**Purpose:** Generate multiple phrase examples and evaluate Shorter stylistic authenticity.

---

## TEST SET 1 — Interval Cell Coverage

Generate one 8-bar phrase per interval cell (A–G).

| Test | Cell | Field | Phrase | Expected |
|------|------|-------|--------|----------|
| P1 | Cell A | Field A | 3+5 | m3–tt motif; Dorian |
| P2 | Cell B | Field B | 5+4 | P4–m2 motif; Phrygian |
| P3 | Cell C | Field C | 4+4+3 | m2–M3 motif; Lydian |
| P4 | Cell D | Field D | 7+5 | M2–tt motif; Chromatic planing |
| P5 | Cell E | Field E | 3+3+2 | m3–M2 motif; Whole-step planing |
| P6 | Cell F | Field F | 5+7 | tt–m2 motif; Pedal |
| P7 | Cell G | Field G | 4+3+4 | M3–P4 motif; Turnaround |

---

## TEST SET 2 — Phrase Asymmetry

Generate phrases with each primary pattern.

| Test | Pattern | Bars | Cell | Field |
|------|---------|------|------|-------|
| A1 | 3+5 | 8 | A | A |
| A2 | 5+4 | 9 | B | B |
| A3 | 4+4+3 | 11 | C | C |
| A4 | 7+5 | 12 | D | D |
| A5 | 3+3+2 | 8 | E | E |
| A6 | 6+6 | 12 | F | F |

---

## TEST SET 3 — Transformation Coverage

Generate phrases emphasizing each transformation.

| Test | Transformation | Cell | Phrase |
|------|----------------|------|--------|
| T1 | repeat | A | 3+5 |
| T2 | invert | B | 5+4 |
| T3 | transpose | C | 4+4+3 |
| T4 | fragment | D | 7+5 |
| T5 | extend | E | 3+3+2 |
| T6 | interrupt | F | 5+7 |

---

## EVALUATION CRITERIA

For each phrase, evaluate:

1. **Melodic identity:** Does melody trace to interval cell?
2. **Harmonic plausibility:** Is harmony non-functional? Chromatic/modal?
3. **Phrase asymmetry:** Is grouping irregular?
4. **Shorter stylistic authenticity:** Does it avoid generic jazz?

---

## SCORING (Per Phrase)

| Criterion | Pass (1) | Fail (0) |
|-----------|----------|----------|
| Melodic identity | Cell present; motivic | Scalar; unrelated |
| Harmonic plausibility | Non-functional; planing/modal | ii–V–I; predictable |
| Phrase asymmetry | Irregular grouping | 4+4 only |
| Shorter authenticity | Distinctive | Generic |

**Target:** 4/4 for each phrase.

---

## STRESS TEST MATRIX

Run all combinations (subset for initial validation):

- Cells A–G × Fields A–G (selected pairs)
- Patterns 3+5, 5+4, 4+4+3, 7+5
- Transformations: repeat, invert, transpose, fragment

Record pass/fail per test. Identify weak combinations for rule tightening.

---

## V1 PHRASE STRESS TEST RUN (2026-03-15)

### 12 Test Cases Summary

**Source:** tests/phrase_cases/wayne_shorter_phrase_cases_v1.md  
**Evaluations:** tests/phrase_cases/wayne_shorter_phrase_case_evaluations_v1.md

| Case | Type | Phrase | Fields | Roles | Ch1 | Ch2 | Ch3 | Ch4 | Ch5 | Ch6 | Ch7 | Ch8 | Verdict |
|------|------|--------|--------|-------|-----|-----|-----|-----|-----|-----|-----|-----|---------|
| P01 | Strong | 3+5 | A+D | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | PASS |
| P02 | Strong | 5+4 | D+F | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | PASS |
| P03 | Strong | 4+4+3 | A+C+F | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | PASS |
| P04 | Strong | 7+5 | A+G | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | PASS |
| P05 | Borderline | 3+5 | A (ext) | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | PASS |
| P06 | Borderline | 4+4 | A (shift) | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | FAIL |
| P07 | Borderline | 3+3+2 | C+E | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | FAIL |
| P08 | Borderline | 5+4 | D (shift) | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | PASS |
| P09 | Fail | 3+5 | A+D | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | FAIL |
| P10 | Fail | 4+4+4+4 | functional | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | FAIL |
| P11 | Fail | AABA | A | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | — | FAIL |
| P12 | Fail | 4+4 | A | 2 | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✗ | FAIL |

**Results:** 6 pass, 2 borderline fail, 4 fail.

---

### Observed Success Patterns

1. **2+ distinct harmonic field types** — All pass cases use 2+ field types (modal + planing, modal + pedal, modal + turnaround) or single type with explicit transformation (extension, bass shift, planing shift).
2. **3+ roles when possible** — P01, P03, P04 (melody + counterline + harmonic_color) score GCE 10.0. P02, P05, P08 (melody + bass or harmonic_color) hit GCE 9.0 boundary.
3. **Irregular phrase patterns** — 3+5, 5+4, 4+4+3, 7+5, 3+3+2 all pass Ch3. No pass case uses bare 4+4.
4. **Motif ≥2× transformed** — All pass cases have motif appearing at least twice in transformed form (transpose, invert, fragment).
5. **Cell logic throughout** — Cells A, B, C, D work well. No scalar runs.

---

### Observed Failure Patterns

1. **Monophonic collapse (P09)** — Melody-only output fails Ch7 regardless of other strengths. Single-role output always fails.
2. **Literal repeat (P11)** — AABA with A' = A identically fails Ch6. No transformation in return.
3. **4+4 without asymmetry (P12)** — Equal phrase groups with no harmonic or motivic differentiation fail Ch3 and Ch5.
4. **GCE boundary (P06, P07)** — P06: 4+4 with motivic asymmetry passes Ch3/Ch5 but GCE 8.0 (Phrase=1, Ensemble=1). P07: Cell G (major triad) scores low on motivic/interval; GCE < 9.0.
5. **Generic bebop (P10)** — Scalar, ii–V–I, 4+4+4+4 fails multiple checks. Validator correctly rejects.

---

### Grammar Rules Proving Strongest

1. **Interval cell library** — Cells A–D produce clear, traceable material. Transformation rules (transpose, invert, fragment) are operational.
2. **Harmonic field definitions** — Modal, planing, pedal, turnaround are distinct and usable. Field combination logic works.
3. **Phrase asymmetry patterns** — 3+5, 5+4, 4+4+3, 7+5, 3+3+2 are well-defined and testable.
4. **Role minimum (2)** — Monophonic collapse check correctly enforces ensemble texture.
5. **Loop/narrative check** — Literal repeat detection is clear and enforceable.

---

### Grammar Rules Too Vague or Too Weak

1. **4+4 with asymmetry** — "Harmonic or motivic asymmetry" is underspecified. P06 had transposed motif + bass shift but still failed GCE. When does 4+4 pass? Need clearer bar-level criteria.
2. **Cell G (major triad)** — Cell G (C E G) risks generic sound. No rule constrains or warns. Consider: restrict Cell G to specific contexts, or add "consonant cell" handling.
3. **Single-field transformation** — Extension change, bass shift, planing shift satisfy Ch5, but "transformation" is broad. Planing shift (root moves) vs. extension change — are both equally valid? Could tighten.
4. **GCE Ensemble dimension** — 2 roles = 1, 3 roles = 2. Threshold is sharp. Phrases with 2 roles (melody + bass) can pass at 9.0 but are fragile. No guidance for "thin but valid" vs. "too thin."
5. **Contour rules** — Still no operational contour grammar. "Leaps followed by stepwise recovery" not encoded. Stress test did not exercise contour.
