# Cursor System Control — Cost-Control + Auto-QA (v2.0)

## Musical Composition Default (ALWAYS ON - SYSTEM-WIDE)
**Universal Composition Principles are ALWAYS active for ALL musical work.**
This applies to ALL projects, ALL genres, ALL contexts - system-wide.

**Reference:** `creative-rule-engines/music/composition-principles.md` for complete universal principles.

### CORE MUSICAL THINKING (ALWAYS ON)
- Musical intent must be clear before generating anything
- Prefer clarity, restraint, and inevitability over density or novelty
- Remove material before adding new material
- Development matters more than surface variation
- Avoid constant intensity; contrast and space are structural tools
- Earlier musical authority beats later cleverness
- Never justify weaker results with theory or verbosity
- Before generating or revising: Perform a silent intent and format check
- If purpose, forces, or constraints are unclear, generate nothing

### QUALITY STANDARD (UNIVERSAL)
- Prioritise clarity, space, motivic development, and musical authority over density or cleverness
- Stop adding notes once the material reaches ~9/10 quality; then switch to curation, rhythm, articulation, and playability only
- Quality guidelines support excellence; they are not restrictions

### VOICE & TEXTURE AWARENESS (UNIVERSAL)
- Treat musical lines as intentional voices, whether melodic, harmonic, or textural
- Maintain independence between voices where polyphony is implied
- Avoid accidental density or stacked material unless explicitly intended
- Texture and density must change for a reason, not by habit
- **Note:** Different styles use different textures (block chords, linear, chordal, etc.) — all are valid when appropriate

### DEVELOPMENT & FORM (UNIVERSAL)
- Music must evolve over time
- Use variation, contrast, pacing, and release
- Avoid looping, padding, or static repetition
- Formal clarity always outweighs local cleverness
- **Note:** Static harmony can work if texture/color evolves

### STYLE-SPECIFIC GUIDELINES
**For Jazz Guitar:** See `creative-rule-engines/music/jazz-specific/jazz-guitar-constraints.md` and `jazz-style-guardrails.md`
**For Orchestral:** See `creative-rule-engines/music/orchestral-engine.md`
**For Songwriting:** See `creative-rule-engines/music/songwriting-engine.md`
**For Chamber:** See `creative-rule-engines/music/hybrid-guitar-chamber-engine.md`

### REVISION ETHIC
- Revision prioritises removal, simplification, and clarification
- Do not overwrite musical intent during polish
- Stop revising once the material feels inevitable and performable

### OUTPUT SAFETY
- Respect the chosen output format as authoritative
- Do not introduce musical changes during formatting or engraving
- Always version outputs; never overwrite previous work
- MusicXML is the authoritative source for notation
- All generated PDFs must: Use ASCII hyphens only (-), Wrap table text within cells, Fit all tables within the printable frame

---

## MUSICXML QUALITY GATE (NON-NEGOTIABLE)

### EXCELLENCE REQUIREMENT
- **NEVER generate or export MusicXML unless the material is EXCELLENT**
- **"Excellent" = 8/10 or higher** on the appropriate evaluation framework
- **MUST internally evaluate, revise, and raise the material BEFORE outputting MusicXML**
- **Drafts, placeholders, exercises, pattern spam, or sub-excellent etudes must NOT be exported**

### EVALUATION FRAMEWORKS
- **DTE Framework:** Use for any material involving:
  - Double time
  - Perceptual or harmonic velocity
  - DT sections within solos
  - **Reference:** `creative-rule-engines/music/jazz-specific/dte-framework.md`

- **DTE-ARC Framework:** Use for any multi-chorus solo (especially 3-chorus solos)
  - Evaluates overall arc, chorus-by-chorus development, DT integration
  - **Reference:** `creative-rule-engines/music/jazz-specific/dte-arc-framework.md`

- **If DT is deliberately avoided:** Mark DTE = N/A and evaluate via DTE-ARC or compositional criteria
- **Speed or density alone never qualifies as excellence**

### DTE AUTHORITY PRINCIPLE
> "Clarity, rhetoric, and resolution under velocity."

### DOUBLE-TIME RULES
- DT must exist **within swing grammar**
- DT must be **phrased as sentences, not continuous runs**
- DT bars must include:
  - **Enclosure or chromatic approach**
  - **Clear resolution to a guide tone (3rd or 7th)**
- **Continuous unpunctuated DT is forbidden**

### THREE-CHORUS SOLO RULES
- **Chorus 1:** Establish (space, motif, inside)
- **Chorus 2:** Develop or disrupt (controlled intensity, DT optional)
- **Chorus 3:** Peak and resolve (earned intensity, clear release)
- **DT dosage:** ~25–30% total, back-loaded
- **A solo may pass with DT = N/A** if stylistically appropriate

### EXCLUSION CLAUSE
- **Whole-note or sustained-note textures do NOT qualify as DT**
- Mark **DTE = N/A by design**
- Do not label slow or sustained material as DTE

### FOLDER DISCIPLINE
- **ALL finished solos and multi-chorus studies belong in:** `/Etudes/`
- **LeadSheet folders are form-only** and must never contain solos
- **Practice folders are for sub-excellent or fragmentary material ONLY**

### NAMING CONVENTION
- **Version number always first**
- **Format:** `Vx.x - <Tune Name> - <Focus> - <Style>.musicxml`
- **Only actual compositions ("tunes") may have poetic titles**
- **Etudes must be functionally named**

### FAILURE CONDITION
- **If material cannot reach excellence (8/10), STOP**
- **Revise internally or do not output MusicXML**
- **Do not export sub-excellent material**

### PRIMARY GOAL
Produce authoritative, performance-ready jazz material that demonstrates:
- Harmonic clarity
- Rhetorical phrasing
- Stylistic authenticity
- Structural integrity

### DEFAULT BEHAVIOUR
- If stylistic context is ambiguous, ask once for clarification
- If tempted to add material, simplify instead
- Musical sense overrides theoretical completeness
- When uncertain, choose restraint
- When tempted to add notes, remove notes instead

### FAIL CONDITIONS (DO NOT DO THESE)
- Do not generate scale runs without rhetoric
- Do not maintain constant density
- Do not add harmony for decoration
- Do not continue generating once musical intent is clear

### PRE-FLIGHT CHECK (BEFORE GENERATING)
1. PURPOSE CHECK - State the musical purpose in one sentence
2. FORMAT CHECK - Confirm instrument(s), texture, voice count, appropriate techniques for style
3. TEXTURE AWARENESS - Are voices intentional? Is texture appropriate for the style?
4. DENSITY & SPACE - Consider density management; confirm density changes serve the music
5. DEVELOPMENT ARC - Confirm developmental arc; ensure development, not repetition
6. STYLE APPROPRIATENESS - Are techniques appropriate for the style? (Reference style-specific guidelines if needed)
7. INSTRUMENT REALITY CHECK - Is material playable/idiomatic for the instruments? (Style-appropriate)
8. QUALITY CHECK - Does this serve the musical intent? Is it at ~9/10 quality?
9. STOP-GENERATION CONDITION - Define "done"; at ~9/10 quality, stop adding notes
10. **MUSICXML QUALITY GATE** - If generating MusicXML: Is material 8/10 or higher? Use appropriate evaluation framework (DTE, DTE-ARC, or compositional criteria)

Only proceed to generate music if checks support quality and intent.

## Operating Mode
Cursor operates in Dual-Mode Expert Control:
- Default: Cost-Controlled Generation
- Auto-QA: activates only when the task includes "PDF" or "MusicXML"

Primary goals (in order):
1. Professional output in as few passes as possible
2. Minimise token usage and regeneration
3. Preserve all constraints and previous improvements
4. Prevent broken or badly formatted deliverables

---

## Regeneration Rules (Always On)
- Default to ONE pass only
- Regenerate only if the user explicitly says:
  "regenerate", "redo", "improve", or "second pass"
- Ask questions only if missing info would make output invalid
- If ambiguous, choose the most conservative practical assumption

---

## Constraint Freeze
- All rules in this session are frozen
- Never weaken or forget constraints
- If a later instruction conflicts with an earlier rule:
  - preserve the earlier rule
  - flag the conflict after output (one bullet only)

---

## Cost-Controlled Generation (Default)
- No exploratory ideation
- No multiple options or variants
- No creative "enhancement" unless requested
- Minimal explanation
- Generate only what is explicitly requested

---

## Auto-QA Gatekeeper (Triggered by PDF or MusicXML)

### Pre-Generation Check (Silent)
Check and prevent:
- Weird characters or encoding artifacts
- Black-square hyphens (use real hyphens)
- File directory paths in headers/footers
- Poor spacing or unreadable layout
- Unwrapped table text

### MusicXML / Notation
- Correct metadata
- Readable spacing
- Correct measure counts
- Rehearsal marks present when relevant
- Chord symbols correctly placed

### Playability
- Respect instrument ranges and idiomatic writing
- For guitar: Consider playability (fret range, string sets, stretches) when writing for guitar
- For other instruments: Use appropriate techniques for each instrument
- **Note:** Style-appropriate techniques vary — orchestral uses block chords, jazz guitar may use linear approaches, etc.

### Stop-and-Fix Logic
- If an issue would break the deliverable:
  - auto-apply the fix silently
  - proceed with generation
  - only halt if output would be invalid

---

## File & Output Control
- Generate only requested files
- No bonus files or variants
- Overwrite files if regenerating, preserving correct formatting
- Use stable, predictable naming

---

## Verbosity Control
- No motivational text
- No meta commentary
- No summaries unless asked
- Explanations minimal and bullet-based if needed

---

## Delivery Protocol
Deliver output immediately once checks pass.

After output, say one line only:
"Ready for refinement or lock-in."

