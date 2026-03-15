#!/usr/bin/env python3
"""
Wayne Shorter Engine — Tkinter UI

Composer-facing tool for generating MusicXML.
Musical-intent controls; seed in Advanced.
"""

import sys
import subprocess
import os
from pathlib import Path
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext

# Ensure runtime is importable
ENGINE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ENGINE_DIR / "runtime"))


def _get_output_dir():
    """Normal output: one file at a time."""
    return ENGINE_DIR / "output"


def _get_test_runs_dir():
    """Batch/test output: multiple files, isolated from normal output."""
    return ENGINE_DIR / "output" / "test_runs"


def _run_generator(seed, export_mode, form_type, run_count):
    """Call runtime generator. Returns (success, paths, error_msg)."""
    try:
        from wayne_shorter_runtime_generator import generate_shorter_output
        output_dir = _get_output_dir() if run_count == 1 else _get_test_runs_dir()
        paths = generate_shorter_output(
            seed=seed,
            export_mode=export_mode,
            form_type=form_type,
            run_count=run_count,
            output_dir=output_dir,
        )
        return True, paths, None
    except Exception as e:
        return False, [], str(e)


# Map Generate dropdown to export_mode
GENERATE_TO_EXPORT = {
    "Melody only": "lead_sheet",
    "Chord progression": "lead_sheet",
    "Melody + chord progression": "melody_bass",
    "Motif idea": "lead_sheet",
    "Full sketch (melody + bass)": "melody_bass",
}

# Map Output dropdown to export_mode (override when both matter)
OUTPUT_TO_EXPORT = {
    "Lead sheet": "lead_sheet",
    "Melody + bass": "melody_bass",
    "Piano sketch": "piano",
}

FORM_TO_INTERNAL = {
    "Episodic": "episodic",
    "Motif-driven sectional": "motif_sectional",
    "Asymmetrical AABA": "asym_aaba",
    "Free phrase chain": "episodic",
}


class WayneShorterEngineApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Wayne Shorter Engine")
        self.root.geometry("520x680")
        self.root.resizable(True, True)

        self._build_ui()

    def _build_ui(self):
        main = ttk.Frame(self.root, padding=10)
        main.pack(fill=tk.BOTH, expand=True)

        row = 0

        # --- Generate ---
        ttk.Label(main, text="Generate:", font=("", 9, "bold")).grid(row=row, column=0, sticky=tk.W, pady=(0, 2))
        row += 1
        self.generate_var = tk.StringVar(value="Full sketch (melody + bass)")
        gen_combo = ttk.Combobox(
            main, textvariable=self.generate_var,
            values=[
                "Melody only",
                "Chord progression",
                "Melody + chord progression",
                "Motif idea",
                "Full sketch (melody + bass)",
            ],
            state="readonly", width=28
        )
        gen_combo.grid(row=row, column=0, columnspan=2, sticky=tk.W, pady=2)
        row += 1

        # --- Form ---
        ttk.Label(main, text="Form:", font=("", 9, "bold")).grid(row=row, column=0, sticky=tk.W, pady=(8, 2))
        row += 1
        self.form_var = tk.StringVar(value="Episodic")
        form_combo = ttk.Combobox(
            main, textvariable=self.form_var,
            values=["Episodic", "Motif-driven sectional", "Asymmetrical AABA", "Free phrase chain"],
            state="readonly", width=28
        )
        form_combo.grid(row=row, column=0, columnspan=2, sticky=tk.W, pady=2)
        row += 1

        # --- Harmony ---
        ttk.Label(main, text="Harmony:", font=("", 9, "bold")).grid(row=row, column=0, sticky=tk.W, pady=(8, 2))
        row += 1
        self.harmony_var = tk.StringVar(value="Mixed Shorter style")
        harm_combo = ttk.Combobox(
            main, textvariable=self.harmony_var,
            values=["Mixed Shorter style", "Modal", "Chromatic planing", "Pedal-based"],
            state="readonly", width=28
        )
        harm_combo.grid(row=row, column=0, columnspan=2, sticky=tk.W, pady=2)
        row += 1

        # --- Phrase structure ---
        ttk.Label(main, text="Phrase structure:", font=("", 9, "bold")).grid(row=row, column=0, sticky=tk.W, pady=(8, 2))
        row += 1
        self.phrase_var = tk.StringVar(value="Asymmetrical")
        phrase_combo = ttk.Combobox(
            main, textvariable=self.phrase_var,
            values=["Asymmetrical", "4+4 variation", "5+3", "3+5", "Random asymmetry"],
            state="readonly", width=28
        )
        phrase_combo.grid(row=row, column=0, columnspan=2, sticky=tk.W, pady=2)
        row += 1

        # --- Output ---
        ttk.Label(main, text="Output:", font=("", 9, "bold")).grid(row=row, column=0, sticky=tk.W, pady=(8, 2))
        row += 1
        self.output_var = tk.StringVar(value="Melody + bass")
        out_combo = ttk.Combobox(
            main, textvariable=self.output_var,
            values=["Lead sheet", "Melody + bass", "Piano sketch"],
            state="readonly", width=28
        )
        out_combo.grid(row=row, column=0, columnspan=2, sticky=tk.W, pady=2)
        row += 1

        # --- Ideas to generate ---
        ttk.Label(main, text="Ideas to generate:", font=("", 9, "bold")).grid(row=row, column=0, sticky=tk.W, pady=(8, 2))
        row += 1
        self.run_count_var = tk.StringVar(value="1")
        run_spin = ttk.Spinbox(main, from_=1, to=10, textvariable=self.run_count_var, width=6)
        run_spin.grid(row=row, column=0, sticky=tk.W, pady=2)
        ttk.Label(main, text="(1 = one file, default. 2+ = batch for exploration.)", font=("", 8), foreground="gray").grid(row=row, column=1, sticky=tk.W, padx=(8, 0))
        row += 1

        # --- Advanced (collapsible) ---
        adv_frame = ttk.Frame(main)
        adv_frame.grid(row=row, column=0, columnspan=2, sticky=tk.W, pady=(12, 4))
        row += 1
        self.advanced_btn = ttk.Label(adv_frame, text="Advanced ▸", cursor="hand2", foreground="gray")
        self.advanced_btn.pack(anchor=tk.W)
        self.advanced_btn.bind("<Button-1>", self._toggle_advanced)
        self.advanced_inner = ttk.Frame(adv_frame)
        ttk.Label(self.advanced_inner, text="Seed (optional integer):").grid(row=0, column=0, sticky=tk.W, padx=(0, 8))
        self.seed_var = tk.StringVar(value="")
        self.seed_entry = ttk.Entry(self.advanced_inner, textvariable=self.seed_var, width=12)
        self.seed_entry.grid(row=0, column=1, sticky=tk.W)
        self._advanced_expanded = False

        # --- Output folder ---
        row += 1
        ttk.Label(main, text="Output folder:").grid(row=row, column=0, sticky=tk.NW, pady=(12, 2))
        out_dir = _get_output_dir()
        self.output_label = ttk.Label(main, text=str(out_dir), foreground="gray")
        self.output_label.grid(row=row, column=1, sticky=tk.W, pady=2, padx=(8, 0))
        row += 1

        # --- Status / log ---
        ttk.Label(main, text="Status:").grid(row=row, column=0, sticky=tk.NW, pady=(12, 2))
        row += 1
        self.status_text = scrolledtext.ScrolledText(main, height=8, width=55, state=tk.DISABLED)
        self.status_text.grid(row=row, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=2)
        main.columnconfigure(1, weight=1)
        main.rowconfigure(row, weight=1)
        row += 1

        # --- Buttons ---
        btn_frame = ttk.Frame(main)
        btn_frame.grid(row=row, column=0, columnspan=2, pady=12)
        ttk.Button(btn_frame, text="Generate", command=self._on_generate).pack(side=tk.LEFT, padx=4)
        ttk.Button(btn_frame, text="Open Output Folder", command=self._on_open_output).pack(side=tk.LEFT, padx=4)
        ttk.Button(btn_frame, text="Run Self-Test", command=self._on_self_test).pack(side=tk.LEFT, padx=4)
        ttk.Button(btn_frame, text="Quit", command=self.root.quit).pack(side=tk.LEFT, padx=4)

    def _toggle_advanced(self, event=None):
        self._advanced_expanded = not self._advanced_expanded
        if self._advanced_expanded:
            self.advanced_inner.pack(fill=tk.X, pady=(4, 0))
            self.advanced_btn.configure(text="Advanced ▾")
        else:
            self.advanced_inner.pack_forget()
            self.advanced_btn.configure(text="Advanced ▸")

    def _log(self, msg):
        self.status_text.config(state=tk.NORMAL)
        self.status_text.insert(tk.END, msg + "\n")
        self.status_text.see(tk.END)
        self.status_text.config(state=tk.DISABLED)
        self.root.update_idletasks()

    def _clear_log(self):
        self.status_text.config(state=tk.NORMAL)
        self.status_text.delete(1.0, tk.END)
        self.status_text.config(state=tk.DISABLED)

    def _resolve_export_mode(self):
        """Output dropdown overrides Generate for export format."""
        out = self.output_var.get() or "Melody + bass"
        return OUTPUT_TO_EXPORT.get(out, "melody_bass")

    def _on_generate(self):
        self._clear_log()
        self._log("Generating...")

        seed_val = None
        s = self.seed_var.get().strip()
        if s:
            try:
                seed_val = int(s)
            except ValueError:
                self._log("Fail: Seed must be an integer.")
                return

        try:
            run_count = int(self.run_count_var.get())
            if run_count < 1 or run_count > 10:
                run_count = 1
        except ValueError:
            run_count = 1

        export_mode = self._resolve_export_mode()
        form_type = FORM_TO_INTERNAL.get(self.form_var.get() or "Episodic", "episodic")

        success, paths, err = _run_generator(seed_val, export_mode, form_type, run_count)

        if success:
            if run_count == 1:
                self._log("Success. One file created.")
                self._log(f"  {paths[0].name}")
            else:
                self._log(f"Success. {len(paths)} files in output/test_runs/")
                for p in paths:
                    self._log(f"  {p.name}")
        else:
            self._log(f"Fail: {err}")

    def _on_open_output(self):
        out_dir = _get_output_dir()
        out_dir.mkdir(parents=True, exist_ok=True)
        path = str(out_dir.resolve())
        if sys.platform == "win32":
            os.startfile(path)
        elif sys.platform == "darwin":
            subprocess.run(["open", path])
        else:
            subprocess.run(["xdg-open", path])

    def _on_self_test(self):
        """Run automated self-test. Writes to output/test_runs/ only."""
        self._clear_log()
        self._log("Running self-test (5 runs)...")
        self.root.update_idletasks()
        try:
            from wayne_shorter_self_test import run_self_test
            passed, results = run_self_test(num_runs=5)
            for line in results:
                self._log(line)
            if passed:
                self._log("Self-test: PASSED")
            else:
                self._log("Self-test: FAILED")
        except Exception as e:
            self._log(f"Self-test error: {e}")

    def run(self):
        self.root.mainloop()


def main():
    app = WayneShorterEngineApp()
    app.run()


if __name__ == "__main__":
    main()
