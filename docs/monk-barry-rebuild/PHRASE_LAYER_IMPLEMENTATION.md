# Phrase Layer Implementation

## Architecture Diagram

```
form
  ↓
motif
  ↓
harmony engine (Barry Harris / Monk)
  ↓
Barry Harris chord motion grammar  ← NEW (Barry only)
  ↓
phrase architecture engine  ← NEW
  ↓
melodic realization
  ↓
counterline generation
  ↓
instrument idiom engine
  ↓
voicing engine
  ↓
export
  ↓
validation
  ↓
revision loop
```

---

## Phrase Architecture Engine

**Module:** `creative-engines/engines/shared/phraseArchitecture.ts`

### Responsibilities

- Group harmonic events into phrases
- Define phrase lengths (4, 6, 8 bars)
- Control tension arc across phrase
- Control interruption points
- Insert cadential pressure

### Output Structure

```typescript
PhraseStructure {
  phraseLength: number;
  harmonicTargets: HarmonicTarget[];
  cadencePoints: number[];
  tensionCurve: number[];
}
```

### Validation Rules

Reject outputs with:

- No cadence pressure
- Uniform harmonic density
- No phrase boundary

---

## Barry Harris Chord Motion Grammar

**Module:** `creative-engines/engines/barry-harris-engine/barryMotionGrammar.ts`

### Motion Families

| Family | Description |
|--------|-------------|
| tonic_diminished_passing | Tonic6 → diminished passing chord |
| tonic_ii_V | Tonic → ii → V progression |
| dominant_tonic | V → I resolution |
| dominant_tritone_sub | V → tritone substitute |
| diminished_pivot | Dim7 → related dim7 |
| chromatic_dominant_approach | Chromatic approach to dominant |
| major6_diminished_alternation | Major6 ↔ diminished alternation |

### 6th–Diminished System

```
Major6 chord
    ↓
derived diminished structure
    ↓
resolution target
```

### Ensures

- Harmonic pull
- Voice-leading direction
- Non-random root movement

---

## Phrase Structure Examples

### 4-Bar Phrase

```
Measure 0: Cmaj7 (tonic)
Measure 1: Dm7 (ii)
Measure 2: G7 (V)
Measure 3: Cmaj7 (tonic, cadence)
```

### 8-Bar with Tension Arc

```
Bars 0–2: Building (tension curve rises)
Bars 3–4: Peak (cadence pressure)
Bars 5–7: Release (tension curve falls)
Bar 8: Resolution (cadence point)
```

---

## Test Results

### Phrase Architecture Tests

| Test | Result |
|------|--------|
| 4-bar phrase | PASS |
| Cadence pressure injected | PASS |
| Empty targets rejected | PASS |

### Barry Motion Grammar Tests

| Test | Result |
|------|--------|
| applyBarryMotionGrammar returns targets | PASS |
| hasDirectionalMotion (ii-V-I) | PASS |
| rejectRandomChordChains (static roots) | PASS |
| dominant_tonic family applied | PASS |

### Generated Phrase Studies

| File | Result |
|------|--------|
| barry-guitar-phrase.musicxml | OK |
| barry-piano-phrase.musicxml | OK |
| monk-guitar-phrase.musicxml | OK |
| monk-piano-phrase.musicxml | OK |

---

## Integration

- **Harmony engine** produces `HarmonicTarget[]`
- **Phrase engine** organizes them into `PhraseStructure` with cadence points and tension curve
- **Barry motion grammar** refines Barry targets into directional harmonic motion
- **Melodic realization** uses the refined targets

---

## Validation

### Pipeline Rejection

The pipeline rejects output when:

- **Phrase architecture missing:** `buildPhraseArchitecture` returns `null` or `validatePhraseStructure` fails
- **Harmonic direction absent:** (Barry only) `hasDirectionalMotion` returns `false` after motion grammar application

`valid` is set to `false` when either condition fails. The pipeline returns `metadata` for downstream use:

```typescript
metadata: {
  phraseArchitectureApplied: boolean;
  harmonicDirectionPresent: boolean;
  motionGrammarUsed?: boolean;  // Barry only
}
```

### GCE Evaluator

When `engine` is `barry` or `monk`, the GCE evaluator checks:

- `phraseArchitectureMissing` — `metadata.phraseArchitectureApplied === false`
- `harmonicDirectionAbsent` — `metadata.harmonicDirectionPresent === false`
- `motionGrammarUnused` — (Barry only) `metadata.motionGrammarUsed === false`

Penalties: harmonic coherence reduced, overall score capped at 4.5 when any of these are true.

---

## Files Created/Modified

| File | Action |
|------|--------|
| creative-engines/engines/shared/phraseArchitecture.ts | Created |
| creative-engines/engines/barry-harris-engine/barryMotionGrammar.ts | Created |
| engines/monk-barry-engine/pipeline.ts | Modified (integrated phrase + motion, validation wiring) |
| creative-engines/apps/monk-composer/.../gceEvaluator.ts | Modified (phrase/motion rejection) |
| creative-engines/apps/monk-composer/.../types.ts | Modified (new warnings) |
| tests/monk-barry/phrase-tests.ts | Created |
| tests/monk-barry/barry-motion-tests.ts | Created |
| engines/monk-barry-engine/tests/generatePhraseStudies.ts | Created |
