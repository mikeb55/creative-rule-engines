# Mighty Ten Engines — Architecture Guide V3

## Purpose

This document describes the **architecture** of the Mighty Ten global composition framework: system design, component relationships, and how engines integrate with the broader creative-rule-engines ecosystem.

---

## System Architecture Overview

```
creative-rule-engines/
├── cursor-system-pack.md          ← Master import (single entry point)
├── creative-engines/              ← Mighty Ten framework
│   ├── engines/                   ← 10 aesthetic engines
│   ├── rules/                     ← GCE, anti-monotony, ensemble, engraving, structure
│   ├── palettes/                  ← tonality_vault, interval_cycles, triad_pairs, polychords
│   ├── templates/                 ← composition_request, revision_loop
│   └── docs/                      ← User guides, architecture
└── music/                         ← Style-specific engines (orchestral, big band, etc.)
```

---

## Component Hierarchy

### Layer 1: Master System
- **cursor-system-pack.md** — Unified system prompt for all Cursor projects
- Imports and coordinates: music, literature, therapy-writing, creative-engines

### Layer 2: Creative Engines (Mighty Ten)
- **engines/** — 10 aesthetic engines (Scofield, Shorter, Frisell, Wheeler, Stravinsky, Zappa, Slonimsky, Bartók, Counterpoint, Polyphonic)
- Each engine defines: core priorities, characteristics, avoid list

### Layer 3: Rules
- **gce_evaluation_framework.md** — 0–10 scoring, 10 dimensions
- **anti_monotony_rules.md** — Motivic variation, harmonic/rhythmic avoidance
- **ensemble_rules.md** — Who has the line, section balance
- **engraving_rules.md** — Sibelius-friendly MusicXML
- **composition_structure_rules.md** — Form, length, motivic development

### Layer 4: Palettes
- **tonality_vault.md** — Melodic triad, quadratonics, tension layers
- **interval_cycles.md** — IC1–IC6, symmetrical structures
- **triad_pairs.md** — Two-triad systems
- **polychords.md** — Upper/lower structure

### Layer 5: Templates
- **composition_request_template.md** — Request structure
- **revision_loop_template.md** — Iteration structure

---

## Engine Design Principles

1. **One primary aesthetic per engine** — Each engine has a clear identity
2. **Composability** — Engines can combine (hybrid) or rotate (album)
3. **GCE gate** — No MusicXML output until GCE ≥ 9
4. **Tonality Vault integration** — All engines use the shared harmonic framework
5. **Canonical home** — This repo is the single source of truth; no local redefinition

---

## Engine Categories (Architectural)

| Category | Engines | Shared Traits |
|----------|---------|---------------|
| **Groove** | Scofield–Holland | Rhythm-section, forward motion |
| **Narrative** | Shorter, Counterpoint | Motivic logic, sectional structure |
| **Atmospheric** | Frisell, Bartók | Space, colour, restraint or darkness |
| **Lyrical** | Wheeler | Melody, warmth, singability |
| **Rhythmic** | Stravinsky, Zappa | Pulse, disruption, metric play |
| **Harmonic** | Slonimsky | Systematic, non-functional |
| **Polyphonic** | Counterpoint, Polyphonic Labyrinth | Multi-voice, independence |

---

## Data Flow

1. **Selection** — User or AI selects engine(s) from palette
2. **Request** — Composition request template filled
3. **Composition** — AI composes using engine + rules + palettes
4. **GCE Check** — Score on 10 dimensions; if < 7 on any axis, revise
5. **Iteration** — Revision loop until GCE ≥ 9
6. **Output** — MusicXML only after gate passed

---

## Integration Points

### With music/
- **excellence-criteria.md** — Shared 0–10 scale
- **engraving-rules-sibelius.md** — Shared engraving rules
- **palettes/tonality-vault/** — Shared harmonic framework

### With cursor-system-pack.md
- Mode selection can include engine name (e.g. "Mode: Scofield–Holland")
- Master file references creative-engines for Mighty Ten projects

---

## Versioning

- **V1** — Basic user guide
- **V2** — Extended guide (matrix, prompts, orchestration)
- **V3** — Architecture guide (this document)

---

*This repository is the canonical source of creative excellence standards.*
