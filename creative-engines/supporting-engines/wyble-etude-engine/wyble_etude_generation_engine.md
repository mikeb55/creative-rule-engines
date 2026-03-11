# Wyble Etude Generation Engine

**Purpose:** Generate high-level Jimmy Wyble–style guitar etudes from existing composition material.

This engine is intended for automated etude-generation from source MusicXML. Apply it automatically to any request to create Wyble etudes from source MusicXML.

---

## Global Objective

Create playable, musically strong, non-generic Wyble-style etudes that help the user learn and internalise their own compositions.

Do not output weak studies.

Every etude must be refined toward GCE 10, or as close as possible, before any MusicXML is written.

No MusicXML output should be written until the internal evaluation loop has pushed the etude to a clearly excellent level.

---

## Core Wyble Principles

All etudes must reflect Jimmy Wyble-style two-line guitar counterpoint.

**Required characteristics:**

- two independent voices
- contrary motion
- oblique motion
- occasional parallel 3rds or 6ths
- harmony implied by line interaction
- dyads preferred over thick chord stacks
- upper voice usually melodic
- lower voice usually bass / harmonic guide line
- transparency, not density
- guitar idiom first

**Avoid:**

- block-chord comping
- generic chord-melody writing
- piano-style density
- long unbroken monophonic runs unless transitional
- AI-symmetrical phrasing
- ornamental filler with no harmonic function

---

## Supported Output Modes

**Mode A — Etude Mode**  
Generate short Wyble-style guitar etudes derived from an existing composition.

**Mode B — Two-String Study Mode**  
Generate reductions playable on two separated strings only (e.g. 1+4, 2+5, 1+5) to internalise contrapuntal motion and harmony.

**Mode C — Modular Arrangement Study Mode**  
Generate Intro / Solo Area / Outro Wyble modules derived from the source piece.

Unless explicitly told otherwise, default to **Mode A — Etude Mode**.

---

## Source Material Rule

Etudes must be derived from existing musical material in the source piece.

Use one or more of the following as source material:

- main melody
- violin I line
- cello harmonic motion
- guitar harmonic skeleton
- motivic fragments
- cadence zones
- bridge or transition material

Do not invent unrelated study material if useful source material already exists in the piece.

Etudes must preserve the identity of the source piece while making it playable and educational on solo guitar.

---

## Default Etude Design

| Parameter | Default |
|-----------|---------|
| Length | 8–16 bars |
| Study density | 2 voices only |
| Rhythm simplification | mostly quarter notes; occasional eighth notes; only use more complex rhythms if crucial to source identity |
| Fretboard handling | keep inside a practical position zone whenever possible |

**Preferred positional ranges:** frets 3–7, frets 5–9, frets 7–10. Choose the most musical and playable range automatically.

---

## Voice Assignment Rule

**Upper voice:** melody, motif, lyrical fragment, violin I reduction, thematic line.

**Lower voice:** bass guide line, cello motion, harmonic anchor, stepwise contrapuntal motion.

If the source material suggests a better assignment, adapt intelligently.

---

## Contrapuntal Motion Rules

Each etude should include at least two of the following:

- contrary motion
- oblique motion
- delayed entry between voices
- stepwise bass motion
- voice crossing only if clearly playable and musically justified
- inner chromatic motion where harmonically appropriate

Etudes should feel like real music, not mechanical exercises.

---

## Two-String Mode Rules

If Two-String Study Mode is requested or appropriate:

- use only two separated strings
- preferred pairs: 1+4, 2+5, 1+5
- avoid 1+2, 2+3 unless explicitly requested

The point is clarity of voice separation and harmonic hearing.

---

## Modular Arrangement Mode Rules

If Modular Arrangement Study Mode is requested:

Generate clearly labelled modules with rehearsal letters:

- **A** — Intro
- **B** — Optional solo / development area
- **C** — Outro

Each module must be usable independently.

Do not force all modules into one through-composed etude if that weakens clarity.

---

## Piece Selection Automation

- If the user gives a source file, use it.
- If the user gives a piece name, locate the relevant MusicXML automatically if possible.
- If multiple source files exist, prefer the highest-version final or master file.
- If no source is specified but one is clearly implied by the workspace context, use the strongest current file automatically.

---

## Output Automation

When generating etudes from a source piece, automatically create this structure if missing:

```
[PIECE_FOLDER]/Wyble_Etudes/
[PIECE_FOLDER]/Wyble_Etudes/musicxml/
[PIECE_FOLDER]/Wyble_Etudes/notes/
[PIECE_FOLDER]/Wyble_Etudes/revisions/
```

Use relative paths only. Do not require confirmation before writing.

---

## File Naming Rule

**One etude:** `Wyble_Etude_01_[Piece_Name].musicxml`

**Multiple etudes:** `Wyble_Etude_01_[Piece_Name].musicxml`, `Wyble_Etude_02_[Piece_Name].musicxml`, etc.

**Notes file:** `Wyble_Etudes_Notes.md`  
**Revision log:** `Wyble_Etudes_Log.md`

---

## Required Notes File Content

For every generation pass, write a notes file including:

- source piece used
- source file used
- output mode
- bars or section used
- upper voice source
- lower voice source
- fretboard position used
- technical focus
- brief performance note

---

## Required Etude Types

If the user requests a study pack, generate a balanced set using these defaults:

| Etude | Purpose |
|-------|---------|
| Etude 1 | Intro / opening identity study |
| Etude 2 | Main harmonic motion study |
| Etude 3 | Bridge / transition / development study |
| Etude 4 (optional) | Cadence / outro study |

If only one etude is requested, choose the section that yields the strongest learning value.

---

## Quality Threshold — Do Not Output Weak Material

Before outputting any MusicXML:

Evaluate the etude against a Wyble-specific GCE framework.

**Default:** Do not output unless the etude reaches **GCE ≥ 9.0**.

**If the request says** "10", "level 10", "GCE 10", or "as close as possible to 10": target **GCE ≥ 9.6** and push as high as possible before output.

No preliminary MusicXML should be written before this threshold is achieved.

---

## Wyble Etude GCE Framework

Evaluate each etude on:

1. **Contrapuntal clarity** — Do the two voices feel independent?
2. **Harmonic implication** — Does the line interaction imply convincing harmony without heavy chords?
3. **Guitar idiom** — Is it playable and natural on guitar?
4. **Source integrity** — Does it genuinely reflect the source piece?
5. **Educational usefulness** — Does practicing it teach harmony, line, and motion?
6. **Motivic coherence** — Does it derive from meaningful material rather than filler?
7. **Register clarity** — Are the two voices clearly separated?
8. **Musicality** — Does it sound like a miniature piece, not just a drill?
9. **Economy** — Is there unnecessary clutter?
10. **Memorability** — Is there a clear musical identity?

---

## Auto-Revision Loop

Before any MusicXML is written:

1. Generate draft study internally
2. Evaluate against the Wyble Etude GCE Framework
3. If below target:
   - simplify rhythm if cluttered
   - improve contrary motion
   - strengthen harmonic guide line
   - improve register separation
   - remove non-essential notes
   - improve positional playability
   - sharpen source-material identity
4. Re-evaluate
5. Repeat until threshold is achieved

Only then write MusicXML.

---

## Engraving Rules

All MusicXML etudes must:

- use clean readable notation
- avoid repeated time signatures every bar
- show meter only when it changes
- include fingering only if specifically useful
- avoid visual clutter
- import cleanly into Sibelius or MuseScore
- keep slurs and ties clear
- make voice separation visually readable

---

## Default Output Behaviour

Unless the user says otherwise:

- generate 3 etudes per source piece
- derive them from different useful parts of the piece
- create the folder structure
- write MusicXML
- write notes file
- write revision log

---

## Default Study Pack Template

**Study Pack for [Piece Name]**

- **Etude 1** — opening identity / motif / intro logic
- **Etude 2** — harmonic motion / contrary motion / voice-leading
- **Etude 3** — bridge, development, or cadence study
- **Etude 4 (optional)** — outro / cadence / thinning texture

---

## Human Feel Rule

Do not let etudes become cold or mechanical.

**Use:** delayed melodic arrival, slight asymmetry, breath in phrase endings, occasional rests, natural voice spacing.

**Avoid:** over-regular phrase grids, pure system display with no musical life.

---

## Final Output Rule

Only output MusicXML after the etude or etude pack has been pushed as close as possible to GCE 10.

If the etudes cannot reach that level, continue revising before writing.

Write directly to the workspace using relative paths.

No weak or merely acceptable studies should be emitted.
