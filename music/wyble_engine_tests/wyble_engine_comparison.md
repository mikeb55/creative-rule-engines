# Wyble Engine Impact Test — Comparison Report

**Date:** 2026-03-11  
**Tunes:** Narrative Drift, Shifting Lines, Northern Thread

## Overview

Three tunes were processed through the Wyble Engine Impact Test, each producing three variants:

- **V1 (Original Lead Sheet):** Single-line melody, no counterpoint
- **V2 (Wyble Intro):** Bars 1–4 rewritten as two-voice Wyble counterpoint; rest unchanged
- **V3 (Full Wyble Texture):** Entire melody accompanied by moving bass counterline

---

## Narrative Drift (C minor, 4/4, ♩=132)

**Source:** Scofield-style narrative groove

| Variant | Assessment | Notes |
|---------|------------|-------|
| **V1** | ✓ Baseline | Clean lead sheet; melody intact. Reference for comparison. |
| **V2** | ✓ Works well | Intro establishes two-voice dialogue immediately. Bass: descending chromatic line (C3–Bb2–A2–G2) with chromatic approaches to Ab. Contrast with melody’s upward motion. |
| **V3** | ✓ Works | Full texture adds weight. Melodic bass (stepwise, chromatic approaches) supports harmony without arpeggio patterns. Some bars feel dense at tempo; may benefit from selective thinning. |

**Conclusion:** V2 is the strongest musically. The intro sets a clear Wyble character without overloading the tune. V3 is effective but denser; best suited to slower tempos or as a study.

---

## Shifting Lines (B minor, 6/8, ♩.=72)

**Source:** Shorter-style narrative with implied Wyble counterpoint

| Variant | Assessment | Notes |
|---------|------------|-------|
| **V1** | ✓ Baseline | Single-line lead sheet; dyadic feel implied but not written. |
| **V2** | ✓ Works well | Bars 1–4: bass B2–A#2–B2 (bar 1), G2–A2–B2 (bar 2), E2–D#2–E2 (bar 3), F#2–G2–A#2 (bar 4). Chromatic approach to B in bar 4. Two-voice dialogue suits the 6/8 flow. |
| **V3** | ✓ Works | Three bass notes per bar (6/8) keeps texture lighter. Melodic bass supports Bm9–Gmaj7–Em9–F#7alt cycle. Some bridge sections could use more variation. |

**Conclusion:** V2 again works best. The tune already suggests two voices; the written intro makes that explicit. V3 is playable and coherent but can feel repetitive in long stretches.

---

## Northern Thread (Eb major, 4/4, ♩=84)

**Source:** Lyrical Metheny/Bacharach contour

| Variant | Assessment | Notes |
|---------|------------|-------|
| **V1** | ✓ Baseline | Lyrical single line; singable melody. |
| **V2** | ✓ Works | Bars 1–4: Eb2–F2–G2–Ab2 (ascending), C2–B2–C3–D3, F2–E2–F2–G2, Bb2–A2–Bb2–A2 (chromatic approach to Eb). Bass moves with the lyrical flow. |
| **V3** | ✓ Works | Full bass line supports Eb–Cm7–Fm7–Bb7 progression. Lyrical character preserved; bass avoids arpeggio patterns. |

**Conclusion:** V2 and V3 both work. The lyrical style tolerates fuller texture. V3 is a good option for solo guitar arrangements.

---

## Summary: Which Version Works Musically and Why

### V1 (Original)
- **Role:** Baseline and reference
- **Use:** Learning the melody, rehearsal charts, contexts where simplicity is preferred

### V2 (Wyble Intro)
- **Works best for:** Narrative Drift, Shifting Lines
- **Why:** Introduces Wyble counterpoint at the start without changing the rest of the tune. Creates a clear “two voices in dialogue” feel. The contrast between the written intro and the single-line continuation can be effective.
- **Limitation:** Abrupt transition at bar 5 if not handled with care (dynamics, articulation).

### V3 (Full Wyble Texture)
- **Works best for:** Northern Thread (lyrical), Narrative Drift (at moderate tempo)
- **Why:** Full texture suits lyrical and ballad-like material. Melodic bass (stepwise, chromatic approaches, no arpeggios) supports the harmony and keeps the bass as a real voice.
- **Limitation:** Can feel dense on faster tunes (e.g. Narrative Drift at 132). May need selective reduction or slower tempo.

### General Observations

1. **Melody identity:** All variants preserve the original melody; no melodic changes.
2. **Bass as melodic voice:** V2 and V3 use stepwise motion and chromatic approaches rather than arpeggio patterns.
3. **Contrary motion:** Used where melody direction is clear (e.g. melody up → bass down).
4. **Guitar playability:** Bass range kept within E2–G4; all variants are playable on solo guitar.
5. **Engine behaviour:** The scripted bass generation (add_melodic_bass.py) produces coherent results; manual refinement (especially in V2 intros) improves musical quality.

---

## File Locations

```
music/wyble_engine_tests/
├── Narrative_Drift/
│   ├── musicxml/  V1_original.musicxml, V2_wyble_intro.musicxml, V3_full_wyble_texture.musicxml
│   ├── notes/
│   └── revisions/
├── Shifting_Lines/
│   ├── musicxml/  V1_original.musicxml, V2_wyble_intro.musicxml, V3_full_wyble_texture.musicxml
│   ├── notes/
│   └── revisions/
├── Northern_Thread/
│   ├── musicxml/  V1_original.musicxml, V2_wyble_intro.musicxml, V3_full_wyble_texture.musicxml
│   ├── notes/
│   └── revisions/
├── add_melodic_bass.py
└── wyble_engine_comparison.md
```
