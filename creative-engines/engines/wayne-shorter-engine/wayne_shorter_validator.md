# Wayne Shorter Engine Validator

**Purpose:** Enforce Shorter stylistic authenticity and reject generic jazz output through measurable, reproducible checks.

---

## DEFINITIONS (Required for Validation)

### Motivic Trace

**Definition:** An event **traces** to a motivic source if its pitch sequence (or interval sequence) matches one of the following:

1. **Exact cell:** Interval sequence matches a defined interval cell (see shorter_interval_cell_library.md).
2. **Transformed cell:** Interval sequence matches a transformation of the cell:
   - **Inversion:** Mirror around first or last note.
   - **Transposition:** Same intervals, different root (m3, tt, P4 preferred).
   - **Fragment:** Subset of cell (minimum 3 notes).
   - **Extension:** Cell plus one added note (maximum 6 notes total).
   - **Rhythmic displacement:** Same pitches, different beat placement (delayed entry, pulse displacement).
3. **Contour fragment:** At least 3 consecutive melodic intervals match a cell's contour (direction and relative size: up/down, leap/step).

**Motivic continuity rule:** A motif cell must appear at least **twice** in transformed form across the output. At least **70%** of melodic events must trace to a defined cell or transformation.

**Fail:** Melodic material is scalar (stepwise runs of 4+ notes), arpeggiated (chord tones in sequence without cell logic), or unrelated to any cell.

---

### Harmonic Distinctness

**Definition:** Two harmonic behaviors are **distinct** if they use different **field types**:

- **Modal** (Field A, B, C): Dorian, Phrygian, Lydian
- **Chromatic planing** (Field D, E): Half-step or whole-step root movement
- **Pedal** (Field F): Static bass with shifting upper structure
- **Turnaround** (Field G): Footprints-style chromatic progression

**Same type, different root** (e.g., Dorian C vs. Dorian F) = **not distinct**. Same field type.

**Harmonic color diversity rule:** Output must include at least **2 distinct field types**. If the same field type repeats (e.g., modal in bars 1–4 and bars 5–8), the repeated color must be **transformed** by at least one of: inversion, bass register shift, extension change (e.g., Cm7 → Cm9).

**Fail:** Single field type throughout with no transformation.

---

### Phrase Asymmetry

**Definition:** Phrase groups are **asymmetric** if they are not all equal length.

**Measurable rule:**

- **Pass:** At least one phrase grouping is irregular. Acceptable shapes: 3+5, 5+4, 4+4+3, 7+5, 3+3+2, 6+6, 5+7, 4+3+4, or other non-4+4 patterns.
- **Fail:** All phrase groups are equal length (e.g., 4+4+4+4 for 8+ bars) with no variation.

**For 8-bar phrases:** 4+4 is allowed **only if** harmonic or motivic asymmetry is present (e.g., different harmonic field in each 4-bar block, or motivic transformation in second half).

**For 12-bar phrases:** 6+6 is allowed (asymmetric to 4+4+4); 4+4+4 fails.

---

### Loop / Narrative Check

**Definition:** A **loop** is a literal repetition of a section with no motivic or harmonic transformation.

**Rule:** Reject if the form contains a section that is **literally repeated** without:

- Motivic transformation (inversion, transposition, fragment, extension, displacement), or
- Harmonic transformation (field change, planing shift, extension change).

**Examples:**
- **Fail:** AABA with A' identical to A (same pitches, same rhythm, same harmony).
- **Pass:** AABA with A' = transposed or inverted motif over same or transformed harmony.
- **Fail:** 8-bar theme repeated exactly for 16 bars.
- **Pass:** 8-bar theme with second statement transformed (e.g., register shift, fragment).

---

### Monophonic Collapse Check

**Definition:** Output has **monophonic collapse** if it contains only melody events (role=melody) with no other musical roles.

**Rule:** Valid outputs must include at least **two musical roles** from: melody, counterline, harmonic_color, rhythmic_punctuation, bass.

**Minimum:** melody + (counterline OR harmonic_color OR bass).

**Fail:** Only melody events. No counterline, no harmonic_color, no bass, no rhythmic_punctuation.

**Pass:** Melody + counterline; or melody + harmonic_color; or melody + bass; or any combination of 2+ roles.

---

### GCE Threshold (Generic Jazz Cliché Exclusion)

**Definition:** GCE = (Sum of 5 dimension scores / 10) × 10, yielding 0–10 scale.

**Dimensions (each 0–2):**

| Dimension | 0 (Generic) | 1 (Partial) | 2 (Strongly Shorter-like) |
|-----------|-------------|-------------|---------------------------|
| Motivic identity | No cell logic; scalar/arpeggiated | Some cells; mixed with generic | Consistent cell use; transformations throughout |
| Harmonic originality | ii–V–I default; predictable | Some planing/modal; 1–2 V–I | Non-functional; planing/modal; no V–I |
| Phrase irregularity | 4+4 throughout | One irregular grouping | Multiple irregular groupings; delayed/early cadence |
| Interval consistency | Random intervals; bebop clichés | Mostly cell-aligned; 1–2 violations | All intervals from cells; no scalar runs |
| Ensemble equality | Melody + chord only | 2 roles; one thin | 3+ roles; all carry structural material |

**Pass:** GCE ≥ 9.0 (average ≥ 1.8 per dimension).

**Fail:** GCE < 9.0.

**Ensemble GCE threshold adjustment (melody + bass / melody + harmonic_color):**

- **2-role output** (melody + bass or melody + harmonic_color) can pass GCE 9.0 **only if** both motivic and harmonic dimensions score 2, and phrase asymmetry scores ≥1.
- **Strong motivic + harmonic behavior:** If motivic identity = 2, harmonic originality = 2, and phrase asymmetry ≥1, then Ensemble = 1 is acceptable for pass. Melody + bass with strong cell logic and non-functional harmony does **not** automatically fail.
- **Fragile pass note:** 2-role output at GCE 9.0 is a boundary pass. Prefer 3+ roles for robust Shorter-like output.

**Calibration examples:**
- Phrase with Cell A, Field A, 3+5, melody + counterline + harmonic_color, no ii–V–I → Motivic 2, Harmonic 2, Phrase 2, Interval 2, Ensemble 2 → GCE 10.0 → Pass.
- Phrase with scalar run, one ii–V–I, 4+4, melody only → Motivic 0, Harmonic 0, Phrase 0, Interval 0, Ensemble 0 → GCE 0.0 → Fail.
- Phrase with Cell B, Field D, 5+4, melody + bass, no V–I, strong motivic trace → Motivic 2, Harmonic 2, Phrase 2, Interval 2, Ensemble 1 → GCE 9.0 → Pass (boundary; strong motivic/harmonic compensates).

---

## VALIDATION CHECKS

### CHECK 1 — Motivic Continuity

**Pass:** ≥70% of melodic events trace to a cell or transformation; motif appears ≥2 times in transformed form.

**Fail:** Scalar, arpeggiated, or unrelated material; motif appears once or not at all.

**Action:** Reject or require regeneration with stronger motivic binding.

---

### CHECK 2 — Harmonic Ambiguity

**Pass:** No more than 1 dominant-tonic resolution per 8 bars; chromatic planing or modal motion present.

**Fail:** ii–V–I or V–I as default; predictable cadences.

**Action:** Reject or require harmonic field regeneration.

---

### CHECK 3 — Phrase Asymmetry

**Pass:** At least one irregular phrase grouping (3+5, 5+4, 4+4+3, 7+5, etc.); or 4+4 with harmonic/motivic asymmetry.

**Fail:** Strict 4+4+4+4 for 8+ bars without variation.

**Action:** Reject or require phrase architecture regeneration.

---

### CHECK 4 — Interval Logic Consistency

**Pass:** Melodic intervals align with interval cell library; no arbitrary scalar runs (4+ stepwise notes).

**Fail:** Intervals violate cell logic; bebop clichés present.

**Action:** Reject or require motif regeneration.

---

### CHECK 5 — Harmonic Color Diversity

**Pass:** At least 2 distinct field types; or same type with transformation (inversion, bass shift, extension).

**Fail:** Single field type throughout with no transformation.

**Action:** Reject or require harmonic field variety.

---

### CHECK 6 — Loop / Narrative

**Pass:** No literal section repeat without motivic or harmonic transformation.

**Fail:** Section A repeated identically (same pitches, rhythm, harmony).

**Action:** Reject or require form/motif regeneration.

---

### CHECK 7 — Monophonic Collapse

**Pass:** At least 2 roles present: melody + (counterline OR harmonic_color OR bass).

**Fail:** Only melody events.

**Action:** Reject or require ensemble role assignment.

---

### CHECK 8 — GCE Threshold

**Pass:** GCE ≥ 9.0.

**Fail:** GCE < 9.0.

**Action:** Reject output; do not export.

---

## VALIDATION ORDER

1. Motivic continuity
2. Harmonic ambiguity
3. Phrase asymmetry
4. Interval logic consistency
5. Harmonic color diversity
6. Loop / narrative
7. Monophonic collapse
8. GCE

If any check fails, reject before export.

---

## REJECTION SUMMARY

Reject if:

- motivic continuity fails
- harmonic ambiguity fails
- phrase asymmetry fails
- interval logic consistency fails
- harmonic color diversity fails
- loop / narrative fails (literal repeat)
- monophonic collapse (melody only)
- GCE < 9.0
