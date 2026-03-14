# Voicing Optimization Implementation

## Overview

The Voicing Optimization Engine and Revision Loop Enhancement refine harmonic spacing, guide-tone placement, register logic, and automatic correction of weak outputs for Monk and Barry Harris engines.

## Pipeline Order

```
form → motif → harmony → phrase architecture → guide-tone motion → texture state
→ rhythm grammar → melodic realization → counterline → instrument idiom
→ voicing engine → voicing optimization → validation → revision loop → export
```

## Voicing Optimization Rules

### Global Rules

- **Guide tones in upper voices**: 3rd and 7th must appear in upper voices when possible
- **Minimize voice-leading distance**: Chord-to-chord voice-leading kept within reasonable bounds
- **Register stability**: Jumps > octave discouraged except at phrase boundaries
- **Stacked seconds**: Avoid unless Monk engine explicitly allows
- **Parallel fifths/octaves**: Avoid unintended chains (Barry engine)

### Rejection Criteria

Voicings are rejected when:

- Guide tones disappear
- Chord density exceeds texture state
- Register instability appears

### Guitar Rules (`guitarVoicingOptimization.ts`)

- Maintain stable fretboard region per phrase
- Prefer shell / dyad / triad voicings
- Avoid piano-style stacked vertical chords (4+ voices in tight register)
- Preserve guide-tone continuity in top voice
- Prevent >5 fret jumps unless at phrase boundary (max 7 at boundary)

### Piano Rules (`pianoVoicingOptimization.ts`)

- Maintain LH/RH register zones (LH ≤ 60, RH ≥ 60)
- LH: shells, guide tones, sparse bass (max 3 voices)
- RH: melody or upper harmony (max 4 voices)
- Avoid both hands stacking dense chords simultaneously
- Enforce smooth voice-leading between chord changes

## Revision Loop Architecture

### Evaluation Checks

- Guide-tone continuity
- Harmonic direction
- Rhythmic diversity
- Texture variation
- Voicing clarity
- Instrument idiom compliance

### Regeneration Triggers

| Trigger | Action |
|--------|--------|
| `guideToneContinuityBroken` | Regenerate melodic layer |
| `textureUniform` | Regenerate melodic + counterline |
| `rhythmGrammarMissing` | Regenerate melodic + counterline |
| `counterlineTooDense` | Regenerate counterline layer |
| `voicingUnstable` | Regenerate voicing layer |
| `instrumentIdiomViolation` | Regenerate voicing layer |

### Behavior

- Max **5 regeneration cycles**
- Select **highest-scoring output**
- Score computed from metadata (phrase architecture, guide tones, voicing, texture, etc.)

## Validation Updates (GCE Evaluator)

New warnings:

- `voicingGuideToneMissing`
- `voicingRegisterJump`
- `voicingTextureConflict`
- `voicingInstrumentViolation`

**Score cap**: 7.5 if voicing optimization fails (`voicingOptimizationValid === false`).

## Before/After Comparisons

### Texture Studies (Before)

- Chord events built from voicing families without guide-tone optimization
- Voice-leading distance not minimized
- Register jumps possible

### Optimized Studies (After)

- Chord events pass through `optimizeVoicings` with guide-tone skeleton
- Guitar: fretboard stability, shell/dyad/triad preference, guide-tone in top voice
- Piano: LH/RH split, density limits, smooth voice-leading
- Revision loop runs up to 5 cycles, selects best output

## Files

| File | Purpose |
|------|---------|
| `creative-engines/engines/shared/voicingOptimization.ts` | Main optimizer |
| `creative-engines/engines/shared/guitarVoicingOptimization.ts` | Guitar rules |
| `creative-engines/engines/shared/pianoVoicingOptimization.ts` | Piano rules |
| `creative-engines/engines/shared/revisionLoopEnhancement.ts` | Revision evaluation |
| `engines/monk-barry-engine/pipeline.ts` | Integration |

## Output Files

- `barry-guitar-optimized.musicxml`
- `barry-piano-optimized.musicxml`
- `monk-guitar-optimized.musicxml`
- `monk-piano-optimized.musicxml`

Generate via: `npx tsx engines/monk-barry-engine/tests/generateOptimizedStudies.ts`
