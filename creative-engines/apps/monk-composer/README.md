# Monk Composer

**Monk Composer** is a Windows desktop application for generative jazz composition using the Barry Harris Engine and Monk Engine from the Creative Rule Engines framework.

## What It Does

- **Engine selection**: Use Barry Harris Engine, Monk Engine, or both combined
- **Parameters**: Key signature, tempo, meter, bars, form, instrument target
- **Generation**: Motif-first for chordal targets (motif → variation → harmony → idiom translation). Chord structure → motif → rhythm → instrumentation → GCE scoring.
- **Auto-revision**: Compositions revise automatically until GCE ≥ 9.0
- **Export**: MusicXML to `outputs/` folder

## Launching the App

**Double-click the desktop icon** labeled **Monk Composer**. No terminal, command line, or scripts required.

The desktop shortcut is created automatically after the first build.

## Executable Location

After building:

- **Portable**: `creative-engines/apps/monk-composer/release/Monk Composer.exe`
- Or: `release/win-unpacked/Monk Composer.exe` (unpacked build)

## Guitar and Piano Chord Export

Guitar uses a **fretboard-aware voicing system**: dictionary-based chord generation only (no piano-style pitch stacking). Voicing families: shell, triad, drop-2, quartal, guide-tone dyads. Fretboard mapper enforces max fret span (5), adjacent-string shapes. Voice-leading engine minimizes fret displacement. Rhythmic comping patterns (A–D) ensure consistent comp rhythm. Hard idiom validators reject outputs that fail playability or structural requirements.

Piano uses target-specific voicing engines (`pianoVoicingEngine.ts`). Both guitar and piano use the internal chord-event model (`musicEvents.ts`).

**Generate fixed outputs** (with retry until pass):
```bash
npx tsx scripts/generate-fixed-outputs.ts
```
Writes `barry-guitar-fixed.musicxml`, `monk-guitar-fixed.musicxml`, `barry-piano-fixed.musicxml`, `monk-piano-fixed.musicxml` to `outputs/`.

If you see only single notes:
1. **Rebuild the app**: `npm run electron:build` (or `npm run build`)
2. **Restart** Monk Composer
3. **Verify** with `npm run test:voicing` — must report chord events

## Exporting MusicXML

### Naming the file

- Enter a file name in the **File Name** field (e.g. `bebop_test_01`).
- The `.musicxml` extension is added automatically.
- Invalid characters (`<>:"/\|?*`) are replaced with underscores.

### Where files are saved

- **Default export folder**: `Documents/Monk Composer Exports/`
- Full path example: `C:\Users\<you>\Documents\Monk Composer Exports\`
- Use **Browse** to choose a different folder.

### After export

- A confirmation shows the full path of the exported file.
- The export folder opens automatically in File Explorer.

## Build (Developers)

```bash
cd creative-engines/apps/monk-composer
npm install
npm run electron:build
```

The postbuild script creates the desktop shortcut automatically.

## Debugging and Diagnostics

- **GCE scores** appear in the **Audit** panel after generating a draft or running Raise GCE.
- **Idiom Status** (chordal targets) — Chord events, motif recurrences, target idiom pass/fail, export verification.
- **Quartet metrics** (active duration, attack density, rest ratio, motif participation, etc.) appear in the Audit panel when the target is string quartet.
- **Debug Diagnostics** — Expand the collapsible "Debug Diagnostics" section at the bottom of the Audit panel to inspect raw GCE scores, warnings, and quartet diagnostics.
- **Export Diagnostics JSON** — Click "Export Diagnostics JSON" in the Export panel to save a JSON file (e.g. `my_piece_diagnostics.json`) alongside your MusicXML export. The file includes title, timestamp, target, engine selections, scores, warnings, quartet diagnostics, and revision count.

## Requirements

- Windows 10 or later
- Node.js 18+ (for building only)
