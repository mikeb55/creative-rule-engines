#!/usr/bin/env python3
"""
Wayne Shorter Engine — Self-Test

Runs a controlled automated test pass. Writes to output/test_runs/.
Returns (passed, results_list) for UI display.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from wayne_shorter_runtime_generator import (
    run,
    export_musicxml,
    get_engine_dir,
    generate_shorter_output,
)


def _verify_musicxml_structure(path: Path) -> tuple:
    """Check MusicXML file has valid structure. Returns (valid, issues)."""
    issues = []
    try:
        text = path.read_text(encoding="utf-8")
    except Exception as e:
        return False, [f"Read error: {e}"]

    if "<?xml" not in text:
        issues.append("Missing XML declaration")
    if "<score-partwise" not in text:
        issues.append("Missing score-partwise root")
    if "<part-list>" not in text:
        issues.append("Missing part-list")
    if "<part id=" not in text:
        issues.append("Missing part")
    if "<measure " not in text:
        issues.append("Missing measure")
    if "<note>" not in text and "<note " not in text:
        issues.append("Missing note elements")
    if "<pitch>" not in text:
        issues.append("Missing pitch elements")

    return len(issues) == 0, issues


def run_self_test(num_runs: int = 5):
    """
    Run self-test: generator, validator, export, paths.
    Writes to output/test_runs/ only.
    Returns (all_passed, list of result lines).
    """
    results = []
    engine_dir = get_engine_dir()
    output_dir = engine_dir / "output" / "test_runs"
    output_dir.mkdir(parents=True, exist_ok=True)

    launcher_bat = engine_dir / "launcher" / "WayneShorterEngine.bat"
    results.append("1. Launcher path: " + ("OK" if launcher_bat.exists() else "MISSING"))

    passed = 0
    failed = 0

    for i in range(num_runs):
        try:
            events, metadata, ok, failures, gce = run(seed=i)
            if ok:
                path = export_musicxml(events, metadata, output_dir, i + 1, "melody_bass")
                if path:
                    valid, issues = _verify_musicxml_structure(path)
                    if valid:
                        passed += 1
                        results.append(f"  Run {i+1}: PASS  GCE={gce:.1f}  export OK")
                    else:
                        failed += 1
                        results.append(f"  Run {i+1}: WARN  MusicXML issues: {issues}")
                else:
                    failed += 1
                    results.append(f"  Run {i+1}: FAIL  export failed")
            else:
                failed += 1
                results.append(f"  Run {i+1}: FAIL  {failures}")
        except Exception as e:
            failed += 1
            results.append(f"  Run {i+1}: FAIL  {e}")

    results.append("")
    results.append(f"Summary: {passed} passed, {failed} failed out of {num_runs}")
    results.append(f"Output: {output_dir}")
    results.append("")

    all_passed = failed == 0
    return all_passed, results
