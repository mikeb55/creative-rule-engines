# Andrew Hill Engine Launcher Workflow

## Process Flow

```
Desktop icon
    ↓
Launcher
    ↓
Runtime generator
    ↓
Validator
    ↓
MusicXML export
    ↓
Outputs folder
```

---

## Step Details

| Step | Description |
|------|-------------|
| Desktop icon | User double-clicks "Andrew Hill Engine" shortcut |
| Launcher | Invokes the runtime generator entry point |
| Runtime generator | Generates phrase (cell + field + structure), produces events |
| Validator | Runs pulse anchor, layer compatibility, convergence checks |
| MusicXML export | Converts validated phrase to MusicXML |
| Outputs folder | Writes `hill_phrase_YYYY_MM_DD_HHMM.musicxml` |
