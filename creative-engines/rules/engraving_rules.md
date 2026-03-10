# Engraving Rules

Sibelius-friendly MusicXML generation rules.

## Staff & Clefs

- Piano: 2 staves (RH treble, LH bass)
- No duplicate or hidden staves unless explicitly requested

## Voices & Rhythms

- Single melodic voice per staff where possible
- Rhythms must sum to exact bar duration
- No over/underfilled measures

## Chord Symbols

- Standard jazz syntax: Cmaj7(#11), G7alt, Fm9, etc.
- Above RH staff, left-aligned to beat positions

## Notation Cleanliness

- Avoid excessive tuplets unless musically essential
- Avoid stacked rhythms that are hard to read
- Use rests instead of tied zero-length values

## Phrasing & Dynamics

- Slurs for phrasing, not every interval
- Dynamics at logical structural points

## Reference

See `../../music/engraving-rules-sibelius.md` for full Sibelius-focused rules.
