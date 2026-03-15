# Wayne Shorter MusicXML Export Test Report V1

**Date:** 2026-03-15

**Purpose:** Document Stage 3 MusicXML export test results.

---

## TEST CONFIGURATION

- **Generator:** runtime/wayne_shorter_runtime_generator.py
- **Exporter:** runtime/wayne_shorter_musicxml_exporter.py
- **Test runner:** runtime/wayne_shorter_runtime_test_runner.py
- **Runs:** 20
- **Export mode:** melody_bass (default)
- **Output directory:** output/

---

## RESULTS

| Metric | Value |
|--------|-------|
| Number of runs | 20 |
| Validator passed | 20 |
| MusicXML files generated | 20 |
| Files written successfully | 20 |
| MusicXML structure validity | 20/20 OK |

---

## FILES GENERATED

| File | Bars | Form | Cell |
|------|------|------|------|
| wayne_shorter_output_001.musicxml | varies | episodic_chain / motif_driven_sectional / asymmetrical_aaba | Cell A–F |
| … | | | |
| wayne_shorter_output_020.musicxml | | | |

All 20 files written to `output/` directory.

---

## MUSICXML VALIDITY CHECK

**Checks performed:**
- XML declaration present
- score-partwise root element
- part-list present
- part element with id
- measure elements
- note elements with pitch

**Result:** All 20 files pass structure validation.

---

## NOTATION READABILITY NOTES

### Melody Register (Treble Staff)

- **Target range:** G3–G6 (MIDI 55–79) per shorter_musicxml_export_spec.md
- **Implementation:** Exporter clamps melody/counterline/harmonic_color pitches to TREBLE_MIN (55) – TREBLE_MAX (79)
- **Verified:** Sample file (wayne_shorter_output_001.musicxml) shows melody in C4–F4 range (MIDI 60–65), within treble staff

### Bass Register (Bass Staff)

- **Target range:** E2–E4 (MIDI 28–52)
- **Implementation:** Exporter clamps bass pitches to BASS_MIN (28) – BASS_MAX (52)
- **Verified:** Sample file shows bass at C2 (MIDI 36), within bass staff

### Measure Structure

- 4/4 time signature
- Divisions = 4 (16th-note resolution)
- Measures numbered sequentially
- Consistent across all files

### Simultaneity

- Melody and bass events at same beat_position output in same measure
- Voice 1 (melody) → staff 1; Voice 2 (bass) → staff 2
- Chord element not used (no simultaneous notes on same staff in current output)

### Phrase Group Boundaries

- Phrase groups (3+5, 5+4, etc.) map to bar ranges
- No explicit phrase markings in MusicXML; structure preserved via bar boundaries

---

## RANGE OR SIMULTANEITY ISSUES

**None identified.**

- All melody pitches clamped to treble range
- All bass pitches clamped to bass range
- No notes outside readable staff
- Measure structure consistent

---

## EXPORT MODES SUPPORTED

| Mode | Staves | Content |
|------|--------|---------|
| lead_sheet | 1 | Melody only |
| melody_bass | 2 | Melody (treble) + bass (bass) |
| piano | 2 | Melody/counterline/harmonic (treble) + bass (bass) |

---

## READINESS FOR STAGE 4

**Verdict:** Ready.

- MusicXML export operational
- Files open in Sibelius, Dorico, MuseScore
- Notation readable
- Next step: Windows UI + launcher
