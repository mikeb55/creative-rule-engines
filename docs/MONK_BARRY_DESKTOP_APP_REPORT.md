# Monk Barry Composer — Desktop App Report

## Summary

The Monk Barry Composer desktop app has been built and configured. It uses the clean rebuilt engine from `engines/monk-barry-engine/` (no legacy code).

---

## Paths

| Item | Path |
|------|------|
| **App source** | `apps/monk-barry-desktop/` |
| **Executable (portable)** | `apps/monk-barry-desktop/release/Monk Barry Composer 1.0.0.exe` |
| **Executable (unpacked)** | `apps/monk-barry-desktop/release/win-unpacked/Monk Barry Composer 1.0.0.exe` |
| **Desktop shortcut** | `C:\Users\mike\Desktop\Monk Barry Composer.lnk` |
| **Export folder** | `C:\Users\mike\Documents\Monk Barry Exports\` |

---

## Verification

| Check | Status |
|-------|--------|
| App launches | ✓ |
| Engine selector works | ✓ |
| Instrument selector works | ✓ |
| Generate button works | ✓ |
| Export button works | ✓ |
| Files in Documents/Monk Barry Exports | ✓ |
| Desktop shortcut exists | ✓ |
| Shortcut launches app | ✓ |
| Barry guitar generation | ✓ |
| Monk guitar generation | ✓ |
| Barry piano generation | ✓ |
| Monk piano generation | ✓ |

---

## Build Scripts

| Script | Command |
|--------|---------|
| start-desktop | `npm run start-desktop` — Dev mode |
| build-desktop | `npm run build-desktop` — Full build |
| package-desktop | `npm run package-desktop` — Same as build |

---

## Files Changed

- `engines/monk-barry-engine/pipeline.ts` — Filename format (barry-guitar-8.musicxml), return filename
- `engines/monk-barry-engine/export/musicxmlExporter.ts` — Piano two-staff, staves tag
- `apps/monk-barry-desktop/` — Rebuilt (src/main, src/renderer, src/preload)
- `scripts/build-engine.mjs` — New (esbuild bundle)
- `scripts/create-desktop-shortcut.ps1` — New
- `package.json` — build:engine, build-desktop, package-desktop
- `README.md` — Monk Barry section
- `apps/monk-barry-desktop/CHANGELOG.md` — New

---

## Git

- **Commit hash (pre-change):** cc6c63e1c39244a9d03848e7dc792e180a4c1411
- **Push status:** Changes not yet committed
