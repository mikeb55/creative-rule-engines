# Wayne Shorter Engine — Cross-Engine Contamination Audit

**Date:** 2026-03-15

---

## SEARCH FOR CONTAMINATION

**Grep:** Hill, Monk, Barry, Harris in wayne-shorter-engine subtree.

**Result:** No explicit references to other engines or composers in content.

---

## STRUCTURAL COMPARISON

### Interval Cells

| Hill | Shorter | Overlap |
|------|---------|---------|
| A: m2→M3 (C Db E) | C: m2→M3 (C Db E) | **Identical** |
| B: m3→tt (C Eb A) | A: m3→tt (C Eb A) | **Identical** |
| C: P4→m2 (C F Gb) | B: P4→m2 (C F Gb) | **Identical** |
| D: M2→tt (C D Ab) | D: M2→tt (C D Ab) | **Identical** |
| E: m3→M2 (C Eb F) | E: m3→M2 (C Eb F) | **Identical** |
| — | F: tt→m2 (C F# G) | Shorter adds |
| — | G: M3→P4 (C E G) | Shorter adds |

**Verdict:** Shorter cells A–E are Hill cells B, C, A, D, E (reordered). Cells F and G are Shorter additions. The interval cell *vocabulary* is largely shared. This could be (a) legitimate — both composers use similar interval language — or (b) structural copy. No Hill-specific content (e.g., "dark cluster color") appears in Shorter cells.

### Harmonic Fields

| Hill | Shorter |
|------|--------|
| 4-note clusters (C Eb F# G, etc.) | Full modal scales (Dorian, Phrygian, Lydian) |
| "Dark cluster color," "modal ambiguity" | "Dorian color," "Phrygian," "Lydian #4" |
| Shared pitch pivot, interval mutation | + Chromatic planing, pedal, Footprints turnaround |

**Verdict:** Shorter harmonic fields are **distinct**. Modal foundations and chromatic planing are Shorter-specific. No direct copy of Hill field content.

### Rhythmic Patterns

| Hill | Shorter |
|------|---------|
| 3+3+2 grouping | Tresillo (3+3+2) — same |
| Delayed entry | Delayed entry — same |
| Pulse displacement | Pulse displacement — same |
| Phrase stretch | Phrase stretch — same |
| — | Base pulse (Hill implies) | Base pulse — explicit |
| — | 3-over-2, Syncopated entry | Shorter adds |
| Convergence every 4–8 bars | Same | Same |
| Pulse anchor, layer compatibility | Same | Same |

**Verdict:** Rhythmic pattern **names and rules** are nearly identical. Layer combinations, pulse anchor, forbidden pairs — same structure. This is architectural borrowing. Hill's rhythmic logic is generic (layered pulse, convergence); Shorter's music also uses it. But the *wording* and *rules* are very close. **MINOR CONTAMINATION.**

### Phrase Patterns

| Hill | Shorter |
|------|---------|
| 3+5, 5+4, 4+4+3, 7+5 | 3+5, 5+4, 4+4+3, 7+5 + 3+3+2, 6+6, 5+7, 4+3+4 |

**Verdict:** Overlap. Phrase asymmetry is a shared post-bop trait. Shorter adds more patterns. Not composer-specific contamination.

### Validator / Pipeline

Pipeline order: form → motif → harmonic field → phrase → rhythm → ensemble → export → validation. Hill uses: motif → harmonic field → phrase → rhythm → ensemble → export → validation. Shorter adds form first. Structure is similar; appropriate for shared architecture.

---

## CONTAMINATION VERDICT

**MINOR CONTAMINATION**

**Where:**

1. **Interval cells A–E:** Same interval structures as Hill (different letter assignment). Shorter adds F, G. Risk: output may sound Hill-like if cells drive melody. Mitigation: Shorter harmonic fields (modal, planing) differ; context may distinguish.

2. **Rhythmic patterns:** Pattern names (delayed_entry, pulse_displacement, phrase_stretch) and layer rules (pulse anchor, forbidden pairs) match Hill. This is architectural reuse. Both engines use layered rhythm. Acceptable if documented as shared pattern.

3. **No Monk/Barry content:** No guide tones, bebop scales, or Harris motion. Clean.

---

## RECOMMENDATIONS

1. **Document architectural precedent:** Add note in wayne_shorter_engine_spec.md: "Rhythmic layer concepts (delayed entry, pulse displacement, convergence) follow repository architecture; interval cell concept is shared across post-bop engines."

2. **Differentiate Shorter cells:** Consider adding 1–2 Shorter-specific cells derived from repertoire (e.g., from Footprints turnaround, Infant Eyes). Reduces overlap with Hill.

3. **No further action required** for contamination. MINOR level does not block stress tests.
