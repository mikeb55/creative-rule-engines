# Andrew Hill Engine V2.5 — Rule Stabilization Summary

## Stress-Test Findings (V2.4)

The 12-phrase identity stress test revealed:

- **Strong:** Interval cells, harmonic fields, phrase asymmetry, ensemble equality, anti-cadential behavior held across all variants.
- **Weak:** Phrases 3, 5, 9, 11 — dual displacement layers (delayed_entry + pulse_displacement or pulse_displacement + phrase_stretch) without base_pulse anchor. Rhythmic identity weakened toward generic avant-jazz drift.
- **Pattern:** Any combination excluding base_pulse and using two displacement-type layers weakens Hill identity.

---

## New Rhythm Rules

| Rule | Requirement |
|------|-------------|
| **Pulse Anchor** | ≥1 base_pulse event per 2-bar span when displacement layers exist |
| **Layer Compatibility** | At least one layer must be base_pulse; forbid delayed_entry + pulse_displacement and pulse_displacement + phrase_stretch as sole combinations |
| **Long Phrase** | For phrases ≥ 10 bars: convergence interval ≤ 6 bars |

---

## Validator Upgrades

| Check | Condition | Action |
|-------|-----------|--------|
| **Pulse Anchor Check** | 2-bar span with displacement layers but no base_pulse | Flag; reject or regenerate |
| **Layer Compatibility Check** | Two displacement layers, no base_pulse in phrase | Flag; reject or regenerate |
| **Long Phrase Convergence Check** | Phrase ≥ 10 bars, convergence gap > 6 bars | Flag; reject or regenerate |

---

## Expected Improvement

- **Phrase stability:** Phrases that previously drifted (3, 5, 9, 11) will be rejected or corrected before output.
- **Identity preservation:** Hill character (controlled ambiguity, layered perception) maintained under wider variation.
- **Generator guidance:** Explicit rules for phrase generator and rhythmic layer selector.

---

## Files Updated

- hill_rhythm_stability_rules.md — formal rule specification
- rhythmic_displacement_patterns.md — stability constraints integrated
- andrew_hill_validator.md — three new validation checks
