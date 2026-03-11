# Engine Architecture

A practical guide to the Big Ten composition system and its interaction with the Wyble Etude Engine.

---

## 1. System Overview

The composition system is built around the **Big Ten Engines** and uses a three-layer model:

| Layer | Role |
|-------|------|
| **Structure Engine** | Defines form, sectional logic, and harmonic architecture. Drives how the piece is organised. |
| **Behaviour Engine** | Defines rhythmic feel, texture, and surface character. Drives how the piece moves and sounds. |
| **Optional Modifier** | Alters selected sections. Never generates a full piece on its own. |

**Workflow:** Choose a Structure Engine + Behaviour Engine. Optionally apply a Modifier to specific sections. The combination produces a composition with clear identity and coherence.

---

## 2. Big Ten Engines

### Structure Engines

These engines define the architectural backbone of a piece.

| Engine | Focus |
|--------|-------|
| **Shorter Narrative** | Motivic storytelling, sectional logic, narrative pacing |
| **Counterpoint / Tonality Hybrid** | Chamber voicings, two-line logic, lyric gravity |
| **Polyphonic Labyrinth** | Dense polyphony, inner motion, labyrinthine form |
| **Frisell Atmosphere** | Space, colour, restraint, suspended harmony |
| **Tonality Vault** | Melodic triads, quadratonics, tension layers |
| **Metheny–Bacharach Lyric Architecture** | Lyrical form, singable arcs, harmonic warmth |
| **Andrew Hill Harmonic** | Chromatic harmony, structural tension, harmonic density |

### Behaviour Engines

These engines define how the piece moves and feels.

| Engine | Focus |
|--------|-------|
| **Scofield–Holland Groove** | Groove, dyadic guitar, bass movement |
| **Coleman Rhythmic Architecture** | Axis drift, rhythmic freedom, harmonic ambiguity |
| **Wyble Linear Counterpoint** | Two-line guitar, contrary motion, dyadic voice-leading |

### Modifier Engines

Modifiers alter sections but never generate a full piece. Apply them to specific passages for contrast or emphasis.

| Engine | Effect |
|--------|--------|
| **Zappa Disruption** | Abrupt contrast, controlled chaos, edge |
| **Slonimsky Interval Injection** | Interval cycles, systematic colour injection |
| **Hill Harmonic Distortion** | Chromatic distortion, tension spikes |
| **Stravinsky Pulse Shift** | Metric irregularity, ostinato, pulse disruption |

---

## 3. Wyble Etude Engine

### Purpose

The Wyble Etude Engine extracts two-voice guitar studies from existing compositions.

**Functions:**

- Reduce compositions to melody + bass guide line
- Generate short 8–16 bar studies
- Reinforce voice-leading and harmonic motion
- Internalise composition engines through guitar practice

### Modes

| Mode | Use |
|------|-----|
| **Etude Mode** | Standard two-voice studies derived from a section. Default. |
| **Two-String Study Mode** | Reductions on two separated strings (e.g. 1+4, 2+5, 1+5) for clarity of voice separation. |
| **Modular Arrangement Mode** | Intro / Solo Area / Outro modules. Each module usable independently. |

### Source Material

Etudes are derived from:

- Main melody
- Violin I line
- Cello harmonic motion
- Guitar harmonic skeleton
- Motivic fragments
- Cadence zones
- Bridge or transition material

---

## 4. How Wyble Etudes Relate to the Big Ten

### Pipeline

```
Big Ten Engine → composition
composition → section selection
section → Wyble reduction
reduction → guitar etude
```

### Example

**Structure Engine:** Shorter Narrative  
**Behaviour Engine:** Coleman Rhythm  

**Wyble Etude focuses on:** melody fragment + harmonic guide line. The study reinforces the motivic logic and rhythmic feel of the source section while making it playable on solo guitar.

### Another Example

**Structure Engine:** Counterpoint Hybrid  
**Behaviour Engine:** Wyble Linear Counterpoint  

**Wyble Etude focuses on:** two-line reduction of the chamber material. The etude distils the contrapuntal logic into a guitar-specific format.

---

## 5. Repository Structure

```
creative-rule-engines/
├── engines/           # Definitions of each engine
├── prompts/           # Automation prompts
├── docs/              # Architecture documentation
│   └── engine_architecture.md
├── creative-engines/   # Mighty Ten framework
│   ├── engines/
│   ├── rules/
│   ├── palettes/
│   ├── templates/
│   └── supporting-engines/
│       ├── modulation-menu-engine/
│       └── wyble-etude-engine/
├── music/             # Music composition engines and palettes
└── README.md
```

---

## 6. Workflow

1. **Generate composition** using Big Ten Engines (Structure + Behaviour, optional Modifier).
2. **Export MusicXML** from the composition.
3. **Select useful section** (intro, main motion, bridge, cadence).
4. **Run Wyble Etude Engine** on the selected section.
5. **Generate guitar studies** (Etude, Two-String, or Modular mode).
6. **Use studies** for practice and internalisation of the composition’s harmonic and motivic logic.

---

## Reference

- Wyble Etude Engine: `creative-engines/supporting-engines/wyble-etude-engine/wyble_etude_generation_engine.md`
- Modulation Menu Engine: `creative-engines/supporting-engines/modulation-menu-engine/`
- Engine Master Palette: `creative-engines/docs/engine_master_palette.md`
