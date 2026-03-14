# Andrew Hill Engine V2.2 — Phrase Output

## Fixed Seed

- **interval cell:** Cell B (minor 3 → tritone: C Eb A)
- **harmonic field:** Field C (E G Bb C#)
- **phrase type:** 3+5
- **ensemble:** piano trio (piano, bass, drums implied)
- **rhythmic layers:** base pulse, delayed entry

## 8-Bar Phrase — Structured Events

Pitches in scientific notation (e.g. E4 = E above middle C).

---

### Bar 1 (phrase group 1, 3-bar segment begins)

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_001 | 1 | [E3, G3, Bb3] | melody_fragment | 0 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |
| HILL_002 | 1 | [C#4] | cluster_color | 1.5 | 0.5 | middle | staccato | Cell B | Field C | 3+5 | delayed_entry |
| HILL_003 | 1 | [G2, Bb2] | counterline | 2 | 1.5 | low | legato | Cell B | Field C | 3+5 | base_pulse |

---

### Bar 2

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_004 | 2 | [Eb3, A3] | melody_fragment | 0.5 | 1.0 | middle | accent | Cell B | Field C | 3+5 | delayed_entry |
| HILL_005 | 2 | [E3, G3, Bb3, C#4] | cluster_color | 2 | 0.5 | middle | staccato | Cell B | Field C | 3+5 | base_pulse |
| HILL_006 | 2 | [G2] | counterline | 2.5 | 0.5 | low | staccato | Cell B | Field C | 3+5 | delayed_entry |

---

### Bar 3 (phrase group 1 ends — 3-bar segment)

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_007 | 3 | [C#3, E3] | counterline | 0 | 1.5 | middle | legato | Cell B | Field C | 3+5 | base_pulse |
| HILL_008 | 3 | [Bb2, E3] | melody_fragment | 1.5 | 0.5 | low | staccato | Cell B | Field C | 3+5 | delayed_entry |
| HILL_009 | 3 | [G3, Bb3] | cluster_color | 2 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |

---

### Bar 4 (phrase group 2, 5-bar segment begins)

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_010 | 4 | [E3, G3, Bb3] | melody_fragment | 0 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |
| HILL_011 | 4 | [C#4, E4] | counterline | 1.5 | 0.5 | high | staccato | Cell B | Field C | 3+5 | delayed_entry |
| HILL_012 | 4 | [G2, Bb2, E3] | cluster_color | 2 | 1.5 | low | legato | Cell B | Field C | 3+5 | base_pulse |

---

### Bar 5

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_013 | 5 | [Eb3, A3] | melody_fragment | 0 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |
| HILL_014 | 5 | [Bb2] | counterline | 1 | 0.5 | low | staccato | Cell B | Field C | 3+5 | delayed_entry |
| HILL_015 | 5 | [G3, Bb3, C#4] | cluster_color | 2 | 1.0 | middle | legato | Cell B | Field C | 3+5 | base_pulse |

---

### Bar 6 (rhythmic convergence point)

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_016 | 6 | [E3, G3, Bb3, C#4] | melody_fragment | 0 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |
| HILL_017 | 6 | [G2, Bb2] | counterline | 0 | 1.0 | low | legato | Cell B | Field C | 3+5 | base_pulse |
| HILL_018 | 6 | [E4] | cluster_color | 1 | 0.5 | high | staccato | Cell B | Field C | 3+5 | delayed_entry |

---

### Bar 7

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_019 | 7 | [C#3, E3, G3] | counterline | 0 | 1.5 | middle | legato | Cell B | Field C | 3+5 | base_pulse |
| HILL_020 | 7 | [Eb3, A3] | melody_fragment | 1.5 | 0.5 | middle | staccato | Cell B | Field C | 3+5 | delayed_entry |
| HILL_021 | 7 | [Bb2, E3] | cluster_color | 2 | 1.0 | low | accent | Cell B | Field C | 3+5 | base_pulse |

---

### Bar 8 (phrase group 2 ends — 5-bar segment)

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| HILL_022 | 8 | [E3, G3, Bb3] | melody_fragment | 0 | 1.5 | middle | legato | Cell B | Field C | 3+5 | base_pulse |
| HILL_023 | 8 | [G2, C#3] | counterline | 1 | 1.0 | low | legato | Cell B | Field C | 3+5 | base_pulse |
| HILL_024 | 8 | [Bb3, C#4] | cluster_color | 2.5 | 0.5 | middle | staccato | Cell B | Field C | 3+5 | delayed_entry |

---

## Summary

- **Total events:** 24
- **Phrase structure:** 3+5 (bars 1–3, bars 4–8)
- **Roles used:** melody_fragment, counterline, cluster_color
- **Rhythmic layers:** base_pulse, delayed_entry
- **Convergence point:** Bar 6, beat 0 (HILL_016, HILL_017 align)
- **No dominant-tonic cadence:** Field C (E G Bb C#) sustains; phrase ends on cluster, not resolution
