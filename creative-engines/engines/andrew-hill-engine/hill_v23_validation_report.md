# Andrew Hill Engine V2.3 Validation Report

Cross-variant validation for five controlled phrase variants.

---

## Variant 1 — Cell B, Field C, 3+5, base pulse + delayed entry

| Criterion | Result | Notes |
|----------|--------|-------|
| Interval Cell Integrity | PASS | Cell B (m3 → tritone) in E-G-Bb, Eb-A throughout |
| Harmonic Ambiguity | PASS | Field C sustains; no V-I |
| Phrase Asymmetry | PASS | 3+5 structure |
| Rhythmic Layering | PASS | base_pulse + delayed_entry |
| Ensemble Equality | PASS | melody, counterline, cluster distributed |
| Anti-Cadential Check | PASS | Ends on cluster, not resolution |
| Hill Identity Stability | PASS | Field-based, asymmetrical |

**Overall:** PASS

---

## Variant 2 — Cell C, Field A, 5+4, base pulse + phrase stretch

| Criterion | Result | Notes |
|----------|--------|-------|
| Interval Cell Integrity | PASS | Cell C (P4 → m2) in C-F-Gb, F-Gb-C, Eb-Gb |
| Harmonic Ambiguity | PASS | Field A (C Eb F# G) — dark, unstable |
| Phrase Asymmetry | PASS | 5+3 (8-bar truncation of 5+4) |
| Rhythmic Layering | PASS | base_pulse + phrase_stretch (V2_014 extends) |
| Ensemble Equality | PASS | All three roles present |
| Anti-Cadential Check | PASS | No tonal resolution |
| Hill Identity Stability | PASS | Cell C + Field A distinct from V1 |

**Overall:** PASS

---

## Variant 3 — Cell D, Field B, 4+4+3, delayed entry + pulse displacement

| Criterion | Result | Notes |
|----------|--------|-------|
| Interval Cell Integrity | PASS | Cell D (M2 → tritone) in D-F-Ab, D-Ab, F-G-Bb |
| Harmonic Ambiguity | PASS | Field B (D F G Bb) — modal, no cadence |
| Phrase Asymmetry | PASS | 3+2+3 (8-bar interpretation of 4+4+3) |
| Rhythmic Layering | PASS | delayed_entry + pulse_displacement |
| Ensemble Equality | PASS | melody, counterline, cluster |
| Anti-Cadential Check | PASS | Ends on melody fragment, not resolution |
| Hill Identity Stability | PASS | Displaced entries; no downbeat lock |

**Overall:** PASS

---

## Variant 4 — Cell A, Field D, 7+5, base pulse + delayed entry

| Criterion | Result | Notes |
|----------|--------|-------|
| Interval Cell Integrity | PASS | Cell A (m2 → M3) in F-Gb-A, Gb-A-C |
| Harmonic Ambiguity | PASS | Field D (F Ab B C) — chromatic, dark |
| Phrase Asymmetry | PASS | 5+3 (8-bar truncation of 7+5) |
| Rhythmic Layering | PASS | base_pulse + delayed_entry |
| Ensemble Equality | PASS | All three roles |
| Anti-Cadential Check | PASS | Suspended ending |
| Hill Identity Stability | PASS | Dark register emphasis (Field D) |

**Overall:** PASS

---

## Variant 5 — Cell E, Field C, 3+5, pulse displacement + phrase stretch

| Criterion | Result | Notes |
|----------|--------|-------|
| Interval Cell Integrity | PASS | Cell E (m3 → M2) in E-G-A, Eb-F, G-A |
| Harmonic Ambiguity | PASS | Field C sustains |
| Phrase Asymmetry | PASS | 3+5 structure |
| Rhythmic Layering | PASS | pulse_displacement + phrase_stretch |
| Ensemble Equality | PASS | All three roles |
| Anti-Cadential Check | PASS | No resolution |
| Hill Identity Stability | PASS | Entries displaced; phrase stretch on V5_013 |

**Overall:** PASS

---

## Overall Findings

### Identity Preservation Across Variants

**Yes.** The engine preserved Hill identity across all five variants. Each phrase:
- avoids functional cadence
- uses field-based harmony
- maintains phrase asymmetry
- distributes ensemble roles
- includes at least one convergence point
- traces to its source interval cell

### Strongest Variant

**Variant 1** (Cell B, Field C, 3+5). It is the most coherent: Cell B and Field C align naturally (E G Bb C# contains the minor-3 and tritone relationships). The 3+5 phrase is clearly articulated. Base pulse + delayed entry create a strong rhythmic contrast. This variant best demonstrates the V2.2 proof-of-concept.

### Weakest Variant

**Variant 3** (Cell D, Field B, 4+4+3). The 3+2+3 interpretation of 4+4+3 is the most compressed; the middle 2-bar group feels brief. Pulse displacement + delayed entry together can blur the rhythmic identity — both layers avoid the downbeat, so the phrase risks feeling rhythmically diffuse. The variant still passes, but the phrase structure is less convincing than V1 or V4.

### Rule Library Tightening

**Phrase rules:** The 4+4+3 and 7+5 structures, when truncated to 8 bars, require clearer guidance. Recommend adding explicit 8-bar interpretations (e.g. 4+4+3 → 3+3+2 or 3+2+3) to the phrase generator rules.

**Rhythmic rules:** When both layers avoid the downbeat (delayed entry + pulse displacement), consider requiring at least one layer to anchor on the beat in every 2-bar span. This would prevent the rhythmic drift observed in V3.

No drift toward Monk or Barry Harris was observed. All variants remained field-based and anti-cadential.
