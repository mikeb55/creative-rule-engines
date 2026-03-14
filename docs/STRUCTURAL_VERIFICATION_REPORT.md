# Structural Verification Report — Monk/Barry Engine

## Verification Criteria

| Check | Result |
|-------|--------|
| Harmonic logic separate from voicing | PASS — barryHarrisEngine, monkHarmonyEngine output HarmonicTarget only |
| Voicing separate from idiom | PASS — voicingFamilies defines families; idiom translators map to guitar/piano |
| Idiom separate from export | PASS — guitarTranslator, pianoTranslator output pitches; musicxmlExporter receives MusicEvent[] |
| Engines produce MusicEvent objects | PASS — pipeline creates MusicEvent via createChordEvent, createMelodyEvent |

## Layer Boundaries

- **harmony/** — No pitch generation; outputs HarmonicTarget with chord symbols and metadata.
- **voicing/** — No instrument logic; outputs interval structures and families.
- **idiom/** — No harmonic logic; maps voicing families to instrument constraints.
- **export/** — No generation; converts MusicEvent[] to MusicXML.

## Conclusion

All structural verification checks pass. The engine enforces layered architecture and produces only valid musical objects.
