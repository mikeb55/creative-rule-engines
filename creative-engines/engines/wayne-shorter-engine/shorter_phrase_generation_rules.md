# Wayne Shorter Phrase Generation Rules

**Purpose:** Define phrase architecture and asymmetry for the Shorter engine.

---

## PHRASE PATTERNS

### Primary Patterns

| Pattern | Bar Layout | Example |
|---------|------------|---------|
| 3+5 | 3 bars + 5 bars | 8-bar phrase |
| 5+4 | 5 bars + 4 bars | 9-bar phrase |
| 4+4+3 | 4 + 4 + 3 bars | 11-bar phrase |
| 7+5 | 7 bars + 5 bars | 12-bar phrase |
| 3+3+2 | 3 + 3 + 2 bars | 8-bar phrase |
| 6+6 | 6 + 6 bars | 12-bar phrase |
| 5+7 | 5 + 7 bars | 12-bar phrase |
| 4+3+4 | 4 + 3 + 4 bars | 11-bar phrase |

### Secondary Patterns

| Pattern | Bar Layout |
|---------|------------|
| 3+4+5 | 12-bar phrase |
| 5+3+4 | 12-bar phrase |
| 4+5+3 | 12-bar phrase |
| 3+4+4 | 11-bar phrase |

---

## PHRASE BOUNDARY BEHAVIORS

### Delayed Cadence

Phrase extends past expected bar boundary.

- Expected end: bar 4
- Actual end: bar 4.5 or bar 5

### Early Cadence

Phrase truncates before expected boundary.

- Expected end: bar 4
- Actual end: bar 3.5

### Overlap

Next phrase begins before previous ends.

- Phrase 1 ends bar 4
- Phrase 2 begins bar 3.5

### Restart

Motif restarts mid-phrase.

- Fragment 1: bars 1–2
- Fragment 2: bars 2.5–4 (restart of same motif)

---

## MOTIF PLACEMENT RULES

1. Place motif fragments across phrase according to pattern.
2. Apply transformation per fragment (repeat, invert, transpose, fragment, extend, interrupt).
3. Allow interruptions between fragments.
4. Allow restarts (motif begins again).
5. Ensure at least one transformation per phrase.

---

## REJECTION RULES

- Reject strict 4+4 for 8 bars without variation.
- Reject 4+4+4+4 for 16 bars without variation.
- Reject phrases with no motivic development.
- Reject phrases with no asymmetry.

---

## 4+4 ASYMMETRY RULE (Explicit Conditions)

A 4+4 phrase (8 bars) is **acceptable only if** at least one of the following holds:

1. **Motivic transformation between halves**
   - Bars 1–4: motif statement (exact cell or fragment).
   - Bars 5–8: motif must undergo at least one transformation: invert, transpose (m3, tt, P4), fragment, extend, or rhythmic displacement.
   - Bar-level criterion: second half must not be literal repeat of first.

2. **Harmonic field shift**
   - Bars 1–4: one harmonic field (e.g., Field A).
   - Bars 5–8: different harmonic field type (e.g., Field D) or same type with distinct root and transformation (extension change, bass register shift, planing shift).
   - Bar-level criterion: harmonic color must differ between halves.

3. **Interval contour change**
   - Contour in bars 5–8 must invert (up→down or down→up) or expand (step→leap) relative to bars 1–4.
   - Bar-level criterion: melodic contour in second half must not mirror first half without transformation.

**Fail:** 4+4 with identical motif in both halves, same harmonic field with no transformation, and no contour change.

---

## 8-BAR PHRASE INTERPRETATIONS

For 8-bar phrases, use:

- 3+5
- 5+3 (truncated 5+4)
- 4+4 (only if one of: motivic transformation between halves, harmonic field shift, or interval contour invert/expand)
- 3+3+2

---

## 12-BAR PHRASE INTERPRETATIONS

For 12-bar phrases (e.g., blues):

- 7+5
- 6+6
- 5+7
- 4+4+3
- 3+4+5
- 5+4+3
