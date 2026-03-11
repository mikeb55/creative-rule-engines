# Modulation Menu Engine

A stable minimal modulation engine for The Mighty Ten ecosystem. It parses chord progressions, generates top modulation suggestions, and supports style-aware weighting.

## What It Is

The Modulation Menu Engine is a shared supporting engine that sits alongside The Mighty Ten rather than inside any single engine. It provides a canonical modulation suggestion system that any Mighty Ten engine can call when it needs harmonic transition options.

## Why Alongside The Mighty Ten

Modulation is a cross-genre concern. Jazz, classical, pop, and ECM-style pieces all need modulation logic, but each engine has different priorities. By keeping the modulation engine as a shared supporting engine, we avoid duplicating logic across engines and allow style profiles to tune the same core strategies.

## Installation

```cmd
cd creative-engines/supporting-engines/modulation-menu-engine
pip install -e .
```

## Usage

```cmd
modmenu --prog "Dm9,G13,Cmaj7" --style jazz_rock
```

### Example Calls

**ECM axis** (common-tone, chromatic mediant favoured; strong cadence penalised):

```cmd
modmenu --prog "Em7,A7,Dmaj7" --style ecm_axis
```

**Jazz rock** (dominant injection, chromatic mediant; dramatic shifts):

```cmd
modmenu --prog "Dm9,G13,Cmaj7" --style jazz_rock
```

**Pop colour** (chromatic mediant, emotional lift; simple pivots):

```cmd
modmenu --prog "C,G,Am,F" --style pop_colour
```

**Classical structural** (pivot chord, common-tone, clear cadence):

```cmd
modmenu --prog "C,F,G7,C" --style classical_structural
```

### Mighty Ten Integration

Use `--mighty_engine` to apply engine-specific weighting:

```cmd
modmenu --prog "C,G,Am,F" --style pop_colour --mighty_engine metheny
```

Supported values: `metheny`, `coleman`, `zappa`, `schneider`, `default`.

## Architecture

This is Phase 1/2 architecture: minimal core plus style profiles. The core parses chords, generates strategies (pivot chord, common-tone, chromatic mediant, dominant injection, modal interchange), and scores suggestions. Style profiles adjust weights. Future phases may add geometry and tonal gravity.

## Files

- `core/` — parser, strategies, scorer
- `styles/` — default, ecm_axis, jazz_modern, jazz_rock, pop_colour, classical_structural
- `cli.py` — modmenu entry point
- `tests/test_smoke.py` — smoke test
