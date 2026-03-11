# Modulation Menu Engine — Web App

Local Streamlit app for the modulation-menu-engine. Easier to use than the CLI for quick experimentation.

## What it does

- Enter a chord progression
- Choose style and Mighty engine
- Run the engine and view ranked modulation suggestions
- Export results as markdown or plain text
- Copy results for use elsewhere

## How to launch

**Option 1 — Batch file (Windows):**

```
run_app.bat
```

Double-click or run from a command prompt. The app opens in your browser.

**Option 2 — Command line:**

```
cd creative-engines/supporting-engines/modulation-menu-engine
streamlit run app/streamlit_app.py
```

## Example usage

1. Enter `C,G,Am,F` in the progression box (or pick a preset)
2. Choose style: `pop_colour` or `jazz_rock`
3. Choose Mighty engine: `metheny` or `default`
4. Click **Run**
5. View ranked suggestions in the Results tab
6. Export or copy as needed

## Where exports are saved

Exports go to:

```
app/exports/
```

Filenames: `modmenu_YYYYMMDD_HHMMSS.md` or `.txt`

## CLI still exists

For automation and scripting, use the CLI:

```
modmenu --prog "C,G,Am,F" --style jazz_rock
```

Or: `py -m cli --prog "C,G,Am,F" --style jazz_rock`
