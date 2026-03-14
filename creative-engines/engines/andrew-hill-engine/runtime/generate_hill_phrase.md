# generate_hill_phrase — Runtime Command

**Command name:** `generate_hill_phrase`

---

## Runtime Behavior

- choose interval cell randomly
- choose harmonic field randomly
- choose phrase structure randomly
- generate phrase events
- validate phrase
- export MusicXML
- save to outputs folder

---

## Example Output Path

```
creative-engines/engines/andrew-hill-engine/outputs/
```

---

## Invocation

When implemented, the command will be invoked to trigger a single phrase generation cycle. Each invocation produces one MusicXML file in the outputs directory, timestamped for uniqueness.
