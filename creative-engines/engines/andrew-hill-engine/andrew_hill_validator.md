# Andrew Hill Engine Validator

Reject outputs if any of the following occur:

- phrase symmetry persists longer than two cycles
- phrases become metrically predictable
- harmonic motion becomes purely functional
- harmonic motion resolves too conventionally
- ensemble collapses into melody + chord support
- ensemble roles collapse into melody + accompaniment
- cluster density exceeds threshold
- cluster density remains constant
- rhythmic layers fail to reconverge
- motif identity disappears
- interval cell identity disappears

---

## V2.5 Rhythm Stability Checks

### Pulse Anchor Check

**Flag:** Phrase uses delayed_entry or pulse_displacement but contains a 2-bar span with zero base_pulse events.

**Action:** Reject or require regeneration with pulse anchor inserted.

### Layer Compatibility Check

**Flag:** Phrase uses exactly two rhythmic layers and both are displacement-type (delayed_entry + pulse_displacement, or pulse_displacement + phrase_stretch) with no base_pulse anywhere in the phrase.

**Action:** Reject or require regeneration with base_pulse added.

### Long Phrase Convergence Check

**Flag:** Phrase length ≥ 10 bars and the gap between consecutive convergence points exceeds 6 bars.

**Action:** Reject or require regeneration with additional convergence point.
