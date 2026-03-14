# Andrew Hill Engine V2.2 — Structured Event Generator

## Purpose

Generate one deterministic 8-bar Hill-style phrase from:

- one interval cell
- one ambiguous harmonic field
- one asymmetric phrase structure
- two rhythmic layers
- at least three ensemble roles

## Rules

- no functional cadence
- no pure accompaniment layer
- preserve interval-cell identity
- maintain phrase asymmetry
- include at least one rhythmic convergence point

## Fixed Test Seed

| Parameter | Value |
|-----------|-------|
| interval cell | Cell B |
| harmonic field | Field C |
| phrase type | 3+5 |
| ensemble | piano trio |
| rhythmic layers | base pulse, delayed entry |

## Output

Structured event sequence only. No MusicXML. No orchestration.

## Event Schema

Each event contains:

- event_id
- bar
- pitches
- role
- beat_position
- duration
- register_band
- articulation
- source_interval_cell
- source_harmonic_field
- phrase_group
- rhythmic_layer

## Cell B

**minor 3 → tritone**

Example: C Eb A / D F B

Transposed to Field C (E G Bb C#): E G Bb, Eb G A, etc.

## Field C

**E G Bb C#**

- high tension field
- cluster pivot potential

## Phrase 3+5

- Bars 1–3: first phrase group (3 bars)
- Bars 4–8: second phrase group (5 bars)
- Asymmetric; no 4+4 symmetry
