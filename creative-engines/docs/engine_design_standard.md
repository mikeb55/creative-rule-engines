# ENGINE DESIGN STANDARD — MUSICAL GENERATIVE SYSTEMS

## Purpose

Provide a repeatable architecture for building generative music engines that produce usable musical material while avoiding the common design failures that lead to random, non-idiomatic output.

This standard applies to all engines regardless of style, composer influence, instrumentation, or ensemble size.

The goal is reliable musical sketch generation built from coherent musical behavior rather than arbitrary pitch output.

---

## PRINCIPLE 1 — SEPARATE MUSICAL LAYERS

Never generate finished notation in one step.

All engines must follow a layered pipeline:

1. form structure
2. motif generation
3. harmonic logic
4. phrase architecture
5. melodic realization
6. counterline generation
7. instrument idiom mapping
8. voicing/orchestration
9. export
10. validation
11. revision loop

Each layer passes structured data to the next.

Harmony, voicing, and orchestration must never be merged prematurely.

---

## PRINCIPLE 2 — USE MUSICAL EVENTS, NOT NOTE STREAMS

Engines must operate on structured musical events.

Event structure:

```
event
  pitches
  role
  staff
  beat_position
  duration
  register_band
  articulation
```

Chord events must be represented as simultaneous pitch events.

---

## PRINCIPLE 3 — IMPLEMENT A FORM LAYER

Music requires large-scale structure before notes are generated.

Form defines:

- section lengths
- phrase groupings
- cadence zones
- density arcs
- motif recurrence points

Without form, engines produce endless mid-density material.

---

## PRINCIPLE 4 — INSTRUMENTS REQUIRE IDIOM ENGINES

Each instrument must have a translation layer.

**Examples**

| Instrument | Idiom concerns |
|------------|----------------|
| Guitar | fretboard mapping, voicing families, string constraints |
| Piano | LH/RH independence, comping logic, register balance |
| Horn Sections | voicing spreads, sectional roles, breath constraints |

The idiom layer converts abstract musical events into playable material.

---

## PRINCIPLE 5 — GENERATE FROM MUSICAL VOCABULARY

Pitch selection must draw from defined vocabularies:

- voicing families
- phrase templates
- rhythm templates
- motif transformations
- harmonic movement patterns
- interval cells

Engines must not invent unconstrained pitch structures.

---

## PRINCIPLE 6 — USE HIERARCHICAL GENERATION

All parts must derive from a shared hierarchy:

```
motif
→ harmonic context
→ melody
→ counterline
→ harmonic support
→ rhythm section
```

Parts must not be generated independently.

---

## PRINCIPLE 7 — CONTROL TEXTURE DENSITY

Engines must vary ensemble density intentionally.

Example density states:

- solo line
- melody + bass
- melody + harmony
- layered ensemble
- full ensemble

Static density is a failure condition.

---

## PRINCIPLE 8 — BUILD VALIDATORS

Every engine must include validation checks:

- instrument playability
- voice independence
- harmonic coherence
- register balance
- texture balance

If validation fails, generation restarts.

---

## PRINCIPLE 9 — DETECT MUSICAL FAILURE MODES

Reject output if:

- pitch repetition exceeds limits
- phrase symmetry repeats excessively
- texture density never changes
- harmonic rhythm remains static
- parts collapse into monophony

These prevent mechanically repetitive music.

---

## PRINCIPLE 10 — PREVENT METRIC GAMING

Evaluation systems must include score caps.

Cap scores if:

- harmony events missing
- monophony dominates
- instrument idiom rules fail
- phrase structure absent

Superficial metrics must not inflate scores.

---

## PRINCIPLE 11 — USE MUSICAL DICTIONARIES

Generation must rely on constrained dictionaries:

- voicing libraries
- interval cell libraries
- scale collections
- rhythm libraries
- orchestration templates

---

## PRINCIPLE 12 — IMPLEMENT REVISION LOOPS

Generation loop:

```
generate
→ validate
→ score
→ identify weakest section
→ regenerate
```

Repeat until thresholds are satisfied.

---

## PRINCIPLE 13 — DISTINGUISH ENGINE TYPES

**Composition Engines**

Responsible for harmonic and melodic logic.

Examples: Barry Harris, Monk, Andrew Hill, Wayne Shorter

**Orchestration Engines**

Responsible for ensemble realization.

Examples: Ellington, Thad Jones, Gil Evans, Maria Schneider, Brookmeyer

Composition engines generate structure. Orchestration engines translate structure into ensemble writing.

---

## PRINCIPLE 14 — AVOID STYLE IMITATION

Engines must model musical behavior rather than surface style.

**Correct approach**

- model harmonic logic
- model phrase structure
- model rhythmic placement
- model ensemble interaction

---

## PRINCIPLE 15 — STAGE COMPLEXITY

Development order:

1. single instrument
2. two-voice textures
3. rhythm section
4. small ensemble
5. chamber ensemble
6. large ensemble

---

## PRINCIPLE 16 — VALIDATE EXPORT

Export layers must verify:

- staff structure preserved
- chord simultaneity preserved
- voice separation intact
- instrument assignments correct

Export failures trigger regeneration.

---

## DESIGN SUMMARY

Reliable engines follow this pipeline:

```
form
→ motif
→ harmony
→ phrase
→ melody
→ counterline
→ instrument idiom
→ voicing/orchestration
→ export
→ validation
→ revision
```

Architecture must precede stylistic modeling.
