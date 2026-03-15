# Wayne Shorter Engine — Test Plan

**Purpose:** Define the full testing procedure for the Wayne Shorter Engine before runtime development.

---

## TEST SETUP

### How Phrase Generation Examples Are Produced

Phrase generation examples are produced **manually** or via **hand-constructed event lists** until runtime exists.

**Process:**

1. Select parameters from grammar: interval cell (A–G), harmonic field (A–G), phrase pattern (3+5, 5+4, etc.), form archetype.
2. Construct event list per shorter_event_schema.md.
3. Assign: event_id, section_id, phrase_group, bar, beat_position, duration, pitch/pitch_set, register_band, role, motivic_source, harmonic_field, staff_or_voice.
4. Ensure at least 2 roles (melody + counterline/harmonic_color/bass).
5. Apply validator checks.

**Reference documents:**

- shorter_interval_cell_library.md
- shorter_harmonic_fields.md
- shorter_phrase_generation_rules.md
- shorter_form_archetypes.md
- shorter_event_schema.md

**Output format:** Event list (JSON or table) or MusicXML (when export is implemented).

---

## PHASE 1 — PHRASE STRESS TESTS

**Reference:** shorter_phrase_stress_tests.md

### Procedure

1. Generate multiple phrases from the grammar using the test setup above.
2. For each phrase, record: Cell, Field, Phrase pattern, Roles, Event count.
3. Evaluate each phrase manually against validator rules (see Evaluation Criteria below).
4. Record pass/fail per validator check.

### Test Sets

- **Interval Cell Coverage (P1–P7):** One 8-bar phrase per cell A–G.
- **Phrase Asymmetry (A1–A6):** One phrase per pattern (3+5, 5+4, 4+4+3, 7+5, 3+3+2, 6+6).
- **Transformation Coverage (T1–T6):** One phrase per transformation (repeat, invert, transpose, fragment, extend, interrupt).

### Evaluation Criteria

Apply validator checks 1–8 from wayne_shorter_validator.md:

| Check | Criterion |
|-------|-----------|
| 1 | ≥70% melodic events trace to cell; motif ≥2× transformed |
| 2 | ≤1 V–I per 8 bars; planing/modal present |
| 3 | At least one irregular phrase grouping |
| 4 | Intervals from cells; no 4+ scalar runs |
| 5 | ≥2 distinct field types or transformation |
| 6 | No literal section repeat |
| 7 | ≥2 roles (melody + counterline/harmonic_color/bass) |
| 8 | GCE ≥ 9.0 |

### Test Outcome Recording

For each phrase, record:

- **Test ID:** (e.g., P1, A1, T1)
- **Parameters:** Cell, Field, Phrase pattern
- **Check 1–8:** Pass / Fail
- **GCE score:** (if computed)
- **Notes:** Weak areas, rule violations, recommendations

**Output location:** Document results in test run log (e.g., `tests/results/phrase_stress_test_YYYY_MM_DD.md` or inline in stress test matrix).

---

## PHASE 2 — FORM STRESS TESTS

**Reference:** shorter_form_stress_tests.md

### Procedure

1. Generate phrase sequences for each form archetype (8-bar theme, 12-bar blues, AABA, modular chain, short complete form, modal vamp).
2. Evaluate form coherence, narrative arc, section linkage.
3. Apply validator checks, especially Check 6 (loop/narrative).

### Test Sets

- **Form Archetypes (F1–F6):** One output per archetype.
- **Narrative Arc (N1–N3):** Evaluate modular chain, short complete, AABA for build/release/suspend.
- **Section Linkage (L1–L4):** No literal repeat; motivic transformation; harmonic variety; phrase asymmetry.

### Evaluation Criteria

- Form coherence: sections connect logically
- Narrative arc: build, release, suspend present
- Motivic continuity across form
- **Check 6 (loop/narrative):** No literal A return
- Anti-generic: no default song structure

### Test Outcome Recording

For each form output:

- **Test ID:** (e.g., F1, F2, N1)
- **Form type:** 8-bar, 12-bar, AABA, etc.
- **Check 6:** Pass / Fail (literal repeat?)
- **Narrative:** Build / Release / Suspend present?
- **Notes:** Recommendations

---

## PHASE 3 — VALIDATOR PASS

**Reference:** shorter_validator_tests.md

### Procedure

1. Run validator tests: PASS examples (should pass), FAIL examples (should fail).
2. For each rule (1–8), verify PASS example passes and FAIL example fails.
3. Verify validator order: first failure stops process; no export.

### Test Sets

- **Rule 1–8:** PASS and FAIL examples per rule (see shorter_validator_tests.md).
- **Validator order (O1–O4):** Intentionally fail at Check 1, 2, 7, 8; confirm rejection.

### Evaluation Criteria

- PASS examples: All 8 checks pass; GCE ≥ 9.0.
- FAIL examples: At least one check fails; output rejected.
- Order: Validator stops at first failure.

### Test Outcome Recording

| Rule | PASS example | FAIL example | Order test |
|------|--------------|--------------|------------|
| 1. Motivic | ✓/✗ | ✓/✗ | — |
| 2. Harmonic | ✓/✗ | ✓/✗ | — |
| … | | | |
| 8. GCE | ✓/✗ | ✓/✗ | — |
| O1–O4 | — | — | ✓/✗ |

---

## EVALUATION CRITERIA (Validator Rules)

The following validator rules are used to judge each output:

1. **Motivic trace:** ≥70% trace; motif ≥2× transformed
2. **Harmonic ambiguity:** ≤1 V–I per 8 bars; planing/modal
3. **Phrase asymmetry:** At least one irregular grouping
4. **Interval consistency:** Cell-aligned; no scalar runs
5. **Harmonic color diversity:** ≥2 distinct field types or transformation
6. **Loop/narrative:** No literal repeat without transformation
7. **Monophonic collapse:** ≥2 roles
8. **GCE:** ≥ 9.0

**Source:** wayne_shorter_validator.md

---

## TEST OUTCOME RECORDING

### Document Format

For each test run, create a results document:

**Location:** `tests/results/` (create if needed)

**Naming:** `shorter_test_run_YYYY_MM_DD.md`

**Content:**

```markdown
# Wayne Shorter Engine Test Run — YYYY-MM-DD

## Phrase Stress Tests
| ID | Cell | Field | Pattern | Ch1 | Ch2 | Ch3 | Ch4 | Ch5 | Ch6 | Ch7 | Ch8 | GCE | Result |
|----|------|-------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|--------|
| P1 | A | A | 3+5 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 9.2 | Pass |

## Form Stress Tests
...

## Validator Tests
...

## Summary
- Phrase pass rate: X/Y
- Form pass rate: X/Y
- Validator: All rules verified ✓/✗
- Recommendations: ...
```

### For Later Refinement

- Record weak combinations (e.g., Cell G + Field A fails interval consistency).
- Record edge cases (e.g., 4+4 with motivic asymmetry — pass or fail?).
- Document recommendations for grammar or validator updates.
- Use results to refine rules before runtime development.

---

## EXECUTION ORDER

1. **Validator tests** — Verify validator rules work (shorter_validator_tests.md).
2. **Phrase stress tests** — Generate and evaluate phrases (shorter_phrase_stress_tests.md).
3. **Form stress tests** — Generate and evaluate form outputs (shorter_form_stress_tests.md).
4. **Document results** — Record outcomes; identify refinements.

---

## READINESS

After completing this test plan:

- Validator is verified with PASS/FAIL examples.
- Phrase grammar is stress-tested across cells, fields, patterns.
- Form grammar is stress-tested across archetypes.
- Results inform any rule tightening before runtime development.

**Next step after tests:** Proceed to runtime planning (shorter_runtime_generator_plan.md) or refine grammar/validator based on test results.
