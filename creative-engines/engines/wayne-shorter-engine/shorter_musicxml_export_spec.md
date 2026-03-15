# Wayne Shorter MusicXML Export Specification

**Purpose:** Define how the engine exports to MusicXML.

---

## EXPORT MODES

### 1. Melody-Only Output

**Content:** Single staff with melody line.

**Mapping:**

- Events with role = melody → treble staff
- pitch → note
- beat_position, duration → position and duration
- articulation → MusicXML articulation elements

**Staff:** One treble staff.

---

### 2. Lead Sheet

**Content:** Melody + chord symbols.

**Mapping:**

- Events with role = melody → treble staff
- harmonic_field or chord root → chord symbol above staff
- Chord symbols placed at beat_position of harmonic change

**Staff:** One treble staff with chord symbols.

---

### 3. Piano Reduction

**Content:** Piano grand staff.

**Mapping:**

- role = melody, counterline → right hand (treble)
- role = harmonic_color, bass → left hand (bass) or right hand (upper)
- pitch_set → chord voicing
- register_band: high/middle → treble; low → bass

**Staves:** Piano (treble + bass).

---

### 4. Ensemble Sketch

**Content:** Multiple staves (e.g., quartet: soprano, alto, tenor, bass; or piano trio).

**Mapping:**

- staff_or_voice → staff assignment
- role → part function
- pitch / pitch_set → notes
- Simultaneous events → same beat_position; vertical alignment

**Staves:** As per ensemble configuration (e.g., 4 for quartet, 2 for piano trio).

---

## SIMULTANEITY

Events with same bar and beat_position must align vertically in MusicXML.

Use `<chord>` for simultaneous notes on same staff.

Use multiple `<note>` elements with same `<chord>` for chord tones.

---

## STAFF RANGES

- **Treble:** G3–G6 (readable)
- **Bass:** E2–E4 (readable)
- **Middle register:** Split between staves for piano; assign by register_band

Avoid notes outside readable range; transpose if needed.

---

## DURATION MAPPING

| Duration (beats) | MusicXML type |
|------------------|---------------|
| 0.25 | 16th |
| 0.5 | 8th |
| 1.0 | quarter |
| 2.0 | half |
| 4.0 | whole |

Use dots for 1.5, 3.0, etc.

---

## ARTICULATION MAPPING

| articulation | MusicXML |
|--------------|----------|
| accent | `<accent>` |
| staccato | `<staccato>` |
| legato | `<slur>` (connect notes) |
| tenuto | `<tenuto>` |

---

## FILE STRUCTURE

- Part list with instrument names
- Measures with correct time signature (4/4 default; 6/4 for Footprints-style)
- Divisions per quarter (e.g., 4 for 16th-note resolution)
- Key signature (from harmonic field)
- Tempo (optional; default 120 BPM)

---

## OUTPUT LOCATION

```
creative-engines/engines/wayne-shorter-engine/outputs/
```

---

## FILE NAMING

```
shorter_phrase_YYYY_MM_DD_HHMM.musicxml
```

Example: `shorter_phrase_2026_03_15_1200.musicxml`
