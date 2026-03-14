# Andrew Hill Engine Pipeline

Hill engine generation follows the standard architecture:

```
motif
→ harmonic field
→ phrase structure
→ rhythmic displacement
→ ensemble mapping
→ export
→ validation
```

Each stage pulls material from rule libraries.

---

## STAGE 1 — CELL MOTIF GENERATOR

**Uses:** interval_cell_library.md

**Process:**

1. choose interval cell
2. generate pitch sequence
3. apply transformation

**Allowed transformations:**

- repeat fragment
- invert
- expand interval
- compress interval
- register shift

**Output:** motif fragment (3–6 notes)

---

## STAGE 2 — AMBIGUOUS HARMONIC FIELD GENERATOR

**Uses:** ambiguous_harmonic_fields.md

**Process:**

1. select harmonic field
2. map motif notes to field
3. generate supporting tones

Harmony is not functional.

Avoid dominant-tonic motion.

**Allowed motion:**

- shared pitch pivot
- interval mutation
- register pivot

---

## STAGE 3 — PHRASE ASYMMETRY GENERATOR

**Uses:** phrase_generator_rules.md

**Process:**

1. choose phrase pattern

**Examples:**

- 3+5
- 5+4
- 4+4+3
- 7+5

2. place motif fragments across phrase

Allow interruptions.

Allow restarts.

Reject strict 4+4 symmetry.

---

## STAGE 4 — RHYTHMIC LAYER GENERATOR

**Uses:** rhythmic_displacement_patterns.md

**Process:**

**Layer 1:** base pulse

**Layer 2:** motif displacement

**Layer 3:** phrase stretch

Ensure convergence every 4–8 bars.

---

## STAGE 5 — ENSEMBLE DISTRIBUTION

**Rules:**

- All instruments must carry structural material.
- No instrument is purely accompaniment.

**Possible roles:**

- melody fragment
- counterline
- cluster color
- rhythmic punctuation
