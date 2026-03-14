# Plan: Idiomatic MusicXML for Sibelius (Guitar, Piano, Big Band)

**Goal:** Produce MusicXML files that open correctly in Sibelius and display idiomatic chordal notation for guitar and piano.

---

## Research Summary

### Sibelius Compatibility

| Requirement | Finding |
|-------------|---------|
| **Format** | Sibelius can **only** open **partwise** MusicXML (not timewise). ✓ We use partwise. |
| **Version** | Some Sibelius versions reject MusicXML 4.0 with "This MusicXML file uses a newer version than Sibelius can import." Beatrice export uses **MusicXML 3.0**. |
| **Action** | Add MusicXML 3.0 export option for maximum Sibelius compatibility. |

### Piano MusicXML Requirements

| Element | Purpose | Current | Fix |
|---------|---------|---------|-----|
| `<staves>2</staves>` | Declare grand staff in part attributes | Missing | Add in measure 1 attributes |
| `<staff>1</staff>` / `<staff>2</staff>` | Assign each note to treble or bass | ✓ Present | Keep |
| `<voice>1</voice>` / `<voice>2</voice>` | Distinguish RH vs LH for correct stem/beam handling | **Missing** | Add voice 1 = RH, voice 2 = LH |
| `<chord/>` | Simultaneous notes | ✓ Present | Keep |
| Part name | Should be "Piano" not "Part 1" | Wrong | Use target-specific part names |
| Note ordering | Chord notes: first = highest pitch, then descending; all same offset | ✓ Grouped | Verify order (top-down for stems) |

### Guitar MusicXML Requirements

| Element | Purpose | Current | Fix |
|---------|---------|---------|-----|
| Part name | Should be "Guitar" not "Part 1" | Wrong | Use "Guitar" |
| Clef | Treble, line 2 | ✓ Present | Keep |
| `<chord/>` | Simultaneous notes | ✓ Present | Keep |
| `<technical><fret>`, `<string>` | Optional TAB/fingering info | Missing | Optional: add for playability |
| Range | E2 (40) to E6 (88) typical | ✓ Clamped | Keep |

### Big Band Template (Beatrice)

Beatrice MusicXML structure:
- **28 parts**: Alto Sax (2), Tenor Sax (2), Bari Sax, Trumpet (4), Trombone (many), Piano, Acoustic Bass, Drum Set, Acoustic Guitar (2)
- **Part groups**: `<part-group>` with bracket/brace for sections
- **Part metadata**: `part-name`, `part-abbreviation`, `score-instrument`, `instrument-sound`
- **Transpositions**: Trumpet in Bb, etc. (via `transpose` in attributes)
- **Version**: MusicXML 3.0, DTD partwise

For Monk Composer "Big Band Sketch" we use a **reduced template** (6 parts): Trumpet 1, Alto Sax 1, Tenor Sax 1, Trombone 1, Piano, Bass — derived from Beatrice structure but simplified.

---

## Implementation Plan

### Phase 1: Sibelius-Compatible Base (High Priority)

1. **MusicXML version option**
   - Add export option: MusicXML 3.0 (Sibelius-safe) vs 4.0 (default)
   - Use DTD `MusicXML 3.0 Partwise` and `version="3.0"` when selected
   - 3.0/4.0 differences: minimal for our use; avoid 4.0-only elements

2. **Part names**
   - Guitar: `<part-name>Guitar</part-name>`
   - Piano: `<part-name>Piano</part-name>`
   - Big band: use template names (Trumpet 1, Alto Sax 1, etc.)

3. **Piano: `<staves>2</staves>`**
   - In first measure attributes for piano, add `<staves>2</staves>` before clefs
   - Required for correct grand-staff interpretation in Sibelius

4. **Piano: `<voice>` elements**
   - RH notes: `<voice>1</voice>`
   - LH notes: `<voice>2</voice>`
   - Ensures correct stem direction and beam grouping

### Phase 2: Idiomatic Chordal Content (v0.6.0)

- ✓ Internal chord-event model (`musicEvents.ts`) — events with pitches[], staff, voice, role
- ✓ Guitar voicing engine — shells, guide-tone dyads, compact triads; at least one chord per 2 bars
- ✓ Piano voicing engine — two-staff, LH shells, RH melody+voicings; phrase breathing
- ✓ Piano RH harmonization (chord tones under melody)
- ✓ Guitar mixed texture (dyads, triads, shells)
- ✓ Chord grouping by offset+duration+voice for `<chord/>` tags

### Phase 3: Beatrice Big Band Template Integration

1. **Parse Beatrice MusicXML**
   - Extract part-list (part IDs, names, abbreviations)
   - Extract part-groups (saxes, brass, rhythm)
   - Extract transpositions
   - Store as normalized template JSON/TS

2. **Template options**
   - **Reduced** (6 parts): Trumpet 1, Alto Sax 1, Tenor Sax 1, Trombone 1, Piano, Bass — for sketches
   - **Full** (from Beatrice): Full orchestration structure — for expansion

3. **Use template for export**
   - Part order, names, transpositions from template
   - Strip pitched/rhythmic content from template; use only structure

### Phase 4: Polish (Lower Priority)

1. **Guitar**
   - Optional: `<notations><technical><fret>`, `<string>` for fingering hints
   - Ensure note order in chords: top note first (for stem direction)

2. **Piano**
   - Stem direction: `<stem>up</stem>` for RH, `<stem>down</stem>` for LH (Sibelius may infer; verify)
   - Beam groups: `<beam number="1">begin</beam>`, etc. (Sibelius may infer)

3. **Chord symbols**
   - Add `<harmony>` elements above staff for chord symbols (Cmaj7, G7, etc.) if desired for lead-sheet style

---

## File Changes Required

| File | Changes |
|------|---------|
| `musicxml.ts` | Part names, staves, voice, MusicXML 3.0 option |
| `bigBandTemplate.ts` | Integrate Beatrice-derived structure; add parser for external MusicXML |
| `types.ts` or export options | Add `musicXmlVersion?: '3.0' \| '4.0'` |
| New: `beatriceTemplateParser.ts` | Parse Beatrice MusicXML to extract template (optional) |

---

## Implemented (Phase 1)

- ✓ MusicXML 3.0 default for Sibelius compatibility
- ✓ Part names: Guitar, Piano (not "Part 1")
- ✓ Piano: `<staves>2</staves>` in attributes
- ✓ Piano: `<voice>1</voice>` (RH), `<voice>2</voice>` (LH)
- ✓ Piano: Chord grouping by voice (RH and LH chords kept separate)
- ✓ Big band: Part abbreviations (Tpt. 1, Alto Sax., etc.)
- ✓ Script: `parse-beatrice-template.ts` to extract template from Beatrice MusicXML

## Verification Checklist

After implementation, verify in Sibelius:

- [ ] Guitar: Opens without errors; chord shapes display correctly
- [ ] Piano: Grand staff displays; RH and LH distinct; chords not flattened
- [ ] Big band: 6 parts (or template count); correct names; no import errors
- [ ] MusicXML 3.0: Imports in older Sibelius without version warning
- [ ] Chord events: Simultaneous notes appear as chords, not separate notes

---

## References

- [MusicXML 4.0 Notation Basics](https://www.w3.org/2021/06/musicxml40/tutorial/notation-basics/)
- [MusicXML chord element](https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/chord/)
- [Sibelius MusicXML import](https://www.sibeliusforum.com/viewtopic.php?t=72404)
- Beatrice: `V22 Beatrice - Bora Version - 13 March 2026.musicxml` (MusicXML 3.0, Sibelius export)
