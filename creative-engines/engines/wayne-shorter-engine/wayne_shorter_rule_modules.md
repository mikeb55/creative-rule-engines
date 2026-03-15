# Wayne Shorter Engine Rule Modules

Each module defines input, process, output, failure conditions, and validation hooks.

---

## MODULE 1 — MOTIF TRANSFORMATION ENGINE

**Input:**

- Interval cell (from shorter_interval_cell_library.md)
- Transformation type (repeat, invert, transpose, fragment, extend, interrupt)
- Register band
- Harmonic field (for pitch mapping)

**Process:**

1. Generate base motif from cell (3–6 notes)
2. Apply transformation
3. Map to harmonic field if needed
4. Output pitch sequence

**Output:**

- Motif fragment (pitch list, duration hints)
- motivic_source tag

**Failure conditions:**

- Cell produces < 3 notes
- Transformation produces invalid pitch set
- Motif exceeds 6 notes without extend

**Validation hooks:**

- Interval logic consistency
- Motivic continuity with prior phrase

---

## MODULE 2 — HARMONIC FIELD GENERATOR

**Input:**

- Form section
- Harmonic field type (modal, chromatic planing, pedal, suspended)
- Root or pedal note
- Motif pitches (for mapping)

**Process:**

1. Select field from shorter_harmonic_fields.md
2. Generate pitch set for section
3. Apply chromatic root movement if planing
4. Map motif to field

**Output:**

- Harmonic field (pitch set per bar or phrase)
- Root movement sequence (if applicable)

**Failure conditions:**

- Field produces empty set
- Dominant-tonic motion detected
- Excessive functional resolution

**Validation hooks:**

- Harmonic ambiguity check
- Harmonic color diversity check

---

## MODULE 3 — PHRASE ASYMMETRY GENERATOR

**Input:**

- Form structure
- Phrase pattern (3+5, 5+4, 4+4+3, 7+5, etc.)
- Bar count

**Process:**

1. Choose phrase pattern from shorter_phrase_generation_rules.md
2. Map pattern to bars
3. Assign phrase_group to events
4. Allow overlap, restart, delayed/early cadence

**Output:**

- Phrase boundaries (bar ranges)
- phrase_group per event

**Failure conditions:**

- Pattern does not fit bar count
- Strict 4+4 symmetry for extended passage
- No asymmetry in output

**Validation hooks:**

- Phrase asymmetry check

---

## MODULE 4 — FORM GENERATOR

**Input:**

- Form archetype (8-bar theme, 12-bar blues, AABA, modular chain, short form)
- Target length (bars)
- Section count

**Process:**

1. Select archetype from shorter_form_archetypes.md
2. Define sections
3. Assign phrase groups to sections
4. Define linkage rules for modular chains

**Output:**

- Form structure (section_id, bar ranges, phrase groups)

**Failure conditions:**

- Form exceeds target length
- Section boundaries invalid
- Modular chain lacks linkage logic

**Validation hooks:**

- Form coherence
- Narrative arc (build, release, suspend)

---

## MODULE 5 — RHYTHMIC PLACEMENT SYSTEM

**Input:**

- Phrase structure
- Motif events
- Rhythmic pattern (base pulse, delayed entry, displacement, phrase stretch, tresillo, 3-over-2)

**Process:**

1. Assign rhythmic layer per event
2. Place attacks on beat grid
3. Apply displacement or delayed entry
4. Ensure convergence every 4–8 bars

**Output:**

- beat_position, duration per event
- rhythmic_layer tag

**Failure conditions:**

- No convergence in 8+ bars
- Invalid beat position
- Duration exceeds bar

**Validation hooks:**

- Rhythmic coherence
- Convergence density

---

## MODULE 6 — ENSEMBLE ROLE MAPPING

**Input:**

- Event list
- Ensemble configuration (piano trio, quartet, lead sheet, etc.)
- Staff/voice count

**Process:**

1. Assign role per event: melody, counterline, harmonic_color, rhythmic_punctuation, bass
2. Map to staff_or_voice
3. Ensure no instrument purely accompaniment
4. Distribute motivic material

**Output:**

- role, staff_or_voice per event

**Failure conditions:**

- All events on one staff
- No counterline or color when ensemble supports it
- Melody + chord only (collapse)

**Validation hooks:**

- Ensemble equality
- Role diversity
