# Wayne Shorter Runtime Pipeline

**Purpose:** Define the runtime generation pipeline for the Shorter engine.

**Date:** 2026-03-15

---

## PIPELINE OVERVIEW

```
seed
  → motif selection
  → phrase generation
  → harmonic field assignment
  → form assembly
  → validator
  → export
```

---

## EVENT FLOW DIAGRAM

```
┌─────────┐     ┌──────────────────┐     ┌──────────────────┐
│  SEED   │────▶│ MOTIF SELECTION   │────▶│ PHRASE           │
│         │     │ (Cell A–F; avoid  │     │ GENERATION       │
│ - form  │     │  G unless planing)│     │ (3+5, 5+4, etc.) │
│ - cell  │     └──────────────────┘     └────────┬─────────┘
└─────────┘                                            │
       │                                               ▼
       │     ┌──────────────────┐     ┌────────────────────────┐
       └────▶│ HARMONIC FIELD   │◀───│ FORM ASSEMBLY          │
             │ ASSIGNMENT       │     │ (episodic / AABA /      │
             │ (Field A–G)     │     │  motif-driven)          │
             └────────┬────────┘     └────────────┬─────────────┘
                      │                           │
                      ▼                           ▼
             ┌─────────────────────────────────────────────┐
             │ EVENT STRUCTURE BUILD                        │
             │ (event_id, section_id, phrase_group, bar,    │
             │  role, motivic_source, harmonic_field, ...)   │
             └─────────────────────┬─────────────────────────┘
                                  │
                                  ▼
             ┌─────────────────────────────────────────────┐
             │ VALIDATOR (Ch1–Ch8)                          │
             │ Pass → proceed; Fail → reject                 │
             └─────────────────────┬─────────────────────────┘
                                  │
                                  ▼
             ┌─────────────────────────────────────────────┐
             │ EXPORT (console / MusicXML)                 │
             └─────────────────────────────────────────────┘
```

---

## DATA STRUCTURES

### Seed

```python
{
    "form_type": "episodic_chain" | "asymmetrical_aaba" | "motif_driven_sectional",
    "cell": "Cell A" | "Cell B" | "Cell C" | "Cell D" | "Cell E" | "Cell F",
    "phrase_option": 0 | 1 | 2  # index into form-specific phrase options
}
```

### Motif (Interval Cell)

```python
{
    "cell_id": "Cell A",
    "intervals": [3, 6],  # semitones: m3, tt
    "root_midi": 60,
    "pitches": [60, 63, 66]  # C, Eb, F# (tt from Eb = 6 semitones to A-ish)
}
```

### Phrase

```python
{
    "phrase_group": "3+5",
    "bars": 8,
    "bar_ranges": [(1, 3), (4, 8)],
    "transformation": "repeat" | "invert" | "transpose" | "fragment" | "extend"
}
```

### Harmonic Field Assignment

```python
{
    "section_id": "A",
    "phrase_index": 0,
    "harmonic_field": "Field A",
    "bar_start": 1,
    "bar_end": 8
}
```

### Event

```python
{
    "event_id": "SHORTER_001",
    "section_id": "A",
    "phrase_group": "3+5",
    "bar": 1,
    "beat_position": 0.0,
    "duration": 1.0,
    "pitch": 64,
    "register_band": "middle",
    "role": "melody",
    "motivic_source": "Cell A",
    "harmonic_field": "Field A",
    "staff_or_voice": "treble",
    "transformation": "repeat"
}
```

---

## PIPELINE STEPS

### Step 1 — Seed

**Input:** Random or fixed parameters.

**Output:** Seed dict with form_type, cell, phrase_option.

**Rules:** Prefer Cells A–F. Cell G only with Field D/E and chromatic displacement.

---

### Step 2 — Motif Selection

**Input:** Seed (cell).

**Process:**
1. Map cell to interval sequence (see shorter_interval_cell_library.md).
2. Choose root (e.g., C = 60).
3. Generate pitch sequence from intervals.

**Output:** Motif dict (cell_id, intervals, root_midi, pitches).

---

### Step 3 — Phrase Generation

**Input:** Seed (form_type, phrase_option), motif.

**Process:**
1. Select phrase structure from form rule table (shorter_form_archetypes.md).
2. Map phrase groups to bar ranges.
3. Assign transformation per phrase (repeat, invert, transpose, fragment, extend).

**Output:** List of phrase dicts.

---

### Step 4 — Harmonic Field Assignment

**Input:** Form type, phrase list.

**Process:**
1. Assign field per phrase/section per form rule table.
2. Ensure ≥2 distinct field types (or single with transformation).
3. Avoid ii–V–I.

**Output:** List of (section_id, phrase_index, harmonic_field, bar_start, bar_end).

---

### Step 5 — Form Assembly

**Input:** Motif, phrases, harmonic assignments.

**Process:**
1. Build event list: one event per melodic note (minimal: 2–4 events per bar for melody).
2. Add secondary roles: bass, counterline, or harmonic_color (≥2 roles total).
3. Assign event_id, section_id, phrase_group, bar, beat_position, role, motivic_source, harmonic_field.

**Output:** Ordered list of events.

---

### Step 6 — Validator

**Input:** Event list.

**Process:** Run checks 1–8 (wayne_shorter_validator.md). Compute GCE.

**Output:** Pass/fail, failure reason if fail.

---

### Step 7 — Export

**Input:** Event list (if pass).

**Output:** Console (Stage 2) or MusicXML (Stage 3).

---

## DEPENDENCIES

- shorter_interval_cell_library.md
- shorter_harmonic_fields.md
- shorter_phrase_generation_rules.md
- shorter_form_archetypes.md
- shorter_event_schema.md
- wayne_shorter_validator.md
