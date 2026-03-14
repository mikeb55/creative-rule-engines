# Andrew Hill Engine Runtime Generator (V3.5)

**Purpose:** Define the runtime process for generating Hill phrases and exporting them to MusicXML.

---

## Runtime Steps

1. **Generate phrase seed** — random or selected interval cell + field.
2. **Produce phrase events** — using Hill phrase rules.
3. **Run validator checks:**
   - pulse anchor
   - layer compatibility
   - convergence density
4. **If validator fails:** regenerate phrase.
5. **If validator passes:** convert phrase to MusicXML using `hill_musicxml_template.musicxml`.
6. **Write file** to outputs directory.

---

## File Naming Format

```
hill_phrase_YYYY_MM_DD_HHMM.musicxml
```

**Example:**

```
hill_phrase_2026_03_14_0715.musicxml
```

---

## Output Location

```
creative-engines/engines/andrew-hill-engine/outputs/
```
