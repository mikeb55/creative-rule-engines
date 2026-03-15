# Wayne Shorter Engine — Launcher

## What It Launches

Double-clicking `WayneShorterEngine.bat` launches the Wayne Shorter Engine Tkinter UI — a musical menu for generating Shorter-style MusicXML (melody, bass, lead sheet, piano sketch).

---

## How It Works

1. The batch file changes to the Wayne Shorter engine directory (parent of `launcher/`).
2. It runs `py ui/wayne_shorter_engine_app.py` using the Windows Python launcher.
3. The UI opens with musical controls: Generate, Form, Harmony, Phrase structure, Output, Ideas to generate.

---

## Desktop Shortcut

Run the PowerShell script to create a desktop shortcut named **Wayne Shorter Engine**:

```
cd launcher
powershell -ExecutionPolicy Bypass -File create_desktop_shortcut.ps1
```

The shortcut points to `WayneShorterEngine.bat` and uses the engine directory as working directory. Double-click the shortcut to launch the UI.

---

## Requirements

- **Python 3** (with `py` launcher on Windows)
- **Tkinter** (usually included with Python)

---

## Troubleshooting

### "Python was not found"
- Install Python 3 from [python.org](https://www.python.org/downloads/)
- During installation, check **Add Python to PATH**
- Restart the terminal/Explorer after installing

### "py is not recognized"
- Use full path to Python, e.g. `C:\Python39\python.exe` instead of `py`
- Edit `WayneShorterEngine.bat` and replace `py` with your Python path

### "No module named 'tkinter'"
- On Windows: Reinstall Python and ensure **tcl/tk** is selected
- On Linux: `sudo apt install python3-tk` (Debian/Ubuntu)

### App window does not appear
- Check that no error dialog is behind other windows
- Run from Command Prompt to see error messages:
  ```
  cd path\to\wayne-shorter-engine\launcher
  py ..\ui\wayne_shorter_engine_app.py
  ```

### "Validation failed" when generating
- Try a different seed or leave seed blank for random
- Ensure Ideas to generate is 1–10
