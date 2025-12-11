# ✏️ Engraving Rules – Sibelius-Focused

Rules for generating **Sibelius-friendly** MusicXML.

## 1. Staff & Clefs

- Piano:
  - 2 staves: RH treble, LH bass.
  - No duplicate clefs on separate staves.
- No extra or hidden staves unless explicitly requested.

## 2. Voices & Rhythms

- Single melodic voice per staff where possible.
- Avoid multiple voices unless there is a clear polyphonic need.
- Rhythms must add up to full bar value; no over/underfilled measures.

## 3. Chord Symbols

- Standard jazz syntax: Cmaj7(#11), G7alt, Fm9, etc.
- Above the RH staff, left-aligned to beat positions.

## 4. Notation Cleanliness

- Avoid excessive tuplets unless musically essential.
- Avoid stacked rhythms that are hard to read.
- Use rests instead of tied zero-length values.

## 5. Phrasing & Dynamics

- Slurs for phrasing, not every interval.
- Dynamics at logical structural points: phrase begins, climaxes.

## 6. Layout (Post-Import)

- Leave final page layout/cast-off to Sibelius, but avoid:
  - Overly cramped measures.
  - Irrational tuplets or odd time mis-beaming.

Use this as the engraving reference whenever generating .musicxml.


