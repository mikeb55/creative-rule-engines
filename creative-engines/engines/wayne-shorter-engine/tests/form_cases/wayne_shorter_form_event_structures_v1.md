# Wayne Shorter Form Event Structures V1

**Purpose:** Compact event-schema representations for each form case.

**Date:** 2026-03-15

**Schema reference:** shorter_event_schema.md

---

## FC01 — Asymmetrical Phrase Chain (3+5 → 4+4 → 7+5)

```
section_id: A
phrase_groups:
  - phrase_group: "3+5"   bars: 1-8   harmonic_field: Field A   motivic_source: Cell A
  - phrase_group: "4+4"   bars: 9-16  harmonic_field: Field D   motivic_source: Cell A (invert)
  - phrase_group: "7+5"   bars: 17-28 harmonic_field: Field F   motivic_source: Cell A (fragment, extend)

melodic_role:
  - bars 1-8:   Cell A, transformation: repeat
  - bars 9-16:  Cell A, transformation: invert
  - bars 17-28: Cell A, transformation: fragment, extend

secondary_roles:
  - counterline: Cell A fragment, delayed_entry, bars 1-28
  - harmonic_color: Field A/D/F voicings
  - bass: pedal bars 17-28
```

---

## FC02 — Episodic (5+4 → 6+3 → 8)

```
section_id: A
phrase_groups:
  - phrase_group: "5+4"   bars: 1-9   harmonic_field: Field C   motivic_source: Cell B
  - phrase_group: "6+3"   bars: 10-18 harmonic_field: Field E   motivic_source: Cell B (transpose P4)
  - phrase_group: "3+5"   bars: 19-26 harmonic_field: Field A   motivic_source: Cell B (invert, fragment)

melodic_role:
  - bars 1-9:   Cell B, transformation: repeat
  - bars 10-18: Cell B, transformation: transpose
  - bars 19-26: Cell B, transformation: invert, fragment

secondary_roles:
  - counterline: Cell B derived, bars 1-26
  - bass: motivic bars 10-18
```

---

## FC03 — AABA Variant (Asymmetrical A)

```
section_id: A | B | A'
phrase_groups:
  - A:  phrase_group: "3+5" bars: 1-8   harmonic_field: Field A   motivic_source: Cell C
  - A:  phrase_group: "3+5" bars: 9-16  harmonic_field: Field A   motivic_source: Cell C (repeat)
  - B:  phrase_group: "4+3+4" bars: 17-27 harmonic_field: Field G   motivic_source: Cell C (invert)
  - A': phrase_group: "5+3" bars: 28-35 harmonic_field: Field A   motivic_source: Cell C (transpose m3)

melodic_role:
  - A:  Cell C, transformation: repeat
  - B:  Cell C, transformation: invert
  - A': Cell C, transformation: transpose (not literal A return)

secondary_roles:
  - counterline: Cell C derived
  - harmonic_color: Field A, Field G
  - bass: throughout
```

---

## FC04 — Narrative Phrase Sequence (7+5 → 4+4+3 → 3+3+2)

```
section_id: A
phrase_groups:
  - phrase_group: "7+5"     bars: 1-12  harmonic_field: Field D   motivic_source: Cell D
  - phrase_group: "4+4+3"   bars: 13-23 harmonic_field: Field F    motivic_source: Cell D (invert)
  - phrase_group: "3+3+2"  bars: 24-31 harmonic_field: Field B    motivic_source: Cell D (fragment, extend)

melodic_role:
  - bars 1-12:  Cell D, transformation: repeat
  - bars 13-23: Cell D, transformation: invert (bars 17-20)
  - bars 24-31: Cell D, transformation: fragment, extend

secondary_roles:
  - counterline: Cell D derived
  - harmonic_color: Field D/F/B
  - bass: throughout
```

---

## FC05 — Episodic with Harmonic Field Rotation

```
section_id: A
phrase_groups:
  - phrase_group: "4+3"  bars: 1-7   harmonic_field: Field A   motivic_source: Cell A
  - phrase_group: "5+4"  bars: 8-16  harmonic_field: Field D   motivic_source: Cell A (transpose)
  - phrase_group: "4"    bars: 17-20 harmonic_field: Field C   motivic_source: Cell A (fragment)

melodic_role:
  - bars 1-7:   Cell A, transformation: repeat
  - bars 8-16:  Cell A, transformation: transpose
  - bars 17-20: Cell A, transformation: fragment

secondary_roles:
  - bass: throughout (2 roles only; strong motivic + harmonic)
```

---

## FC06 — 4+4 with Explicit Asymmetry

```
section_id: A
phrase_groups:
  - phrase_group: "4+4" bars: 1-8   harmonic_field: Field A (1-4) → Field D (5-8)   motivic_source: Cell B → Cell B (invert)
  - phrase_group: "4+4" bars: 9-16  harmonic_field: Field C (1-4) → Field F (5-8)   motivic_source: Cell C → Cell C (transpose)

melodic_role:
  - bars 1-4:   Cell B; bars 5-8:   Cell B invert (motivic transformation between halves)
  - bars 9-12:  Cell C; bars 13-16: Cell C transpose (harmonic field shift)

secondary_roles:
  - counterline: Cell B/C derived
  - bass: throughout
```

---

## FC07 — Modular Chain (No Literal Repeat)

```
section_id: A
phrase_groups:
  - phrase_group: "3+3+2" bars: 1-8   harmonic_field: Field A   motivic_source: Cell A, Cell B
  - phrase_group: "5+5"   bars: 9-18  harmonic_field: Field E   motivic_source: Cell A+B combined (transpose, extend)

melodic_role:
  - bars 1-8:   Cell A fragment, Cell B fragment
  - bars 9-18:  Combined motif, transformation: transpose, extend (no literal repeat of phrase 1)

secondary_roles:
  - counterline: Cell A/B derived
  - harmonic_color: Field A, Field E
  - bass: throughout
```

---

## FC08 — Short Complete Form (Intro–Theme–Development–Closure)

```
section_id: intro | A | development | closure
phrase_groups:
  - intro:      phrase_group: "4"    bars: 1-4   harmonic_field: Field F   motivic_source: Cell D (fragment)
  - theme:      phrase_group: "5+4"  bars: 5-13  harmonic_field: Field A   motivic_source: Cell D
  - development: phrase_group: "4+4+3" bars: 14-24 harmonic_field: Field D   motivic_source: Cell D (invert, extend)
  - closure:    phrase_group: "4"   bars: 25-28 harmonic_field: Field F   motivic_source: Cell D (fragment)

melodic_role:
  - intro: Cell D fragment
  - theme: Cell D statement
  - development: Cell D invert, extend
  - closure: Cell D fragment

secondary_roles:
  - counterline, harmonic_color, bass, rhythmic_punctuation
```

---

## FC09 — 12-Bar Blues Variant (7+5)

```
section_id: A
phrase_groups:
  - phrase_group: "7+5" bars: 1-12 harmonic_field: Field G   motivic_source: Cell A

melodic_role:
  - bars 1-7:   Cell A, transformation: repeat
  - bars 8-12:  Cell A, transformation: transpose (tt), fragment

secondary_roles:
  - counterline: Cell A derived
  - bass: Field G chromatic
```

---

## FC10 — Modal Vamp with Motivic Development

```
section_id: A
phrase_groups:
  - phrase_group: "4+4" bars: 1-8   harmonic_field: Field A   motivic_source: Cell C
  - phrase_group: "4+4" bars: 9-16  harmonic_field: Field A   motivic_source: Cell C (extension Cm7→Cm9)

melodic_role:
  - bars 1-4:   Cell C; bars 5-8:   Cell C invert (motivic transformation between halves)
  - bars 9-12:  Cell C transpose; bars 13-16: Cell C fragment (motivic transformation between halves)

secondary_roles:
  - harmonic_color: Field A
  - bass: pedal
```

---

## EVENT STRUCTURE SUMMARY

| Form ID | Phrase Groups | Sections | Roles |
|---------|---------------|----------|-------|
| FC01 | 3+5, 4+4, 7+5 | A | melody, counterline, harmonic_color, bass |
| FC02 | 5+4, 6+3, 3+5 | A | melody, counterline, bass |
| FC03 | 3+5×2, 4+3+4, 5+3 | A, B, A' | melody, counterline, harmonic_color, bass |
| FC04 | 7+5, 4+4+3, 3+3+2 | A | melody, counterline, harmonic_color, bass |
| FC05 | 4+3, 5+4, 4 | A | melody, bass |
| FC06 | 4+4, 4+4 | A | melody, counterline, bass |
| FC07 | 3+3+2, 5+5 | A | melody, counterline, harmonic_color, bass |
| FC08 | 4, 5+4, 4+4+3, 4 | intro, A, dev, closure | melody, counterline, harmonic_color, bass, rhythmic_punctuation |
| FC09 | 7+5 | A | melody, counterline, bass |
| FC10 | 4+4, 4+4 | A | melody, harmonic_color, bass |
