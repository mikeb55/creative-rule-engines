# Andrew Hill Engine V2.4 — Identity Stress Test Spec

## Purpose

Evaluate Hill identity stability under expanded variation. The stress test determines whether the Hill grammar remains recognizably Hill-like when pushed across a wider parameter space.

**Focus:** Phrase grammar stress testing only. No MusicXML, runtime work, or orchestration layers.

---

## Test Set

Generate **12 phrase studies** spanning:

- All five interval cells (A–E)
- All four harmonic fields (A–D)
- Five phrase structure types
- Four rhythmic layer combinations
- Phrase lengths 8–12 bars

---

## Allowed Variation Parameters

### Interval Cells (A–E)

| Cell | Interval content | Example |
|------|------------------|---------|
| A | minor 2 → major 3 | C Db E |
| B | minor 3 → tritone | C Eb A |
| C | perfect 4 → minor 2 | C F Gb |
| D | major 2 → tritone | C D Ab |
| E | minor 3 → major 2 | C Eb F |

### Harmonic Fields (A–D)

| Field | Pitches | Behavior |
|-------|---------|----------|
| A | C Eb F# G | dark cluster, unstable center |
| B | D F G Bb | modal ambiguity |
| C | E G Bb C# | high tension, cluster pivot |
| D | F Ab B C | chromatic cluster, dark register |

### Phrase Structures

- **3+5** — 3-bar group + 5-bar group
- **5+4** — 5-bar group + 4-bar group
- **4+4+3** — 4 + 4 + 3 bars
- **7+5** — 7-bar group + 5-bar group
- **3+3+2** — 3 + 3 + 2 bars

### Rhythmic Layers

- **base pulse** — on-beat anchor
- **delayed entry** — motif begins one eighth-note after expected attack
- **pulse displacement** — motif repeats one beat later than original position
- **phrase stretch** — last motif fragment extends beyond phrase boundary

---

## Phrase Lengths

8–12 bars per phrase.

---

## Global Hill Constraints

All 12 phrases must satisfy:

1. **No tonal cadence** — Avoid ii–V–I, dominant-tonic resolution.
2. **Interval cell traceable** — Pitches must derive from the assigned cell.
3. **Ensemble equality** — Melody, counterline, cluster_color distributed; no passive accompaniment.
4. **Harmonic fields ambiguous** — Fields used as regions, not progressions.
5. **At least one rhythmic convergence point** — Multiple layers align within 4–8 bars.
6. **Avoid generic avant-jazz drift** — Structured ambiguity, not random freedom.

---

## Output Requirements

Each phrase must include:

- **melody_fragment**
- **counterline**
- **cluster_color**

**Minimum:** 10 events per phrase.

---

## Event Schema

Each event must include:

| Field | Description |
|-------|-------------|
| event_id | Unique identifier |
| bar | Bar number |
| pitches | Pitch set (e.g. [C3, Eb3, A3]) |
| role | melody_fragment, counterline, cluster_color |
| beat_position | Position within bar |
| duration | In beats |
| register_band | low, middle, high |
| source_interval_cell | Cell A–E |
| source_harmonic_field | Field A–D |
| phrase_group | e.g. 3+5 |
| rhythmic_layer | base_pulse, delayed_entry, pulse_displacement, phrase_stretch |
