# Wayne Shorter Engine — Timing Root Cause V1

**Date:** 2026-03-15

---

## EXACT ROOT CAUSE

The exporter emits notes in sort order (beat_position, staff_order) but **MusicXML is strictly sequential**: each note/rest advances an implicit cursor by its duration. The current logic:

1. **Interleaves melody and bass** — Sorts by (beat_position, staff_order) so melody events come before bass when they share a beat, but then emits them in that mixed order. The cursor advances with each note. A bass note at beat 0 is emitted *after* melody notes at beats 0 and 1.5, so it appears at the wrong time.

2. **No rest/forward for gaps** — Melody has notes at beat 0 (duration 1) and beat 1.5 (duration 1). After the first note, cursor advances to 4 divisions. The next note is at beat 1.5 = 6 divisions. A rest or forward of 2 divisions is required but never emitted.

3. **No backup between voices** — When switching from RH (melody) to LH (bass), the cursor is at the end of the melody. Bass must start at measure position 0. A `<backup>` of full measure duration is required but never emitted.

4. **No measure duration validation** — Each voice must sum to exactly `divisions * beats * 4 / beat_type` for the measure. No validation or fill is performed.

---

## FUNCTIONS RESPONSIBLE

| Function | Responsibility | Issue |
|----------|----------------|--------|
| `_group_events_by_measure` | Groups by bar, sorts by (beat_position, staff_order) | Sort order is wrong for MusicXML: we need per-voice, per-onset ordering, not interleaved |
| `_build_measure_notes` | Emits note elements in sequence | Emits interleaved notes; no rests for gaps; no backup between voices |
| `events_to_musicxml` | Orchestrates measure build | No measure duration logic; no time signature parameterization |
| `_measure_attributes` | Hardcodes 4/4, divisions=4 | No support for other time signatures |

---

## EXAMPLE OF CURRENT BAD MEASURE LOGIC

**Measure 1, 4/4, 16 divisions:**

| Event | Role | Beat | Duration | Divisions |
|-------|------|------|----------|-----------|
| 1 | melody | 0.0 | 1.0 | 4 |
| 2 | melody | 1.5 | 1.0 | 4 |
| 3 | bass | 0.0 | 2.0 | 8 |

**Current emission order:** 1, 2, 3 (sorted by beat, then melody before bass)

**What actually happens in MusicXML:**
- Note 1: cursor 0→4
- Note 2: cursor 4→8 (but note 2 should start at beat 1.5 = 6! We need rest 2 first)
- Note 3: cursor 8→16 (but bass should be at 0. We need backup 16, then write bass)

**Correct emission:**
1. RH voice: note at 0 (divs 4), rest (divs 2), note at 1.5 (divs 4), rest to fill measure (divs 6)
2. `<backup>` 16
3. LH voice: note at 0 (divs 8), rest to fill (divs 8)
