# Setting Up MusicXML Quality Gate for New Projects

## Quick Setup

To make the MusicXML Quality Gate active in a **new project**, follow these steps:

### Step 1: Create `_cursor` Folder
In your new project root, create a `_cursor` folder:
```
YourNewProject/
├── _cursor/
└── ...
```

### Step 2: Copy SYSTEM_CONTROL.md
Copy `SYSTEM_CONTROL_TEMPLATE.md` from `creative-rule-engines/music/` to your new project's `_cursor/` folder and rename it to `SYSTEM_CONTROL.md`:

```
YourNewProject/
├── _cursor/
│   └── SYSTEM_CONTROL.md  ← Copy from template
└── ...
```

### Step 3: Verify Path References
The template uses paths relative to the project root (`creative-rule-engines/music/`). This assumes your project is a sibling of `creative-rule-engines/` in the `Cursor AI Projects/` folder.

**Standard Structure:**
```
Cursor AI Projects/
├── creative-rule-engines/
│   └── music/          ← Shared rules here
├── YourNewProject/
│   └── _cursor/
│       └── SYSTEM_CONTROL.md  ← References creative-rule-engines/music/
└── GCE-Jazz/
    └── _cursor/
        └── SYSTEM_CONTROL.md  ← Already set up
```

**If your project structure is different**, adjust the paths in `SYSTEM_CONTROL.md` to point to the `creative-rule-engines/music/` folder.

---

## What Gets Activated

Once `SYSTEM_CONTROL.md` is in place, the following become active:

### ✅ Universal Composition Principles
- Core musical thinking
- Quality standards
- Voice & texture awareness
- Development & form

### ✅ MusicXML Quality Gate
- **8/10 minimum** before MusicXML export
- **DTE Framework** for double-time material
- **DTE-ARC Framework** for multi-chorus solos
- **Internal evaluation** before export
- **Folder discipline** (`/Etudes/` for finished solos)
- **Naming conventions** (version-first format)

### ✅ Style-Specific Guidelines
- Jazz-specific rules (when applicable)
- Orchestral, chamber, songwriting engines
- All reference the shared `creative-rule-engines/music/` folder

---

## Automated Setup Script

**Option 1: Setup Single Project**
Run the setup script from within your project directory:
```powershell
cd "C:\Users\mike\Documents\Cursor AI Projects\YourProject"
..\creative-rule-engines\music\setup_musicxml_quality_gate.ps1
```

**Option 2: Deploy to All Projects**
Run the deployment script to set up all projects at once:
```powershell
cd "C:\Users\mike\Documents\Cursor AI Projects\creative-rule-engines\music"
.\DEPLOY_TO_ALL_PROJECTS.ps1
```

The scripts will:
- Create `_cursor` folder if needed
- Copy `SYSTEM_CONTROL_TEMPLATE.md` to `_cursor/SYSTEM_CONTROL.md`
- Backup existing files if present
- Verify installation

---

## Verification

After setup, ask Cursor in your new project:
- "Is the MusicXML Quality Gate active?"
- "What evaluation frameworks are available?"

Cursor should confirm that:
- MusicXML Quality Gate is active
- DTE and DTE-ARC frameworks are available
- 8/10 minimum requirement is enforced

---

## Notes

- The `creative-rule-engines/music/` folder is **shared** across all projects
- Each project has its own `_cursor/SYSTEM_CONTROL.md` that references the shared rules
- This allows project-specific customization while maintaining shared quality standards
- The MusicXML Quality Gate applies to **all music projects** once set up

---

## Current Status

✅ **GCE-Jazz:** Already set up (has `_cursor/SYSTEM_CONTROL.md`)
⏳ **New Projects:** Need setup (copy template to `_cursor/SYSTEM_CONTROL.md`)

