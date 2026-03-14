# Create Desktop Shortcut — Andrew Hill Engine

## Shortcut Name

**Andrew Hill Engine**

---

## Shortcut Target

```
powershell.exe -ExecutionPolicy Bypass -File hill_engine_launcher.ps1
```

---

## Working Directory

Set the shortcut's **Start in** (working directory) to:

```
creative-engines/engines/andrew-hill-engine/launcher/
```

Use the full path, for example:

```
C:\Users\mike\Documents\Cursor AI Projects\creative-rule-engines\creative-engines\engines\andrew-hill-engine\launcher\
```

---

## Steps to Create the Shortcut

1. Right-click on the desktop → **New** → **Shortcut**
2. **Target:** `powershell.exe -ExecutionPolicy Bypass -File hill_engine_launcher.ps1`
3. **Name:** Andrew Hill Engine
4. After creating, right-click the shortcut → **Properties**
5. Set **Start in** to the launcher directory path above
6. Click **OK**

---

## Expected Behavior

1. **Double-click icon** — Andrew Hill Engine shortcut
2. **Hill runtime runs** — phrase generation, validation, MusicXML export
3. **MusicXML generated** — new file appears in outputs folder
4. **File appears** in `creative-engines/engines/andrew-hill-engine/outputs/`

---

## Output Location

```
creative-engines/engines/andrew-hill-engine/outputs/
```

File naming: `hill_phrase_YYYY_MM_DD_HHMM.musicxml`
