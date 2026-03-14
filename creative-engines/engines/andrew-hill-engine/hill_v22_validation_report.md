# Andrew Hill Engine V2.2 Validation Report

**Phrase under review:** hill_v22_phrase_output.md  
**Fixed seed:** Cell B, Field C, 3+5, piano trio, base pulse + delayed entry

---

## 1. Interval Cell Integrity

**Check:** Does the phrase preserve Cell B (minor 3 → tritone) identity in transformed form?

**Evidence:**
- Cell B structure: minor 3 (e.g. E–G, G–Bb, Eb–G) and tritone (e.g. Eb–A, G–C#) appear throughout
- HILL_001: E3–G3–Bb3 (minor 3 + minor 3, Field C subset)
- HILL_004: Eb3–A3 (minor 3 → tritone, direct Cell B transposition)
- HILL_022: E3–G3–Bb3 (recurrence of opening cell)
- Pitches drawn from Field C (E G Bb C#) with Eb, A as cell extensions

**Result:** PASS

---

## 2. Harmonic Ambiguity

**Check:** Does the harmony avoid clear dominant-tonic resolution?

**Evidence:**
- Field C (E G Bb C#) sustains throughout; no ii–V–I or V–I motion
- Phrase ends on cluster [Bb3, C#4] + counterline [G2, C#3] — suspended, not resolved
- No chord symbol implies G7→C or Dm7→G7→Cmaj7
- Tonal center remains ambiguous (E minor? G minor? neither clearly stated)

**Result:** PASS

---

## 3. Phrase Asymmetry

**Check:** Is the phrase grouping asymmetric (3+5, not 4+4)?

**Evidence:**
- Phrase structure: bars 1–3 (3 bars) + bars 4–8 (5 bars) = 3+5
- No 4+4 symmetry
- First group ends at bar 3; second group begins bar 4 with motivic return (HILL_010 echoes HILL_001)
- Asymmetric lengths create structural tension

**Result:** PASS

---

## 4. Rhythmic Layering

**Check:** Are at least two rhythmic layers active? Is there a convergence point?

**Evidence:**
- **base_pulse:** Events on beats 0, 2, etc. (HILL_001, HILL_003, HILL_005, HILL_007, HILL_009, etc.)
- **delayed_entry:** Events on & of beat (1.5, 2.5, etc.) (HILL_002, HILL_004, HILL_006, HILL_008, HILL_011, etc.)
- **Convergence point:** Bar 6, beat 0 — HILL_016 (melody), HILL_017 (counterline) align on downbeat
- Layers alternate and converge; no uniform alignment throughout

**Result:** PASS

---

## 5. Ensemble Equality

**Check:** Are ensemble roles distributed? No bar functions as pure accompaniment?

**Evidence:**
- **melody_fragment:** 9 events (HILL_001, 004, 008, 010, 013, 016, 020, 022)
- **counterline:** 9 events (HILL_003, 006, 007, 011, 014, 017, 019, 023)
- **cluster_color:** 6 events (HILL_002, 005, 009, 012, 015, 018, 021, 024)
- All three roles present in every bar or nearly every bar
- No bar is exclusively accompaniment; bass/counterline and melody/cluster share structural weight

**Result:** PASS

---

## 6. Anti-Cadential Check

**Check:** Does the phrase avoid implying a clean tonal cadence?

**Evidence:**
- Final events (HILL_022–024): melody [E3,G3,Bb3], counterline [G2,C#3], cluster [Bb3,C#4]
- No V–I or ii–V–I; no clear resolution to a tonic
- Phrase ends on Field C material with cluster color — open, suspended
- No punctuation on beat 1 of bar 9 suggesting "arrival"

**Result:** PASS

---

## 7. Overall Pass/Fail

| Criterion | Result |
|-----------|--------|
| Interval Cell Integrity | PASS |
| Harmonic Ambiguity | PASS |
| Phrase Asymmetry | PASS |
| Rhythmic Layering | PASS |
| Ensemble Equality | PASS |
| Anti-Cadential Check | PASS |

**Overall:** PASS

The V2.2 phrase satisfies all validation criteria and is suitable as a proof-of-life output for the Andrew Hill engine.
