# Wayne Shorter Engine — Repair Plan

**Date:** 2026-03-15

**Last updated:** 2026-03-15 (Validator Repair Pass)

---

## PRIORITY 1 — TIGHTEN VALIDATOR ✅ RESOLVED

### Issue

Validator checks (motivic continuity, harmonic color diversity) use undefined terms ("trace," "distinct"). Loop/narrative and monophonic collapse are not checked. GCE has no rubric.

### Resolution (2026-03-15)

**Files revised:** wayne_shorter_validator.md, shorter_validator.md

**Changes made:**

1. **Trace definition added:** Event traces to motivic source if interval sequence matches exact cell, transformed cell (inversion, transposition, fragment, extension, rhythmic displacement), or contour fragment (3+ intervals). Rule: ≥70% melodic events trace; motif appears ≥2× in transformed form.

2. **Harmonic distinctness definition added:** Two behaviors distinct if different field types (modal, chromatic planing, pedal, turnaround). Same type + different root = not distinct. Rule: ≥2 distinct field types; or same type with transformation (inversion, bass shift, extension).

3. **Phrase asymmetry clarified:** Measurable rule — at least one irregular grouping (3+5, 5+4, etc.); 4+4 allowed for 8-bar only if harmonic/motivic asymmetry present.

4. **Check 6 — Loop/Narrative added:** Reject literal section repeat without motivic or harmonic transformation. Examples: AABA with A'=A fails; A' transposed passes.

5. **Check 7 — Monophonic Collapse added:** Reject if only melody events. Minimum: melody + (counterline OR harmonic_color OR bass).

6. **GCE rubric added:** 5 dimensions (0–2 each) with 0/1/2 criteria per dimension. Calibration examples: GCE 10.0 (pass), 0.0 (fail), 9.0 boundary (pass).

7. **Validation order updated:** Now 8 checks (1–8); loop/narrative and monophonic collapse inserted before GCE.

---

## PRIORITY 2 — CREATE tests/wayne_shorter_engine_test_plan.md ✅ RESOLVED

### Issue

tests/ directory and wayne_shorter_engine_test_plan.md are missing. Audit expects this file.

### Resolution (2026-03-15)

**Files created:** tests/wayne_shorter_engine_test_plan.md

**Changes made:**

- Created tests/ directory.
- Created wayne_shorter_engine_test_plan.md with:
  - Test Setup (how phrase examples are produced)
  - Phase 1: Phrase Stress Tests (reference shorter_phrase_stress_tests.md)
  - Phase 2: Form Stress Tests (reference shorter_form_stress_tests.md)
  - Phase 3: Validator Pass (reference shorter_validator_tests.md)
  - Evaluation Criteria (validator rules 1–8)
  - Test Outcome Recording (format, location, refinement notes)
  - Execution order

---

## PRIORITY 3 — DEFINE CHORD SYMBOL CONVERSION ⏳ PENDING

### Issue

Export spec says "harmonic_field or chord root → chord symbol" but does not define how Field A (Dorian C) becomes "Cm7" vs "C-" vs "Cmin9". Lead sheet output will be inconsistent.

### Why It Matters

Lead sheet is a stated output type. Without conversion rules, export may produce invalid or ambiguous chord symbols.

### Files to Revise

- shorter_musicxml_export_spec.md

### Type of Revision

Add Chord Symbol Conversion Table (see original repair plan for table). Define root extraction from harmonic field.

### Status

Not yet performed. Needed before lead sheet export; can follow stress tests.

---

## ADDITIONAL CHANGES (Validator Repair Pass)

### shorter_validator_tests.md — Expanded

**Changes made:**

- Added PASS/FAIL example + explanation for each of 8 validator rules.
- Covered: motivic trace, harmonic distinctness, phrase asymmetry, interval consistency, harmonic color diversity, loop/narrative, monophonic collapse, GCE.
- Added test matrix quick reference.
- Added validator order tests (O1–O4).

---

## REPAIR ORDER SUMMARY

| Priority | Item | Status |
|----------|------|--------|
| 1 | Validator — definitions and checks | ✅ Resolved |
| 2 | Test plan — tests/wayne_shorter_engine_test_plan.md | ✅ Resolved |
| 3 | Chord symbols — export spec | ⏳ Pending |

---

## REMAINING WORK

- **Priority 3:** Add chord symbol conversion table to shorter_musicxml_export_spec.md (before lead sheet export).
- **Post–stress tests:** Refine grammar or validator based on test run results.

---

## PHRASE STRESS TEST FINDINGS (2026-03-15)

**Source:** 12 hand-constructed phrase cases. Evaluations: tests/phrase_cases/wayne_shorter_phrase_case_evaluations_v1.md

**Results:** 6 pass, 2 borderline fail, 4 fail.

### Issues Discovered

1. **4+4 with asymmetry — underspecified** — Validator allows 4+4 "only if harmonic or motivic asymmetry present." Case P06 had transposed motif + bass shift but failed GCE. Unclear when 4+4 passes. Need bar-level criteria.

2. **Cell G (major triad) — generic risk** — Case P07 failed GCE despite valid structure. Cell G (C E G) is consonant; no grammar constraint. Consider restricting or documenting "use with caution."

3. **Single-field transformation — broad** — Extension change, bass shift, planing shift all satisfy Ch5. No hierarchy. Could tighten "transformation" definition.

4. **GCE Ensemble threshold — sharp** — 2 roles = 1, 3 roles = 2. Melody + bass can pass at 9.0 but is fragile. P06, P07 failed at GCE.

5. **Contour rules — missing** — No operational contour grammar. "Leaps followed by stepwise recovery" not encoded.

### Files That Need Revision

| File | Revision Type | Priority |
|------|---------------|----------|
| wayne_shorter_validator.md | Clarify 4+4 asymmetry criteria; add examples | High |
| shorter_phrase_generation_rules.md | Add bar-level 4+4 asymmetry rules | High |
| shorter_interval_cell_library.md | Add Cell G constraint or caution note | Medium |
| wayne_shorter_validator.md | Tighten "transformation" for single field | Medium |
| shorter_style_grammar.md | Add contour rules (optional) | Low |

### Priority Order

1. **4+4 asymmetry** — Define in validator and phrase rules. Add 2–3 test cases.
2. **Cell G** — Add constraint or caution in interval cell library.
3. **Single-field transformation** — List valid transformations explicitly in validator.
4. **GCE Ensemble** — Add "fragile pass" note for 2-role output.
5. **Contour** — Defer to post–form stress test; lower priority.

---

## FORM STRESS TEST FINDINGS (2026-03-15)

**Source:** Stage 1 compressed workflow. 10 form cases designed and evaluated.

**Reference:** tests/form_cases/wayne_shorter_form_cases_v1.md, wayne_shorter_form_case_evaluations_v1.md

### Grammar Improvements Made (Stage 1)

1. **4+4 Asymmetry Rule** — shorter_phrase_generation_rules.md
   - Added explicit conditions: (a) motivic transformation between halves, (b) harmonic field shift, (c) interval contour invert/expand.
   - Bar-level criteria defined. Rejection rule clarified.

2. **Cell G Constraint** — shorter_interval_cell_library.md
   - Added usage constraints: chromatic displacement required; non-functional harmonic field only; transformation before repetition.
   - "Use with caution" note added.

3. **Ensemble GCE Threshold** — wayne_shorter_validator.md
   - 2-role output (melody + bass) can pass GCE 9.0 when motivic + harmonic = 2 and phrase asymmetry ≥1.
   - Strong motivic/harmonic behavior compensates for thin ensemble. Fragile pass note added.

### Form Test Results

- **Forms run:** 10
- **Forms passed:** 10
- **Forms failed:** 0

### Remaining Weaknesses

1. **Single-field transformation** — Still broad. Extension change, bass shift, planing shift all satisfy Ch5. No hierarchy. Could tighten in future.
2. **Contour rules** — Not yet encoded. "Leaps followed by stepwise recovery" not operational.
3. **Cell G** — Constraints added but not yet exercised in form cases (no FC uses Cell G). Runtime should enforce constraints.

### Files Requiring Further Refinement

| File | Refinement | Priority |
|------|------------|----------|
| shorter_style_grammar.md | Add contour rules (optional) | Low |
| wayne_shorter_validator.md | List valid single-field transformations explicitly | Medium |
| shorter_interval_cell_library.md | Runtime enforcement of Cell G constraints | Medium (at runtime) |

### Grammar Stability for Runtime Prototype

**Verdict:** Grammar is **stable enough** for runtime prototype (Stage 2).

- All 10 form cases passed validation.
- 4+4 asymmetry, Cell G, ensemble GCE refinements are operational.
- Form archetypes (episodic chains, asymmetrical AABA, motif-driven sectional) are validated.
- Remaining weaknesses (contour, single-field hierarchy) are lower priority and can be addressed during or after runtime development.
