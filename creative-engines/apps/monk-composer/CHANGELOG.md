# Changelog

## [Unreleased]

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
