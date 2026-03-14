# Andrew Hill Rhythmic Displacement Library

Hill rhythmic logic uses layered pulse perception.

Each phrase may include three rhythmic strata.

---

## PATTERN A

**3 + 3 + 2 grouping**

Used for motif fragmentation.

---

## PATTERN B

**Delayed entry**

Motif begins one eighth-note after expected attack.

---

## PATTERN C

**Pulse displacement**

Motif repeats one beat later than original position.

---

## PATTERN D

**Phrase stretch**

Last motif fragment extends beyond phrase boundary.

---

## RHYTHMIC RULES

At least one rhythmic convergence point must occur every 4–8 bars.

Reject rhythmic chaos without convergence.

---

## Stability Constraints (V2.5)

Formal rules from V2.4 stress test. See hill_rhythm_stability_rules.md for full specification.

### Pulse Anchor Rule

If displacement layers (delayed_entry, pulse_displacement) exist, require ≥1 base_pulse event per 2-bar span.

### Layer Compatibility Rule

**Allowed:** base_pulse + delayed_entry | base_pulse + pulse_displacement | base_pulse + phrase_stretch | delayed_entry + phrase_stretch

**Forbidden (as sole pair):** delayed_entry + pulse_displacement | pulse_displacement + phrase_stretch — unless base_pulse appears elsewhere in the phrase.

### Long Phrase Rule

For phrases ≥ 10 bars: convergence interval ≤ 6 bars. No gap between convergence points may exceed 6 bars.
