# Andrew Hill Engine — Rhythm Stability Rules (V2.5)

Formal rules derived from V2.4 stress test findings. These rules stabilize phrase identity under expanded variation.

---

## Pulse Anchor Rule

**If displacement layers exist, require ≥1 base_pulse event per 2-bar span.**

- **Rationale:** When delayed_entry or pulse_displacement are active, both layers can avoid the downbeat. Without a pulse anchor, the phrase risks "rhythmic soup" — texture without direction.
- **Application:** Scan each 2-bar window. If any event in that window uses delayed_entry or pulse_displacement, the window must contain at least one base_pulse event.
- **Violation:** Flag phrase; reject or require regeneration.

---

## Layer Compatibility Rule

**At least one layer must be base_pulse when using two rhythmic layers.**

### Allowed Layer Combinations

| Combination | Status |
|-------------|--------|
| base_pulse + delayed_entry | ✓ Allowed |
| base_pulse + pulse_displacement | ✓ Allowed |
| base_pulse + phrase_stretch | ✓ Allowed |
| delayed_entry + phrase_stretch | ✓ Allowed (one displaces, one extends) |

### Forbidden Combinations (as sole pair)

| Combination | Status |
|-------------|--------|
| delayed_entry + pulse_displacement | ✗ Forbidden |
| pulse_displacement + phrase_stretch | ✗ Forbidden |

**Exception:** These combinations are allowed if base_pulse appears elsewhere in the phrase (e.g. in a different 2-bar span or phrase group).

---

## Long Phrase Rule

**For phrases ≥ 10 bars: convergence interval ≤ 6 bars.**

- **Rationale:** Long phrases with displacement layers amplify drift. Phrase 9 (12 bars) in the V2.4 stress test showed that extended spans need more anchor points.
- **Application:** Count bars between consecutive convergence points. If any gap exceeds 6 bars, flag the phrase.
- **Convergence point:** A bar where multiple rhythmic layers align (e.g. base_pulse and delayed_entry both have events on the same beat).

---

## Summary

| Rule | Condition | Requirement |
|------|-----------|-------------|
| Pulse Anchor | Displacement layers present | ≥1 base_pulse per 2-bar span |
| Layer Compatibility | Two rhythmic layers | At least one must be base_pulse (or base_pulse elsewhere) |
| Long Phrase | Phrase length ≥ 10 bars | Convergence point every ≤ 6 bars |
