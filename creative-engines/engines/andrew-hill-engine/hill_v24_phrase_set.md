# Andrew Hill Engine V2.4 — 12 Phrase Studies

Identity stress test phrase set. Each phrase spans 8–12 bars with 10+ events.

---

## Phrase 1 — Cell A, Field A, 3+5, base pulse + delayed entry, 8 bars

**Seed:** Cell A (m2 → M3), Field A (C Eb F# G), phrase 3+5, base pulse + delayed entry

| event_id | bar | pitches | role | beat_position | duration | register_band | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|---------------------|----------------------|--------------|----------------|
| P1_001 | 1 | [C3, Db3, E3] | melody_fragment | 0 | 1.0 | middle | Cell A | Field A | 3+5 | base_pulse |
| P1_002 | 1 | [Eb3, F#3] | counterline | 1.5 | 0.5 | middle | Cell A | Field A | 3+5 | delayed_entry |
| P1_003 | 1 | [G3] | cluster_color | 2 | 0.5 | middle | Cell A | Field A | 3+5 | base_pulse |
| P1_004 | 2 | [C2, Db2] | counterline | 0 | 1.5 | low | Cell A | Field A | 3+5 | base_pulse |
| P1_005 | 2 | [E3, G3] | melody_fragment | 0.5 | 1.0 | middle | Cell A | Field A | 3+5 | delayed_entry |
| P1_006 | 2 | [C3, Eb3, F#3] | cluster_color | 2 | 0.5 | middle | Cell A | Field A | 3+5 | base_pulse |
| P1_007 | 3 | [Db3, E3, G3] | melody_fragment | 0 | 1.0 | middle | Cell A | Field A | 3+5 | base_pulse |
| P1_008 | 3 | [Eb2, F#2] | counterline | 1.5 | 1.0 | low | Cell A | Field A | 3+5 | delayed_entry |
| P1_009 | 5 | [C3, Db3, E3] | melody_fragment | 0 | 1.0 | middle | Cell A | Field A | 3+5 | base_pulse |
| P1_010 | 5 | [G2, Eb3] | counterline | 0 | 1.0 | low | Cell A | Field A | 3+5 | base_pulse |
| P1_011 | 6 | [Eb3, F#3, G3] | cluster_color | 0 | 0.5 | middle | Cell A | Field A | 3+5 | delayed_entry |
| P1_012 | 8 | [C3, Db3, E3] | melody_fragment | 0 | 1.5 | middle | Cell A | Field A | 3+5 | base_pulse |

**Convergence:** Bar 5, beat 0 (P1_009, P1_010)

---

## Phrase 2 — Cell B, Field B, 5+4, base pulse + phrase stretch, 9 bars

**Seed:** Cell B (m3 → tritone), Field B (D F G Bb), phrase 5+4, base pulse + phrase stretch

| event_id | bar | pitches | role | beat_position | duration | register_band | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|---------------------|----------------------|--------------|----------------|
| P2_001 | 1 | [D3, F3, A3] | melody_fragment | 0 | 1.0 | middle | Cell B | Field B | 5+4 | base_pulse |
| P2_002 | 1 | [G2, Bb2] | counterline | 1.5 | 0.5 | low | Cell B | Field B | 5+4 | phrase_stretch |
| P2_003 | 2 | [D3, F3] | cluster_color | 0 | 0.5 | middle | Cell B | Field B | 5+4 | base_pulse |
| P2_004 | 2 | [F2, A2] | counterline | 1 | 1.5 | low | Cell B | Field B | 5+4 | base_pulse |
| P2_005 | 2 | [Eb3, A3] | melody_fragment | 2.5 | 0.5 | middle | Cell B | Field B | 5+4 | phrase_stretch |
| P2_006 | 3 | [D3, F3, G3] | melody_fragment | 0 | 1.5 | middle | Cell B | Field B | 5+4 | base_pulse |
| P2_007 | 3 | [Bb2, D3] | counterline | 2 | 1.0 | low | Cell B | Field B | 5+4 | base_pulse |
| P2_008 | 4 | [F3, G3, Bb3] | cluster_color | 0 | 1.0 | middle | Cell B | Field B | 5+4 | base_pulse |
| P2_009 | 4 | [D3, A3] | melody_fragment | 1.5 | 0.5 | middle | Cell B | Field B | 5+4 | phrase_stretch |
| P2_010 | 5 | [G2, Bb2, D3] | counterline | 0 | 1.5 | low | Cell B | Field B | 5+4 | base_pulse |
| P2_011 | 6 | [D3, F3, A3] | melody_fragment | 0 | 1.0 | middle | Cell B | Field B | 5+4 | base_pulse |
| P2_012 | 6 | [F2, G2] | counterline | 0 | 1.0 | low | Cell B | Field B | 5+4 | base_pulse |
| P2_013 | 8 | [D3, F3, G3, Bb3] | cluster_color | 0.5 | 1.5 | middle | Cell B | Field B | 5+4 | phrase_stretch |
| P2_014 | 9 | [D3, F3, A3] | melody_fragment | 0 | 2.0 | middle | Cell B | Field B | 5+4 | phrase_stretch |

**Convergence:** Bar 6, beat 0 (P2_011, P2_012). Phrase stretch: P2_014 extends into bar 9.

---

## Phrase 3 — Cell C, Field C, 4+4+3, delayed entry + pulse displacement, 9 bars

**Seed:** Cell C (P4 → m2), Field C (E G Bb C#), phrase 4+4+3, delayed entry + pulse displacement

| event_id | bar | pitches | role | beat_position | duration | register_band | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|---------------------|----------------------|--------------|----------------|
| P3_001 | 1 | [E3, A3, Bb3] | melody_fragment | 0.5 | 1.0 | middle | Cell C | Field C | 4+4+3 | delayed_entry |
| P3_002 | 1 | [G2, Bb2] | counterline | 1 | 1.5 | low | Cell C | Field C | 4+4+3 | pulse_displacement |
| P3_003 | 2 | [E3, G3] | cluster_color | 1.5 | 0.5 | middle | Cell C | Field C | 4+4+3 | delayed_entry |
| P3_004 | 2 | [A2, Bb2] | counterline | 2 | 1.0 | low | Cell C | Field C | 4+4+3 | pulse_displacement |
| P3_005 | 3 | [E3, A3, C#4] | melody_fragment | 0.5 | 1.0 | middle | Cell C | Field C | 4+4+3 | delayed_entry |
| P3_006 | 3 | [G2, Bb2] | counterline | 1 | 1.0 | low | Cell C | Field C | 4+4+3 | pulse_displacement |
| P3_007 | 4 | [A3, Bb3, E4] | melody_fragment | 1 | 1.5 | middle | Cell C | Field C | 4+4+3 | delayed_entry |
| P3_008 | 4 | [Bb2, C#3] | cluster_color | 1.5 | 0.5 | low | Cell C | Field C | 4+4+3 | pulse_displacement |
| P3_009 | 5 | [E3, A3, Bb3] | melody_fragment | 0.5 | 1.0 | middle | Cell C | Field C | 4+4+3 | delayed_entry |
| P3_010 | 5 | [G2, Bb2, E3] | counterline | 2 | 1.0 | low | Cell C | Field C | 4+4+3 | pulse_displacement |
| P3_011 | 7 | [E3, G3, Bb3] | melody_fragment | 0 | 1.0 | middle | Cell C | Field C | 4+4+3 | pulse_displacement |
| P3_012 | 7 | [Bb2, C#3] | counterline | 0 | 1.0 | low | Cell C | Field C | 4+4+3 | pulse_displacement |
| P3_013 | 9 | [E3, A3, Bb3] | cluster_color | 0.5 | 0.5 | middle | Cell C | Field C | 4+4+3 | delayed_entry |

**Convergence:** Bar 7, beat 0 (P3_011, P3_012). Phrase groups: bars 1-3, 4-5, 6-9 (3+2+3).

---

## Phrase 4 — Cell D, Field D, 7+5, base pulse + delayed entry, 10 bars

**Seed:** Cell D (M2 → tritone), Field D (F Ab B C), phrase 7+5, base pulse + delayed entry

| event_id | bar | pitches | role | beat_position | duration | register_band | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|---------------------|----------------------|--------------|----------------|
| P4_001 | 1 | [F3, G3, B3] | melody_fragment | 0 | 1.0 | middle | Cell D | Field D | 7+5 | base_pulse |
| P4_002 | 1 | [C3] | cluster_color | 1.5 | 0.5 | middle | Cell D | Field D | 7+5 | delayed_entry |
| P4_003 | 1 | [F2, Ab2] | counterline | 2 | 1.5 | low | Cell D | Field D | 7+5 | base_pulse |
| P4_004 | 2 | [Ab3, B3] | melody_fragment | 0.5 | 1.0 | middle | Cell D | Field D | 7+5 | delayed_entry |
| P4_005 | 2 | [F3, G3, B3, C4] | cluster_color | 2 | 0.5 | middle | Cell D | Field D | 7+5 | base_pulse |
| P4_006 | 3 | [G2, B2] | counterline | 0 | 1.5 | low | Cell D | Field D | 7+5 | base_pulse |
| P4_007 | 3 | [F3, Ab3] | melody_fragment | 1.5 | 0.5 | middle | Cell D | Field D | 7+5 | delayed_entry |
| P4_008 | 4 | [Ab2, B2, F3] | cluster_color | 0 | 1.5 | low | Cell D | Field D | 7+5 | base_pulse |
| P4_009 | 4 | [G3, B3, C4] | melody_fragment | 1.5 | 0.5 | middle | Cell D | Field D | 7+5 | delayed_entry |
| P4_010 | 5 | [F2, Ab2, B2] | counterline | 0 | 1.0 | low | Cell D | Field D | 7+5 | base_pulse |
| P4_011 | 7 | [F3, G3, B3] | melody_fragment | 0 | 1.0 | middle | Cell D | Field D | 7+5 | base_pulse |
| P4_012 | 7 | [F2, Ab2] | counterline | 0 | 1.0 | low | Cell D | Field D | 7+5 | base_pulse |
| P4_013 | 9 | [Ab3, B3, C4] | cluster_color | 0.5 | 1.0 | middle | Cell D | Field D | 7+5 | delayed_entry |
| P4_014 | 10 | [F3, G3, B3] | melody_fragment | 0 | 1.5 | middle | Cell D | Field D | 7+5 | base_pulse |

**Convergence:** Bar 7, beat 0 (P4_011, P4_012). Phrase groups: bars 1-6, 7-10 (6+4 interpretation of 7+5).

---

## Phrase 5 — Cell E, Field A, 3+3+2, pulse displacement + phrase stretch, 8 bars

**Seed:** Cell E (m3 → M2), Field A (C Eb F# G), phrase 3+3+2, pulse displacement + phrase stretch

| event_id | bar | pitches | role | beat_position | duration | register_band | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|---------------------|----------------------|--------------|----------------|
| P5_001 | 1 | [C3, Eb3, F3] | melody_fragment | 1 | 1.0 | middle | Cell E | Field A | 3+3+2 | pulse_displacement |
| P5_002 | 1 | [F#3, G3] | counterline | 2 | 1.0 | middle | Cell E | Field A | 3+3+2 | phrase_stretch |
| P5_003 | 2 | [Eb2, F2] | counterline | 0 | 1.5 | low | Cell E | Field A | 3+3+2 | pulse_displacement |
| P5_004 | 2 | [C3, Eb3] | melody_fragment | 1 | 0.5 | middle | Cell E | Field A | 3+3+2 | phrase_stretch |
| P5_005 | 2 | [Eb3, F3, G3] | cluster_color | 2 | 0.5 | middle | Cell E | Field A | 3+3+2 | pulse_displacement |
| P5_006 | 3 | [C3, Eb3, F3, G3] | melody_fragment | 1 | 1.5 | middle | Cell E | Field A | 3+3+2 | phrase_stretch |
| P5_007 | 3 | [Eb2, G2] | counterline | 2 | 1.0 | low | Cell E | Field A | 3+3+2 | pulse_displacement |
| P5_008 | 5 | [C3, Eb3, F3] | melody_fragment | 0 | 1.0 | middle | Cell E | Field A | 3+3+2 | pulse_displacement |
| P5_009 | 5 | [Eb2, F2, G2] | counterline | 0 | 1.0 | low | Cell E | Field A | 3+3+2 | pulse_displacement |
| P5_010 | 6 | [Eb3, F3, G3] | cluster_color | 0 | 1.5 | middle | Cell E | Field A | 3+3+2 | pulse_displacement |
| P5_011 | 7 | [C3, Eb3, F3] | melody_fragment | 0.5 | 2.0 | middle | Cell E | Field A | 3+3+2 | phrase_stretch |
| P5_012 | 8 | [C3, Eb3, F3] | melody_fragment | 0 | 1.5 | middle | Cell E | Field A | 3+3+2 | phrase_stretch |

**Convergence:** Bar 5, beat 0 (P5_008, P5_009). Phrase stretch: P5_011 extends across bar 7-8.

---

## Phrase 6 — Cell A, Field B, 5+4, base pulse + pulse displacement, 11 bars

**Seed:** Cell A (m2 → M3), Field B (D F G Bb), phrase 5+4, base pulse + pulse displacement

| event_id | bar | pitches | role | beat_position | duration | register_band | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|---------------------|----------------------|--------------|----------------|
| P6_001 | 1 | [D3, Eb3, F#3] | melody_fragment | 0 | 1.0 | middle | Cell A | Field B | 5+4 | base_pulse |
| P6_002 | 1 | [G2, Bb2] | counterline | 1 | 1.5 | low | Cell A | Field B | 5+4 | pulse_displacement |
| P6_003 | 2 | [D3, Eb3] | cluster_color | 0 | 0.5 | middle | Cell A | Field B | 5+4 | base_pulse |
| P6_004 | 2 | [F2, F#2] | counterline | 2 | 1.0 | low | Cell A | Field B | 5+4 | pulse_displacement |
| P6_005 | 2 | [Eb3, F#3, G3] | melody_fragment | 2.5 | 0.5 | middle | Cell A | Field B | 5+4 | base_pulse |
| P6_006 | 3 | [D3, Eb3, F#3] | melody_fragment | 0 | 1.5 | middle | Cell A | Field B | 5+4 | base_pulse |
| P6_007 | 3 | [Bb2, D3] | counterline | 1 | 1.0 | low | Cell A | Field B | 5+4 | pulse_displacement |
| P6_008 | 4 | [Eb3, F#3, G3, Bb3] | cluster_color | 0 | 1.0 | middle | Cell A | Field B | 5+4 | base_pulse |
| P6_009 | 5 | [G2, Bb2, D3] | counterline | 0 | 1.5 | low | Cell A | Field B | 5+4 | base_pulse |
| P6_010 | 6 | [D3, Eb3, F#3] | melody_fragment | 0 | 1.0 | middle | Cell A | Field B | 5+4 | base_pulse |
| P6_011 | 6 | [F2, G2] | counterline | 0 | 1.0 | low | Cell A | Field B | 5+4 | base_pulse |
| P6_012 | 9 | [D3, Eb3, F#3] | melody_fragment | 0 | 1.0 | middle | Cell A | Field B | 5+4 | base_pulse |
| P6_013 | 11 | [D3, Eb3, F#3, G3] | cluster_color | 0 | 1.5 | middle | Cell A | Field B | 5+4 | base_pulse |

**Convergence:** Bar 6, beat 0 (P6_010, P6_011). Phrase groups: bars 1-5, 6-11 (5+6 interpretation of 5+4).

---

## Phrase 7 — Cell B, Field C, 4+4+3, delayed entry + phrase stretch, 10 bars

**Seed:** Cell B (m3 → tritone), Field C (E G Bb C#), phrase 4+4+3, delayed entry + phrase stretch

| event_id | bar | pitches | role | beat_position | duration | register_band | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|---------------------|----------------------|--------------|----------------|
| P7_001 | 1 | [E3, G3, Bb3] | melody_fragment | 0.5 | 1.0 | middle | Cell B | Field C | 4+4+3 | delayed_entry |
| P7_002 | 1 | [C#4] | cluster_color | 1.5 | 0.5 | middle | Cell B | Field C | 4+4+3 | phrase_stretch |
| P7_003 | 1 | [G2, Bb2] | counterline | 2 | 1.5 | low | Cell B | Field C | 4+4+3 | delayed_entry |
| P7_004 | 2 | [Eb3, A3] | melody_fragment | 0.5 | 1.0 | middle | Cell B | Field C | 4+4+3 | delayed_entry |
| P7_005 | 2 | [E3, G3, Bb3, C#4] | cluster_color | 2 | 0.5 | middle | Cell B | Field C | 4+4+3 | delayed_entry |
| P7_006 | 3 | [C#3, E3] | counterline | 0 | 1.5 | middle | Cell B | Field C | 4+4+3 | delayed_entry |
| P7_007 | 3 | [Bb2, E3] | melody_fragment | 1.5 | 0.5 | low | Cell B | Field C | 4+4+3 | phrase_stretch |
| P7_008 | 4 | [E3, G3, Bb3] | melody_fragment | 0 | 1.0 | middle | Cell B | Field C | 4+4+3 | delayed_entry |
| P7_009 | 4 | [C#4, E4] | counterline | 1.5 | 0.5 | high | Cell B | Field C | 4+4+3 | phrase_stretch |
| P7_010 | 6 | [Eb3, A3] | melody_fragment | 0 | 1.0 | middle | Cell B | Field C | 4+4+3 | delayed_entry |
| P7_011 | 6 | [G2, Bb2] | counterline | 0 | 1.0 | low | Cell B | Field C | 4+4+3 | delayed_entry |
| P7_012 | 8 | [E3, G3, Bb3] | melody_fragment | 0 | 1.0 | middle | Cell B | Field C | 4+4+3 | delayed_entry |
| P7_013 | 9 | [Bb3, C#4] | cluster_color | 2.5 | 0.5 | middle | Cell B | Field C | 4+4+3 | phrase_stretch |
| P7_014 | 10 | [E3, G3, Bb3] | melody_fragment | 0 | 2.0 | middle | Cell B | Field C | 4+4+3 | phrase_stretch |

**Convergence:** Bar 6, beat 0 (P7_010, P7_011). Phrase stretch: P7_014 extends into bar 10.

---

## Phrase 8 — Cell C, Field D, 7+5, base pulse + delayed entry, 9 bars

**Seed:** Cell C (P4 → m2), Field D (F Ab B C), phrase 7+5, base pulse + delayed entry

| event_id | bar | pitches | role | beat_position | duration | register_band | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|---------------------|----------------------|--------------|----------------|
| P8_001 | 1 | [F3, Bb3, B3] | melody_fragment | 0 | 1.0 | middle | Cell C | Field D | 7+5 | base_pulse |
| P8_002 | 1 | [Ab3, B3] | counterline | 1.5 | 0.5 | middle | Cell C | Field D | 7+5 | delayed_entry |
| P8_003 | 2 | [C3] | cluster_color | 0 | 0.5 | middle | Cell C | Field D | 7+5 | base_pulse |
| P8_004 | 2 | [F2, Bb2] | counterline | 1 | 1.5 | low | Cell C | Field D | 7+5 | base_pulse |
| P8_005 | 2 | [Bb3, B3, C4] | melody_fragment | 2.5 | 0.5 | middle | Cell C | Field D | 7+5 | delayed_entry |
| P8_006 | 3 | [F3, Bb3, C4] | melody_fragment | 0 | 1.5 | middle | Cell C | Field D | 7+5 | base_pulse |
| P8_007 | 3 | [Ab2, B2] | counterline | 2 | 1.0 | low | Cell C | Field D | 7+5 | base_pulse |
| P8_008 | 4 | [F3, Ab3, B3] | cluster_color | 0 | 1.0 | middle | Cell C | Field D | 7+5 | base_pulse |
| P8_009 | 4 | [Bb3, C4] | melody_fragment | 1.5 | 0.5 | middle | Cell C | Field D | 7+5 | delayed_entry |
| P8_010 | 5 | [F2, Ab2, B2] | counterline | 0 | 1.0 | low | Cell C | Field D | 7+5 | base_pulse |
| P8_011 | 7 | [F3, Bb3, B3] | melody_fragment | 0 | 1.0 | middle | Cell C | Field D | 7+5 | base_pulse |
| P8_012 | 7 | [F2, Ab2] | counterline | 0 | 1.0 | low | Cell C | Field D | 7+5 | base_pulse |
| P8_013 | 9 | [F3, Ab3, B3, C4] | cluster_color | 0.5 | 1.0 | middle | Cell C | Field D | 7+5 | delayed_entry |

**Convergence:** Bar 7, beat 0 (P8_011, P8_012). Phrase groups: bars 1-6, 7-9 (6+3 interpretation of 7+5).

---

## Phrase 9 — Cell D, Field A, 3+5, pulse displacement + phrase stretch, 12 bars

**Seed:** Cell D (M2 → tritone), Field A (C Eb F# G), phrase 3+5, pulse displacement + phrase stretch

| event_id | bar | pitches | role | beat_position | duration | register_band | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|---------------------|----------------------|--------------|----------------|
| P9_001 | 1 | [C3, D3, Ab3] | melody_fragment | 1 | 1.0 | middle | Cell D | Field A | 3+5 | pulse_displacement |
| P9_002 | 1 | [Eb3, F#3] | counterline | 2 | 1.0 | middle | Cell D | Field A | 3+5 | phrase_stretch |
| P9_003 | 2 | [G2, Ab2] | counterline | 0 | 1.5 | low | Cell D | Field A | 3+5 | pulse_displacement |
| P9_004 | 2 | [C3, D3] | melody_fragment | 1 | 0.5 | middle | Cell D | Field A | 3+5 | phrase_stretch |
| P9_005 | 2 | [Eb3, F#3, G3] | cluster_color | 2 | 0.5 | middle | Cell D | Field A | 3+5 | pulse_displacement |
| P9_006 | 3 | [C3, D3, Ab3] | melody_fragment | 1 | 1.5 | middle | Cell D | Field A | 3+5 | phrase_stretch |
| P9_007 | 3 | [Eb2, F#2] | counterline | 2 | 1.0 | low | Cell D | Field A | 3+5 | pulse_displacement |
| P9_008 | 5 | [C3, D3, Ab3] | melody_fragment | 0 | 1.0 | middle | Cell D | Field A | 3+5 | pulse_displacement |
| P9_009 | 5 | [G2, Ab2] | counterline | 0 | 1.0 | low | Cell D | Field A | 3+5 | pulse_displacement |
| P9_010 | 7 | [Eb3, F#3, G3] | cluster_color | 0 | 1.5 | middle | Cell D | Field A | 3+5 | pulse_displacement |
| P9_011 | 9 | [C3, D3, Ab3] | melody_fragment | 0.5 | 2.0 | middle | Cell D | Field A | 3+5 | phrase_stretch |
| P9_012 | 12 | [C3, D3, Eb3] | melody_fragment | 0 | 1.5 | middle | Cell D | Field A | 3+5 | phrase_stretch |

**Convergence:** Bar 5, beat 0 (P9_008, P9_009). Phrase stretch: P9_011 extends across bar 9-10.

---

## Phrase 10 — Cell E, Field B, 4+4+3, base pulse + delayed entry, 8 bars

**Seed:** Cell E (m3 → M2), Field B (D F G Bb), phrase 4+4+3, base pulse + delayed entry

| event_id | bar | pitches | role | beat_position | duration | register_band | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|---------------------|----------------------|--------------|----------------|
| P10_001 | 1 | [D3, F3, G3] | melody_fragment | 0 | 1.0 | middle | Cell E | Field B | 4+4+3 | base_pulse |
| P10_002 | 1 | [Bb3] | cluster_color | 1.5 | 0.5 | middle | Cell E | Field B | 4+4+3 | delayed_entry |
| P10_003 | 1 | [D2, F2] | counterline | 2 | 1.5 | low | Cell E | Field B | 4+4+3 | base_pulse |
| P10_004 | 2 | [Eb3, F3] | melody_fragment | 0.5 | 1.0 | middle | Cell E | Field B | 4+4+3 | delayed_entry |
| P10_005 | 2 | [D3, F3, G3, Bb3] | cluster_color | 2 | 0.5 | middle | Cell E | Field B | 4+4+3 | base_pulse |
| P10_006 | 3 | [F2, G2] | counterline | 0 | 1.5 | low | Cell E | Field B | 4+4+3 | base_pulse |
| P10_007 | 3 | [D3, F3, G3] | melody_fragment | 1.5 | 0.5 | middle | Cell E | Field B | 4+4+3 | delayed_entry |
| P10_008 | 4 | [D3, Eb3, F3] | melody_fragment | 0 | 1.0 | middle | Cell E | Field B | 4+4+3 | base_pulse |
| P10_009 | 4 | [F2, G2, Bb2] | cluster_color | 1.5 | 0.5 | low | Cell E | Field B | 4+4+3 | delayed_entry |
| P10_010 | 6 | [D3, F3, G3] | melody_fragment | 0 | 1.0 | middle | Cell E | Field B | 4+4+3 | base_pulse |
| P10_011 | 6 | [D2, F2] | counterline | 0 | 1.0 | low | Cell E | Field B | 4+4+3 | base_pulse |
| P10_012 | 8 | [D3, F3, G3, Bb3] | melody_fragment | 0 | 1.5 | middle | Cell E | Field B | 4+4+3 | base_pulse |

**Convergence:** Bar 6, beat 0 (P10_010, P10_011). Phrase groups: bars 1-3, 4-5, 6-8 (3+2+3).

---

## Phrase 11 — Cell A, Field C, 3+3+2, delayed entry + pulse displacement, 9 bars

**Seed:** Cell A (m2 → M3), Field C (E G Bb C#), phrase 3+3+2, delayed entry + pulse displacement

| event_id | bar | pitches | role | beat_position | duration | register_band | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|---------------------|----------------------|--------------|----------------|
| P11_001 | 1 | [E3, F3, G#3] | melody_fragment | 0.5 | 1.0 | middle | Cell A | Field C | 3+3+2 | delayed_entry |
| P11_002 | 1 | [G2, Bb2] | counterline | 1 | 1.5 | low | Cell A | Field C | 3+3+2 | pulse_displacement |
| P11_003 | 2 | [E3, G3] | cluster_color | 1.5 | 0.5 | middle | Cell A | Field C | 3+3+2 | delayed_entry |
| P11_004 | 2 | [Bb2, C#3] | counterline | 2 | 1.0 | low | Cell A | Field C | 3+3+2 | pulse_displacement |
| P11_005 | 3 | [E3, F3, G#3, Bb3] | melody_fragment | 0.5 | 1.0 | middle | Cell A | Field C | 3+3+2 | delayed_entry |
| P11_006 | 3 | [G2, Bb2] | counterline | 1 | 1.0 | low | Cell A | Field C | 3+3+2 | pulse_displacement |
| P11_007 | 4 | [E3, G3, Bb3] | melody_fragment | 1 | 1.5 | middle | Cell A | Field C | 3+3+2 | delayed_entry |
| P11_008 | 4 | [Bb2, C#3] | cluster_color | 1.5 | 0.5 | low | Cell A | Field C | 3+3+2 | pulse_displacement |
| P11_009 | 6 | [E3, F3, G#3] | melody_fragment | 0 | 1.0 | middle | Cell A | Field C | 3+3+2 | pulse_displacement |
| P11_010 | 6 | [G2, Bb2] | counterline | 0 | 1.0 | low | Cell A | Field C | 3+3+2 | pulse_displacement |
| P11_011 | 8 | [E3, G3, Bb3, C#4] | cluster_color | 0.5 | 0.5 | middle | Cell A | Field C | 3+3+2 | delayed_entry |
| P11_012 | 9 | [E3, F3, G#3] | melody_fragment | 0 | 1.5 | middle | Cell A | Field C | 3+3+2 | delayed_entry |

**Convergence:** Bar 6, beat 0 (P11_009, P11_010). Note: Cell A uses m2→M3; Field C transposed to E gives E F G# (enharmonic Ab) Bb C# — F-G# is M3 from F, G#-Bb is m2.

---

## Phrase 12 — Cell B, Field D, 7+5, base pulse + phrase stretch, 11 bars

**Seed:** Cell B (m3 → tritone), Field D (F Ab B C), phrase 7+5, base pulse + phrase stretch

| event_id | bar | pitches | role | beat_position | duration | register_band | source_interval_cell | source_harmonic_field | phrase_group | rhythmic_layer |
|----------|-----|---------|------|---------------|----------|---------------|---------------------|----------------------|--------------|----------------|
| P12_001 | 1 | [F3, Ab3, B3] | melody_fragment | 0 | 1.0 | middle | Cell B | Field D | 7+5 | base_pulse |
| P12_002 | 1 | [C3] | cluster_color | 1.5 | 0.5 | middle | Cell B | Field D | 7+5 | phrase_stretch |
| P12_003 | 1 | [F2, Ab2] | counterline | 2 | 1.5 | low | Cell B | Field D | 7+5 | base_pulse |
| P12_004 | 2 | [Ab3, B3] | melody_fragment | 0.5 | 1.0 | middle | Cell B | Field D | 7+5 | phrase_stretch |
| P12_005 | 2 | [F3, Ab3, B3, C4] | cluster_color | 2 | 0.5 | middle | Cell B | Field D | 7+5 | base_pulse |
| P12_006 | 3 | [Ab2, B2] | counterline | 0 | 1.5 | low | Cell B | Field D | 7+5 | base_pulse |
| P12_007 | 3 | [F3, Ab3] | melody_fragment | 1.5 | 0.5 | middle | Cell B | Field D | 7+5 | phrase_stretch |
| P12_008 | 4 | [F2, Ab2, B2, F3] | cluster_color | 0 | 1.5 | low | Cell B | Field D | 7+5 | base_pulse |
| P12_009 | 5 | [Ab3, B3, C4] | melody_fragment | 1.5 | 0.5 | middle | Cell B | Field D | 7+5 | phrase_stretch |
| P12_010 | 5 | [F2, Ab2, B2] | counterline | 0 | 1.0 | low | Cell B | Field D | 7+5 | base_pulse |
| P12_011 | 8 | [F3, Ab3, B3] | melody_fragment | 0 | 1.0 | middle | Cell B | Field D | 7+5 | base_pulse |
| P12_012 | 8 | [F2, Ab2] | counterline | 0 | 1.0 | low | Cell B | Field D | 7+5 | base_pulse |
| P12_013 | 10 | [Ab3, B3, C4] | cluster_color | 0.5 | 1.5 | middle | Cell B | Field D | 7+5 | phrase_stretch |
| P12_014 | 11 | [F3, Ab3, B3] | melody_fragment | 0 | 2.0 | middle | Cell B | Field D | 7+5 | phrase_stretch |

**Convergence:** Bar 8, beat 0 (P12_011, P12_012). Phrase stretch: P12_014 extends into bar 11.

---

## Summary

| Phrase | Cell | Field | Phrase Type | Rhythmic Layers | Bars | Events |
|--------|------|-------|-------------|----------------|------|--------|
| 1 | A | A | 3+5 | base_pulse + delayed_entry | 8 | 12 |
| 2 | B | B | 5+4 | base_pulse + phrase_stretch | 9 | 14 |
| 3 | C | C | 4+4+3 | delayed_entry + pulse_displacement | 9 | 13 |
| 4 | D | D | 7+5 | base_pulse + delayed_entry | 10 | 14 |
| 5 | E | A | 3+3+2 | pulse_displacement + phrase_stretch | 8 | 12 |
| 6 | A | B | 5+4 | base_pulse + pulse_displacement | 11 | 13 |
| 7 | B | C | 4+4+3 | delayed_entry + phrase_stretch | 10 | 14 |
| 8 | C | D | 7+5 | base_pulse + delayed_entry | 9 | 13 |
| 9 | D | A | 3+5 | pulse_displacement + phrase_stretch | 12 | 12 |
| 10 | E | B | 4+4+3 | base_pulse + delayed_entry | 8 | 12 |
| 11 | A | C | 3+3+2 | delayed_entry + pulse_displacement | 9 | 12 |
| 12 | B | D | 7+5 | base_pulse + phrase_stretch | 11 | 14 |
