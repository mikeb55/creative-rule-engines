# Thelonious Monk Engine v2 — Shell-Displacement Harmonic System

## 1. Purpose

The **Monk Engine v2** generates harmony from **shell voicings** and **rhythmic displacement**. Chords are minimal (root, 3rd, 7th); chromatic triad displacement and off-beat attacks create Monk-style character. Harmony is implied rather than stated; space and displacement are structural.

All outputs must pass GCE evaluation (≥ 9.0) before export.

---

## 2. Core Philosophy

- **Shell voicings first** — Root, 3rd, 7th (or 6th); maximum 4 notes.
- **Chromatic triad displacement** — Triads shifted by half-step for colour and tension.
- **Rhythmic gaps** — Space between chord attacks; silence is material.
- **Off-beat attacks preferred** — Entries on & of 1, & of 2, & of 3, & of 4 over on-beat.
- **Ornament rules** — b9, #11, b13, minor-2 clusters as permitted extensions.

---

## 3. Harmonic Rules

### 3.1 Shell Chords

- **Maximum chord size:** 4 notes.
- **Core shell:** Root, 3rd, 7th (or 6th for tonic).
- **Optional 4th note:** 9th, b9, #11, b13, or cluster tone.

### 3.2 Chromatic Triad Displacement

- Triad (root–3–5) may be displaced by half-step:
  - Up: C → C#/Db
  - Down: C → B
- Creates tension; resolution by return to diatonic or stepwise motion.
- Use sparingly; not every chord.

### 3.3 Chord Ornament Rules

| Ornament | Use | Example |
|----------|-----|---------|
| **b9** | Dominant tension | G7b9 |
| **#11** | Lydian colour | Cmaj7#11 |
| **b13** | Altered dominant | G7b13 |
| **Minor-2 clusters** | Adjacent semitones | E–F, B–C |

- One ornament per chord maximum (unless cluster).
- Clusters: 2–3 adjacent semitones for friction.

---

## 4. Rhythmic Rules

### 4.1 Gaps Between Chord Attacks

- **Minimum gap:** 1 beat between chord attacks.
- **Preferred:** 1.5–2 beats.
- **Bars must breathe** — No continuous chord streams.

### 4.2 Off-Beat Preference

- **On-beat (1, 2, 3, 4):** Allowed but not default.
- **Off-beat (& of 1, & of 2, etc.):** Preferred.
- **Anticipations:** Chord on & of 4 resolving to beat 1 of next bar — allowed.
- **Delayed attacks:** Chord on beat 1.5 or 2.5 — preferred.

### 4.3 Asymmetry

- **Do not optimise phrasing.**
- **Do not balance symmetry.**
- **Preserve asymmetry** — 3-, 5-, 7-note phrase lengths; irregular bar groupings.

---

## 5. Generation Pipeline

### 5.1 Step 1: Shell Progression

1. Choose key and basic progression (e.g. C6, Am7, Dm7, G7, C6).
2. Reduce to shells: root–3–7 (or root–7–3).
3. Limit to 3–4 notes per chord.

### 5.2 Step 2: Displacement

1. Select 1–2 chords per phrase for chromatic triad displacement.
2. Apply half-step shift (up or down).
3. Ensure resolution within 2–4 beats.

### 5.3 Step 3: Ornament Placement

1. Add b9, #11, b13, or minor-2 cluster to 1–2 chords per 4 bars.
2. Do not overload.

### 5.4 Step 4: Rhythmic Placement

1. Place chord attacks on off-beats where possible.
2. Insert gaps (rests) between attacks.
3. Avoid 4-on-the-floor; allow lurch and displacement.

---

## 6. Output Types

| Output Type | Description |
|-------------|-------------|
| **Shell progressions** | Root–3–7 with optional ornaments |
| **Guitar studies** | 3–4 note chords, off-beat attacks, fretboard idiomatic |
| **Piano studies** | Sparse shells, rhythmic gaps, cluster accents |
| **MusicXML** | Valid MusicXML for tests/guitar and tests/piano |

---

## 7. Integration with GCE

| GCE Dimension | Monk v2 Contribution |
|---------------|----------------------|
| **Rhythmic personality** | Off-beat attacks, gaps, asymmetry |
| **Harmonic character** | Shell voicings, chromatic displacement |
| **Non-generic originality** | Avoid stock voicings; Monk grammar |
| **Target idiom** | Guitar/piano specific rules |

---

## 8. Critical Rules

- **Do not optimise phrasing.**
- **Do not balance symmetry.**
- **Preserve asymmetry.**
- **Maximum 4 notes per chord.**
- **Off-beat attacks preferred.**
- **Rhythmic gaps required.**
