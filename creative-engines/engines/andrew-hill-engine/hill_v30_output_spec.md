# Andrew Hill Engine V3.0 — Output Format Spec

Export formats for notation-ready output. Sibelius and other notation tools can open these.

---

## MusicXML

### Supported Features

- **Piano trio instrumentation:** Piano (grand staff), Bass, Drums
- **Simultaneous pitches:** Cluster events as chord elements
- **Independent voices:** Multiple voices per staff
- **Bar structure:** 4/4 measure divisions
- **Phrase groups:** Direction elements for phrase boundaries
- **Articulations:** accent, staccato, legato

### Event Field → MusicXML Mapping

| Engine Field | MusicXML Element | Notes |
|--------------|------------------|-------|
| event_id | `<note id="...">` or `<chord>` id | Unique identifier |
| bar | `<measure number="...">` | 1-based measure index |
| pitches | `<pitch><step><octave><alter>` | One note per pitch; chord = simultaneous |
| role | Part assignment | melody_fragment→Piano RH; counterline→Bass; cluster_color→Piano LH |
| beat_position | `<divisions>` + `<duration>` | Position within measure (beats × divisions) |
| duration | `<duration>` | In divisions (4 = quarter) |
| register_band | Octave adjustment | low/middle/high → octave range |
| articulation | `<articulations><accent>`, `<staccato>` | accent, staccato, legato |
| phrase_group | `<direction><words>` | Optional phrase label |
| rhythmic_layer | `<direction><words>` | Optional layer label |

### Role → Part Mapping

| Role | Part | Staff |
|------|------|-------|
| melody_fragment | Piano | Treble (right hand) |
| counterline | Bass | Bass staff |
| cluster_color | Piano | Bass (left hand) |

### Divisions

Use `divisions="4"` (quarter = 4). Beat position 1.5 → offset 6 divisions.

---

## MIDI

See hill_midi_export_spec.md for channel, tempo, velocity, and register mapping.
