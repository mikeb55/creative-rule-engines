# Quartet Role Engine Implementation

## Overview

The String Quartet Role + Texture Engine maps existing musical layers (melody, counterline, harmony) into quartet roles and texture states for the Monk and Barry Harris system. It is a controlled translator, not full quartet orchestration.

## Pipeline Position

```
form → motif → harmony → phrase architecture → guide-tone motion → texture state
→ quartet role engine → rhythm grammar → melodic realization → counterline
→ idiom translation → voicing → export → validation
```

## Role Definitions

| Role | Description |
|------|-------------|
| `melody` | Primary melodic line |
| `counterline` | Independent response line |
| `inner_motion` | Moving inner voice |
| `harmonic_support` | Chord tones, sustained support |
| `bass` | Root/bass movement |
| `rest` | Silence |
| `pedal` | Sustained tone |
| `punctuation` | Accent, cadential emphasis |

## Texture Mapping

| Texture State | Quartet Realization |
|---------------|---------------------|
| MELODY_ONLY | One active voice; others rest or sustain lightly |
| MELODY_HARMONY | Melody + bass (cello) + harmonic support (viola) |
| MELODY_COUNTERLINE | Melody + counterline + bass |
| HARMONY_ONLY | Chorale / sustained support / bass movement |
| SPARSE | Duo writing or isolated punctuation |
| SILENCE | True silence or single held residue |

## Lead Rotation Rules

- Rotate melodic prominence every 2–4 bars when musically appropriate
- Prioritize Violin 1, Violin 2, Viola, and occasionally Cello as leaders
- Avoid constant first-violin dominance
- Retain phrase coherence when rotation occurs
- Rotation triggered at phrase boundaries or cadence points

## Anchor Voice Principle

- At any phrase segment, one instrument functions as anchor voice
- Anchor may rotate
- Anchor determines phrase identity
- Non-anchor voices support, answer, or contrast
- Anchor changes at phrase boundaries or structural transitions

## Barry vs Monk Quartet Differences

### Barry Harris

- Smoother role continuity
- Inner moving lines preferred
- Cello bass / guide-tone grounding
- Gradual density shifts
- Counterline support through Violin 2 / Viola

### Monk

- Punctuated entries
- Abrupt texture contrasts
- Sparse role use
- Repeated-note interruptions
- Viola / Cello as dark interruption voices

## Validation Rules

| Warning | Condition |
|---------|-----------|
| quartetLeadStatic | Violin 1 carries melody for entire phrase |
| violaUnderused | Viola has no events in 8+ bar study |
| celloOnlyBass | Cello has 6+ events, all bass role |
| quartetTextureFlat | Same texture density every bar |
| quartetBlockWriting | All four parts play continuously |

**Score cap:** 7.0 if quartet role logic fails.

## Files

| File | Purpose |
|------|---------|
| `quartetRoleEngine.ts` | Main role allocation |
| `quartetTextureRules.ts` | Texture → quartet mapping |
| `quartetAnchorVoice.ts` | Anchor voice assignment |
| `quartetLeadRotation.ts` | Lead rotation plan |
| `quartetPhraseBoundaryRules.ts` | Phrase boundary detection |
| `quartetEventMapper.ts` | Pipeline events → quartet parts |
| `quartetMusicXMLExporter.ts` | MusicXML export |
| `quartetValidation.ts` | GCE validation |
| `monkQuartetRules.ts` | Monk-specific behavior |
| `barryQuartetRules.ts` | Barry-specific behavior |

## Output Files

- `barry-string-quartet-study.musicxml`
- `monk-string-quartet-study.musicxml`

Generate via: `npx tsx engines/monk-barry-engine/tests/generateQuartetStudies.ts`
