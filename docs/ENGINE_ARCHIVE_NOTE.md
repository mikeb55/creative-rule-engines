# Engine Archive Note

## Archived: Monk / Barry Harris Legacy Engine

**Date:** 2026-03-14

**Source:** `creative-engines/apps/monk-composer`

**Archive location:** `archive/monk-barry-engine-legacy/`

## Contents

The entire monk-composer application was copied (not moved) to preserve the legacy implementation. This includes:

- `src/` — Main process, renderer, React UI, and all logic modules
- `scripts/` — Generation and test scripts
- `presets/` — default_barry.json, default_monk.json, default_barry_monk.json
- `outputs/` — Sample MusicXML exports
- `package.json`, `vite.config.ts`, `electron-builder.json`, etc.

## Key Logic Modules (Archived)

- `barryRules.ts` — Barry Harris harmonic and melodic rules
- `monkRules.ts` — Monk harmonic and melodic rules
- `generator.ts` — Main composition generator
- `guitarVoicingEngine.ts`, `pianoVoicingEngine.ts` — Voicing logic
- `guitarIdiomRules.ts`, `pianoIdiomRules.ts`, `bigBandIdiomRules.ts` — Instrument idiom
- `gceEvaluator.ts`, `revisionLoop.ts` — Evaluation and revision
- `musicxml.ts` — MusicXML export
- `targetTranslator.ts` — Target-specific translation

## Status

- **Original files:** Unchanged. Do NOT delete until new engine passes structural verification.
- **Purpose:** Reference for migration; new engine built from clean architecture.
