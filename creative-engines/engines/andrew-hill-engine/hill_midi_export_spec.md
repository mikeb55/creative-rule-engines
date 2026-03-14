# Andrew Hill Engine — MIDI Export Specification

**Version:** 3.0  
**Purpose:** Define how validated Hill phrases are converted to MIDI for playback and interchange.

---

## Role → MIDI Channel Mapping

| Engine Role       | MIDI Channel | Program | Notes                          |
|-------------------|--------------|---------|--------------------------------|
| melody_fragment   | 0            | 0 (Piano) | Piano RH; melodic line         |
| cluster_color     | 0            | 0 (Piano) | Piano LH; simultaneous pitches  |
| counterline       | 1            | 33 (Acoustic Bass) | Bass part              |
| rhythmic_layer    | 9            | —       | Drums (channel 10 in 0-based)  |

**Rationale:** Piano uses one channel with two hands distinguished by note-on timing and register. Bass and drums use separate channels for clarity.

---

## Tempo Assumptions

- **Default tempo:** 120 BPM (500000 microseconds per quarter)
- **Time signature:** 4/4
- **Divisions per quarter:** 480 (standard MIDI resolution)
- **No tempo changes** within a single phrase export

---

## Velocity Rules

| Event Type        | Velocity Range | Rationale                          |
|-------------------|----------------|------------------------------------|
| cluster_color     | 72–96 (mf–f)   | Clusters as tension; slightly louder |
| melody_fragment   | 80–100         | Melodic prominence                  |
| counterline       | 70–90          | Equal status; avoid overpowering    |
| rhythmic_layer   | 90–110         | Percussion clarity; accent layer   |

**Cluster vs melodic differentiation:**

- Cluster events: velocity 72–88 (denser, less attack)
- Melodic events: velocity 88–100 (clearer attack, more projection)

---

## Register Mapping

Engine `register_band` maps to MIDI note numbers:

| Register Band | MIDI Note Range | Typical Use                    |
|---------------|-----------------|--------------------------------|
| low           | 36–48 (C2–C3)   | Bass, low cluster              |
| mid_low       | 48–60 (C3–C4)   | Piano LH, bass counterline     |
| mid           | 60–72 (C4–C5)   | Melody, cluster color           |
| mid_high      | 72–84 (C5–C6)   | Melody extension, upper cluster |
| high          | 84–96 (C6–C7)   | Sparse; phrase peaks            |

**Octave offset:** Engine octave numbers (e.g. octave 3) map directly to MIDI: `note_number = 12 * (octave + 1) + step_offset`.

---

## Event-to-MIDI Conversion

For each validated event:

1. **Note On:** channel, pitch (from `pitches`), velocity (from role + articulation), tick (from `bar` × divisions × 4 + `beat_position` × divisions)
2. **Note Off:** same channel/pitch, tick + `duration` × divisions
3. **Chord events:** multiple Note On at same tick; Note Off at same tick + duration

---

## Implementation Notes

- Use standard MIDI file format (Format 1 for multi-track)
- Track 0: Conductor (tempo, time sig)
- Track 1: Piano (melody + cluster)
- Track 2: Bass
- Track 3: Drums

---

## Future Extensions

- Articulation → velocity curves (staccato = shorter, legato = overlap)
- Phrase group markers as MIDI markers or meta events
