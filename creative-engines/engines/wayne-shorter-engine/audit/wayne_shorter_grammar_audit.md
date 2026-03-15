# Wayne Shorter Engine — Grammar Audit

**Date:** 2026-03-15

---

## 1. STRENGTHS

- **Interval cell vocabulary:** 7 cells (A–G) with interval structure and examples. Operational.
- **Motif transformation rules:** Table with constraints (max 2 consecutive repeat, axis for invert, etc.). Testable.
- **Phrase asymmetry logic:** Primary and secondary patterns; 8-bar and 12-bar interpretations. Specific.
- **Harmonic field definitions:** 7 fields (modal, planing, pedal, Footprints turnaround). Non-functional rules stated.
- **Chromatic root behavior:** Allowed progressions listed; ii–V–I avoided.
- **Form archetypes:** 6 archetypes with length, structure, use case.
- **Rhythmic displacement patterns:** Base pulse, delayed entry, pulse displacement, phrase stretch, tresillo, 3-over-2, syncopated entry. Layer combinations and convergence rules.
- **Anti-generic guardrails:** Anti-patterns section; reject 4+4, scalar bebop, melody+chord only.

---

## 2. WEAK AREAS

- **Contour rules:** "Angular: leaps followed by stepwise recovery" — no operational definition. What leap size? How many steps to recover? No contour grammar.
- **Expectation-substitution rules:** **MISSING.** No rules for "expected resolution → substitute with X." Shorter often sets up then subverts; grammar does not encode this.
- **Cell G (M3–P4):** C E G is a major triad — risks generic sound. "Supports major 3rd, tritone" in Field C but Cell G is consonant. May need constraint or exclusion in certain contexts.
- **Narrative arc:** "Build, release, suspend" — no density curve, no bar-by-bar guidance. Not operational.
- **Lead sheet chord symbol logic:** Harmonic fields map to pitch sets, but export spec says "harmonic_field or chord root → chord symbol." No rule for converting Field A (Dorian) to chord symbol (e.g., Cm7? Cm9? C-7?).

---

## 3. MISSING RULE CATEGORIES

1. **Expectation-substitution:** Expected cadence → substitute with planing, pedal, or motivic return.
2. **Contour grammar:** Leap size thresholds; recovery step count; contour transformation.
3. **Density rules:** How many simultaneous events per bar? When to thin vs. thicken?
4. **Shorter-specific chord vocabulary:** maj7#5, ø7, 7(#11), 9(♭5) — when and how.
5. **Recomposition logic:** "Form emerges from interaction" — no rule. Needs: how does phrase B derive from phrase A without literal repeat?

---

## 4. GENERIC OR UNUSABLE WORDING

| Location | Wording | Issue |
|----------|---------|-------|
| shorter_style_grammar.md §8 | "Form emerges from motivic development" | Vague. No process. |
| shorter_style_grammar.md §8 | "Build, release, suspend as narrative arc" | Not operational. |
| shorter_form_archetypes.md | "Narrative arc: build, release, suspend" | Repeated; still vague. |
| shorter_harmonic_fields.md Field C | "Bright but ambiguous" | Subjective; no rule. |
| shorter_harmonic_fields.md Field B | "Dark, Spanish-tinged" | Color language; not actionable. |

---

## 5. READINESS VERDICT

**PARTIALLY READY**

The grammar is **operational** for: interval cells, transformations, phrase patterns, harmonic fields, rhythmic layers. A runtime could generate events from these rules.

The grammar is **testable** for: motivic continuity, phrase asymmetry, harmonic ambiguity (with some interpretation).

The grammar is **not specific enough** for: contour, expectation-substitution, narrative arc, density, Shorter chord vocabulary.

**Verdict: PARTIALLY READY FOR STRESS TESTS.** Phrase stress tests can proceed using existing rules. Form stress tests and narrative evaluation will be under-specified until contour and expectation-substitution rules are added.
