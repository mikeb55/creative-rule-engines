# Wayne Shorter Event Schema

**Purpose:** Define the core musical event model used by the engine.

The engine uses structured events rather than raw note streams.

---

## EVENT FIELDS

Each event contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| event_id | string | Unique identifier (e.g., SHORTER_001) |
| section_id | string | Form section (e.g., A, B, intro) |
| phrase_group | string | Phrase group within section (e.g., 3+5, phrase 1) |
| bar | integer | Bar number (1-based) |
| beat_position | float | Position within bar (0 = downbeat) |
| duration | float | Duration in beats |
| pitch | integer or list | MIDI pitch or pitch set (for chords) |
| pitch_set | list | Alternative: list of MIDI pitches for chord/cluster |
| register_band | string | low, middle, high |
| role | string | melody, counterline, harmonic_color, rhythmic_punctuation, bass |
| motivic_source | string | Interval cell (e.g., Cell A, Cell B) |
| harmonic_field | string | Field (e.g., Field A, Field D) |
| staff_or_voice | string | Staff or voice assignment (e.g., treble, bass, piano_RH) |
| rhythmic_layer | string | base_pulse, delayed_entry, pulse_displacement, phrase_stretch |
| articulation | string | accent, staccato, legato, tenuto |
| transformation | string | repeat, invert, transpose, fragment, extend, interrupt |

---

## FIELD DETAILS

### event_id

Format: `SHORTER_NNN` where NNN is zero-padded (001, 002, ...).

### section_id

Identifies form section: `intro`, `A`, `B`, `bridge`, `outro`, etc.

### phrase_group

Identifies phrase structure: `3+5`, `5+4`, `4+4+3`, etc., and phrase index if needed.

### bar

1-based bar number within the composition.

### beat_position

Position within bar. In 4/4: 0 = beat 1, 1 = beat 2, 2 = beat 3, 3 = beat 4. Fractional values for subdivisions (e.g., 1.5 = & of 2).

### duration

Duration in beats. 1.0 = quarter note in 4/4.

### pitch / pitch_set

- **pitch:** Single MIDI note (e.g., 60 = C4) for melody.
- **pitch_set:** List of MIDI pitches for chord, cluster, or counterline.

### register_band

- **low:** Below C3 (MIDI 48)
- **middle:** C3–C5 (48–72)
- **high:** Above C5 (72)

### role

- **melody:** Lead melodic material
- **counterline:** Secondary melodic line (derived from motif)
- **harmonic_color:** Voicings, clusters
- **rhythmic_punctuation:** Accents, hits
- **bass:** Bass line (pedal, motivic, or walking)

### motivic_source

Interval cell identifier: `Cell A`, `Cell B`, `Cell C`, etc.

### harmonic_field

Harmonic field identifier: `Field A`, `Field B`, `Field D`, etc.

### staff_or_voice

- **treble:** Treble staff
- **bass:** Bass staff
- **piano_RH:** Piano right hand
- **piano_LH:** Piano left hand
- **voice_1, voice_2:** For multi-voice staves

### rhythmic_layer

- **base_pulse:** On strong beats
- **delayed_entry:** Delayed attack
- **pulse_displacement:** Displaced repeat
- **phrase_stretch:** Extends past phrase boundary

### articulation

- **accent:** Emphasized
- **staccato:** Short, detached
- **legato:** Smooth, connected
- **tenuto:** Sustained

### transformation

Motif transformation applied: `repeat`, `invert`, `transpose`, `fragment`, `extend`, `interrupt`.

---

## EXAMPLE EVENT

```json
{
  "event_id": "SHORTER_001",
  "section_id": "A",
  "phrase_group": "3+5",
  "bar": 1,
  "beat_position": 0,
  "duration": 1.0,
  "pitch": 64,
  "register_band": "middle",
  "role": "melody",
  "motivic_source": "Cell A",
  "harmonic_field": "Field A",
  "staff_or_voice": "treble",
  "rhythmic_layer": "base_pulse",
  "articulation": "accent",
  "transformation": "repeat"
}
```

---

## EVENT SEQUENCE RULES

1. Events are ordered by (bar, beat_position).
2. Simultaneous events share same bar and beat_position.
3. All events must have motivic_source and harmonic_field.
4. All events must have role and staff_or_voice for ensemble output.

---

## MINIMUM REQUIRED FIELDS

For every event:

- event_id
- section_id
- phrase_group
- bar
- beat_position
- duration
- pitch or pitch_set
- register_band
- role
- motivic_source
- harmonic_field
- staff_or_voice

Optional but recommended: rhythmic_layer, articulation, transformation.
