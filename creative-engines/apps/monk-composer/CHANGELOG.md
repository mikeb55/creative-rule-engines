# Changelog

## [Unreleased]

### 2025-03-11 — Barry/Monk Guitar & Piano Chord Generation Fix (v0.6.0)

- **Internal chord-event model** — New `musicEvents.ts` with `MusicEvent` (pitches[], duration, beatPosition, staff, voice, role). Stops flattening harmony into note streams; supports genuine simultaneity.

- **Separation of harmony and voicing** — Barry and Monk engines output harmonic instructions (chord symbols, guide tones, shells); target-specific voicing engines translate to instrumental notation.

- **Guitar voicing engine** — `guitarVoicingEngine.ts` produces real chord events: shells, guide-tone dyads, compact triads. At least one chord event every two measures. Valid string grouping, realistic fret span. Mixed texture: line, dyad, triad, stab, rest.

- **Piano voicing engine** — `pianoVoicingEngine.ts` produces true two-staff writing. LH: shell, root/guide-tone support, sparse movement. RH: melody, compact voicings. Phrase breathing, release at cadences. Regular 3+ note harmonic events.

- **Hard idiom validators** — `idiomValidators.ts` rejects outputs that fail: guitar (playable grips, chord-event %, mixed texture); piano (two staves, LH/RH independence, simultaneity threshold).

- **GCE hard caps** — Guitar: cap at 6.5 if >65% single-note; cap at 6.0 if chordal texture not recurrent. Piano: cap at 5.5 if no LH/RH independence; cap at 5.5 if max simultaneity < 3; cap at 5.0 if melody + occasional bass. GCE ≥ 9 only when idiom and export validators pass.

- **Self-test loop** — Revision loop runs idiom validators, export validation, GCE; regenerates on failure until pass.

- **Audit panel** — Shows target type, staff/voice counts, chord-event %, average/max simultaneity, LH/RH activity ratio, guitar grip validity, motif recurrence, GCE, export validation.

- **Sibelius export** — MusicXML 3.0 default, piano `<staves>2</staves>`, correct RH/LH voice separation, chord grouping by voice. Canonical export path shared by script and GUI.

- **Big band deferred** — Big band template utilities retained; big band gated behind successful guitar and piano generation.

- **Generation script** — `npx tsx scripts/generate-fixed-outputs.ts` produces `barry-guitar-fixed.musicxml`, `monk-guitar-fixed.musicxml`, `barry-piano-fixed.musicxml`, `monk-piano-fixed.musicxml` with retry until idiom and export pass.

### 2025-03-11 — Target-Specific Idiom Rules and Template-Based Big Band (v0.5.0)

- **Target-specific idiom rule sets** — Guitar, piano, and big band now use dedicated idiom modules (`guitarIdiomRules.ts`, `pianoIdiomRules.ts`, `bigBandIdiomRules.ts`) instead of generic voicing engines. Each target enforces idiomatic constraints: compact chord vocabulary, string-group awareness (guitar); two-hand independence, phrase breathing (piano); section roles, counterlines, density arc (big band).

- **Template-based big band score generation** — Big band exports use a normalized 6-part template (Trumpet 1, Alto Sax 1, Tenor Sax 1, Trombone 1, Piano, Bass) with correct part order, names, and transpositions. MusicXML export produces proper multi-part scores instead of piano grand staff.

- **Permanent self-test harness** — `selfTest.ts` runs automatically after generation and revision. Tests: chord density, monophonic fallback, guitar/piano/big band idiom, motif recurrence, phrase shape, rhythmic life, export verification, usability score. Hard pass: GCE ≥ 9.0, idiom pass, export verified.

- **Export verification** — `exportValidators.ts` validates exported MusicXML: correct chord tags, simultaneity preserved, part count, part names. Rejects export if validation fails.

- **Motif-first generation** — Chordal targets (guitar, piano, big band) use motif-first pipeline: seed motif → variation → harmonic interpretation → target idiom translation. Pipeline: `motifEngine.ts` → `targetTranslator` → idiom rules.

- **Idiom Status UI** — Audit panel shows chord event count, motif recurrences, target idiom pass/fail, export verification status for chordal targets.

- **Generation script** — `npm run generate-idiomatic` produces all 6 idiomatic outputs in order: guitar (Barry, Monk), piano (Barry, Monk), big band (Barry, Monk). Outputs: `outputs/barry-guitar-idiomatic.musicxml`, `outputs/monk-guitar-idiomatic.musicxml`, etc.

### 2025-03-11 — Fix Unresponsive Buttons (v0.4.4)

- **Fixed Raise to GCE ≥ 9.0** — Now runs revision loop, updates composition/scores/warnings, and shows status feedback. Disabled when no composition exists.

- **Fixed Regenerate Weakest Section** — Calls revision loop; shows status. Disabled when no composition.

- **Fixed Save Preset** — Uses file save dialog instead of prompt. Saves preset JSON to user-chosen location. Shows success/error feedback. Disabled when not running as desktop app.

- **Fixed Load Preset** — Uses file open dialog to pick preset JSON. Populates UI from loaded preset. Shows success/error feedback. Disabled when not running as desktop app.

- **Added status feedback area** — Visible messages for: Preset saved, Preset loaded, Revision loop complete, No composition available, Error messages. Messages auto-dismiss after 5 seconds.

- **Added debug logging** — In development mode, logs button clicks and handler results.

### 2025-03-11 — Readable Piano/Big Band Notation (v0.4.3)

- **Reduced harmonization density** — Piano and big band now harmonize every 4th note (instead of every 2nd), producing readable scores instead of dense, unplayable notation.

- **Raised minimum bass pitch** — Support tones no longer go below C2 (MIDI 36), avoiding sub-bass (A0, C1) that caused extreme ledger lines and red error markers in Sibelius.

- **Grand staff for piano and big band** — Exports now use treble + bass clef. Notes above middle C go on the treble staff; notes below go on the bass staff. Standard piano layout.

- **Prefer dyads/shells over triads** — Fewer notes per chord for cleaner notation.

### 2025-03-11 — Export Matches Selected Instrument (v0.4.2)

- **Work title uses user filename** — The score title in the exported MusicXML now uses the filename you enter (e.g. `pianoreduc100`) instead of always "Monk Composer - guitar".

- **Chordal targets always regenerate at export** — For Guitar, Piano Reduction, and Big Band Sketch, export now regenerates the composition with the currently selected instrument before writing. This fixes the bug where every export was guitar and monophonic regardless of selection.

### 2025-03-11 — Unified GUI and Script Chord Export

- **Unified GUI and script MusicXML export path** — Both GUI export and script exports (`test:voicing`, `generate-voicing-demo`) now call the same `compositionToMusicXML` function. One canonical exporter for chord-capable output.

- **Fixed chosen-directory export bug** — When the user selects an output directory via Browse or Use Default, the GUI now uses `exportMusicXML(path, filename, xml)` to write directly to that path instead of always opening the save dialog. The chosen directory is respected.

- **Added debug logging for GUI export** — In development mode only, logs export function used (path-based vs dialog), target, event count, chord event count, and destination path.

- **Added visible app version/build label** — UI shows "v0.4.1 — chord export unified" to confirm the rebuilt app is the latest version.

- **Added GUI export validation files** — Test cases: `gui-test-guitar.musicxml`, `gui-test-piano.musicxml`, `gui-test-bigband.musicxml` exported via GUI to verify chord events.

### 2025-03-11 — All Targets Polyphonic (Guitar, Piano, Big Band)

- **Big band voicing added** — Big Band Sketch now uses piano voicing (same as Piano Reduction); exports dyads/triads instead of single-note lines.

- **Auto-regenerate on target change** — When switching instrument (Guitar, Piano Reduction, Big Band), composition regenerates automatically so export always matches the selected target.

### 2025-03-11 — Guitar and Piano Polyphonic Voicing (Fix)

- **Guitar voicing engine fixed** — Deterministic harmonization (every 2nd note + 25% of 4th); fallback support tone when chord tones empty; ensures dyads/triads in export.

- **Piano voicing engine added** — New `pianoVoicingEngine.ts` applies triads, shell voicings, guide-tone dyads to piano target. Same pipeline as guitar.

- **MusicXML chord grouping fixed** — Round offsets to 3 decimals when grouping simultaneous notes; prevents floating-point mismatch from monk phrase displacement.

- **Both guitar and piano** now export actual chord events with `<chord/>` notation.

### 2025-03-11 — Debug Diagnostics Panel and Export

- **Debug diagnostics panel added** — Collapsible "Debug Diagnostics" section in the Audit panel shows raw GCEScores, warnings, and quartetDiagnostics (when target is string quartet).
- **Raw quartet metrics exposed** — violaVln2Ratio, celloVln1Ratio, activeDurationByInstrument, attackDensityByInstrument, restRatioByInstrument, roleEntropyByInstrument, motifParticipationByInstrument, simultaneousMotionRatio, exposedDuoTrioBars, textureRotationCount, motifMigrationCount, repeatedBarWarnings, densityViolations, counterpointEventCount.
- **Diagnostics JSON export added** — "Export Diagnostics JSON" button in Export panel writes a JSON file (e.g. `my_piece_diagnostics.json`) next to the MusicXML export, containing title, timestamp, target, engine selections, scores, warnings, quartet diagnostics, and revision count.
- **Optional dev logging added** — In development mode only, console logs scores, warnings, and quartetDiagnostics after Generate Draft and Raise GCE.

### 2025-03-11 — Quartet Texture Architecture

- **Added texture architecture system** — Texture plan built before voice generation. Piece divided into sections of 2–4 measures; each section assigned FULL, TRIO, DUO, SOLO_PLUS_PUNCTUATION, or PEDAL_TEXTURE. Voices generated according to plan; inactive instruments rest, sustain, or produce short punctuation.

- **Improved density contrast** — Per 16 measures: at least one DUO, one TRIO, one SOLO_PLUS_PUNCTUATION; FULL texture ≤ 40% of bars. Exposed duo/trio sections enforced.

- **Enforced inner voice rests** — Viola must rest in at least one section per 8 measures; must lead/answer motif per 12 measures. Cello must rest or sustain alone per 10 measures; sometimes participates in counterline rather than bass only.

- **New evaluation penalties** — Continuous 4-voice motion, viola zero-rest, missing duo/trio textures, excessive texture uniformity.

- **Regenerated quartet example** — `outputs/lets-see.musicxml` with viola rests, texture contrast, duo/trio sections, inner voices carrying motif material.

### 2025-03-11 — Quartet Evaluation Metrics Overhaul

- **Quartet evaluation no longer relies on raw note counts** — Replaced with active duration, attack density, rest ratio, role entropy, motif participation, texture occupancy, and simultaneous-motion density.

- **Added quartet metrics module** — `quartetMetrics.ts` computes per-instrument active duration, attack density, rest ratio, role entropy, motif participation; plus simultaneous-motion ratio and exposed duo/trio bar count.

- **Improved viola agency rules** — Minimum 50% of Vln2 attack density (unless sustained tension); motif participation every 8–12 bars; role rotation every 2–4 bars.

- **Reduced cello always-on behaviour** — Cello must have rests or textural reduction every 6–10 measures; explicit rest bars inserted when not in marked pedal span.

- **Added texture occupancy and simultaneous-motion controls** — Penalties for excessive all-four-moving passages; rewards for exposed duo/trio textures and textural reduction.

- **New GCE penalties** — Low viola attack density, low viola motif participation, low viola role entropy, cello always-on, cello zero-rest, excessive simultaneous motion, insufficient textural reduction, few exposed duo/trio, high sustained filler without structural function.

- **Regenerated** — `outputs/lets-see.musicxml` with more articulated viola agency, cello rests, fewer all-voices-moving passages, stronger motif participation in inner voices, and more exposed textures.

### 2025-03-11 — Quartet Chamber Composition Upgrade (GCE ≥ 8)

- **Viola agency system** — Viola note count 60–90% of Violin 2; must carry motif at least once every 12 bars; roles alternate every 2–4 bars (counterline, imitation, suspension tension, harmonic wedge, registral bridge, motivic fragment carrier). Auto-rewrite when viola < 50% of Vln2.

- **Ensemble density control** — Activity mask limits to 2–3 instruments normally active. At least one rest/sustain every 3 bars. All four voices only at cadence, climax, or tutti. Density scoring in GCE evaluator.

- **Motif engine strengthened** — Seed motif with 8 transformation types (transpose, invert, rhythm_disp, truncate, expand, compress, interval_expand, interval_compress). At least three transformations per 16 bars; motif in ≥3 instruments.

- **Counterpoint insertion** — Every 8–12 bars: imitation, contrary-motion, or staggered-entry events. Melody fallback when bar is empty.

- **Activity balancing** — Viola < 50% of Vln2 or Cello < 40% of Vln1 triggers revision loop to rewrite those parts.

- **Quartet GCE penalties tightened** — Strengthened penalties for viola inactivity, cello inactivity, lack of counterpoint events, constant ensemble density, static accompaniment, weak motif migration.

- **Revision loop priority** — 1) rewrite viola, 2) rebalance density, 3) inject motif migration, 4) add counterpoint events, 5) reduce simultaneous voice motion, 6) rewrite phrase endings.

- **Regenerated** — `outputs/barry-working-strings.musicxml` with improved viola activity, motif migration, texture contrast, and ensemble density.

### 2025-03-11 — Final Quartet Corrective Pass

- **Stricter anti-repetition rules** — No 1-bar pitch-rhythm cell may repeat more than twice; no 2-bar cell unchanged more than twice; accompaniment must vary within 4 bars.

- **Viola role-rotation improvements** — Viola rotates between counterline, imitation, harmonic wedge, sustained tension, registral bridge, and brief lead. May not act as filler for more than 2 bars; must carry motif at least once per section.

- **Cello role-rotation improvements** — Cello rotates between bass anchor, pedal, counterline, motivic fragment, registral punctuation, and independent support. No 2- or 3-note loop more than twice; must carry motif at least once per section.

- **Texture contrast enforcement** — Every 2–4 bars one instrument rests, sustains, or reduces activity. Complementary figures preferred (moving line vs sustained, staggered entrances, echo responses). Every 4–8 bars visible texture change.

- **Reduced all-instruments-active overuse** — Detects and penalizes passages where all four instruments play the same or similar figures except at cadences/climaxes.

- **Stronger quartet diagnostics** — Audit panel reports repeated-bar warnings, repeated-2-bar-loop warnings, viola usefulness score, cello independence score, texture reduction count, all-voices-active overuse, and complementary-rhythm score.

- **Regenerated quartet demo** — `outputs/monk_quartet_demo.musicxml` regenerated with upgraded generator showing substantially less repetition, more interesting viola and cello writing, clearer texture contrast, and better ensemble conversation.

- **Final stabilization pass** — Revision loop fix order updated: break repeated bar loops, rewrite viola/cello for role variation, reduce overactive tutti, insert rests/sustains, add motif migration and imitation, improve phrase endings.

### 2025-03-11 — String Quartet Engine Upgrade

- **String quartet generator upgraded** — Output now behaves like real chamber composition rather than melody + accompaniment.

- **Texture rotation** — Four texture floors (A/B/C/D) rotate every 4–6 bars:
  - A: Vln1 melody, Vln2 answer, viola suspension, cello bass anchor
  - B: Vln2 melody fragment, Vln1 commentary, viola moving counterline, cello contrapuntal support
  - C: Polyphonic exchange, short imitation chain, viola motivic variation, cello independent movement
  - D: Reduced chamber texture with strategic rests

- **Anti-loop rules** — Viola and cello no longer repeat the same pitch-rhythm pattern more than twice. Roles rotate intentionally across bars.

- **Motivic migration enforced** — Motif seed migrates across instruments using transposition, inversion, rhythmic displacement, and registral transfer. At least three transformations per 16 bars; motif carried by at least three instruments.

- **Quartet-specific GCE penalties strengthened** — Strong penalties for viola filler syndrome, cello loop syndrome, repeated accompaniment cells, static inner voices, lack of texture rotation, lack of motivic migration, non-bowable writing, and upper/lower voice disconnect. Quartet output cannot pass GCE ≥ 9 unless these are resolved.

- **Revision loop improved** — When quartet fails GCE, priority fixes applied in order: rewrite viola, rewrite cello, add motif migration, rotate texture floor, thin upper voices, increase registral contrast, improve phrase endings. Structural rewriting rather than note tweaks.

- **Quartet diagnostics expanded** — Audit panel shows texture rotation count, motif migration count, repeated-cell warnings, inner voice independence score, cello independence score, and viola usefulness score.

- **Export rule** — Quartet MusicXML not exported if GCE < 9; revision loop triggers automatically on export attempt.

- **New quartet demo generated** — `outputs/monk_quartet_demo.musicxml` regenerated with upgraded generator.
