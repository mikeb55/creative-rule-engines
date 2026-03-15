# Wayne Shorter Runtime Generator Plan

**Purpose:** Define the eventual runtime pipeline. Do not implement runtime code yet.

---

## RUNTIME PIPELINE

```
seed
→ motif generation
→ phrase construction
→ harmonic environment generation
→ event structure assembly
→ export
→ validation
```

---

## STEP 1 — SEED

**Input:** Random or user-selected parameters.

**Parameters:**

- interval_cell (Cell A–G)
- harmonic_field (Field A–G)
- form_archetype (8-bar, 12-bar, AABA, modular, short form, modal vamp)
- phrase_pattern (3+5, 5+4, 4+4+3, 7+5, etc.)

**Output:** Seed configuration for generation.

---

## STEP 2 — MOTIF GENERATION

**Input:** Seed (cell, field).

**Process:**

1. Generate base motif from interval cell (3–6 notes).
2. Apply transformation (repeat, invert, transpose, fragment, extend, interrupt).
3. Map to harmonic field.

**Output:** Motif fragment(s).

---

## STEP 3 — PHRASE CONSTRUCTION

**Input:** Motif, phrase pattern, form.

**Process:**

1. Map phrase pattern to bars.
2. Place motif fragments across phrase.
3. Apply transformation per fragment.
4. Assign phrase_group to events.

**Output:** Phrase structure with bar boundaries.

---

## STEP 4 — HARMONIC ENVIRONMENT GENERATION

**Input:** Form, harmonic field, section.

**Process:**

1. Assign harmonic field per section.
2. Generate pitch sets.
3. Apply chromatic root movement if planing.
4. Map motif to field.

**Output:** Harmonic environment per bar/phrase.

---

## STEP 5 — EVENT STRUCTURE ASSEMBLY

**Input:** Motif, phrase structure, harmonic environment, rhythmic patterns, ensemble config.

**Process:**

1. Create event per note/chord.
2. Assign event_id, section_id, phrase_group, bar, beat_position, duration.
3. Assign pitch/pitch_set, register_band, role, motivic_source, harmonic_field.
4. Assign staff_or_voice, rhythmic_layer, articulation, transformation.

**Output:** Ordered list of structured events.

---

## STEP 6 — EXPORT

**Input:** Event list, export mode (melody-only, lead sheet, piano reduction, ensemble sketch).

**Process:**

1. Convert events to MusicXML per shorter_musicxml_export_spec.md.
2. Preserve simultaneity and staff ranges.
3. Write file.

**Output:** MusicXML file.

---

## STEP 7 — VALIDATION

**Input:** Event list (before export) or MusicXML (after).

**Process:**

1. Run shorter_validator.md checks.
2. Compute GCE.
3. Pass/fail.

**Output:** Pass → export; Fail → regenerate or reject.

---

## REGENERATION LOGIC

If validation fails:

1. Retry with new seed (max 3 attempts).
2. If still fail: reject; do not export.
3. Log failure reason for debugging.

---

## FILE OUTPUT

**Location:** `creative-engines/engines/wayne-shorter-engine/outputs/`

**Naming:** `shorter_phrase_YYYY_MM_DD_HHMM.musicxml`

---

## DEPENDENCIES

- shorter_interval_cell_library.md
- shorter_harmonic_fields.md
- shorter_phrase_generation_rules.md
- shorter_rhythmic_patterns.md
- shorter_form_archetypes.md
- shorter_event_schema.md
- shorter_validator.md
- shorter_musicxml_export_spec.md

---

## STATUS

Plan only. Runtime not implemented. Grammar and validator must be defined first.
