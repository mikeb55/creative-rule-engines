# Wayne Shorter Form Stress Tests

**Purpose:** Evaluate form archetypes and narrative structure.

---

## STAGE 1 FORM STRESS TEST RESULTS (2026-03-15)

### Summary of 10 Form Tests

| Form ID | Bars | Phrase Pattern | Archetype | Validator Result |
|---------|------|----------------|-----------|------------------|
| FC01 | 24 | 3+5 → 4+4 → 7+5 | Asymmetrical chain | PASS |
| FC02 | 22 | 5+4 → 6+3 → 8 | Episodic | PASS |
| FC03 | 28 | AABA (asymmetrical A) | AABA variant | PASS |
| FC04 | 24 | 7+5 → 4+4+3 → 3+3+2 | Narrative sequence | PASS |
| FC05 | 20 | 4+3 → 5+4 → 4 | Episodic + field rotation | PASS (boundary) |
| FC06 | 16 | 4+4 → 4+4 | 4+4 asymmetry test | PASS |
| FC07 | 18 | 3+3+2 → 5+5 | Modular chain | PASS |
| FC08 | 24 | Intro–Theme–Dev–Closure | Short complete | PASS |
| FC09 | 12 | 7+5 | 12-bar blues variant | PASS |
| FC10 | 16 | 4+4 → 4+4 | Modal vamp | PASS |

**Forms passed:** 10 / 10  
**Forms failed:** 0

**Reference:** tests/form_cases/wayne_shorter_form_cases_v1.md, wayne_shorter_form_case_evaluations_v1.md

---

### Patterns Observed in Successful Forms

1. **4+4 with explicit asymmetry** — FC06, FC10 pass when each 4+4 block has either (a) motivic transformation between halves, or (b) harmonic field shift. Refined 4+4 rule (shorter_phrase_generation_rules.md) is operational.

2. **Episodic Shorter-style chains** — FC02, FC05, FC07 use phrase sequences without literal return. Motivic linkage via transformation (transpose, invert, fragment). Ch6 (loop/narrative) satisfied.

3. **2-role boundary pass** — FC05 (melody + bass) passes at GCE 9.0 when motivic + harmonic dimensions = 2. Refined ensemble GCE rule allows strong motivic/harmonic to compensate.

4. **Single-field forms** — FC09 (Field G), FC10 (Field A) pass Ch5 via transformation (extension change, internal chromatic motion). Modal vamp and 12-bar blues archetypes valid with single field + transformation.

5. **Asymmetrical AABA** — FC03: A' transposed, not literal. Bridge (B) uses different field. Satisfies Ch6 and Ch3.

---

### Patterns That Triggered Validator Failures

**None in Stage 1.** All 10 form cases passed. Cases were designed after grammar refinements (4+4 rule, Cell G constraint, ensemble GCE). No forms were constructed to intentionally fail.

**Historical (from phrase stress tests):** 4+4 without asymmetry, Cell G without constraints, melody+bass with weak motivic/harmonic — these triggered failures before refinements.

---

## TEST SET 1 — Form Archetypes

Generate one output per form archetype.

| Test | Archetype | Length | Expected |
|------|-----------|--------|----------|
| F1 | 8-bar theme | 8 bars | Single phrase; 3+5 or 5+3 |
| F2 | 12-bar blues | 12 bars | Chromatic turnaround; 7+5 or 6+6 |
| F3 | AABA | 32 bars | Altered bridge; motivic return |
| F4 | Modular phrase chain | 16 bars | No literal repeat; linkage |
| F5 | Short complete form | 24 bars | Intro, theme, development, closure |
| F6 | Modal vamp | 8 bars | Static harmony; motivic development |

---

## TEST SET 2 — Narrative Arc

Evaluate form outputs for narrative structure.

| Test | Form | Build | Release | Suspend |
|------|------|-------|---------|---------|
| N1 | Modular chain | ✓/✗ | ✓/✗ | ✓/✗ |
| N2 | Short complete | ✓/✗ | ✓/✗ | ✓/✗ |
| N3 | AABA | ✓/✗ | ✓/✗ | ✓/✗ |

**Build:** Tension or density increase.
**Release:** Resolution or density decrease.
**Suspend:** Sustained tension; deferred resolution.

---

## TEST SET 3 — Section Linkage

For modular chain and short complete form:

| Test | Criterion | Pass |
|------|-----------|------|
| L1 | No literal repeat of A | ✓/✗ |
| L2 | Motivic transformation between sections | ✓/✗ |
| L3 | Harmonic field variety across sections | ✓/✗ |
| L4 | Phrase asymmetry in each section | ✓/✗ |

---

## EVALUATION

- Form coherence: sections connect logically
- Narrative arc: build/release/suspend present
- Motivic continuity across form
- No generic song structure default

---

## STRESS TEST MATRIX (Stage 1 Results)

| Form | Coherence | Narrative | Motivic | Anti-Generic | Validator |
|------|-----------|-----------|---------|--------------|-----------|
| Asymmetrical chain (FC01) | ✓ | ✓ | ✓ | ✓ | PASS |
| Episodic (FC02, FC05) | ✓ | ✓ | ✓ | ✓ | PASS |
| AABA variant (FC03) | ✓ | ✓ | ✓ | ✓ | PASS |
| Narrative sequence (FC04) | ✓ | ✓ | ✓ | ✓ | PASS |
| 4+4 asymmetry (FC06) | ✓ | ✓ | ✓ | ✓ | PASS |
| Modular chain (FC07) | ✓ | ✓ | ✓ | ✓ | PASS |
| Short complete (FC08) | ✓ | ✓ | ✓ | ✓ | PASS |
| 12-bar blues (FC09) | ✓ | ✓ | ✓ | ✓ | PASS |
| Modal vamp (FC10) | ✓ | ✓ | ✓ | ✓ | PASS |

Record pass/fail. Identify forms needing rule adjustment.
