# Wayne Shorter Engine

Generates Shorter-style phrase chains using validated grammar and exports MusicXML for use in Sibelius, Dorico, or MuseScore.

---

## What the Wayne Shorter Engine Does

- **Generates** asymmetrical phrase chains inspired by Wayne Shorter's compositional style
- **Uses** interval cells (m3–tt, P4–m2, etc.), harmonic fields (modal, planing, pedal), and validated form structures
- **Exports** MusicXML files suitable for notation software
- **Validates** output against stylistic rules (motivic trace, harmonic diversity, phrase asymmetry, GCE threshold)

---

## How to Launch the UI

1. **Desktop icon:** Double-click **Wayne Shorter Engine** on your Windows desktop (create via `launcher/create_desktop_shortcut.ps1`)
2. **From engine folder:** Double-click `launcher/WayneShorterEngine.bat`
3. **From terminal:** Run `py ui/wayne_shorter_engine_app.py` from the engine directory
4. See `launcher/README-launcher.md` for troubleshooting

---

## Musical Menu

The UI presents musical choices, not developer controls:

- **Generate:** Melody only, Chord progression, Melody + chord progression, Motif idea, Full sketch (melody + bass)
- **Form:** Episodic, Motif-driven sectional, Asymmetrical AABA, Free phrase chain
- **Harmony:** Mixed Shorter style, Modal, Chromatic planing, Pedal-based
- **Phrase structure:** Asymmetrical, 4+4 variation, 5+3, 3+5, Random asymmetry
- **Output:** Lead sheet, Melody + bass, Piano sketch
- **Ideas to generate:** 1–10 (default 1 = one file)
- **Run Self-Test:** Runs a 5-run automated test (generator, validator, export, paths); writes to `output/test_runs/` only. Use to confirm the engine is working.

---

## Where Output Files Are Written

- **Normal generation (Ideas = 1):** `output/`
- **Batch generation (Ideas ≥ 2):** `output/test_runs/`
- **Run Self-Test:** `output/test_runs/`
- **Naming:** `wayne_shorter_output_001.musicxml`, etc.

---

## Supported Export Modes

| Mode | Content |
|------|---------|
| **lead_sheet** | Melody only (single treble staff) |
| **melody_bass** | Melody + bass (piano grand staff) |
| **piano** | Melody/counterline/harmonic + bass (piano grand staff) |

---

## Form Types

- **episodic** — Episodic phrase chain (5+4 → 6+3 → 8, etc.)
- **motif_sectional** — Motif-driven sectional (3+5 → 4+4 → 7+5, etc.)
- **asym_aaba** — Asymmetrical AABA variant

---

## Composition vs Orchestration Boundary

The Wayne Shorter Engine is a **composition / harmony-grammar engine**. It generates melodic and harmonic material (motifs, phrase chains, bass lines), not big-band orchestration. Orchestration engines (e.g. Ellington-style section layout, voicing) sit above it in the larger system. Reusable primitive ideas belong upstream in `gml-composer-engines`.
