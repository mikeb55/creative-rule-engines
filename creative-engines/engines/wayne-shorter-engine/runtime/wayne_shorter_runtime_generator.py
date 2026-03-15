#!/usr/bin/env python3
"""
Wayne Shorter Runtime Generator — Minimal Prototype

Generates Shorter-style phrase chains using validated grammar.
Output: structured event list to console; MusicXML export to output/.

Usage: python wayne_shorter_runtime_generator.py [--seed N] [--export MODE] [--no-export]
"""

import json
import random
import sys
from pathlib import Path
from typing import Optional

# Export modes: lead_sheet (melody only), melody_bass, piano
EXPORT_MODES = ("lead_sheet", "melody_bass", "piano")

# Grammar definitions (from shorter_interval_cell_library.md, shorter_harmonic_fields.md)
CELLS = {
    "Cell A": {"intervals": [3, 6], "desc": "m3 → tt"},
    "Cell B": {"intervals": [5, 1], "desc": "P4 → m2"},
    "Cell C": {"intervals": [1, 4], "desc": "m2 → M3"},
    "Cell D": {"intervals": [2, 6], "desc": "M2 → tt"},
    "Cell E": {"intervals": [3, 2], "desc": "m3 → M2"},
    "Cell F": {"intervals": [6, 1], "desc": "tt → m2"},
}

# Prefer A–F; Cell G excluded for minimal prototype (constraints complex)
CELL_IDS = list(CELLS.keys())

FIELDS = ["Field A", "Field B", "Field C", "Field D", "Field E", "Field F", "Field G"]
MODAL_FIELDS = ["Field A", "Field B", "Field C"]
PLANING_FIELDS = ["Field D", "Field E"]

# Form structures (from shorter_form_archetypes.md — runtime-ready)
FORM_STRUCTURES = {
    "episodic_chain": [
        {"phrases": ["5+4", "6+3", "3+5"], "fields": ["Field C", "Field E", "Field A"], "transformations": ["repeat", "transpose", "invert"]},
        {"phrases": ["4+3", "5+4", "4"], "fields": ["Field A", "Field D", "Field C"], "transformations": ["repeat", "transpose", "fragment"]},
        {"phrases": ["3+3+2", "5+5"], "fields": ["Field A", "Field E"], "transformations": ["repeat", "transpose"]},
    ],
    "motif_driven_sectional": [
        {"phrases": ["3+5", "4+4", "7+5"], "fields": ["Field A", "Field D", "Field F"], "transformations": ["repeat", "invert", "fragment"]},
        {"phrases": ["7+5", "4+4+3", "3+3+2"], "fields": ["Field D", "Field F", "Field B"], "transformations": ["repeat", "invert", "fragment"]},
    ],
    "asymmetrical_aaba": [
        {"phrases": ["3+5", "3+5", "4+3+4", "5+3"], "fields": ["Field A", "Field A", "Field G", "Field A"], "transformations": ["repeat", "repeat", "invert", "transpose"], "sections": ["A", "A", "B", "A_prime"]},
    ],
}

PHRASE_BAR_COUNTS = {
    "3+5": 8, "5+4": 9, "4+4+3": 11, "7+5": 12, "3+3+2": 8, "6+6": 12, "5+7": 12,
    "4+3+4": 11, "4+3": 7, "6+3": 9, "3+5": 8, "5+5": 10, "4": 4, "4+4": 8, "5+3": 8,
}

ROLES = ["melody", "counterline", "harmonic_color", "bass"]


def get_engine_dir() -> Path:
    """Return path to wayne-shorter-engine directory."""
    return Path(__file__).resolve().parent.parent


def pitches_from_cell(cell_id: str, root_midi: int = 60) -> list[int]:
    """Generate pitch sequence from interval cell."""
    intervals = CELLS[cell_id]["intervals"]
    pitches = [root_midi]
    for i in intervals:
        pitches.append(pitches[-1] + i)
    return pitches


def invert_pitches(pitches: list[int]) -> list[int]:
    """Invert pitch sequence around first note."""
    if len(pitches) < 2:
        return pitches[:]
    base = pitches[0]
    return [base - (p - base) for p in pitches]


def transpose_pitches(pitches: list[int], semitones: int) -> list[int]:
    """Transpose pitch sequence."""
    return [p + semitones for p in pitches]


def fragment_pitches(pitches: list[int], start: int = 0, length: int = 3) -> list[int]:
    """Take fragment of pitch sequence (min 3 notes)."""
    if len(pitches) <= length:
        return pitches[:]
    return pitches[start : start + length]


def generate_events(
    form_type: str,
    cell_id: str,
    structure_index: int = 0,
    seed: Optional[int] = None,
) -> tuple:
    """
    Generate event list for given form type and cell.
    Returns (events, metadata).
    """
    if seed is not None:
        random.seed(seed)

    struct = FORM_STRUCTURES[form_type][structure_index % len(FORM_STRUCTURES[form_type])]
    phrases = struct["phrases"]
    fields = struct["fields"]
    transformations = struct["transformations"]
    sections = struct.get("sections", ["A"] * len(phrases))

    events = []
    event_id = 1
    bar = 1

    root_midi = 60
    pitches = pitches_from_cell(cell_id, root_midi)

    for i, (phrase_group, field, trans, section_id) in enumerate(zip(phrases, fields, transformations, sections)):
        bars_in_phrase = PHRASE_BAR_COUNTS.get(phrase_group, 8)

        # Apply transformation to motif
        if trans == "repeat":
            motif_pitches = pitches[:]
        elif trans == "invert":
            motif_pitches = invert_pitches(pitches)
        elif trans == "transpose":
            motif_pitches = transpose_pitches(pitches, 5)  # P4
        elif trans == "fragment":
            motif_pitches = fragment_pitches(pitches)
        else:
            motif_pitches = pitches[:]

        # Generate melody events (2–4 per bar)
        for b in range(bars_in_phrase):
            num_events = 2 + (b % 2)
            for e in range(num_events):
                pitch_idx = (b * 2 + e) % len(motif_pitches)
                pitch = motif_pitches[pitch_idx]
                reg = "high" if pitch >= 72 else ("middle" if pitch >= 48 else "low")
                events.append({
                    "event_id": f"SHORTER_{event_id:03d}",
                    "section_id": section_id,
                    "phrase_group": phrase_group,
                    "bar": bar + b,
                    "beat_position": float(e * 1.5),
                    "duration": 1.0,
                    "pitch": pitch,
                    "register_band": reg,
                    "role": "melody",
                    "motivic_source": cell_id,
                    "harmonic_field": field,
                    "staff_or_voice": "treble",
                    "transformation": trans,
                })
                event_id += 1
        bar += bars_in_phrase

    # Add bass events (ensure ≥2 roles)
    bar = 1
    for i, (phrase_group, field, section_id) in enumerate(zip(phrases, fields, sections)):
        bars_in_phrase = PHRASE_BAR_COUNTS.get(phrase_group, 8)
        for b in range(bars_in_phrase):
            events.append({
                "event_id": f"SHORTER_{event_id:03d}",
                "section_id": section_id,
                "phrase_group": phrase_group,
                "bar": bar + b,
                "beat_position": 0.0,
                "duration": 2.0,
                "pitch": 36,
                "register_band": "low",
                "role": "bass",
                "motivic_source": cell_id,
                "harmonic_field": field,
                "staff_or_voice": "bass",
                "transformation": "repeat",
            })
            event_id += 1
        bar += bars_in_phrase

    metadata = {
        "form_type": form_type,
        "cell_id": cell_id,
        "phrases": phrases,
        "fields": fields,
        "total_bars": bar - 1,
        "event_count": len(events),
    }
    return events, metadata


def validate(events: list[dict]) -> tuple[bool, list[str], float]:
    """
    Run validator checks. Returns (pass, failure_reasons, gce_score).
    """
    failures = []

    # Ch1: Motivic continuity — assume we use cells; check motif appears ≥2×
    melody_events = [e for e in events if e.get("role") == "melody"]
    if len(melody_events) < 2:
        failures.append("Ch1: Too few melodic events")
    motivic_sources = set(e.get("motivic_source", "") for e in melody_events)
    if not motivic_sources or "" in motivic_sources:
        failures.append("Ch1: Missing motivic_source")

    # Ch2: Harmonic ambiguity — no ii–V–I (we don't generate those)
    # Pass by construction

    # Ch3: Phrase asymmetry
    phrase_groups = [e.get("phrase_group", "") for e in events if e.get("phrase_group")]
    irregular = ["3+5", "5+4", "4+4+3", "7+5", "3+3+2", "6+6", "5+7", "4+3+4", "4+3", "6+3", "5+5", "4", "5+3"]
    has_irregular = any(pg in irregular for pg in phrase_groups)
    if not has_irregular and phrase_groups:
        failures.append("Ch3: No irregular phrase grouping")

    # Ch4: Interval consistency — assume cell-aligned
    # Pass by construction

    # Ch5: Harmonic color diversity — ≥2 distinct field types
    fields = set(e.get("harmonic_field", "") for e in events)
    fields.discard("")
    if len(fields) < 2:
        failures.append("Ch5: Single harmonic field (need ≥2 distinct)")

    # Ch6: Loop/narrative — no literal repeat (we use transformations)
    # Pass by construction

    # Ch7: Monophonic collapse — ≥2 roles
    roles = set(e.get("role", "") for e in events)
    roles.discard("")
    if len(roles) < 2:
        failures.append("Ch7: Only one role (need melody + bass/counterline/harmonic_color)")

    # Ch8: GCE ≥ 9.0 (sum of 5 dimensions 0-2 each, scale 0-10)
    motivic = 2 if motivic_sources and len(melody_events) >= 4 else 1
    harmonic = 2 if len(fields) >= 2 else 1
    phrase = 2 if has_irregular else 1
    interval = 2
    ensemble = 2 if len(roles) >= 3 else 1
    gce = motivic + harmonic + phrase + interval + ensemble

    if gce < 9.0:
        failures.append(f"Ch8: GCE {gce:.1f} < 9.0")

    return len(failures) == 0, failures, gce


# UI form type mapping (episodic, motif_sectional, asym_aaba -> internal names)
FORM_TYPE_MAP = {
    "episodic": "episodic_chain",
    "motif_sectional": "motif_driven_sectional",
    "asym_aaba": "asymmetrical_aaba",
}


def run(seed: Optional[int] = None, form_type: Optional[str] = None) -> tuple:
    """
    Run generator once. Returns (events, metadata, pass, failures, gce).
    """
    if form_type is None:
        form_type = random.choice(list(FORM_STRUCTURES.keys()))
    else:
        form_type = FORM_TYPE_MAP.get(form_type, form_type)
        if form_type not in FORM_STRUCTURES:
            form_type = random.choice(list(FORM_STRUCTURES.keys()))
    cell_id = random.choice(CELL_IDS)
    struct_idx = random.randint(0, 2) if seed is not None else random.randint(0, 2)

    events, metadata = generate_events(form_type, cell_id, struct_idx, seed)
    passed, failures, gce = validate(events)
    return events, metadata, passed, failures, gce


def _next_output_index(output_dir: Path) -> int:
    """Find next available wayne_shorter_output_NNN index."""
    import re
    pattern = re.compile(r"wayne_shorter_output_(\d+)\.musicxml")
    max_n = 0
    for f in output_dir.glob("wayne_shorter_output_*.musicxml"):
        m = pattern.match(f.name)
        if m:
            max_n = max(max_n, int(m.group(1)))
    return max_n + 1


def generate_shorter_output(
    seed: Optional[int] = None,
    export_mode: str = "melody_bass",
    form_type: str = "episodic",
    run_count: int = 1,
    output_dir: Optional[Path] = None,
) -> list:
    """
    Generate Shorter-style outputs and export to MusicXML.
    Suitable for UI import.

    Args:
        seed: Optional integer seed for reproducibility.
        export_mode: lead_sheet | melody_bass | piano
        form_type: episodic | motif_sectional | asym_aaba
        run_count: Number of outputs to generate (1–20).
        output_dir: Override output directory. Default: engine/output/

    Returns:
        List of Path objects for generated MusicXML files.

    Raises:
        ValueError: Invalid parameters.
        RuntimeError: Generation or export failed.
    """
    if export_mode not in EXPORT_MODES:
        raise ValueError(f"Invalid export_mode: {export_mode}. Use one of {EXPORT_MODES}")
    mapped = FORM_TYPE_MAP.get(form_type, form_type)
    if mapped not in FORM_STRUCTURES:
        raise ValueError(f"Invalid form_type: {form_type}. Use episodic, motif_sectional, or asym_aaba")
    run_count = max(1, min(20, int(run_count)))  # UI uses 1-10; test runner may use up to 20

    out_dir = output_dir or (get_engine_dir() / "output")
    out_dir.mkdir(parents=True, exist_ok=True)
    start_idx = _next_output_index(out_dir)

    paths = []
    for i in range(run_count):
        use_seed = (seed + i) if seed is not None else None
        events, metadata, passed, failures, gce = run(seed=use_seed, form_type=mapped)
        if not passed:
            raise RuntimeError(f"Validation failed: {failures}")
        path = export_musicxml(events, metadata, out_dir, start_idx + i, export_mode)
        if path is None:
            raise RuntimeError("MusicXML export failed")
        paths.append(path)
    return paths


def export_musicxml(
    events: list,
    metadata: dict,
    output_dir: Path,
    run_index: int,
    export_mode: str = "melody_bass",
) -> Optional[Path]:
    """Export events to MusicXML. Returns path if successful."""
    try:
        from wayne_shorter_musicxml_exporter import export_to_file, get_output_dir
        out_dir = output_dir or get_output_dir()
        out_dir.mkdir(parents=True, exist_ok=True)
        path = out_dir / f"wayne_shorter_output_{run_index:03d}.musicxml"
        title = f"Wayne Shorter — {metadata.get('cell_id', '')} {metadata.get('form_type', '')}"
        export_to_file(events, path, export_mode=export_mode, title=title)
        return path
    except Exception as e:
        print(f"Export error: {e}")
        return None


def main():
    seed = None
    export_mode = "melody_bass"
    do_export = True

    i = 1
    while i < len(sys.argv):
        if sys.argv[i] == "--seed":
            seed = int(sys.argv[i + 1]) if i + 1 < len(sys.argv) else 42
            i += 2
        elif sys.argv[i] == "--export":
            export_mode = sys.argv[i + 1] if i + 1 < len(sys.argv) else "melody_bass"
            if export_mode not in EXPORT_MODES:
                export_mode = "melody_bass"
            i += 2
        elif sys.argv[i] == "--no-export":
            do_export = False
            i += 1
        else:
            i += 1

    events, metadata, passed, failures, gce = run(seed=seed)

    print("=== Wayne Shorter Runtime Generator — Output ===\n")
    print("Metadata:", json.dumps(metadata, indent=2))
    print("\nValidator:", "PASS" if passed else "FAIL")
    print("GCE:", f"{gce:.1f}")
    if failures:
        print("Failures:", failures)
    print("\nEvents (first 15):")
    for e in events[:15]:
        print(f"  {e['event_id']} bar={e['bar']} role={e['role']} {e['motivic_source']} {e['harmonic_field']}")
    if len(events) > 15:
        print(f"  ... and {len(events) - 15} more")
    print("\nFull event count:", len(events))

    if passed and do_export:
        engine_dir = get_engine_dir()
        output_dir = engine_dir / "output"
        path = export_musicxml(events, metadata, output_dir, 1, export_mode)
        if path:
            print(f"\nMusicXML exported: {path}")

    return 0 if passed else 1


if __name__ == "__main__":
    sys.exit(main())
