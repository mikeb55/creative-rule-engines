# Big Ten Composer Workbench

Local Windows web app that acts as the front-end for the full Big Ten engine system.

## What it does

- Choose Structure Engine, Behaviour Engine, Modifier Engines, Supporting Engines
- Run modulation-menu-engine (integrated as a supporting engine)
- Generate full composition prompts for Cursor Chat
- Export prompts and project notes
- Save to `app/exports/`

## How to launch

**Batch file:**
```
run_big_ten_workbench.bat
```
Double-click or run from a command prompt. Opens in your browser.

**Command line:**
```
cd creative-rule-engines/app
py -m streamlit run big_ten_workbench.py
```

## Engine types

**Core / Structure Engines** — Primary composition engines. Control harmonic gravity, form, narrative arc.

**Behaviour Engines** — Control rhythmic motion, phrase density, ensemble interaction.

**Modifier Engines** — Optional. Use only in intro, bridge, transition, coda, interlude, solo. Must NOT generate the whole piece.

**Supporting Engines** — Assist composition: modulation-menu-engine, wyble-etude-engine, orchestration helpers, voicing helpers. modulation-menu-engine is kept and integrated as a supporting engine.

## Where exports are saved

- Prompts: `app/exports/bigten_prompt_[timestamp].md` and `.txt`
- Project notes: `app/exports/project_notes_[timestamp].md`

## modulation-menu-engine

The modulation-menu-engine is kept at `creative-engines/supporting-engines/modulation-menu-engine/` and integrated into the workbench. When enabled, you can run it from the sidebar and include modulation results in the generated composition prompt.

## Master system prompt

The global composition model is defined in `.cursor/rules/engine-composition.mdc`.
