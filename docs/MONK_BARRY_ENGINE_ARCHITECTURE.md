# Monk / Barry Harris Engine — Architecture

## Overview

The Monk/Barry Harris engine is a layered generative system that produces valid musical objects only. Each layer has clear responsibilities; no layer mixes harmonic logic with voicing, idiom, or export.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PIPELINE                                   │
├─────────────────────────────────────────────────────────────────┤
│  form        →  motif      →  harmony   →  voicing  →  idiom     │
│  FormStructure   Motif        HarmonicTarget  families  guitar/   │
│  phrase len     3–7 notes    Barry/Monk      shells    piano     │
│  cadence        intervals    movement         drop-2   translators│
│  density        variation    shell/6-dim      quartal             │
├─────────────────────────────────────────────────────────────────┤
│  orchestration  →  export   →  validation                         │
│  guitar/piano     MusicXML    playability                         │
│  small ensemble   3.0          voice-leading                      │
│                                 chord density                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    MusicEvent objects
```

## Module Responsibilities

| Module | Responsibility | Output |
|--------|----------------|--------|
| **form/formEngine** | Phrase length, sections, cadence points, density curves | FormStructure |
| **motif/motifEngine** | Generate/develop/repeat motifs (3–7 notes, interval variety) | Motif |
| **harmony/barryHarrisEngine** | 6th–diminished, dominant movement, guide tones | HarmonicTarget[] |
| **harmony/monkHarmonyEngine** | Shell harmony, altered dominants, displacement | HarmonicTarget[] |
| **voicing/voicingFamilies** | Shell, triad, drop-2, quartal, guide-tone families | VoicingFamily |
| **idiom/guitarTranslator** | Fret span ≤5, adjacent strings, drop-2 | number[] |
| **idiom/pianoTranslator** | LH shells, RH color, hand independence | PianoHandAssignment |
| **orchestration/orchestrator** | Assemble events for target | OrchestrationResult |
| **export/musicxmlExporter** | MusicXML 3.0, staves, chord simultaneity | string |
| **validation/musicValidator** | Playability, voice-leading, density | ValidationResult |

## Engine Workflow

1. **Form** — Define bars, phrase lengths, cadence points.
2. **Motif** — Generate motif; optionally develop/repeat.
3. **Harmony** — Barry Harris or Monk harmonic grammar → HarmonicTarget[].
4. **Voicing** — Resolve targets to voicing families (no raw pitch stacking).
5. **Idiom** — Map voicings to guitar/piano constraints.
6. **Orchestration** — Assemble MusicEvent[] for target.
7. **Export** — MusicXML 3.0.
8. **Validation** — Verify playability, voice-leading, density.

## Data Models (engines/shared/)

- **MusicEvent** — MELODY | CHORD | BASS | COUNTERLINE | REST
- **HarmonicTarget** — Chord symbol, beat, guide tones, shell flag
- **Motif** — Pitches, durations, intervals
- **FormStructure** — Sections, phrase lengths, density curve

## Layer Separation Rules

- Harmonic logic does NOT output raw pitches.
- Voicing layer resolves HarmonicTarget → pitches via families only.
- Idiom layer runs AFTER voicing; maps to instrument constraints.
- Export layer receives MusicEvent[] only.
