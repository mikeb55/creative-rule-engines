# Hill Identity Failure Analysis — V2.4 Stress Test

Identify where Hill identity weakens under stress across the 12-phrase variation set.

---

## Strongest Hill Phrases

### Phrase 1 — Cell A, Field A, 3+5, base pulse + delayed entry

**Why strong:** Base pulse anchors the phrase; delayed_entry creates contrast without losing direction. Cell A (m2→M3) and Field A (C Eb F# G) align naturally. Convergence at bar 5. Clear 3+5 articulation.

### Phrase 4 — Cell D, Field D, 7+5, base pulse + delayed entry

**Why strong:** Field D (F Ab B C) sustains dark chromatic color. Long 7+5 structure (6+4 in 10 bars) feels expansive. Strong convergence at bar 7. Ensemble roles well distributed.

### Phrase 10 — Cell E, Field B, 4+4+3, base pulse + delayed entry

**Why strong:** 3+2+3 phrase groups are distinct. Cell E (m3→M2) and Field B (D F G Bb) produce clear modal ambiguity. Base pulse + delayed_entry balance maintains forward motion.

---

## Weakest Phrases

### Phrase 3 — Cell C, Field C, 4+4+3, delayed entry + pulse displacement

**Why weak:** Both rhythmic layers avoid the downbeat. No base_pulse anchor. The phrase risks "rhythmic soup" — interesting texture but less clearly directed. Hill identity depends on layered perception with periodic convergence; here convergence exists (bar 7) but the path to it is diffuse.

### Phrase 5 — Cell E, Field A, 3+3+2, pulse displacement + phrase stretch

**Why weak:** Same dual off-beat issue. Pulse displacement + phrase stretch both displace; no anchor. The 3+3+2 structure is asymmetrical but the rhythmic delivery blurs it.

### Phrase 11 — Cell A, Field C, 3+3+2, delayed entry + pulse displacement

**Why weak:** Third instance of delayed_entry + pulse_displacement. Rhythmic identity weak; could drift toward generic avant-jazz.

### Phrase 9 — Cell D, Field A, 3+5, pulse displacement + phrase stretch, 12 bars

**Why weak:** Longest phrase (12 bars) with dual displacement layers. The extended span amplifies the lack of pulse anchor; by bar 9 the phrase risks losing structural clarity.

---

## Cases of Generic Modern-Jazz Drift

**Phrases 3, 5, 9, 11** — When both rhythmic layers avoid the downbeat:

- The result can resemble "free" or "open" jazz texture
- Hill's language relies on **controlled** ambiguity: layers that displace but periodically converge
- Without a pulse anchor, the control weakens and the output drifts toward generic avant-jazz

**Mitigation:** Require at least one base_pulse event per 2-bar span when using displacement layers (already recommended in V2.3).

---

## Cases of Tonal Implication

**None.** All 12 phrases maintained field-based harmony. No ii–V–I, no dominant-tonic resolution, no clear tonic assertion. The stress test did not expose tonal drift.

---

## Rhythmic Layer Failures

| Phrase | Layers | Issue |
|--------|--------|-------|
| 3 | delayed_entry + pulse_displacement | No base_pulse; both layers off-beat |
| 5 | pulse_displacement + phrase_stretch | No base_pulse; both displace |
| 9 | pulse_displacement + phrase_stretch | No base_pulse; 12 bars amplifies drift |
| 11 | delayed_entry + pulse_displacement | No base_pulse; both layers off-beat |

**Pattern:** Any combination that excludes base_pulse and uses two displacement-type layers weakens rhythmic identity.

---

## Phrase Symmetry Creep

**None observed.** All phrase structures (3+5, 5+4, 4+4+3, 7+5, 3+3+2) remained asymmetrical. The stress test did not produce extended symmetric phrasing.

---

## Recommended Rule Adjustments

### 1. Pulse Anchor Rule (High Priority)

**Current:** V2.3 recommended at least one base_pulse event per 2-bar span when using displacement layers.

**V2.4 refinement:** **Enforce** this rule. Reject or flag phrases that combine delayed_entry + pulse_displacement (or pulse_displacement + phrase_stretch) without a base_pulse event in every 2-bar span.

### 2. Displacement Layer Combination Rule (High Priority)

**New rule:** When using two rhythmic layers, at least one must be base_pulse. Do not allow delayed_entry + pulse_displacement as the only combination. Allow:

- base_pulse + delayed_entry ✓
- base_pulse + pulse_displacement ✓
- base_pulse + phrase_stretch ✓
- delayed_entry + phrase_stretch ✓ (one displaces, one extends)
- pulse_displacement + phrase_stretch ✗ (both displace)
- delayed_entry + pulse_displacement ✗ (both displace)

### 3. Long Phrase Pulse Density (Medium Priority)

**New rule:** For phrases ≥ 10 bars, require a convergence point at least every 6 bars, and increase base_pulse density (e.g. one per 1.5 bars) when using displacement layers. Phrase 9's 12-bar span exposed that long phrases with dual displacement need more anchor points.

### 4. Interval Cells and Harmonic Fields (No Change)

No adjustments needed. All five cells and four fields produced traceable, ambiguous material across the stress set.
