# Wayne Shorter Engine — Notation Accuracy Test V1

**Date:** 2026-03-15

**Purpose:** Assess notation quality after repair pass. 5 fresh outputs generated.

---

## TEST OUTPUTS

| File | Export Mode | Cell | Form |
|------|-------------|------|------|
| wayne_shorter_output_029.musicxml | lead_sheet | varies | episodic |
| wayne_shorter_output_030.musicxml | melody_bass | varies | episodic |
| wayne_shorter_output_031.musicxml | piano | varies | episodic |
| wayne_shorter_output_032.musicxml | melody_bass | varies | episodic |
| wayne_shorter_output_033.musicxml | lead_sheet | varies | episodic |

---

## ASSESSMENT PER FILE

### wayne_shorter_output_029 (lead_sheet)

| Criterion | Result | Notes |
|-----------|--------|-------|
| Treble clef readability | PASS | Melody in readable range (G3–G6) |
| Pitch spelling consistency | PASS | Context-aware from harmonic field |
| Accidental logic | PASS | Field-based preference (flats for Dorian/Phrygian) |
| Bass staff | N/A | Lead sheet = melody only |
| Metadata cleanliness | PASS | Single work-title, clean part-name "Melody" |
| Overall notation plausibility | PASS | Musically readable |

**Verdict:** PASS

---

### wayne_shorter_output_030 (melody_bass)

| Criterion | Result | Notes |
|-----------|--------|-------|
| Treble clef readability | PASS | Melody on staff 1, readable range |
| Pitch spelling consistency | PASS | Db (alter -1) used in flat-key context |
| Accidental logic | PASS | Key fifths=-2 (2 flats); spelling matches |
| Bass staff readability | PASS | C2 on bass staff; clear |
| Metadata cleanliness | PASS | "Piano" part, single title |
| Overall notation plausibility | PASS | Grand staff layout correct |

**Verdict:** PASS

---

### wayne_shorter_output_031 (piano)

| Criterion | Result | Notes |
|-----------|--------|-------|
| Treble clef readability | PASS | Melody on staff 1 |
| Pitch spelling consistency | PASS | G# (alter 1) in Lydian context |
| Accidental logic | PASS | Key fifths=1 (1 sharp) |
| Bass staff readability | PASS | Bass on staff 2 |
| Metadata cleanliness | PASS | "Piano" part |
| Overall notation plausibility | PASS | Same as melody_bass (no counterline yet) |

**Verdict:** PASS

---

### wayne_shorter_output_032 (melody_bass)

| Criterion | Result | Notes |
|-----------|--------|-------|
| Treble clef readability | PASS | |
| Pitch spelling consistency | PASS | |
| Accidental logic | PASS | |
| Bass staff readability | PASS | |
| Metadata cleanliness | PASS | |
| Overall notation plausibility | PASS | |

**Verdict:** PASS

---

### wayne_shorter_output_033 (lead_sheet)

| Criterion | Result | Notes |
|-----------|--------|-------|
| Treble clef readability | PASS | |
| Pitch spelling consistency | PASS | |
| Accidental logic | PASS | |
| Bass staff | N/A | |
| Metadata cleanliness | PASS | |
| Overall notation plausibility | PASS | |

**Verdict:** PASS

---

## SUMMARY

| File | Verdict |
|------|---------|
| 029 (lead_sheet) | PASS |
| 030 (melody_bass) | PASS |
| 031 (piano) | PASS |
| 032 (melody_bass) | PASS |
| 033 (lead_sheet) | PASS |

**Overall:** 5/5 PASS
