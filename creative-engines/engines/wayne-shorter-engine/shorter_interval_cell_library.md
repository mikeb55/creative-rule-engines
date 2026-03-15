# Wayne Shorter Interval Cell Library

These cells form the melodic and harmonic vocabulary of the Shorter engine.

Cells must be used for:

- melodic contour
- harmonic construction
- counterline generation

---

## CELL A

**minor 3 → tritone**

Example pitch sets:

- C Eb A
- F Ab D

---

## CELL B

**perfect 4 → minor 2**

Example:

- C F Gb
- D G Ab

---

## CELL C

**minor 2 → major 3**

Example:

- C Db E
- F Gb A

---

## CELL D

**major 2 → tritone**

Example:

- C D Ab
- E F# C

---

## CELL E

**minor 3 → major 2**

Example:

- C Eb F
- D F G

---

## CELL F

**tritone → minor 2**

Example:

- C F# G
- Eb A Bb

---

## CELL G

**major 3 → perfect 4**

Example:

- C E G
- F A Bb

**Usage constraints (Cell G is generic; apply restrictions):**

1. **Chromatic displacement required** — Cell G may be used only when accompanied by chromatic displacement (rhythmic_layer: delayed_entry or pulse_displacement) or when embedded in chromatic planing (Field D or E).
2. **Non-functional harmonic field** — Cell G is allowed only when the harmonic field is non-functional: modal (A, B, C), chromatic planing (D, E), pedal (F), or turnaround (G). Reject Cell G over ii–V–I or dominant-tonic contexts.
3. **Transformation before repetition** — If Cell G appears twice, the second occurrence must undergo transformation (invert, transpose, fragment, extend) before any literal repeat. No bare repetition of Cell G without transformation.

**Use with caution:** Cell G (major triad) is consonant and risks generic jazz output. Prefer Cells A–F for primary motivic material; use Cell G as secondary or with the above constraints.

---

## CELL TRANSFORMATIONS

**Allowed transformations:**

- repeat fragment
- invert
- transpose (m3, tt, P4)
- compress interval
- expand interval
- fragment (subset)
- extend (add note)
- shift register

---

## USAGE RULES

- At least one cell per phrase.
- Melodic events must trace to cell or transformation.
- Counterlines derive from same cell as melody (or related cell).
- Harmonic voicings may use cell as basis.
