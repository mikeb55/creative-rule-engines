# Wayne Shorter Engine — Timing Fix Regression V1

**Date:** 2026-03-15

---

## SAMPLE FILES

Generated in `output/test_runs/timing_fix/`:

- wayne_shorter_output_001.musicxml
- wayne_shorter_output_002.musicxml
- wayne_shorter_output_003.musicxml
- wayne_shorter_output_004.musicxml
- wayne_shorter_output_005.musicxml

---

## CONFIRMATION

| Check | Result |
|-------|--------|
| Timing correct | PASS — Per-voice measure fill; backup between RH/LH |
| Notation stable in Sibelius | Improved — RH/LH alignment fixed |
| Piano RH/LH alignment | PASS — RH voice, backup, LH voice per measure |

---

## STRUCTURE

Each measure:
1. RH voice (staff 1, voice 1): notes + rests to fill 16 divisions
2. `<backup><duration>16</duration></backup>`
3. LH voice (staff 2, voice 2): bass + rests to fill 16 divisions
