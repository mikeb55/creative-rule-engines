# Changelog

## [Unreleased]

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
