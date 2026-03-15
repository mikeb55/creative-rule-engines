# Wayne Shorter Form Archetypes

**Purpose:** Define form structures for the Shorter engine.

---

## RUNTIME-READY FORM STRUCTURES (Stage 2)

The following form structures are **validated and runtime-ready** for the minimal prototype:

| Form Type | Phrase Structure | Harmonic Field Behavior | Motivic Behavior |
|-----------|------------------|-------------------------|------------------|
| **Asymmetrical AABA** | A: 3+5 or 5+4; B: 4+3+4 or 4+4+3; A': 5+3 or 4+4 (with asymmetry) | A: modal; B: turnaround (Field G) or planing; A': same as A with extension change | A' = transposed or inverted motif; never literal A |
| **Episodic chain** | 5+4 → 6+3 → 8; or 4+3 → 5+4 → 4; or 3+3+2 → 5+5 | Field rotation: modal → planing → modal; each episode different field | Motif transforms (transpose, invert, fragment) across episodes; no literal return |
| **Motif-driven sectional** | 3+5 → 4+4 → 7+5; or 7+5 → 4+4+3 → 3+3+2 | 2–3 distinct field types across form | Statement → invert → fragment/extend; no literal repeat |

---

## RUNTIME FORM RULE TABLES

### Asymmetrical AABA

| Rule | Specification |
|------|---------------|
| Form type | asymmetrical_aaba |
| Phrase structure | A: 3+5 or 5+4 (8–9 bars); A repeat: same; B: 4+3+4 or 4+4+3 (11 bars); A': 5+3 or 4+4 with asymmetry |
| Harmonic field behavior | A: Field A, B, or C (modal); B: Field G (turnaround) or Field D/E (planing); A': Field A/B/C with extension change (Cm7→Cm9) |
| Motivic behavior | Cell selected at seed; A: statement; B: invert; A': transpose (m3, tt, P4) — never literal A |
| Section IDs | A, A, B, A_prime |

### Episodic Chain

| Rule | Specification |
|------|---------------|
| Form type | episodic_chain |
| Phrase structure | Option A: 5+4 → 6+3 → 3+5 (22 bars); Option B: 4+3 → 5+4 → 4 (20 bars); Option C: 3+3+2 → 5+5 (18 bars) |
| Harmonic field behavior | Each phrase in different field type; rotation: modal → planing → modal (e.g., A→D→C or C→E→A) |
| Motivic behavior | Same cell throughout; phrase 1: repeat; phrase 2: transpose; phrase 3: invert or fragment |
| Section IDs | A (single section; phrases are episodes) |

### Motif-Driven Sectional

| Rule | Specification |
|------|---------------|
| Form type | motif_driven_sectional |
| Phrase structure | Option A: 3+5 → 4+4 → 7+5 (24 bars); Option B: 7+5 → 4+4+3 → 3+3+2 (24 bars) |
| Harmonic field behavior | 2–3 distinct field types; e.g., Field A → Field D → Field F |
| Motivic behavior | Phrase 1: statement; phrase 2: invert (4+4 has motivic transformation between halves); phrase 3: fragment + extend |
| Section IDs | A (single section) |

---

## ARCHETYPE 1 — 8-Bar Theme

**Length:** 8 bars

**Structure:** Single phrase or 3+5, 5+3, 3+3+2

**Use:** Melody study; motif exploration

---

## ARCHETYPE 2 — 12-Bar Blues (Chromatic Turnaround)

**Length:** 12 bars

**Structure:** 7+5, 6+6, 5+7, or 4+4+3

**Harmonic:** Blues foundation with chromatic turnaround (Footprints-style)

**Use:** Lead sheet; blues with Shorter flavor

---

## ARCHETYPE 3 — AABA (Altered Bridge)

**Length:** 32 bars (8+8+8+8) or 16 bars (4+4+4+4)

**Structure:** A sections similar; B bridge with harmonic surprise

**Use:** Short form composition

---

## ARCHETYPE 4 — Modular Phrase Chain

**Length:** Variable (8–24 bars)

**Structure:** Phrases link without literal repetition; each phrase derives from shared motivic source

**Linkage:** Motivic transformation; no exact repeat of A

**Use:** Narrative form; through-composed feel

---

## ARCHETYPE 4a — Shorter-Style Episodic Chain ✅ RUNTIME-READY

**Length:** 18–26 bars

**Structure:** Episodic phrase sequence; each phrase is a distinct episode with shared motivic DNA. No literal return.

**Phrase patterns:** 5+4 → 6+3 → 8; or 4+3 → 5+4 → 4; or 3+3+2 → 5+5

**Harmonic:** Field rotation (modal → planing → modal). Each episode in different field.

**Linkage:** Motif transforms (transpose, invert, fragment) across episodes. No A' = A.

**Use:** Episodic Shorter feel; through-composed narrative.

**Validated:** FC02, FC05, FC07

---

## ARCHETYPE 3a — Asymmetrical AABA Variant ✅ RUNTIME-READY

**Length:** 24–32 bars

**Structure:** A sections use irregular phrase lengths (3+5, 5+3); B bridge with harmonic surprise; A' returns with **transformed** motif (transpose, invert), not literal A.

**Phrase patterns:** A: 3+5 or 5+4; B: 4+3+4 or 4+4+3; A': 5+3 or 4+4 (with asymmetry)

**Harmonic:** A: modal; B: turnaround (Field G) or planing; A': same as A with extension change.

**Rule:** A' must not be literal repeat. Transposed or inverted motif satisfies Ch6.

**Use:** Song form with Shorter asymmetry.

**Validated:** FC03

---

## ARCHETYPE 4b — Motif-Driven Sectional Form ✅ RUNTIME-READY

**Length:** 20–28 bars

**Structure:** Asymmetrical phrase chain (e.g., 3+5 → 4+4 → 7+5) with continuous motivic trace. Each section transforms motif.

**Phrase patterns:** 3+5 → 4+4 → 7+5; 7+5 → 4+4+3 → 3+3+2

**Harmonic:** 2–3 distinct field types across form.

**Linkage:** Motif stated → inverted → fragmented/extended. No literal repeat.

**Use:** Narrative phrase sequence; build/release arc.

**Validated:** FC01, FC04

---

## ARCHETYPE 5 — Short Complete Form

**Length:** 16–32 bars (2–4 min equivalent)

**Structure:** Intro, theme, development, closure

**Sections:** 2–4 sections; each with distinct harmonic field

**Use:** Complete composition sketch

---

## ARCHETYPE 6 — Modal Vamp with Motivic Development

**Length:** 8–16 bars

**Structure:** Static harmonic field; melody develops over vamp

**Use:** Nefertiti-style; melody as mantra

---

## FORM SELECTION RULES

1. Match form to output type (melody study → 8-bar; lead sheet → 12-bar or AABA).
2. Modular chain for narrative form.
3. Short complete form for full composition sketch.
4. Modal vamp for minimal harmony focus.

---

## NARRATIVE ARC

Forms should support:

- **Build:** Tension or density increase
- **Release:** Resolution or density decrease
- **Suspend:** Sustained tension; deferred resolution

---

## REJECTION RULES

- Reject forms with no structural variation
- Reject literal repetition without transformation
- Reject forms that default to generic song structure

---

## FORM PATTERNS FROM STAGE 1 STRESS TESTS (2026-03-15)

| Pattern | Example | Validator |
|---------|---------|-----------|
| Asymmetrical phrase chain | 3+5 → 4+4 → 7+5 | PASS |
| Episodic with field rotation | 4+3 → 5+4 → 4 | PASS |
| Asymmetrical AABA | A(3+5)×2, B(4+3+4), A'(5+3) | PASS |
| Narrative sequence | 7+5 → 4+4+3 → 3+3+2 | PASS |
| 4+4 with motivic/harmonic asymmetry | 4+4 → 4+4 (each half transforms) | PASS |
| Modular chain (no literal repeat) | 3+3+2 → 5+5 | PASS |
| Short complete (intro–theme–dev–closure) | 4, 5+4, 4+4+3, 4 | PASS |
| 12-bar blues variant | 7+5 | PASS |
| Modal vamp with motivic development | 4+4 → 4+4 (each half transforms) | PASS |
