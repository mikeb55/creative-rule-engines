# Andrew Hill Engine V2.3 — Phrase Variants

Five 8-bar structured event phrases, one per variant seed.

---

## Variant 1 — Cell B, Field C, 3+5, base pulse + delayed entry

**Seed:** Cell B (minor 3 → tritone), Field C (E G Bb C#), phrase 3+5, base pulse + delayed entry

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| V1_001 | 1 | [E3, G3, Bb3] | melody_fragment | 0 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |
| V1_002 | 1 | [C#4] | cluster_color | 1.5 | 0.5 | middle | staccato | Cell B | Field C | 3+5 | delayed_entry |
| V1_003 | 1 | [G2, Bb2] | counterline | 2 | 1.5 | low | legato | Cell B | Field C | 3+5 | base_pulse |
| V1_004 | 2 | [Eb3, A3] | melody_fragment | 0.5 | 1.0 | middle | accent | Cell B | Field C | 3+5 | delayed_entry |
| V1_005 | 2 | [E3, G3, Bb3, C#4] | cluster_color | 2 | 0.5 | middle | staccato | Cell B | Field C | 3+5 | base_pulse |
| V1_006 | 3 | [C#3, E3] | counterline | 0 | 1.5 | middle | legato | Cell B | Field C | 3+5 | base_pulse |
| V1_007 | 3 | [Bb2, E3] | melody_fragment | 1.5 | 0.5 | low | staccato | Cell B | Field C | 3+5 | delayed_entry |
| V1_008 | 4 | [E3, G3, Bb3] | melody_fragment | 0 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |
| V1_009 | 4 | [C#4, E4] | counterline | 1.5 | 0.5 | high | staccato | Cell B | Field C | 3+5 | delayed_entry |
| V1_010 | 5 | [Eb3, A3] | melody_fragment | 0 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |
| V1_011 | 6 | [E3, G3, Bb3, C#4] | melody_fragment | 0 | 1.0 | middle | accent | Cell B | Field C | 3+5 | base_pulse |
| V1_012 | 6 | [G2, Bb2] | counterline | 0 | 1.0 | low | legato | Cell B | Field C | 3+5 | base_pulse |
| V1_013 | 8 | [E3, G3, Bb3] | melody_fragment | 0 | 1.5 | middle | legato | Cell B | Field C | 3+5 | base_pulse |
| V1_014 | 8 | [Bb3, C#4] | cluster_color | 2.5 | 0.5 | middle | staccato | Cell B | Field C | 3+5 | delayed_entry |

**Convergence:** Bar 6, beat 0 (V1_011, V1_012)

---

## Variant 2 — Cell C, Field A, 5+4, base pulse + phrase stretch

**Seed:** Cell C (perfect 4 → minor 2), Field A (C Eb F# G), phrase 5+4 (5+3 in 8 bars), base pulse + phrase stretch

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| V2_001 | 1 | [C3, F3, Gb3] | melody_fragment | 0 | 1.0 | middle | accent | Cell C | Field A | 5+4 | base_pulse |
| V2_002 | 1 | [Eb3, F#3] | counterline | 1.5 | 0.5 | middle | staccato | Cell C | Field A | 5+4 | phrase_stretch |
| V2_003 | 2 | [G3] | cluster_color | 0 | 0.5 | middle | staccato | Cell C | Field A | 5+4 | base_pulse |
| V2_004 | 2 | [C2, F2] | counterline | 1 | 1.5 | low | legato | Cell C | Field A | 5+4 | base_pulse |
| V2_005 | 2 | [Eb3, Gb3] | melody_fragment | 2.5 | 0.5 | middle | staccato | Cell C | Field A | 5+4 | phrase_stretch |
| V2_006 | 3 | [F3, Gb3, C4] | melody_fragment | 0 | 1.5 | middle | legato | Cell C | Field A | 5+4 | base_pulse |
| V2_007 | 3 | [Eb2, F#2] | counterline | 2 | 1.0 | low | legato | Cell C | Field A | 5+4 | base_pulse |
| V2_008 | 4 | [C3, Eb3, F#3] | cluster_color | 0 | 1.0 | middle | accent | Cell C | Field A | 5+4 | base_pulse |
| V2_009 | 4 | [Gb3, C4] | melody_fragment | 1.5 | 0.5 | middle | staccato | Cell C | Field A | 5+4 | phrase_stretch |
| V2_010 | 5 | [F2, Gb2, C3] | counterline | 0 | 1.5 | low | legato | Cell C | Field A | 5+4 | base_pulse |
| V2_011 | 6 | [C3, F3, Gb3] | melody_fragment | 0 | 1.0 | middle | accent | Cell C | Field A | 5+4 | base_pulse |
| V2_012 | 6 | [Eb3, G3] | counterline | 0 | 1.0 | middle | legato | Cell C | Field A | 5+4 | base_pulse |
| V2_013 | 7 | [F#3, G3, C4] | cluster_color | 0.5 | 1.5 | middle | legato | Cell C | Field A | 5+4 | phrase_stretch |
| V2_014 | 8 | [C3, Eb3] | melody_fragment | 0 | 2.0 | middle | legato | Cell C | Field A | 5+4 | phrase_stretch |

**Convergence:** Bar 6, beat 0 (V2_011, V2_012). Phrase stretch: V2_014 extends into bar 8.

---

## Variant 3 — Cell D, Field B, 4+4+3, delayed entry + pulse displacement

**Seed:** Cell D (major 2 → tritone), Field B (D F G Bb), phrase 4+4+3 (3+3+2 in 8 bars), delayed entry + pulse displacement

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| V3_001 | 1 | [D3, F3, Ab3] | melody_fragment | 0.5 | 1.0 | middle | accent | Cell D | Field B | 4+4+3 | delayed_entry |
| V3_002 | 1 | [G2, Bb2] | counterline | 1 | 1.5 | low | legato | Cell D | Field B | 4+4+3 | pulse_displacement |
| V3_003 | 2 | [D3, F3] | cluster_color | 1.5 | 0.5 | middle | staccato | Cell D | Field B | 4+4+3 | delayed_entry |
| V3_004 | 2 | [F2, Ab2] | counterline | 2 | 1.0 | low | legato | Cell D | Field B | 4+4+3 | pulse_displacement |
| V3_005 | 3 | [G3, Bb3, D4] | melody_fragment | 0.5 | 1.0 | middle | accent | Cell D | Field B | 4+4+3 | delayed_entry |
| V3_006 | 3 | [D2, F2] | counterline | 1 | 1.0 | low | staccato | Cell D | Field B | 4+4+3 | pulse_displacement |
| V3_007 | 4 | [F3, G3, Bb3] | melody_fragment | 1 | 1.5 | middle | legato | Cell D | Field B | 4+4+3 | delayed_entry |
| V3_008 | 4 | [G2, Ab2] | cluster_color | 1.5 | 0.5 | low | staccato | Cell D | Field B | 4+4+3 | pulse_displacement |
| V3_009 | 5 | [D3, Ab3] | melody_fragment | 0.5 | 1.0 | middle | accent | Cell D | Field B | 4+4+3 | delayed_entry |
| V3_010 | 5 | [F2, G2, Bb2] | counterline | 2 | 1.0 | low | legato | Cell D | Field B | 4+4+3 | pulse_displacement |
| V3_011 | 6 | [D3, F3, G3] | melody_fragment | 0 | 1.0 | middle | accent | Cell D | Field B | 4+4+3 | pulse_displacement |
| V3_012 | 6 | [G2, Bb2] | counterline | 0 | 1.0 | low | legato | Cell D | Field B | 4+4+3 | pulse_displacement |
| V3_013 | 7 | [F3, Ab3] | cluster_color | 0.5 | 0.5 | middle | staccato | Cell D | Field B | 4+4+3 | delayed_entry |
| V3_014 | 8 | [D3, G3, Bb3] | melody_fragment | 1 | 1.0 | middle | legato | Cell D | Field B | 4+4+3 | delayed_entry |

**Convergence:** Bar 6, beat 0 (V3_011, V3_012). Phrase groups: bars 1-3, 4-5, 6-8 (3+2+3).

---

## Variant 4 — Cell A, Field D, 7+5, base pulse + delayed entry

**Seed:** Cell A (minor 2 → major 3), Field D (F Ab B C), phrase 7+5 (5+3 in 8 bars), base pulse + delayed entry

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| V4_001 | 1 | [F3, Gb3, A3] | melody_fragment | 0 | 1.0 | middle | accent | Cell A | Field D | 7+5 | base_pulse |
| V4_002 | 1 | [C3] | cluster_color | 1.5 | 0.5 | middle | staccato | Cell A | Field D | 7+5 | delayed_entry |
| V4_003 | 1 | [F2, Ab2] | counterline | 2 | 1.5 | low | legato | Cell A | Field D | 7+5 | base_pulse |
| V4_004 | 2 | [Ab3, B3] | melody_fragment | 0.5 | 1.0 | middle | accent | Cell A | Field D | 7+5 | delayed_entry |
| V4_005 | 2 | [F3, Gb3, A3, C4] | cluster_color | 2 | 0.5 | middle | staccato | Cell A | Field D | 7+5 | base_pulse |
| V4_006 | 3 | [Gb2, A2] | counterline | 0 | 1.5 | low | legato | Cell A | Field D | 7+5 | base_pulse |
| V4_007 | 3 | [F3, Ab3] | melody_fragment | 1.5 | 0.5 | middle | staccato | Cell A | Field D | 7+5 | delayed_entry |
| V4_008 | 4 | [Ab2, B2, F3] | cluster_color | 0 | 1.5 | low | legato | Cell A | Field D | 7+5 | base_pulse |
| V4_009 | 4 | [Gb3, A3, C4] | melody_fragment | 1.5 | 0.5 | middle | staccato | Cell A | Field D | 7+5 | delayed_entry |
| V4_010 | 5 | [F2, Ab2, B2] | counterline | 0 | 1.0 | low | legato | Cell A | Field D | 7+5 | base_pulse |
| V4_011 | 6 | [F3, Gb3, A3] | melody_fragment | 0 | 1.0 | middle | accent | Cell A | Field D | 7+5 | base_pulse |
| V4_012 | 6 | [F2, Ab2] | counterline | 0 | 1.0 | low | legato | Cell A | Field D | 7+5 | base_pulse |
| V4_013 | 7 | [Ab3, B3, C4] | cluster_color | 0.5 | 1.0 | middle | legato | Cell A | Field D | 7+5 | delayed_entry |
| V4_014 | 8 | [F3, Gb3, A3] | melody_fragment | 0 | 1.5 | middle | legato | Cell A | Field D | 7+5 | base_pulse |

**Convergence:** Bar 6, beat 0 (V4_011, V4_012). Phrase groups: bars 1-5, 6-8 (5+3).

---

## Variant 5 — Cell E, Field C, 3+5, pulse displacement + phrase stretch

**Seed:** Cell E (minor 3 → major 2), Field C (E G Bb C#), phrase 3+5, pulse displacement + phrase stretch

| event_id | bar | pitches | role | beat_position | duration | register_band | articulation | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|--------------|---------------------|----------------------|--------------|----------------|
| V5_001 | 1 | [E3, G3, A3] | melody_fragment | 1 | 1.0 | middle | accent | Cell E | Field C | 3+5 | pulse_displacement |
| V5_002 | 1 | [Bb3, C#4] | counterline | 2 | 1.0 | middle | legato | Cell E | Field C | 3+5 | phrase_stretch |
| V5_003 | 2 | [G2, Bb2] | counterline | 0 | 1.5 | low | legato | Cell E | Field C | 3+5 | pulse_displacement |
| V5_004 | 2 | [Eb3, F3] | melody_fragment | 1 | 0.5 | middle | staccato | Cell E | Field C | 3+5 | phrase_stretch |
| V5_005 | 2 | [E3, G3, Bb3] | cluster_color | 2 | 0.5 | middle | staccato | Cell E | Field C | 3+5 | pulse_displacement |
| V5_006 | 3 | [G3, A3, C#4] | melody_fragment | 1 | 1.5 | middle | legato | Cell E | Field C | 3+5 | phrase_stretch |
| V5_007 | 3 | [Bb2, E3] | counterline | 2 | 1.0 | low | legato | Cell E | Field C | 3+5 | pulse_displacement |
| V5_008 | 4 | [E3, G3, Bb3] | melody_fragment | 0 | 1.0 | middle | accent | Cell E | Field C | 3+5 | pulse_displacement |
| V5_009 | 4 | [C#3, E3, G3] | counterline | 1.5 | 0.5 | middle | staccato | Cell E | Field C | 3+5 | phrase_stretch |
| V5_010 | 5 | [G2, A2, Bb2] | cluster_color | 0 | 1.5 | low | legato | Cell E | Field C | 3+5 | pulse_displacement |
| V5_011 | 6 | [E3, G3, Bb3, C#4] | melody_fragment | 0 | 1.0 | middle | accent | Cell E | Field C | 3+5 | pulse_displacement |
| V5_012 | 6 | [G2, Bb2] | counterline | 0 | 1.0 | low | legato | Cell E | Field C | 3+5 | pulse_displacement |
| V5_013 | 7 | [Eb3, F3, G3] | melody_fragment | 0.5 | 2.0 | middle | legato | Cell E | Field C | 3+5 | phrase_stretch |
| V5_014 | 8 | [E3, G3, Bb3] | melody_fragment | 0 | 1.5 | middle | legato | Cell E | Field C | 3+5 | phrase_stretch |

**Convergence:** Bar 6, beat 0 (V5_011, V5_012). Phrase stretch: V5_013 extends across bar 7-8 boundary.

---

## Summary

| Variant | Events | Phrase | Convergence |
|---------|--------|--------|-------------|
| 1 | 14 | 3+5 | Bar 6 |
| 2 | 14 | 5+3 | Bar 6 |
| 3 | 14 | 3+2+3 | Bar 6 |
| 4 | 14 | 5+3 | Bar 6 |
| 5 | 14 | 3+5 | Bar 6 |
