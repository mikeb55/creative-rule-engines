# Guide-Tone Motion Engine Implementation

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
guide-tone motion engine  ← NEW
  ↓
rhythm grammar engine
  ↓
melodic realization engine
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

## Guide-Tone Skeleton

The guide-tone engine produces a **3rd–7th harmonic skeleton** that drives melodic realization and voicing direction. It replaces chord-sequence thinking with **voice-leading motion thinking**.

### Structure

```typescript
GuideTonePair {
  measure: number;
  beatPosition: number;
  upperVoicePitch: number;
  lowerVoicePitch: number;
  upperRole: 'third' | 'seventh';
  lowerRole: 'third' | 'seventh';
  harmonicTargetIndex: number;
  resolutionTarget?: number;
}

GuideToneSkeleton {
  pairs: GuideTonePair[];
  phraseCadenceTargets: number[];
}
```

### Core Rules

- Prioritize 3rd–7th motion between adjacent chords
- Resolve dominant 7th downward by step
- Major-7: upward or hold common tone
- Minimize interval leaps (> octave discouraged)
- Maintain continuous upper-voice line across phrase

### Reject

- Guide-tone continuity breaks
- Dominant resolution absent (when dominants present)
- Excessive voice-leading leaps (> octave)

---

## Barry Harris Extensions

**Module:** `creative-engines/engines/barry-harris-engine/barryGuideToneRules.ts`

### Behavior

- Emphasize 6th–diminished scale relationships
- Allow chromatic approach to guide tones
- Prioritize tonal gravity toward tonic or dominant
- Enforce resolution patterns for ii–V–I motion

### Motion Patterns

| Progression | Upper voice | Lower voice |
|-------------|-------------|-------------|
| ii–V–I | 3 → 7 → 3 | 7 → 3 → 7 |
| tonic → diminished passing | 3 → ♭3 → 2 | — |
| dominant approach | 7 → 3 resolution | — |

### Octave Placement

Upper voice octave is chosen to minimize leap from previous chord. Lower voice in octave below.

---

## Monk Guide-Tone Behavior

**Module:** `creative-engines/engines/monk-engine/monkGuideToneRules.ts`

### Behavior

- Allow angular leaps between guide tones
- Permit sudden register shifts
- Allow interrupted motion across phrase boundaries
- Maintain harmonic clarity despite rhythmic displacement

### Reject

- Motion becomes purely scalar
- Voice-leading becomes overly smooth

---

## Pipeline Integration

- Guide-tone layer runs **after** phrase architecture, **before** rhythm grammar
- `GuideToneSkeleton` passed to:
  - **Melodic realization** — Barry rules prefer skeleton pitches (70% when available); Monk uses skeleton 40%
  - **Rhythm grammar** — (optional; skeleton informs density)
  - **Instrument idiom** — (future: guide-tone placement in upper voices)

---

## Before/After Musical Comparison

### Before (no guide-tone layer)

- Melody selected from chord tones or guide tones per chord, without voice-leading continuity
- No explicit 3rd–7th skeleton driving the line
- Chord voicings from interval structure only

### After (guide-tone layer)

- **Barry:** Melodic events prefer skeleton upper/lower pitches; ii–V–I voice-leading audible
- **Monk:** Skeleton available for angular placement; register shifts supported
- **Validation:** Guide-tone continuity, dominant resolution, and leap limits enforced

---

## GCE Evaluator Updates

| Warning | Condition | Cap |
|---------|----------|-----|
| guideToneContinuityBroken | Upper voice leap > octave | — |
| dominantResolutionMissing | Dominants present, no tonic | — |
| excessiveVoiceLeadingLeap | Horizontal leap > octave | — |
| guideToneSkeletonValid = false | Any of above | overall ≤ 6.0 |

---

## Generated Outputs

| File | Engine | Instrument |
|------|--------|------------|
| barry-guitar-guidetone.musicxml | Barry | Guitar |
| barry-piano-guidetone.musicxml | Barry | Piano |
| monk-guitar-guidetone.musicxml | Monk | Guitar |
| monk-piano-guidetone.musicxml | Monk | Piano |

---

## Files Created/Modified

| File | Action |
|------|--------|
| creative-engines/engines/shared/guideToneMotion.ts | Created |
| creative-engines/engines/barry-harris-engine/barryGuideToneRules.ts | Created |
| creative-engines/engines/monk-engine/monkGuideToneRules.ts | Created |
| creative-engines/engines/shared/melodicRealization.ts | Modified (guideToneSkeleton option) |
| creative-engines/engines/barry-harris-engine/barryMelodicRules.ts | Modified (use skeleton) |
| creative-engines/engines/monk-engine/monkMelodicRules.ts | Modified (use skeleton) |
| engines/monk-barry-engine/pipeline.ts | Modified (guide-tone layer) |
| creative-engines/apps/monk-composer/.../gceEvaluator.ts | Modified (guide-tone warnings) |
| creative-engines/apps/monk-composer/.../types.ts | Modified (new warnings) |
| tests/monk-barry/guidetone-tests.ts | Created |
| engines/monk-barry-engine/tests/generateGuideToneStudies.ts | Created |
