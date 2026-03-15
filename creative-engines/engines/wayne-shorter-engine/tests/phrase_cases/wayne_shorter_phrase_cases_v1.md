# Wayne Shorter Engine — Phrase Test Cases V1

**Purpose:** Hand-constructed phrase prototypes to stress-test grammar and validator.

**MIDI reference:** C4=60, Eb4=63, F4=65, Gb4=66, A4=69, etc.

---

## STRONG PASS CANDIDATES (1–4)

---

### CASE 1 — Strong Pass

**Phrase ID:** P01  
**Phrase length:** 8 bars (3+5)  
**Motivic source:** Cell A (m3→tt: C Eb A)  
**Interval logic:** m3, tt throughout; no scalar runs  
**Harmonic field:** Field A (bars 1–3), Field D (bars 4–8) — 2 distinct types  
**Event-role breakdown:** melody (8), counterline (4), harmonic_color (4)  
**Expected:** PASS — Full Shorter profile

**Why pass:** Cell A exact + transposed + inverted; 2 field types; 3+5; 3 roles; no ii–V–I; no literal repeat.

**Event structure:**

| event_id | bar | beat | dur | pitch/set | role | motivic | field | phrase_group | transformation |
|----------|-----|------|-----|-----------|------|---------|-------|--------------|----------------|
| S001 | 1 | 0 | 1.0 | 60 | melody | Cell A | A | 3+5 | repeat |
| S002 | 1 | 0 | 1.0 | [48,63,69] | harmonic_color | Cell A | A | 3+5 | — |
| S003 | 1 | 2 | 1.0 | 63 | melody | Cell A | A | 3+5 | repeat |
| S004 | 2 | 0 | 1.0 | 69 | melody | Cell A | A | 3+5 | repeat |
| S005 | 2 | 0 | 1.0 | [55,60,63] | counterline | Cell A | A | 3+5 | invert |
| S006 | 2 | 2 | 1.0 | [48,63,69] | harmonic_color | Cell A | A | 3+5 | — |
| S007 | 3 | 0 | 1.0 | 65 | melody | Cell A | A | 3+5 | transpose |
| S008 | 3 | 2 | 1.0 | 68 | melody | Cell A | A | 3+5 | transpose |
| S009 | 4 | 0 | 1.0 | 60 | melody | Cell A | D | 3+5 | transpose |
| S010 | 4 | 0 | 1.0 | [48,51,55] | harmonic_color | Cell A | D | 3+5 | — |
| S011 | 4 | 2 | 1.0 | 63 | melody | Cell A | D | 3+5 | transpose |
| S012 | 5 | 0 | 1.0 | 69 | melody | Cell A | D | 3+5 | transpose |
| S013 | 5 | 0 | 1.0 | [48,63,69] | counterline | Cell A | D | 3+5 | invert |
| S014 | 6 | 0 | 1.0 | 65 | melody | Cell A | D | 3+5 | transpose |
| S015 | 7 | 0 | 1.0 | 69 | melody | Cell A | D | 3+5 | transpose |
| S016 | 8 | 0 | 1.0 | 60 | melody | Cell A | D | 3+5 | transpose |

*Motif: bars 1–2 exact (C Eb A); bars 3–4 transposed P4 (F Ab D); bars 5–8 transposed + inverted. 3+5 phrase. Field A (modal) bars 1–3, Field D (planing) bars 4–8.*

---

### CASE 2 — Strong Pass

**Phrase ID:** P02  
**Phrase length:** 9 bars (5+4)  
**Motivic source:** Cell B (P4→m2: C F Gb)  
**Interval logic:** P4, m2 throughout  
**Harmonic field:** Field D (chromatic planing bars 1–5), Field F (pedal bars 6–9) — 2 distinct  
**Event-role breakdown:** melody (9), bass (9)  
**Expected:** PASS

**Why pass:** Cell B exact + fragment; 2 field types; 5+4; melody + bass; no ii–V–I.

**Event structure:**

| event_id | bar | beat | dur | pitch/set | role | motivic | field | phrase_group | transformation |
|----------|-----|------|-----|-----------|------|---------|-------|--------------|----------------|
| S017 | 1 | 0 | 1.0 | 60 | melody | Cell B | D | 5+4 | repeat |
| S018 | 1 | 0 | 1.0 | 36 | bass | Cell B | D | 5+4 | — |
| S019 | 2 | 0 | 1.0 | 65 | melody | Cell B | D | 5+4 | repeat |
| S020 | 2 | 0 | 1.0 | 36 | bass | Cell B | D | 5+4 | — |
| S021 | 3 | 0 | 1.0 | 66 | melody | Cell B | D | 5+4 | repeat |
| S022 | 4 | 0 | 1.0 | 60 | melody | Cell B | D | 5+4 | fragment |
| S023 | 4 | 0 | 1.0 | 36 | bass | Cell B | D | 5+4 | — |
| S024 | 5 | 0 | 1.0 | 65 | melody | Cell B | D | 5+4 | fragment |
| S025 | 6 | 0 | 1.0 | 60 | melody | Cell B | F | 5+4 | transpose |
| S026 | 6 | 0 | 1.0 | 36 | bass | Cell B | F | 5+4 | — |
| S027 | 7 | 0 | 1.0 | 65 | melody | Cell B | F | 5+4 | transpose |
| S028 | 8 | 0 | 1.0 | 66 | melody | Cell B | F | 5+4 | transpose |
| S029 | 9 | 0 | 1.0 | 60 | melody | Cell B | F | 5+4 | transpose |

*Motif: bars 1–3 exact (C F Gb); bars 4–5 fragment; bars 6–9 transposed. 5+4. Field D (planing) + Field F (pedal).*

---

### CASE 3 — Strong Pass

**Phrase ID:** P03  
**Phrase length:** 11 bars (4+4+3)  
**Motivic source:** Cell C (m2→M3: C Db E)  
**Interval logic:** m2, M3 throughout  
**Harmonic field:** Field A (bars 1–4), Field C (bars 5–8), Field F (bars 9–11) — 3 distinct  
**Event-role breakdown:** melody (11), counterline (6), harmonic_color (6)  
**Expected:** PASS

**Why pass:** Cell C with transformations; 3 field types; 4+4+3; 3 roles; modal + Lydian + pedal.

**Event structure:**

| event_id | bar | beat | dur | pitch/set | role | motivic | field | phrase_group | transformation |
|----------|-----|------|-----|-----------|------|---------|-------|--------------|----------------|
| S030 | 1 | 0 | 1.0 | 60 | melody | Cell C | A | 4+4+3 | repeat |
| S031 | 1 | 0 | 1.0 | [55,60,64] | harmonic_color | Cell C | A | 4+4+3 | — |
| S032 | 2 | 0 | 1.0 | 61 | melody | Cell C | A | 4+4+3 | repeat |
| S033 | 3 | 0 | 1.0 | 64 | melody | Cell C | A | 4+4+3 | repeat |
| S034 | 4 | 0 | 1.0 | 60 | melody | Cell C | A | 4+4+3 | invert |
| S035 | 4 | 0 | 1.0 | [48,61,64] | counterline | Cell C | A | 4+4+3 | invert |
| S036 | 5 | 0 | 1.0 | 60 | melody | Cell C | C | 4+4+3 | transpose |
| S037 | 5 | 0 | 1.0 | [60,64,67] | harmonic_color | Cell C | C | 4+4+3 | — |
| S038 | 6 | 0 | 1.0 | 61 | melody | Cell C | C | 4+4+3 | transpose |
| S039 | 7 | 0 | 1.0 | 66 | melody | Cell C | C | 4+4+3 | transpose |
| S040 | 8 | 0 | 1.0 | 60 | melody | Cell C | C | 4+4+3 | transpose |
| S041 | 9 | 0 | 1.0 | 60 | melody | Cell C | F | 4+4+3 | transpose |
| S042 | 9 | 0 | 1.0 | 36 | bass | Cell C | F | 4+4+3 | — |
| S043 | 10 | 0 | 1.0 | 64 | melody | Cell C | F | 4+4+3 | transpose |
| S044 | 11 | 0 | 1.0 | 60 | melody | Cell C | F | 4+4+3 | transpose |

*Motif: bars 1–4 exact + invert; bars 5–8 transposed (Field C Lydian); bars 9–11 transposed (Field F pedal). 4+4+3. Three field types.*

---

### CASE 4 — Strong Pass

**Phrase ID:** P04  
**Phrase length:** 12 bars (7+5)  
**Motivic source:** Cell D (M2→tt: C D Ab)  
**Interval logic:** M2, tt throughout  
**Harmonic field:** Field G (Footprints turnaround)  
**Event-role breakdown:** melody (10), harmonic_color (8), bass (6)  
**Expected:** PASS

**Why pass:** Cell D; Field G (turnaround = distinct type); 7+5; 3 roles; no ii–V–I in conventional sense; turnaround is chromatic.

**Event structure:**

| event_id | bar | beat | dur | pitch/set | role | motivic | field | phrase_group | transformation |
|----------|-----|------|-----|-----------|------|---------|-------|--------------|----------------|
| S045 | 1 | 0 | 1.0 | 60 | melody | Cell D | A | 7+5 | repeat |
| S046 | 1 | 0 | 1.0 | [48,60,63] | harmonic_color | Cell D | A | 7+5 | — |
| S047 | 1 | 0 | 1.0 | 36 | bass | Cell D | A | 7+5 | — |
| S048 | 2 | 0 | 1.0 | 62 | melody | Cell D | A | 7+5 | repeat |
| S049 | 3 | 0 | 1.0 | 68 | melody | Cell D | A | 7+5 | repeat |
| S050 | 4 | 0 | 1.0 | 60 | melody | Cell D | G | 7+5 | transpose |
| S051 | 4 | 0 | 1.0 | 36 | bass | Cell D | G | 7+5 | — |
| S052 | 5 | 0 | 1.0 | 62 | melody | Cell D | G | 7+5 | transpose |
| S053 | 6 | 0 | 1.0 | 68 | melody | Cell D | G | 7+5 | transpose |
| S054 | 7 | 0 | 1.0 | 60 | melody | Cell D | G | 7+5 | invert |
| S055 | 8 | 0 | 1.0 | [48,60,63] | harmonic_color | Cell D | G | 7+5 | — |
| S056 | 8 | 0 | 1.0 | 60 | melody | Cell D | G | 7+5 | transpose |
| S057 | 9 | 0 | 1.0 | 62 | melody | Cell D | G | 7+5 | transpose |
| S058 | 10 | 0 | 1.0 | 68 | melody | Cell D | G | 7+5 | transpose |
| S059 | 11 | 0 | 1.0 | 60 | melody | Cell D | G | 7+5 | transpose |
| S060 | 12 | 0 | 1.0 | 60 | melody | Cell D | G | 7+5 | transpose |

*Field A (modal) bars 1–3, Field G (turnaround) bars 4–12. 2 distinct types. 7+5. 3 roles. Motif: exact + transpose + invert.*

---

## BORDERLINE CANDIDATES (5–8)

---

### CASE 5 — Borderline (Single Field Type)

**Phrase ID:** P05  
**Phrase length:** 8 bars (3+5)  
**Motivic source:** Cell A  
**Interval logic:** m3, tt  
**Harmonic field:** Field A only (bars 1–8) — 1 type, but extension change Cm7→Cm9 in bars 5–8  
**Event-role breakdown:** melody (8), harmonic_color (6)  
**Expected:** BORDERLINE — transformation (extension) may satisfy Check 5

**Why borderline:** Single field type (modal) but extension change Cm7→Cm9 in second half. Validator allows "same type with transformation."

**Event structure:**

| event_id | bar | beat | dur | pitch/set | role | motivic | field | phrase_group |
|----------|-----|------|-----|-----------|------|---------|-------|--------------|
| S061 | 1 | 0 | 1.0 | 60 | melody | Cell A | A | 3+5 | repeat |
| S062 | 1 | 0 | 1.0 | [48,63,67,70] | harmonic_color | Cell A | A | 3+5 | Cm7 |
| S063 | 2 | 0 | 1.0 | 63 | melody | Cell A | A | 3+5 | repeat |
| S064 | 3 | 0 | 1.0 | 69 | melody | Cell A | A | 3+5 | repeat |
| S065 | 4 | 0 | 1.0 | 65 | melody | Cell A | A | 3+5 | transpose |
| S066 | 5 | 0 | 1.0 | 60 | melody | Cell A | A | 3+5 | transpose |
| S067 | 5 | 0 | 1.0 | [48,63,67,70,74] | harmonic_color | Cell A | A | 3+5 | Cm9 |
| S068 | 6 | 0 | 1.0 | 63 | melody | Cell A | A | 3+5 | transpose |
| S069 | 7 | 0 | 1.0 | 69 | melody | Cell A | A | 3+5 | transpose |
| S070 | 8 | 0 | 1.0 | 60 | melody | Cell A | A | 3+5 | transpose |

*Extension change: bars 1–4 Cm7, bars 5–8 Cm9. Single field type with transformation.*

---

### CASE 6 — Borderline (4+4 with Motivic Asymmetry)

**Phrase ID:** P06  
**Phrase length:** 8 bars (4+4)  
**Motivic source:** Cell E (m3→M2: C Eb F)  
**Interval logic:** m3, M2  
**Harmonic field:** Field A (bars 1–4), Field A (bars 5–8) — same type, bass register shift in bars 5–8  
**Event-role breakdown:** melody (8), bass (8)  
**Expected:** BORDERLINE — 4+4 allowed if motivic asymmetry; bass shift = transformation

**Why borderline:** 4+4 structure. Second half has transposed motif + bass register shift. May pass if transformation counts.

**Event structure:**

| event_id | bar | beat | dur | pitch/set | role | motivic | field | phrase_group |
|----------|-----|------|-----|-----------|------|---------|-------|--------------|
| S071 | 1 | 0 | 1.0 | 60 | melody | Cell E | A | 4+4 | repeat |
| S072 | 1 | 0 | 1.0 | 36 | bass | Cell E | A | 4+4 | — |
| S073 | 2 | 0 | 1.0 | 63 | melody | Cell E | A | 4+4 | repeat |
| S074 | 3 | 0 | 1.0 | 65 | melody | Cell E | A | 4+4 | repeat |
| S075 | 4 | 0 | 1.0 | 60 | melody | Cell E | A | 4+4 | invert |
| S076 | 5 | 0 | 1.0 | 65 | melody | Cell E | A | 4+4 | transpose |
| S077 | 5 | 0 | 1.0 | 48 | bass | Cell E | A | 4+4 | register shift |
| S078 | 6 | 0 | 1.0 | 68 | melody | Cell E | A | 4+4 | transpose |
| S079 | 7 | 0 | 1.0 | 70 | melody | Cell E | A | 4+4 | transpose |
| S080 | 8 | 0 | 1.0 | 65 | melody | Cell E | A | 4+4 | transpose |

*Bars 1–4: exact + invert. Bars 5–8: transposed P5, bass up octave. Single field; bass shift. 4+4.*

---

### CASE 7 — Borderline (Cell G — Major Triad)

**Phrase ID:** P07  
**Phrase length:** 8 bars (3+3+2)  
**Motivic source:** Cell G (M3→P4: C E G)  
**Interval logic:** M3, P4 — consonant, risk of generic  
**Harmonic field:** Field C (Lydian), Field E (whole-step planing) — 2 distinct  
**Event-role breakdown:** melody (8), bass (6)  
**Expected:** BORDERLINE — Cell G is major triad; may score low on GCE "interval consistency" or "motivic identity"

**Why borderline:** Cell G = C E G (major triad). More consonant than other cells. GCE ensemble=1 (2 roles). May hit 8.5–9.0.

**Event structure:**

| event_id | bar | beat | dur | pitch/set | role | motivic | field | phrase_group |
|----------|-----|------|-----|-----------|------|---------|-------|--------------|
| S081 | 1 | 0 | 1.0 | 60 | melody | Cell G | C | 3+3+2 | repeat |
| S082 | 1 | 0 | 1.0 | 36 | bass | Cell G | C | 3+3+2 | — |
| S083 | 2 | 0 | 1.0 | 64 | melody | Cell G | C | 3+3+2 | repeat |
| S084 | 3 | 0 | 1.0 | 67 | melody | Cell G | C | 3+3+2 | repeat |
| S085 | 4 | 0 | 1.0 | 62 | melody | Cell G | E | 3+3+2 | transpose |
| S086 | 5 | 0 | 1.0 | 66 | melody | Cell G | E | 3+3+2 | transpose |
| S087 | 6 | 0 | 1.0 | 69 | melody | Cell G | E | 3+3+2 | transpose |
| S088 | 7 | 0 | 1.0 | 60 | melody | Cell G | E | 3+3+2 | transpose |
| S089 | 8 | 0 | 1.0 | 64 | melody | Cell G | E | 3+3+2 | transpose |

*Cell G. 3+3+2. Field C + Field E. 2 roles. Risk: generic.*

---

### CASE 8 — Borderline (GCE 9.0 Boundary)

**Phrase ID:** P08  
**Phrase length:** 9 bars (5+4)  
**Motivic source:** Cell B  
**Interval logic:** P4, m2  
**Harmonic field:** Field D (bars 1–5), Field D (bars 6–9) — same type, planing shift  
**Event-role breakdown:** melody (9), bass (9) — 2 roles only  
**Expected:** BORDERLINE — Exactly 2 roles; GCE calibration said melody+bass can hit 9.0

**Why borderline:** 2 roles (melody + bass). Ensemble dimension = 1. Motivic 2, Harmonic 2, Phrase 2, Interval 2, Ensemble 1 → GCE 9.0.

**Event structure:**

| event_id | bar | beat | dur | pitch/set | role | motivic | field | phrase_group |
|----------|-----|------|-----|-----------|------|---------|-------|--------------|
| S090 | 1 | 0 | 1.0 | 60 | melody | Cell B | D | 5+4 | repeat |
| S091 | 1 | 0 | 1.0 | 36 | bass | Cell B | D | 5+4 | — |
| S092 | 2 | 0 | 1.0 | 65 | melody | Cell B | D | 5+4 | repeat |
| S093 | 3 | 0 | 1.0 | 66 | melody | Cell B | D | 5+4 | repeat |
| S094 | 4 | 0 | 1.0 | 60 | melody | Cell B | D | 5+4 | fragment |
| S095 | 5 | 0 | 1.0 | 65 | melody | Cell B | D | 5+4 | fragment |
| S096 | 6 | 0 | 1.0 | 61 | melody | Cell B | D | 5+4 | transpose |
| S097 | 6 | 0 | 1.0 | 37 | bass | Cell B | D | 5+4 | planing shift |
| S098 | 7 | 0 | 1.0 | 66 | melody | Cell B | D | 5+4 | transpose |
| S099 | 8 | 0 | 1.0 | 62 | melody | Cell B | D | 5+4 | transpose |
| S100 | 9 | 0 | 1.0 | 60 | melody | Cell B | D | 5+4 | transpose |

*Single field type (D) but planing shift (root moves). Validator: "same type with transformation" — planing shift may count. 5+4. 2 roles.*

---

## FAIL CANDIDATES (9–12)

---

### CASE 9 — Fail (Monophonic Collapse)

**Phrase ID:** P09  
**Phrase length:** 8 bars (3+5)  
**Motivic source:** Cell A  
**Interval logic:** m3, tt  
**Harmonic field:** Field A, Field D  
**Event-role breakdown:** melody (8) only — no counterline, harmonic_color, or bass  
**Expected:** FAIL — Check 7

**Why fail:** Only melody events. Monophonic collapse.

**Event structure:**

| event_id | bar | beat | dur | pitch/set | role | motivic | field | phrase_group |
|----------|-----|------|-----|-----------|------|---------|-------|--------------|
| S101 | 1 | 0 | 1.0 | 60 | melody | Cell A | A | 3+5 | repeat |
| S102 | 2 | 0 | 1.0 | 63 | melody | Cell A | A | 3+5 | repeat |
| S103 | 3 | 0 | 1.0 | 69 | melody | Cell A | A | 3+5 | repeat |
| S104 | 4 | 0 | 1.0 | 65 | melody | Cell A | D | 3+5 | transpose |
| S105 | 5 | 0 | 1.0 | 68 | melody | Cell A | D | 3+5 | transpose |
| S106 | 6 | 0 | 1.0 | 63 | melody | Cell A | D | 3+5 | transpose |
| S107 | 7 | 0 | 1.0 | 69 | melody | Cell A | D | 3+5 | transpose |
| S108 | 8 | 0 | 1.0 | 60 | melody | Cell A | D | 3+5 | transpose |

*Melody only. No other roles.*

---

### CASE 10 — Fail (Multiple Violations)

**Phrase ID:** P10  
**Phrase length:** 16 bars (4+4+4+4)  
**Motivic source:** None — scalar bebop  
**Interval logic:** C D E F G A B C (scale); ii–V–I  
**Harmonic field:** Functional (Dm7 G7 Cm7 etc.)  
**Event-role breakdown:** melody (16), harmonic_color (8) — but harmony is chord-only support  
**Expected:** FAIL — Checks 1, 2, 3, 4, 5, 8

**Why fail:** Scalar; ii–V–I; 4+4+4+4; no cells; generic.

**Event structure:**

| event_id | bar | beat | dur | pitch/set | role | motivic | field | phrase_group |
|----------|-----|------|-----|-----------|------|---------|-------|--------------|
| S109 | 1 | 0 | 0.5 | 62 | melody | — | — | 4+4+4+4 | scalar |
| S110 | 1 | 0.5 | 0.5 | 64 | melody | — | — | 4+4+4+4 | scalar |
| S111 | 1 | 1 | 0.5 | 65 | melody | — | — | 4+4+4+4 | scalar |
| S112 | 1 | 1.5 | 0.5 | 67 | melody | — | — | 4+4+4+4 | scalar |
| S113 | 1 | 0 | 2.0 | [50,62,65,69] | harmonic_color | — | — | 4+4+4+4 | Dm7 |
| S114 | 2 | 0 | 2.0 | [55,59,62,65] | harmonic_color | — | — | 4+4+4+4 | G7 |
| S115 | 3 | 0 | 2.0 | [48,51,55,60] | harmonic_color | — | — | 4+4+4+4 | Cm7 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

*Scalar run C D E F G...; ii–V–I; 4+4+4+4; no motivic source.*

---

### CASE 11 — Fail (Literal Repeat — Loop)

**Phrase ID:** P11  
**Phrase length:** 16 bars (AABA, 4+4+4+4)  
**Motivic source:** Cell A  
**Interval logic:** m3, tt  
**Harmonic field:** Field A  
**Event-role breakdown:** melody (16), harmonic_color (8)  
**Expected:** FAIL — Check 6 — A' identical to A

**Why fail:** Bars 1–4 = A. Bars 13–16 = A' = identical (same pitches, rhythm, harmony). Literal repeat.

**Event structure:**

| event_id | bar | beat | dur | pitch/set | role | motivic | field | section |
|----------|-----|------|-----|-----------|------|---------|-------|---------|
| S116 | 1 | 0 | 1.0 | 60 | melody | Cell A | A | A |
| S117 | 1 | 0 | 1.0 | [48,63,69] | harmonic_color | Cell A | A | A |
| S118 | 2 | 0 | 1.0 | 63 | melody | Cell A | A | A |
| S119 | 3 | 0 | 1.0 | 69 | melody | Cell A | A | A |
| S120 | 4 | 0 | 1.0 | 60 | melody | Cell A | A | A |
| S121–S124 | 5–8 | ... | ... | ... | ... | Cell A | A | B (bridge) |
| S125 | 13 | 0 | 1.0 | 60 | melody | Cell A | A | A' |
| S126 | 13 | 0 | 1.0 | [48,63,69] | harmonic_color | Cell A | A | A' |
| S127 | 14 | 0 | 1.0 | 63 | melody | Cell A | A | A' |
| S128 | 15 | 0 | 1.0 | 69 | melody | Cell A | A | A' |
| S129 | 16 | 0 | 1.0 | 60 | melody | Cell A | A | A' |

*A' (bars 13–16) = A (bars 1–4) identically. Literal repeat.*

---

### CASE 12 — Fail (Single Field, No Transformation, 4+4)

**Phrase ID:** P12  
**Phrase length:** 8 bars (4+4)  
**Motivic source:** Cell A  
**Interval logic:** m3, tt  
**Harmonic field:** Field A only — no transformation, no extension change  
**Event-role breakdown:** melody (8), harmonic_color (4)  
**Expected:** FAIL — Check 3 (4+4 without asymmetry), Check 5 (single field, no transformation)

**Why fail:** 4+4 with no harmonic or motivic asymmetry between halves. Single field type with no transformation.

**Event structure:**

| event_id | bar | beat | dur | pitch/set | role | motivic | field | phrase_group |
|----------|-----|------|-----|-----------|------|---------|-------|--------------|
| S130 | 1 | 0 | 1.0 | 60 | melody | Cell A | A | 4+4 | repeat |
| S131 | 1 | 0 | 1.0 | [48,63,69] | harmonic_color | Cell A | A | 4+4 | — |
| S132 | 2 | 0 | 1.0 | 63 | melody | Cell A | A | 4+4 | repeat |
| S133 | 3 | 0 | 1.0 | 69 | melody | Cell A | A | 4+4 | repeat |
| S134 | 4 | 0 | 1.0 | 60 | melody | Cell A | A | 4+4 | repeat |
| S135 | 5 | 0 | 1.0 | 60 | melody | Cell A | A | 4+4 | repeat |
| S136 | 5 | 0 | 1.0 | [48,63,69] | harmonic_color | Cell A | A | 4+4 | — |
| S137 | 6 | 0 | 1.0 | 63 | melody | Cell A | A | 4+4 | repeat |
| S138 | 7 | 0 | 1.0 | 69 | melody | Cell A | A | 4+4 | repeat |
| S139 | 8 | 0 | 1.0 | 60 | melody | Cell A | A | 4+4 | repeat |

*Bars 1–4 = bars 5–8. Same Cm7. No transformation. 4+4. Single field.*

---

## SUMMARY

| Case | ID | Type | Phrase | Fields | Roles | Expected |
|------|-----|------|--------|--------|-------|----------|
| 1 | P01 | Strong pass | 3+5 | A+D | 3 | PASS |
| 2 | P02 | Strong pass | 5+4 | D+F | 2 | PASS |
| 3 | P03 | Strong pass | 4+4+3 | A+C+F | 3 | PASS |
| 4 | P04 | Strong pass | 7+5 | A+G | 3 | PASS |
| 5 | P05 | Borderline | 3+5 | A (ext) | 2 | BORDERLINE |
| 6 | P06 | Borderline | 4+4 | A (shift) | 2 | BORDERLINE |
| 7 | P07 | Borderline | 3+3+2 | C+E | 2 | BORDERLINE |
| 8 | P08 | Borderline | 5+4 | D (shift) | 2 | BORDERLINE |
| 9 | P09 | Fail | 3+5 | A+D | 1 | FAIL |
| 10 | P10 | Fail | 4+4+4+4 | functional | 2 | FAIL |
| 11 | P11 | Fail | AABA | A | 2 | FAIL |
| 12 | P12 | Fail | 4+4 | A | 2 | FAIL |
