# Harmonic Engine Test Pieces

Test pieces for the Barry Harris v2 and Monk v2 harmonic engines.

## Structure

```
tests/
├── guitar/           # Guitar chord studies (idiomatic fretboard, 3–4 notes)
│   ├── barry_test_01.musicxml
│   └── monk_test_01.musicxml
├── piano/            # Piano studies (shell voicings, grand staff)
│   ├── barry_test_01.musicxml
│   └── monk_test_01.musicxml
├── bigband/          # Orchestral harmonisation (after guitar/piano pass)
│   ├── barry_test_chart.musicxml
│   └── monk_test_chart.musicxml
├── evaluate_gce.ts   # GCE evaluation script
└── README.md
```

## Evaluation

Run GCE evaluation on guitar and piano tests:

```bash
npx tsx tests/evaluate_gce.ts
```

Target: GCE ≥ 9.0 for all guitar and piano tests.

## Engine Specs

- **Barry Harris v2:** `engines/barry_harris_engine_v2.md` — movement-first, C6/B°7 alternation
- **Monk v2:** `engines/monk_engine_v2.md` — shell voicings, off-beat attacks, rhythmic gaps

## Critical Rules

- Do not optimise phrasing
- Do not balance symmetry
- Preserve asymmetry
