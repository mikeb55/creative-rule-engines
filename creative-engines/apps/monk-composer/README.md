# Monk Composer

**Monk Composer** is a Windows desktop application for generative jazz composition using the Barry Harris Engine and Monk Engine from the Creative Rule Engines framework.

## What It Does

- **Engine selection**: Use Barry Harris Engine, Monk Engine, or both combined
- **Parameters**: Key signature, tempo, meter, bars, form, instrument target
- **Generation**: Chord structure → motif → rhythm → instrumentation → GCE scoring
- **Auto-revision**: Compositions revise automatically until GCE ≥ 9.0
- **Export**: MusicXML to `outputs/` folder

## Launching the App

**Double-click the desktop icon** labeled **Monk Composer**. No terminal, command line, or scripts required.

The desktop shortcut is created automatically after the first build.

## Executable Location

After building:

- **Portable**: `creative-engines/apps/monk-composer/release/Monk Composer.exe`
- Or: `release/win-unpacked/Monk Composer.exe` (unpacked build)

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

## Requirements

- Windows 10 or later
- Node.js 18+ (for building only)
