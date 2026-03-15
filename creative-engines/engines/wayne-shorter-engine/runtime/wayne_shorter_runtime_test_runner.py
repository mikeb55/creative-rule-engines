#!/usr/bin/env python3
"""
Wayne Shorter Runtime Test Runner

Runs generator 20 times, validates each output, exports MusicXML,
verifies files are written, confirms MusicXML structure validity.
"""

import sys
from pathlib import Path

# Add runtime dir to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from wayne_shorter_runtime_generator import run, export_musicxml, get_engine_dir


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


def main():
    num_runs = 20
    passed = 0
    failed = 0
    failure_reasons = []
    exported_paths = []
    export_mode = "melody_bass"

    engine_dir = get_engine_dir()
    output_dir = engine_dir / "output" / "test_runs"
    output_dir.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("Wayne Shorter Runtime Test Runner — 20 runs + MusicXML export")
    print("=" * 60)

    for i in range(num_runs):
        events, metadata, ok, failures, gce = run(seed=i)
        if ok:
            passed += 1
            path = export_musicxml(events, metadata, output_dir, i + 1, export_mode)
            if path:
                exported_paths.append(path)
                valid, issues = _verify_musicxml_structure(path)
                status = "OK" if valid else "WARN"
                print(f"  Run {i+1:2d}: PASS  GCE={gce:.1f}  export={path.name}  [{status}]")
                if issues:
                    print(f"         MusicXML issues: {issues}")
            else:
                print(f"  Run {i+1:2d}: PASS  GCE={gce:.1f}  export=FAILED")
        else:
            failed += 1
            print(f"  Run {i+1:2d}: FAIL  GCE={gce:.1f}  {failures}")
            failure_reasons.extend(failures)

    print()
    print("-" * 60)
    print(f"Summary: {passed} passed, {failed} failed out of {num_runs} runs")
    print(f"Pass rate: {100 * passed / num_runs:.0f}%")
    print(f"MusicXML files generated: {len(exported_paths)}")
    print(f"Output directory: {output_dir} (test runs only; does not write to output/)")
    print()

    if failure_reasons:
        from collections import Counter
        counts = Counter(failure_reasons)
        print("Common failure causes:")
        for reason, count in counts.most_common(10):
            print(f"  {count:2d}x  {reason}")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
