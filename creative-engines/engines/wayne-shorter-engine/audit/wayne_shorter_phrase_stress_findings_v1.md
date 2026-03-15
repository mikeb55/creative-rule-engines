# Wayne Shorter Engine — Phrase Stress Test Findings V1

**Date:** 2026-03-15

**Source:** 12 hand-constructed phrase cases evaluated against wayne_shorter_validator.md

---

## TOP 5 GRAMMAR STRENGTHS

1. **Interval cell vocabulary (Cells A–D)** — Cells A (m3–tt), B (P4–m2), C (m2–M3), D (M2–tt) produce clear, traceable melodic material. Transformations (repeat, transpose, invert, fragment) are operational and testable. Motif trace logic works.

2. **Harmonic field differentiation** — Modal (A, B, C), chromatic planing (D, E), pedal (F), turnaround (G) are distinct types. Combining 2+ field types reliably produces non-generic harmony. Field selection drives validator Ch2 and Ch5.

3. **Phrase asymmetry patterns** — 3+5, 5+4, 4+4+3, 7+5, 3+3+2 are well-defined. Validator Ch3 correctly accepts irregular groupings. Phrase generation rules are actionable.

4. **Monophonic collapse check** — Enforcing ≥2 roles (melody + counterline/harmonic_color/bass) prevents melody-only output. Clear, measurable. Correctly rejected P09.

5. **Loop/narrative check** — Literal repeat detection (Ch6) is unambiguous. AABA with A' = A fails. Correctly rejected P11. Supports narrative form over looped form.

---

## TOP 5 GRAMMAR WEAKNESSES

1. **4+4 with asymmetry — underspecified** — Validator allows 4+4 "only if harmonic or motivic asymmetry present." P06 had transposed motif + bass register shift but still failed GCE (Phrase=1, Ensemble=1). Unclear: when does 4+4 pass Ch3? Need bar-level criteria (e.g., "different field in each 4-bar block" or "motif transformation in bars 5–8").

2. **Cell G (major triad) — generic risk** — Cell G (M3–P4: C E G) is consonant, major triad. P07 failed GCE despite 3+3+2, 2 field types, 2 roles. No grammar rule constrains Cell G or flags "consonant cell" contexts. Risk: output sounds generic.

3. **Single-field transformation — broad** — Extension change (Cm7→Cm9), bass register shift, planing shift all satisfy Ch5 "same type with transformation." But "transformation" is broad. Planing shift (root moves) vs. extension change — are both equally valid? No hierarchy or constraint.

4. **GCE Ensemble dimension — sharp threshold** — 2 roles = 1, 3 roles = 2. Melody + bass can hit GCE 9.0 but is fragile. No guidance for "thin but valid" vs. "too thin." P06 and P07 failed at GCE despite passing other checks.

5. **Contour rules — missing** — No operational contour grammar. "Leaps followed by stepwise recovery" not encoded. Stress test did not exercise contour. Grammar cannot enforce angular-yet-lyrical shape.

---

## AMBIGUOUS RULES THAT NEED TIGHTENING

1. **"Harmonic or motivic asymmetry" for 4+4** — Define explicitly: (a) different harmonic field in bars 1–4 vs. 5–8, or (b) motif transformation (transpose, invert, fragment) in bars 5–8, or (c) extension/voicing change. Add examples.

2. **"Transformation" for single field type** — List valid transformations: extension change, bass register shift, planing shift (root movement), voicing inversion. Exclude: mere repetition.

3. **Cell G usage** — Add constraint: Cell G may require accompaniment by less consonant cell, or restrict to Lydian/planing contexts. Or document as "use with caution."

4. **GCE Ensemble = 1** — Clarify: melody + bass or melody + harmonic_color can pass at 9.0 only if other dimensions are 2. Add "fragile pass" note.

---

## SHORTER-LIKE ASYMMETRY VS. GENERIC MODERN-JAZZ

**Assessment:** The engine is producing **real Shorter-like asymmetry** when grammar is followed strictly.

**Evidence:**
- Pass cases (P01–P05, P08) use interval cells (m3, tt, P4, m2, M2), non-functional harmony, irregular phrase lengths. No ii–V–I. No scalar bebop.
- Fail cases (P10) that used generic material were correctly rejected.
- Phrase patterns 3+5, 5+4, 4+4+3, 7+5 produce asymmetric groupings distinct from 4+4 default.

**Risk of generic drift:**
- Cell G (major triad) can sound generic. P07 failed.
- 2-role output (melody + bass) is minimal. Could drift toward "melody with bass" without counterline or harmonic color.
- Single field type with only extension change (P05) passed but is borderline. Repeated modal with minimal transformation may sound samey.

**Verdict:** Grammar supports Shorter-like output when cells A–D, 2+ field types, and 3+ roles are used. Cell G and 2-role minimum need attention to avoid generic drift.

---

## RECOMMENDATION

**Proceed to form stress testing.**

Rationale:
- 6 of 12 cases passed. Validator correctly accepted strong cases and rejected fail cases.
- Grammar is operational for phrase-level generation. Interval cells, harmonic fields, phrase patterns work.
- Remaining weaknesses (4+4 asymmetry, Cell G, GCE threshold) can be refined in parallel with form tests. Form stress tests will exercise loop/narrative (Ch6) and multi-section behavior.
- Do not implement runtime yet. Form stress tests will reveal section linkage and narrative arc gaps before runtime.

**Do not:** Refine grammar before form stress testing. Proceed to form tests; document findings; then batch refinements.

**Optional:** Add 2–3 phrase cases targeting 4+4 with asymmetry and Cell G to clarify rules before form tests.
