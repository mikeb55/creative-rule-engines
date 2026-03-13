# Thelonious Monk Engine

## 1. Purpose

The **Thelonious Monk Engine** is a compositional personality engine inspired by Thelonious Monk (1917–1982). Its job is not harmonic correctness per se but **expressive asymmetry**, **rhythmic personality**, and **strategic dissonance**.

The engine models Monk’s compositional grammar—angular motifs, displaced phrasing, and ironic harmonic events—without pastiche. It produces material that is recognisably Monk-influenced in structure and gesture while remaining original. All outputs must pass GCE evaluation (≥ 9.0) before export.

---

## 2. Core Philosophy

Monk-style composition emphasizes:

- **Angular intervallic motifs** — Leaps and jagged contours over smooth scalar motion
- **Rhythmic asymmetry** — Phrase lengths that avoid predictable 4- or 8-bar symmetry; displaced accents
- **Repetition with variation** — Motifs return with altered endings, registral shifts, or harmonic misplacement
- **Strategic silence** — Rests as structural material; space between attacks
- **Blues-inflected dissonance** — Minor 2nds, tritones, and altered tones used for colour and tension
- **Ironic harmonic events** — Delayed resolution, wrong-right logic, deceptive cadences that become structural

---

## 3. Intervallic Language

### 3.1 Common Melodic Structures

| Structure | Description | Example |
|-----------|-------------|---------|
| **Minor 2nd tension** | Semitone rubs, crushed notes, adjacent-note friction |
| **Tritone pivots** | Tritone as axis; melodic motion around it |
| **Repeated-note figures** | Same pitch restruck with rhythmic emphasis |
| **Jagged arpeggios** | Broken chords with irregular rhythm; not smooth arpeggiation |
| **Sixth-based melodic hooks** | Major and minor 6ths as characteristic intervals |
| **Wide registral leaps** | Octave jumps, 10ths; used sparingly for emphasis |

### 3.2 Cell Types

- Repeated-note cells
- Semitone wedges (minor 2nd clusters)
- Tritone pivots
- Sixth-based heads
- Jagged arpeggio fragments
- Delayed-resolution figures
- Blues neighbour figures
- Contrary-motion dyad cells

---

## 4. Rhythmic Behaviour

### 4.1 Parameters

| Parameter | Description |
|-----------|-------------|
| **Phrase displacement** | Entries and exits shifted off the beat or barline |
| **Delayed attacks** | Notes arrive late; anticipation or lag |
| **Lurching accents** | Unexpected accents on weak beats |
| **Abrupt rests** | Sudden silence; clipped phrase endings |
| **Asymmetrical phrase endings** | 3-, 5-, or 7-note phrases; avoid constant 4-bar blocks |

### 4.2 Rhythm Rules

- Rhythm is first-class, not decoration
- Avoid constant eighth-note flow
- Use silence as phrase punctuation
- Allow late entries and clipped exits
- Support phrase “lurch”
- Support displaced attacks across barlines
- Retain groove even when asymmetrical

---

## 5. Harmonic Behaviour

### 5.1 Rules

| Rule | Description |
|------|-------------|
| **Ambiguous chord implication** | Shell voicings; sparse harmony; implied rather than stated |
| **Shell voicings** | Root, 3rd, 7th (or 6th); minimal voicing |
| **Pedal friction** | Tonic or dominant pedal with dissonant upper structure |
| **Altered dominant colours** | b9, #9, #11, b13 used for tension |
| **Deliberate harmonic misdirection** | Chord implied then subverted; wrong-right recurrence |

### 5.2 Harmonic Priorities

- Development over novelty
- Structural surprise over random dissonance
- Every dissonance must justify itself (see Wrong-Right Validator)
- Space is musical material

---

## 6. Instrument Translation

### 6.1 Guitar

- Sparse shell chords; dyads and 3-note shapes
- Awkward but expressive fingering logic when musically justified
- Top-note-led comping
- Contrary-motion fragments
- Repeated-note cells
- Avoid over-thick piano-style block harmony
- Playable fingerings with character, not ergonomic blandness

### 6.2 Piano

- Stride residue (sparse, not constant)
- Cluster accents
- Register jumps (“registral sarcasm”)
- Split-note attacks
- Displaced LH/RH coordination
- Sparse accompaniment with dead air

### 6.3 String Quartet

- Semitone clashes
- Staggered attacks
- Contrapuntal friction
- Grace-note clashes
- Registral displacement
- No fake piano writing; bowable lines only
- Preserve motivic crookedness and silence

### 6.4 Big Band

- Sectional argument, not wallpaper
- Close rubs in upper structures
- Brass/reed rhythmic disagreement when useful
- Anti-generic soli writing
- Repeated-cell shout logic
- Avoid smooth stock bebop voicings unless requested
- Short score first, optional expanded score

---

## 7. Interaction with Barry Harris Engine

The Monk Engine may **optionally** use the Barry Harris Engine for:

- **Harmonic scaffolding** — ii–V–I or blues structures as underlying framework
- **Guide tone movement** — 3rds and 7ths as anchors
- **Cadence structures** — Strong cadences when Monk grammar permits

**Override rule:** Monk Engine always overrides rhythmic and melodic behaviour. Barry Harris provides harmonic logic; Monk Engine controls phrasing, asymmetry, silence, and dissonance placement.

---

## 8. Composition Behaviour

### 8.1 Generative Priorities

| Priority | Description |
|---------|-------------|
| **Motif development** | Over scale runs; develop cells through transformation |
| **Structural surprise** | Delayed resolution, wrong-right recurrence |
| **Asymmetry preservation** | Do not optimise for symmetry; preserve lurch and displacement |
| **Silence as structural material** | Rests are part of the form |

### 8.2 Transformations

- Displacement
- Compression
- Expansion
- Inversion
- Registral transfer
- Repetition with altered ending
- Overshoot
- Interruption by rest
- Wrong-right recurrence
- Harmonic misplacement then correction
- Tonic-over-dominant overlay
- Cadence sabotage then deadpan landing

---

## 9. GCE Integration

Generated material must be evaluated using the GCE framework. Dimensions relevant to Monk Engine:

| GCE Dimension | Monk Engine Contribution |
|---------------|--------------------------|
| **Motivic identity** | Angular cells, clear development |
| **Rhythmic personality** | Asymmetry, displacement, silence |
| **Harmonic character** | Strategic dissonance, shell voicings |
| **Non-generic originality** | Avoid generic bebop; Monk grammar |
| **Target-instrument idiom** | Guitar, piano, quartet, big band rules |
| **Formal logic** | Asymmetrical phrase groups, structural surprise |

**Mandatory rule:** If GCE < 9.0, the system must revise the composition before output. No sub-excellent material may be exported.

---

## 10. Output Types

The Monk Engine may produce:

| Output Type | Description |
|-------------|-------------|
| **Heads** | Melodic themes with chord symbols |
| **Solos** | Single-line improvisations |
| **Chamber works** | String quartet miniatures |
| **Guitar compositions** | Solo guitar, chord-melody, comping sketches |
| **Quartet miniatures** | Short quartet pieces |
| **Big band sketches** | Short scores, sectional writing |
| **MusicXML exports** | Valid MusicXML compatible with pipelines |

All outputs must pass MusicXML validation and GCE ≥ 9.0. The engine is compatible with Triad Atlas guitar translation and Polyphonic Labyrinth polyphonic systems.
