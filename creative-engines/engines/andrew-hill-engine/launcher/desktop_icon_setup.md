# Desktop Icon Setup — Andrew Hill Engine

## Shortcut Name

**Andrew Hill Engine**

---

## Shortcut Target

```
creative-engines/engines/andrew-hill-engine/runtime/generate_hill_phrase
```

When implemented as a script or executable, the target points to the runtime generator entry point.

---

## Expected Workflow

1. **Double-click icon** — Andrew Hill Engine shortcut
2. **Runtime generator runs** — phrase generation, validation, export
3. **New MusicXML phrase appears** in outputs folder

---

## Output Location

```
creative-engines/engines/andrew-hill-engine/outputs/
```

Each run produces a timestamped file: `hill_phrase_YYYY_MM_DD_HHMM.musicxml`
