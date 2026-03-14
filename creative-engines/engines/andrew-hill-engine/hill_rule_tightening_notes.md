# Hill Rule Tightening Notes

Identify any rule drift revealed by the V2.3 variant set.

---

## Where Hill Identity Remained Strong

- **Field-based harmony:** All five variants sustained a harmonic field without functional progression. No ii–V–I or dominant-tonic resolution.
- **Interval cell traceability:** Each variant clearly derived pitches from its assigned cell. Cell B (m3 → tritone), Cell C (P4 → m2), Cell D (M2 → tritone), Cell A (m2 → M3), Cell E (m3 → M2) were audible in the event sets.
- **Ensemble equality:** Melody, counterline, and cluster_color were distributed across all phrases. No bar functioned as pure accompaniment.
- **Anti-cadential behavior:** All phrases ended on suspended or open material. No clean resolution.
- **Convergence points:** Each variant included at least one bar where multiple layers aligned (typically bar 6).

---

## Where Phrases Became Too Generic

- **Variant 3 (Cell D, Field B):** The combination of delayed_entry + pulse_displacement meant both rhythmic layers often avoided the downbeat. The phrase could drift toward "rhythmic soup" — interesting but less clearly directed than V1 or V4.
- **8-bar truncation of long phrases:** 5+4 and 7+5, when compressed to 8 bars (5+3), lose some of their structural character. The 5+3 interpretation is serviceable but not as distinctive as a true 5+4 or 7+5 would be.

---

## Where Rhythmic Behavior Weakened

- **Dual off-beat layers:** When both delayed_entry and pulse_displacement are active, the phrase can lack a clear pulse anchor. Recommend: require at least one base_pulse event every 2 bars when using displacement layers.
- **Phrase stretch without recovery:** V5's phrase_stretch (V5_013 extending 2 beats) works, but if stretch events dominate without a return to pulse, the phrase can lose forward motion. Recommend: limit consecutive phrase_stretch events to 2 per phrase group.

---

## Where Ambiguity Drifted Toward Tonal Function

**None observed.** All variants maintained harmonic ambiguity. Field A (C Eb F# G), Field B (D F G Bb), Field C (E G Bb C#), and Field D (F Ab B C) were used as regions, not progressions. No variant implied a clear tonic or dominant.

---

## Recommended Refinements

### Interval Cells

- No changes needed. All five cells produced distinct, traceable material.

### Harmonic Fields

- No changes needed. Fields remained ambiguous.

### Phrase Rules

- **Add 8-bar phrase interpretations:**
  - 5+4 → 5+3 (truncate second group)
  - 7+5 → 5+3 (truncate first group)
  - 4+4+3 → 3+3+2 or 3+2+3
- Document these in phrase_generator_rules.md so generators have explicit guidance.

### Rhythmic Rules

- **Pulse anchor rule:** When using delayed_entry or pulse_displacement, require at least one base_pulse event per 2-bar span. Prevents rhythmic drift.
- **Phrase stretch limit:** Maximum 2 consecutive phrase_stretch events per phrase group. Ensures recovery to pulse.
- Add to rhythmic_displacement_patterns.md.

---

## Summary

The V2.3 variant set confirmed that the Hill engine can produce multiple distinct phrases while preserving identity. The main tightening needed is in **rhythmic layering** (pulse anchor when using displacement) and **phrase truncation** (explicit 8-bar interpretations for long phrase types). No changes to interval cells or harmonic fields are required.

---

## V2.4 Stress Test Findings (12-Phrase Identity Stress Test)

### What Held

- **Interval cells A–E:** All traceable across 12 phrases. No cell drift.
- **Harmonic fields A–D:** All remained ambiguous. No tonal implication.
- **Phrase asymmetry:** 3+5, 5+4, 4+4+3, 7+5, 3+3+2 all held. No symmetry creep.
- **Ensemble equality:** Melody, counterline, cluster_color distributed in all phrases.
- **Anti-cadential:** All 12 phrases ended on suspended/open material.

### What Weakened

- **Dual displacement layers:** Phrases 3, 5, 9, 11 combined delayed_entry + pulse_displacement (or pulse_displacement + phrase_stretch) without base_pulse. Rhythmic identity weakened toward generic avant-jazz drift.
- **Long phrases with displacement:** Phrase 9 (12 bars) amplified the dual-displacement problem; longer span = more drift.

### V2.4 Rule Refinements

1. **Enforce pulse anchor rule:** Require at least one base_pulse event per 2-bar span when using displacement layers. Reject or flag phrases that violate this.
2. **Displacement layer combination rule:** When using two rhythmic layers, at least one must be base_pulse. Disallow delayed_entry + pulse_displacement and pulse_displacement + phrase_stretch as sole combinations.
3. **Long phrase pulse density:** For phrases ≥ 10 bars with displacement layers, require convergence point every 6 bars and increased base_pulse density (e.g. one per 1.5 bars).
