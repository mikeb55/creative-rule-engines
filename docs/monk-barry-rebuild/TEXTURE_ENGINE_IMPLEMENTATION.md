# Texture Engine Implementation

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
texture state engine  ← NEW
  ↓
rhythm grammar engine
  ↓
melodic realization engine
  ↓
counterline engine
  ↓
instrument idiom engine
  ↓
voicing engine
  ↓
export
  ↓
validation
```

---

## Texture State Definitions

**Module:** `creative-engines/engines/shared/textureStateEngine.ts`

### Possible States

| State | Melody | Harmony | Counterline |
|-------|--------|---------|-------------|
| MELODY_ONLY | ✓ | — | — |
| MELODY_HARMONY | ✓ | ✓ | — |
| MELODY_COUNTERLINE | ✓ | — | ✓ |
| HARMONY_ONLY | — | ✓ | — |
| SPARSE | ✓ | — | — |
| SILENCE | — | — | — |

### Structure

```typescript
TextureState {
  bar: number;
  beat: number;
  state: TextureState;
}

TextureStateMap: Map<string, TextureState>
```

### Global Rules

Texture state must:

- change at phrase boundaries
- allow density variation within phrases
- avoid full texture on every bar
- introduce contrast between phrase segments

Reject texture maps where:

- density is constant across phrase
- melody + harmony + counterline occur continuously
- silence never appears

---

## Barry vs Monk Texture Behavior

### Barry Harris

**Module:** `creative-engines/engines/barry-harris-engine/barryTextureRules.ts`

- melody + harmony dominant texture
- occasional melody-only moments
- counterline appears mostly in transitions
- harmony-only moments before cadences
- prefer gradual density shifts

### Monk

**Module:** `creative-engines/engines/monk-engine/monkTextureRules.ts`

- sparse punctuation
- abrupt texture shifts
- silence used structurally
- counterline as interruption
- allow sudden contrast between dense and empty bars

---

## Before/After Study Comparison

### Before (no texture engine)

- Melody, counterline, and harmony generated simultaneously
- Overly dense textures
- Constant density across phrases

### After (with texture engine)

- Texture state controls which layers appear at each bar
- MELODY_ONLY: exposed melody
- MELODY_HARMONY: standard comping texture
- MELODY_COUNTERLINE: two-voice dialogue
- HARMONY_ONLY: chordal moments (e.g. before cadences)
- SPARSE: minimal material
- SILENCE: structural rests

---

## Pipeline Integration

Texture state is built after guide-tone motion. All later layers respect it:

- **Melodic realization:** skips melody when state is HARMONY_ONLY or SILENCE
- **Counterline:** skips when state is not MELODY_COUNTERLINE
- **Chord events:** skips when state is MELODY_ONLY, MELODY_COUNTERLINE, SPARSE, or SILENCE

---

## Validation

**Module:** `creative-engines/apps/monk-composer/.../gceEvaluator.ts`

### Warnings

- `textureUniform` — density constant across phrase
- `textureOvercrowded` — melody+harmony+counterline too often
- `textureMissingContrast` — no silence, no variation

### Cap

Score capped at 6.5 if texture states are not respected.
