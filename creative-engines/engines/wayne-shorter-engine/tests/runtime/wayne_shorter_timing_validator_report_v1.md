# Wayne Shorter Engine — Timing Validator Report V1

**Date:** 2026-03-15

---

## VALIDATOR SCOPE

The MusicXML exporter includes a strict timing validator that runs **during export**:

1. **Per-voice measure total** — For each voice in each measure, `total written duration == expected measure duration`
2. **No negative gaps** — Rests are inserted for gaps; onset ordering is enforced
3. **No overlapping non-chord events** — Events sorted by onset; no overlap within one voice
4. **All onsets inside measure** — Events with onset beyond measure are truncated

---

## VALIDATION POINTS

| Check | Location | Behavior on failure |
|-------|----------|---------------------|
| Voice total == measure_duration_divs | `_validate_measure_timing` | Raise RuntimeError; stop export |
| Measure duration formula | `measure_duration_divisions` | divisions * beats * 4 / beat_type |

---

## DIAGNOSTICS ON FAILURE

When validation fails, the exporter raises:

```
RuntimeError: MusicXML timing validation failed: Measure N voice (staff,voice): expected X, got Y
```

---

## POST-EXPORT CHECK

`validate_musicxml_timing(xml_content)` performs basic structural checks on exported XML (score-partwise, measures, duration elements).
