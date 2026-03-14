# Counterline Engine Implementation

## Architecture Diagram

```
form
  ↓
motif
  ↓
harmony engine
  ↓
phrase architecture engine
  ↓
guide-tone motion engine
  ↓
rhythm grammar engine
  ↓
melodic realization engine
  ↓
counterline engine  ← NEW
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

## Global Counterline Rules

**Module:** `creative-engines/engines/shared/counterlineEngine.ts`

### Input

- `PhraseStructure`
- `HarmonicTargets`
- `GuideToneSkeleton`
- `MelodicEvents`

### Output

- `CounterlineEvent[]`

### Structure

```typescript
CounterlineEvent {
  pitch: number;
  duration: number;
  articulation?: string;
  relationshipToMainLine: 'contrary' | 'oblique' | 'echo' | 'answer' | 'innerMotion';
  harmonicRole: 'chordTone' | 'guideTone' | 'passing' | 'enclosure';
  bar: number;
  beatPosition: number;
  harmonicTargetIndex?: number;
}
```

### Global Rules

Counterline must:

- derive from motif or guide-tone material
- avoid duplicating the main line exactly
- support harmonic movement
- leave silence when needed
- be sparser than the main line by default
- enter at structurally meaningful moments

Reject counterlines that:

- shadow the main line continuously
- create constant parallel motion
- ignore harmonic targets
- fill every gap
- become a second unrelated solo

---

## Barry Harris Counterline Behavior

**Module:** `creative-engines/engines/barry-harris-engine/barryCounterlineRules.ts`

### Behavior

- use guide-tone continuation
- use enclosure-derived answering figures
- connect ii–V–I movement with short secondary lines
- favor contrary motion against the main line
- reinforce dominant-to-tonic pull

### Allowed Materials

- 3rd–7th fragments
- bebop enclosure fragments
- short passing diminished motion
- chord-tone answers

### Reject

- counterline weakens tonal gravity
- line becomes rhythmically busier than the melody
- dominant resolution is obscured

---

## Monk Counterline Behavior

**Module:** `creative-engines/engines/monk-engine/monkCounterlineRules.ts`

### Behavior

- short interruptions
- repeated-note answers
- angular dyad-derived fragments
- oblique or punctuated responses
- displaced entries

### Allowed Materials

- shell-adjacent fragments
- repeated notes
- minor-second pressure notes
- abrupt rhythmic restarts

### Reject

- counterline becomes smooth bebop continuity
- line overfills the texture
- interruption logic disappears

---

## Guitar Translation Notes

- allow short answer-line fragments between chord hits
- allow dyad responses
- allow inner-voice motion under held melody
- never turn counterline into impossible simultaneous stacks
- counterline exported as voice 2; melody as voice 1

---

## Piano Translation Notes

- allow RH/LH conversational split
- melody → staff 1 (RH)
- counterline → staff 2 (LH)
- allow LH shell support with RH counter-fragment
- allow RH melody with inner counterline punctuations
- preserve independence without overcrowding

---

## Before/After Comparison

### Before (guide-tone only)

- Single melodic strand plus chord voicings
- No secondary line
- Guitar: melody + chords only
- Piano: melody RH + chord LH

### After (with counterline)

- Main line backbone + secondary intelligent line
- Guitar: melody (voice 1) + answer-lines / dyad responses (voice 2)
- Piano: melody (staff 1) + counterline (staff 2)
- Barry: guide-tone continuation, enclosure answers, contrary motion
- Monk: interruptions, repeated-note answers, displaced entries

---

## Validation

**Module:** `creative-engines/apps/monk-composer/src/renderer/logic/gceEvaluator.ts`

### Warnings

- `counterlineMissing` — required by texture but absent
- `counterlineDuplicatesMainLine` — shadows melody
- `counterlineTooDense` — overfills texture
- `counterlineIgnoresHarmony` — ignores harmonic targets

### Cap

Score capped at 6.0 if counterline is required (guitar/piano for Barry or Monk) but absent or invalid.

---

## Files

| File | Action |
|------|--------|
| creative-engines/engines/shared/counterlineEngine.ts | Created |
| creative-engines/engines/barry-harris-engine/barryCounterlineRules.ts | Created |
| creative-engines/engines/monk-engine/monkCounterlineRules.ts | Created |
| engines/monk-barry-engine/pipeline.ts | Modified (insert counterline after melodic) |
| engines/monk-barry-engine/export/musicxmlExporter.ts | Modified (staff/voice for MELODY, COUNTERLINE) |
| creative-engines/apps/monk-composer/.../gceEvaluator.ts | Modified (counterline warnings, cap) |
| tests/monk-barry/counterline-tests.ts | Created |
