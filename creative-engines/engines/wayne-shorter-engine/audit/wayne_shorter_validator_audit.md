# Wayne Shorter Engine — Validator Audit

**Date:** 2026-03-15

---

## CAN THE VALIDATOR REJECT...

| Condition | Covered | How |
|-----------|---------|-----|
| Too much functional harmony | ✓ | Check 2: max 1 V–I per 8 bars; chromatic planing or modal present |
| Too much symmetry | ✓ | Check 3: at least one irregular grouping; reject 4+4+4+4 for 8+ bars |
| Generic bebop defaults | ✓ | Check 4: interval logic; Check 6: GCE |
| Motivic incoherence | ✓ | Check 1: 70% trace to cell or transformation |
| Looped rather than narrative form | ✗ | **MISSING.** No check for "literal repeat of section A" or "form is AABA with no transformation in return". |
| Weak harmonic color diversity | ✓ | Check 5: at least 2 distinct behaviors |
| Monophonic collapse | ✗ | **MISSING.** No check for "only melody, no counterline/harmony". GCE includes "Ensemble equality" but threshold is subjective. |
| Absence of simultaneity | ✗ | **MISSING.** No check for "all events are single notes; no chords or counterlines". |
| Unreadable notation logic | ✗ | **MISSING.** Validator does not check notation (staff range, voice crossing). Export spec handles that. |
| Fake complexity without structural identity | Partial | GCE "Interval consistency" and "Motivic identity" address this, but scoring is subjective. |

---

## VALIDATOR STRENGTHS

- Clear measurable checks for motivic continuity (70%), harmonic ambiguity (1 V–I per 8 bars), phrase asymmetry (at least one irregular grouping).
- Failure conditions stated per check.
- GCE ≥ 9.0 philosophy with 5 sub-scores.
- Validation order defined; fail-fast before export.
- Rejection summary listed.

---

## MISSING CHECKS

1. **Loop / narrative form:** Reject if form is AABA with literal A return and no motivic transformation.
2. **Monophonic collapse:** Reject if output has only melody events (no counterline, harmonic_color, or bass).
3. **Simultaneity:** Reject if no two events share same beat_position (all monophonic).
4. **Density sanity:** Optional. Reject if >X events per bar (chaos) or <Y events per 4 bars (too sparse). Thresholds TBD.

---

## WEAK CHECKS

1. **Check 1 (Motivic continuity):** "70% trace to cell" — how is "trace" computed? Manual? Automated interval matching? Undefined. Risk: unenforceable.

2. **Check 4 (Interval logic consistency):** "Melodic intervals align with interval cell library" — alignment criteria not specified. Exact match? Subset? Permutation?

3. **GCE scoring:** All 5 dimensions are 0–2 subjective. "Strongly Shorter-like" has no rubric. Two reviewers could disagree. Needs calibration examples.

4. **Check 5 (Harmonic color diversity):** "At least 2 distinct harmonic behaviors" — "distinct" undefined. Modal vs. planing is clear. Modal Dorian vs. Modal Phrygian — distinct? Unclear.

---

## CRITERIA TOO SOFT

1. **1 dominant-tonic per 8 bars:** Arguably lenient. Shorter often has zero. Consider 0 per 8 bars for strict mode.

2. **"At least one irregular grouping":** An 8-bar phrase could be 4+4 with "harmonic asymmetry" (per phrase rules) and still pass. Check 3 only fails "strict 4+4+4+4 for 8+ bars." So 4+4 in 8 bars passes if there's "variation" — but "variation" is not in the validator. Inconsistent with phrase rules.

3. **GCE 9.0:** With 5 dimensions × 2 max = 10, GCE 9.0 means average 1.8/2. Very high bar. Good. But without rubric, "1.8" is not reproducible.

---

## RECOMMENDATION

**Tighten validator before stress tests** for:

1. Add loop/narrative check.
2. Add monophonic collapse check.
3. Define "trace" for motivic continuity (e.g., interval sequence matches cell or transformation).
4. Define "distinct" for harmonic color (e.g., different field types: modal vs. planing vs. pedal).
5. Add GCE calibration examples (2–3 phrases scored with rationale).

**Validator acceptable for next phase** if the above are documented as "to be refined" and stress tests proceed with manual validation. Automated validation will need the definitions.
