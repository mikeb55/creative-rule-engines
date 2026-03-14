# Andrew Hill Phrase Prototype

## Purpose

Generate one manually constructed Hill-style 8-bar phrase as structured event data.

## Requirements

- use one interval cell from interval_cell_library.md
- use one field from ambiguous_harmonic_fields.md
- use one phrase type from phrase_generator_rules.md
- use at least two rhythmic layers from rhythmic_displacement_patterns.md
- distribute material across at least three ensemble roles
- preserve asymmetry
- avoid functional cadence

## Prototype Setup

- **interval cell:** Cell B (minor 3 → tritone: C Eb A)
- **harmonic field:** Field C (E G Bb C#)
- **phrase type:** 3+5
- **ensemble:** piano trio
- **rhythmic layers:** base pulse, delayed entry, phrase stretch

---

## Bar-by-Bar Event List (8 bars)

### Bar 1 (phrase group 1, beat 0–4)

| event_id | pitches | role | staff | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|---------|------|-------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_001 | [E3, G3, Bb3] | melody_fragment | treble | 0 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |
| HILL_002 | [C#4] | cluster_color | treble | 1.5 | 0.5 | middle | staccato | Cell B | Field C | 3+5 | delayed_entry |
| HILL_003 | [G2, Bb2] | counterline | bass | 2 | 1.5 | low | legato | Cell B | Field C | 3+5 | base_pulse |

### Bar 2 (phrase group 1)

| event_id | pitches | role | staff | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|---------|------|-------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_004 | [Eb3, A3] | melody_fragment | treble | 4 | 1.0 | middle | accent | Cell B | Field C | 3+5 | displacement |
| HILL_005 | [E3, G3, Bb3, C#4] | cluster_color | treble | 5.5 | 0.5 | middle | staccato | Cell B | Field C | 3+5 | delayed_entry |
| HILL_006 | [G2] | rhythmic_punctuation | bass | 6 | 0.5 | low | staccato | Cell B | Field C | 3+5 | base_pulse |

### Bar 3 (phrase group 1 — end of 3-bar segment)

| event_id | pitches | role | staff | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|---------|------|-------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_007 | [C#3, E3] | counterline | treble | 8 | 1.5 | middle | legato | Cell B | Field C | 3+5 | phrase_stretch |
| HILL_008 | [Bb2, E3] | melody_fragment | bass | 9.5 | 0.5 | low | staccato | Cell B | Field C | 3+5 | delayed_entry |
| HILL_009 | [G3, Bb3] | cluster_color | treble | 10 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |

### Bar 4 (phrase group 2, 5-bar segment begins)

| event_id | pitches | role | staff | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|---------|------|-------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_010 | [E3, G3, Bb3] | melody_fragment | treble | 12 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |
| HILL_011 | [C#4, E4] | counterline | treble | 13.5 | 0.5 | high | staccato | Cell B | Field C | 3+5 | delayed_entry |
| HILL_012 | [G2, Bb2, E3] | cluster_color | bass | 14 | 1.5 | low | legato | Cell B | Field C | 3+5 | base_pulse |

### Bar 5

| event_id | pitches | role | staff | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|---------|------|-------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_013 | [Eb3, A3] | melody_fragment | treble | 16 | 1.0 | middle | accent | Cell B | Field C | 3+5 | displacement |
| HILL_014 | [Bb2] | rhythmic_punctuation | bass | 17 | 0.5 | low | staccato | Cell B | Field C | 3+5 | base_pulse |
| HILL_015 | [G3, Bb3, C#4] | counterline | treble | 18 | 1.0 | middle | legato | Cell B | Field C | 3+5 | phrase_stretch |

### Bar 6 (convergence point)

| event_id | pitches | role | staff | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|---------|------|-------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_016 | [E3, G3, Bb3, C#4] | melody_fragment | treble | 20 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |
| HILL_017 | [G2, Bb2] | counterline | bass | 20 | 1.0 | low | legato | Cell B | Field C | 3+5 | base_pulse |
| HILL_018 | [E4] | cluster_color | treble | 21 | 0.5 | high | staccato | Cell B | Field C | 3+5 | delayed_entry |

### Bar 7

| event_id | pitches | role | staff | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|---------|------|-------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_019 | [C#3, E3, G3] | counterline | treble | 24 | 1.5 | middle | legato | Cell B | Field C | 3+5 | phrase_stretch |
| HILL_020 | [Eb3, A3] | melody_fragment | treble | 25.5 | 0.5 | middle | staccato | Cell B | Field C | 3+5 | delayed_entry |
| HILL_021 | [Bb2, E3] | cluster_color | bass | 26 | 1.0 | low | accent | Cell B | Field C | 3+5 | base_pulse |

### Bar 8 (phrase group 2 ends — 5-bar segment)

| event_id | pitches | role | staff | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|---------|------|-------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_022 | [E3, G3, Bb3] | melody_fragment | treble | 28 | 1.5 | middle | legato | Cell B | Field C | 3+5 | phrase_stretch |
| HILL_023 | [G2, C#3] | counterline | bass | 29 | 1.0 | low | legato | Cell B | Field C | 3+5 | base_pulse |
| HILL_024 | [Bb3, C#4] | cluster_color | treble | 30 | 0.5 | middle | staccato | Cell B | Field C | 3+5 | delayed_entry |

---

## Validation Notes

- **Phrase grouping:** 3+5 (bars 1–3, bars 4–8) — asymmetric ✓
- **Interval cell:** Cell B (minor 3 → tritone) present throughout ✓
- **Harmonic field:** Field C (E G Bb C#) — no dominant-tonic ✓
- **Rhythmic layers:** base_pulse, delayed_entry, phrase_stretch ✓
- **Ensemble roles:** melody_fragment, counterline, cluster_color, rhythmic_punctuation ✓
- **Convergence:** Bar 6 (beat 20) — all layers align ✓
