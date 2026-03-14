# Barry Harris Engine v2 — Movement-First Harmonic System

## 1. Purpose

The **Barry Harris Engine v2** generates harmony from **movement** rather than static chords. It encodes Harris’s sixth–diminished conceptual framework as a motion grammar: tonic6 and diminished7 alternate to create harmonic flow, with voicings derived after motion is established.

All outputs must pass GCE evaluation (≥ 9.0) before export.

---

## 2. Core Philosophy

- **Harmony is motion** — Chords are not fixed objects; they emerge from voice-leading and root movement.
- **Major6 / Minor6 as tonic structures** — C6, Am6 (and their relatives) are primary tonics.
- **Diminished7 as dominant7b9 without root** — B°7 = G7b9 (no root); F°7 = D7b9 (no root).
- **Generate motion first, voicings second** — Harmonic skeleton → chord symbols → voicings.
- **Half-step insertion** — Bebop phrase rules apply to melodic material over the motion.

---

## 3. Movement Rules

### 3.1 Tonic6–Diminished7 Alternation

Primary motion template:

```
C6
B°7
C6
D°7
C6
```

- **Tonic6** — Major6 or minor6 chord as home.
- **Diminished7** — Connective dominant function; resolves by half-step motion into next chord.
- **Alternation** — Tonic6 ↔ Diminished7; avoid long runs of either.

### 3.2 Diminished7 as Dominant7b9 (No Root)

| Dim7 chord | Implied dominant | Resolution target |
|------------|------------------|-------------------|
| B°7        | G7b9             | C / C6 / Am       |
| D°7        | Bb7b9            | Eb / Eb6 / Cm     |
| F°7        | D7b9             | G / G6 / Em       |
| Ab°7       | F7b9             | Bb / Bb6 / Gm     |

- Treat dim7 as a **movement event**, not a colour chord.
- Voice leading must show resolution (e.g. 7th of implied V7 → 3rd of I).

### 3.3 Voice Leading Constraint

**At least one pivot tone** must be preserved between consecutive chords.

- Common tone retention (e.g. E in C6 and B°7).
- Stepwise motion in other voices.
- No parallel fifths or octaves.

---

## 4. Generation Pipeline

### 4.1 Step 1: Motion Skeleton

1. Choose tonic (e.g. C6).
2. Select dim7 chords that resolve into C6: B°7, D°7 (and optionally F°7, Ab°7 for variety).
3. Build sequence: Tonic6 → Dim7 → Tonic6 → Dim7 → Tonic6.
4. Extend by repeating or varying the dim7 choice.

### 4.2 Step 2: Chord Symbols

Derive chord symbols from motion:

- C6 → `C6` or `Cmaj7` (6th as colour)
- B°7 → `G7b9` (implied) or `B°7` (explicit)
- Am6 → `Am6` or `Am7` (6th as colour)

### 4.3 Step 3: Voicings

- 3–4 note voicings for guitar/piano.
- Guide tones (3rd, 7th) prioritised.
- Shell voicings (root–3–7 or root–7–3) for sparse textures.

### 4.4 Step 4: Bebop Phrase Rules

- **Strong-beat targeting** — Chord tones on beats 1 and 3.
- **Chromatic passing** — Half-step insertion between 5th and 6th (major), root and 7th (dominant).
- **Enclosures** — Above–below or below–above approach to chord tones.
- **Resolution** — Passing tones resolve by strong beat.

---

## 5. Example Motion Templates

### 5.1 Basic (C major)

```
C6    B°7   C6    D°7   C6    B°7   C6
|     |     |     |     |     |     |
0     2     4     6     8    10    12  (beats)
```

### 5.2 Extended with Am6

```
C6    B°7   Am6   Ab°7  C6    D°7   C6
```

### 5.3 Minor key (Am6 tonic)

```
Am6   G°7   Am6   B°7   Am6   G°7   Am6
```

---

## 6. Output Types

| Output Type | Description |
|-------------|-------------|
| **Motion progressions** | Tonic6–Dim7 sequences with chord symbols |
| **Guitar studies** | Idiomatic fretboard voicings, 3–4 notes, strong voice-leading |
| **Piano studies** | Shell voicings, guide-tone motion, swing phrasing |
| **MusicXML** | Valid MusicXML for tests/guitar and tests/piano |

---

## 7. Integration with GCE

| GCE Dimension | Barry v2 Contribution |
|---------------|------------------------|
| **Harmonic coherence** | Movement-first logic ensures logical progression |
| **Voice-leading continuity** | Pivot-tone rule, stepwise resolution |
| **Idiomatic writing** | Bebop phrase rules, 3–4 note voicings |
| **Formal logic** | Clear motion templates, cadential resolution |

---

## 8. Critical Rules

- **Do not optimise phrasing** — Preserve natural asymmetry.
- **Do not balance symmetry** — Allow uneven phrase lengths.
- **Preserve asymmetry** — Harris motion is conversational, not mechanical.
