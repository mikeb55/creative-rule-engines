# Barry Harris Engine

## 1. Purpose

The **Barry Harris Engine** is a harmonic grammar system inspired by the pedagogical and compositional principles of Barry Harris (1929–2021). It provides rule-based generation and evaluation of jazz harmony and bebop melodic motion.

The engine does not imitate Harris’s personal style; it encodes his systematic approach to:

- Sixth–diminished harmonic systems
- Voice-leading grammar
- Bebop resolution logic
- Chromatic approach structures

It is designed for use in generative composition pipelines that require harmonically coherent, idiomatically correct jazz materials. All outputs must pass GCE evaluation (≥ 9.0) before export.

---

## 2. Core Philosophy

The engine models Harris’s conceptual framework:

- **6th–diminished harmonic systems** — Major and minor sixth scales with embedded diminished structures; chord families derived from scale degrees
- **Stepwise voice leading** — Preference for conjunct motion; leaps justified by harmonic or motivic logic
- **Bebop resolution grammar** — Chromatic passing tones and approach notes that resolve to chord tones on strong beats
- **Chord tone targeting** — Melodic lines target 3rds, 7ths, and roots at phrase boundaries and cadence points
- **Chromatic approach logic** — Half-step approaches above and below target notes; enclosures and neighbour figures
- **Diminished passing structures** — Use of diminished chords and scales as connective tissue between diatonic harmonies

---

## 3. Harmonic Rules

### 3.1 Movement Preference

- **ii–V–I movement** — Primary cadential structure; ii and V may be extended (ii7–V7–Imaj7)
- **Diminished passing chords** — Dim7 chords used between scale degrees (e.g. Cmaj7 → C#dim7 → Dm7)
- **Guide tone motion** — 3rds and 7ths move by step or common tone where possible
- **Chromatic approach tones** — Approach chord tones from half step above or below
- **Dominant resolution mechanics** — V7 resolves to I; 7th of V resolves down by step to 3rd of I
- **Cadence strengthening logic** — Strong cadences use clear root motion (V→I, ii→V); avoid deceptive cadences unless structurally motivated

### 3.2 Chord Family Logic

- Major: I, ii, iii, IV, V, vi, vii° (and extensions)
- Minor: i, ii°, III, iv, v, VI, VII (and extensions)
- Diminished: passing function between diatonic chords
- Dominant: resolution to tonic or relative minor

### 3.3 Voice Leading Constraints

- Avoid parallel fifths and octaves in multi-voice contexts
- Prefer contrary or oblique motion
- 7ths resolve down by step
- Leading tones resolve up by half step

---

## 4. Bebop Line Grammar

### 4.1 Strong-Beat Targeting

- **Chord tones on strong beats** — Beats 1 and 3 (in 4/4) should carry chord tones unless a deliberate suspension or anticipation is intended
- **Weak-beat passing** — Chromatic and diatonic passing tones on beats 2 and 4, or on upbeats

### 4.2 Chromatic Enclosures

- **Above–below enclosure** — Approach target from half step above, then half step below (or vice versa) before landing
- **Below–above enclosure** — Same logic, order reversed
- **Double chromatic** — Two chromatic approaches in sequence

### 4.3 Approach Tones

- **Approach from above** — Half step above target, resolving down
- **Approach from below** — Half step below target, resolving up
- **Landing on target** — Approach tone resolves to chord tone on strong beat

### 4.4 Passing Tones

- Diatonic passing tones between chord tones (e.g. C–D–E over Cmaj7)
- Chromatic passing tones where they create bebop resolution (e.g. added chromatic in bebop scale)

### 4.5 Bebop Scale Usage

- **Major bebop scale** — Major scale with chromatic passing tone between 5th and 6th
- **Dominant bebop scale** — Mixolydian with chromatic between root and 7th
- Use to ensure chord tones fall on strong beats in running eighth-note lines

---

## 5. Movement Evaluation

### 5.1 Scoring Principles

The engine evaluates phrase motion using these criteria:

| Criterion | Penalty | Reward |
|-----------|---------|--------|
| Large unmotivated leaps | Leap > 5th without harmonic or motivic justification | — |
| Stepwise motion | — | Conjunct motion preferred |
| Harmonic targeting | Unclear or missed chord tones at phrase ends | Clear resolution to 3rd, 7th, or root |
| Cadence motion | Weak or ambiguous cadences | Strong V–I or ii–V–I resolution |
| Voice leading | Parallel fifths/octaves, awkward leaps | Smooth, logical voice leading |

### 5.2 Phrase Evaluation

- **Phrase end targeting** — Last note of phrase should be a chord tone (or a suspension that resolves)
- **Cadence strength** — Detect clear dominant–tonic or ii–V–I motion
- **Contour coherence** — Melodic shape should have direction (ascending, descending, arc) rather than random wandering

---

## 6. Integration with GCE

The Barry Harris Engine supports GCE dimensions as follows:

| GCE Dimension | Harris Engine Contribution |
|---------------|---------------------------|
| **Motivic development** | Clear harmonic targets enable motivic recall and variation |
| **Tension–release arcs** | Dissonance (e.g. chromatic approach) resolves to consonance; cadences provide release |
| **Harmonic coherence** | Rule-based harmony ensures logical progression |
| **Idiomatic bebop language** | Bebop line grammar produces idiomatically correct jazz phrasing |
| **Formal logic** | Cadence strengthening supports clear phrase and section boundaries |

Generated material is evaluated against the full GCE rubric. If GCE < 9.0, the system must revise before output.

---

## 7. Integration with Other Engines

The Barry Harris Engine may be called by:

| Engine | Role |
|--------|------|
| **Monk Engine** | Optional harmonic scaffolding; Monk overrides rhythmic and melodic behaviour |
| **Polyphonic Labyrinth Engine** | Guide tone frameworks, voice-leading logic for inner voices |
| **Triad Atlas** | Guitar translation of chord voicings and guide-tone lines |
| **Big-band arranging engines** | Reharmonization, chord substitution, guide-tone frameworks for sections |

When used as a sub-engine, Barry Harris provides **harmonic grammar** and **voice-leading rules**; the calling engine controls rhythm, texture, and expressive character.

---

## 8. Expected Outputs

The Barry Harris Engine may produce:

| Output Type | Description |
|-------------|-------------|
| **Chord progressions** | ii–V–I based, with optional diminished passing chords and extensions |
| **Bebop lines** | Single-line melodies following bebop grammar |
| **Reharmonizations** | Substitutions (e.g. tritone, diminished) within Harris rules |
| **Guide tone frameworks** | 3rd and 7th motion for comping or arrangement |
| **MusicXML phrase exports** | Valid MusicXML compatible with pipelines in this repository |

All outputs must pass MusicXML validation and GCE ≥ 9.0 before final export.
