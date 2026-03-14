# Rhythm and Melody Layer Implementation

## Architecture Diagram

```
form
  ↓
motif
  ↓
harmony engine (Barry Harris / Monk)
  ↓
Barry Harris chord motion grammar (Barry only)
  ↓
phrase architecture engine
  ↓
rhythmic grammar engine  ← NEW
  ↓
melodic realization engine  ← NEW
  ↓
counterline generator (optional placeholder)
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

## Rhythmic Grammar Engine

**Module:** `creative-engines/engines/shared/rhythmGrammar.ts`

### Responsibilities

- Convert phrase structure into rhythmic behavior
- Produce `RhythmicEventGrid` from `PhraseStructure` and `HarmonicTargets`
- Delegate to engine-specific rules (Barry / Monk)

### Output Structure

```typescript
RhythmicEvent {
  measure: number;
  beatPosition: number;
  duration: number;
  eventType: 'chord' | 'stab' | 'rest' | 'pickup' | 'line';
  harmonicTargetIndex?: number;
}

RhythmicEventGrid {
  events: RhythmicEvent[];
  phraseLength: number;
  bars: number;
}
```

### Validation

- `hasRhythmicDiversity(grid)` — rejects uniform density (≥2 event types, ≥3 unique beat positions)
- `hasSyncopation(grid)` — requires off-beat attacks (0.5, 1.5, 2.5, 3.5)

---

## Barry Harris Rhythmic Rules

**Module:** `creative-engines/engines/barry-harris-engine/barryRhythmRules.ts`

### Patterns

| Pattern | Description |
|---------|-------------|
| Beat-2 / Beat-4 comp | Chord on beats 1 and 3 |
| Anticipated chord | And-of-4 (beat 3.5) |
| Sustained chord | 2-beat chord from beat 0 |
| Syncopated off-beat comp | Stabs on 0.5, 2.5 |
| Short melodic pickup | Pickup into chord at beat 3 |

### Rules

- Avoid uniform quarter-note chord placement
- Enforce swing density variation
- Limit chord clusters to phrase cadences
- Prefer anticipations before dominant resolution

---

## Monk Rhythmic Rules

**Module:** `creative-engines/engines/monk-engine/monkRhythmRules.ts`

### Patterns

| Pattern | Description |
|---------|-------------|
| Sparse stabs | Short attacks at 0.5, 2, 3.5 |
| Displaced attacks | Off-beat placements |
| Silence | Rest events as structural element |
| Abrupt interruptions | Clustered accents before cadence |

### Rules

- Allow asymmetry
- Allow rests between chord hits
- Encourage sudden rhythmic restarts
- Forbid constant comping density

---

## Melodic Realization Engine

**Module:** `creative-engines/engines/shared/melodicRealization.ts`

### Responsibilities

- Generate melodic events from harmony and rhythm
- Input: `HarmonicTargets`, `PhraseStructure`, `RhythmicEventGrid`
- Output: `MelodicEvent[]`

### Output Structure

```typescript
MelodicEvent {
  pitch: number;
  measure: number;
  beatPosition: number;
  duration: number;
  articulation?: string;
  role: 'guideTone' | 'enclosure' | 'chordTone' | 'passingTone';
  harmonicTargetIndex?: number;
}
```

---

## Barry Melodic Rules

**Module:** `creative-engines/engines/barry-harris-engine/barryMelodicRules.ts`

### Behavior

- Prioritize guide-tone targeting (3rd/7th)
- Allow bebop enclosure figures
- Follow 6th-diminished scale motion
- Resolve chromatic passing tones into chord tones
- Maintain swing continuity

### Reject

- Melody ignores harmonic direction
- Phrases end without tonal resolution

---

## Monk Melodic Rules

**Module:** `creative-engines/engines/monk-engine/monkMelodicRules.ts`

### Behavior

- Angular interval leaps
- Repeated note cells
- Short motivic fragments
- Abrupt phrase restarts
- Strong rhythmic punctuation

### Reject

- Line becomes smooth bebop scale motion
- Phrase symmetry becomes predictable

---

## Before/After Output Comparison

### Before (phrase architecture only)

- Chords placed at harmonic target beat positions (often uniform)
- Melody from motif with fixed 0.5-beat grid
- No swing comping patterns
- No engine-specific rhythmic identity

### After (rhythm + melodic layers)

- **Barry:** Beat-2/4 comp, anticipated chords, syncopated off-beats
- **Monk:** Sparse stabs, displaced attacks, silence as structure
- **Barry melody:** Guide-tone targeting, chord tones from harmonic field
- **Monk melody:** Angular leaps, staccato fragments

---

## GCE Evaluator Updates

New warnings and caps:

- `rhythmicDensityUniform` — uniform chord placement
- `melodyIgnoresHarmony` — melody not following harmonic targets
- `barryLacksGuideToneTargeting` — Barry output without guide tones
- `monkLacksRhythmicInterruption` — Monk output without rests/stabs
- `rhythmGrammarMissing` — cap overall at 5.0

---

## Generated Outputs

| File | Engine | Instrument |
|------|--------|------------|
| barry-guitar-rhythm.musicxml | Barry | Guitar |
| barry-piano-rhythm.musicxml | Barry | Piano |
| monk-guitar-rhythm.musicxml | Monk | Guitar |
| monk-piano-rhythm.musicxml | Monk | Piano |

---

## Files Created/Modified

| File | Action |
|------|--------|
| creative-engines/engines/shared/rhythmGrammar.ts | Created |
| creative-engines/engines/barry-harris-engine/barryRhythmRules.ts | Created |
| creative-engines/engines/monk-engine/monkRhythmRules.ts | Created |
| creative-engines/engines/shared/melodicRealization.ts | Created |
| creative-engines/engines/barry-harris-engine/barryMelodicRules.ts | Created |
| creative-engines/engines/monk-engine/monkMelodicRules.ts | Created |
| engines/monk-barry-engine/pipeline.ts | Modified (integrated rhythm + melodic layers) |
| creative-engines/apps/monk-composer/.../gceEvaluator.ts | Modified (rhythm/melodic validation) |
| creative-engines/apps/monk-composer/.../types.ts | Modified (new warnings) |
| tests/monk-barry/rhythm-tests.ts | Created |
| tests/monk-barry/melodic-tests.ts | Created |
| engines/monk-barry-engine/tests/generateRhythmStudies.ts | Created |
