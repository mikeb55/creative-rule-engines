# Wayne Shorter Engine Pipeline

Shorter engine generation follows the standard architecture:

```
form
→ motif
→ harmonic field
→ phrase architecture
→ rhythmic placement
→ ensemble roles
→ export
→ validation
```

Each stage pulls material from rule libraries.

---

## STAGE 1 — FORM GENERATOR

**Uses:** shorter_form_archetypes.md

**Process:**

1. Select form archetype (8-bar theme, 12-bar blues, AABA, modular chain, short form)
2. Define section boundaries
3. Set phrase count and linkage rules

**Output:** Form structure (sections, phrase groups, bar counts)

---

## STAGE 2 — MOTIF GENERATOR

**Uses:** shorter_interval_cell_library.md, shorter_style_grammar.md

**Process:**

1. Choose interval cell
2. Generate pitch sequence (3–6 notes)
3. Apply transformation (repeat, invert, transpose, fragment, extend, interrupt)

**Allowed transformations:**

- repeat
- invert
- transpose (m3, tt, P4)
- fragment
- extend
- interrupt

**Output:** Motif fragment (3–6 notes)

---

## STAGE 3 — HARMONIC FIELD GENERATOR

**Uses:** shorter_harmonic_fields.md

**Process:**

1. Select harmonic field (modal, chromatic planing, pedal, suspended)
2. Map motif notes to field
3. Generate supporting tones
4. Apply chromatic root movement rules

Harmony is non-functional.

Avoid dominant-tonic motion.

**Allowed motion:**

- chromatic planing (half-step, whole-step)
- shared pitch pivot
- interval cell mutation
- pedal with shifting upper structure

**Output:** Harmonic environment per section/phrase

---

## STAGE 4 — PHRASE ARCHITECTURE GENERATOR

**Uses:** shorter_phrase_generation_rules.md

**Process:**

1. Choose phrase pattern (3+5, 5+4, 4+4+3, 7+5, etc.)
2. Place motif fragments across phrase
3. Apply transformation per fragment
4. Allow interruptions, restarts, overlaps

Reject strict 4+4 symmetry as default.

**Output:** Phrase structure with bar boundaries and motif placement

---

## STAGE 5 — RHYTHMIC PLACEMENT SYSTEM

**Uses:** shorter_rhythmic_patterns.md

**Process:**

1. Assign rhythmic layer (base pulse, delayed entry, displacement, phrase stretch)
2. Apply cross-rhythm patterns (tresillo, 3-over-2) where appropriate
3. Place motif attacks
4. Ensure convergence points every 4–8 bars

**Output:** Beat positions, durations, rhythmic layer per event

---

## STAGE 6 — ENSEMBLE ROLE MAPPING

**Uses:** shorter_event_schema.md (role field)

**Process:**

1. Assign role per event: melody, counterline, harmonic_color, rhythmic_punctuation, bass
2. Ensure no instrument is purely accompaniment
3. Distribute motivic material across voices

**Output:** Role and staff/voice per event

---

## STAGE 7 — EXPORT

**Uses:** shorter_musicxml_export_spec.md

**Process:**

1. Convert events to MusicXML
2. Preserve simultaneity and staff ranges
3. Output melody-only, lead sheet, piano reduction, or ensemble sketch

**Output:** MusicXML file

---

## STAGE 8 — VALIDATION

**Uses:** shorter_validator.md

**Process:**

1. Run motivic continuity check
2. Run harmonic ambiguity check
3. Run phrase asymmetry check
4. Run interval logic consistency check
5. Run harmonic color diversity check
6. Run loop/narrative check
7. Run monophonic collapse check
8. Compute GCE; reject if < 9.0

**Output:** Pass/fail; if fail, regenerate or reject
