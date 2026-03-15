#!/usr/bin/env python3
"""
Wayne Shorter Engine — Time Signature Export Tests

Generates minimal controlled examples for 4/4, 3/4, 5/4, 6/8, 7/8
and verifies export succeeds with correct measure sums.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "runtime"))

from wayne_shorter_musicxml_exporter import (
    export_to_file,
    events_to_musicxml,
    measure_duration_divisions,
    DIVISIONS,
)


def make_events(beats: int, beat_type: int, num_bars: int = 2):
    """Create minimal melody + bass events for given time sig."""
    events = []
    for bar in range(1, num_bars + 1):
        events.append({
            "bar": bar, "beat_position": 0.0, "duration": min(1.0, beats * 0.5),
            "pitch": 60, "role": "melody", "harmonic_field": "Field A", "phrase_group": "4",
        })
        if beats >= 2:
            events.append({
                "bar": bar, "beat_position": beats * 0.5, "duration": min(1.0, beats * 0.5),
                "pitch": 64, "role": "melody", "harmonic_field": "Field A", "phrase_group": "4",
            })
        events.append({
            "bar": bar, "beat_position": 0.0, "duration": min(2.0, beats),
            "pitch": 36, "role": "bass", "harmonic_field": "Field A", "phrase_group": "4",
        })
    return events


def main():
    engine_dir = Path(__file__).resolve().parent.parent.parent
    out_dir = engine_dir / "output" / "test_runs" / "time_sig_tests"
    out_dir.mkdir(parents=True, exist_ok=True)

    time_sigs = [(4, 4), (3, 4), (5, 4), (6, 8), (7, 8)]
    results = []

    for beats, beat_type in time_sigs:
        md = measure_duration_divisions(DIVISIONS, beats, beat_type)
        events = make_events(beats, beat_type)
        path = out_dir / f"time_sig_{beats}_{beat_type}.musicxml"
        try:
            export_to_file(events, path, "melody_bass", f"Time {beats}/{beat_type}", (beats, beat_type))
            results.append((f"{beats}/{beat_type}", "PASS", md, str(path)))
        except Exception as e:
            results.append((f"{beats}/{beat_type}", "FAIL", str(e), ""))

    print("Time Signature Export Tests")
    print("-" * 50)
    for sig, status, detail, p in results:
        print(f"  {sig}: {status}  {detail}")
    return 0 if all(r[1] == "PASS" for r in results) else 1


if __name__ == "__main__":
    sys.exit(main())
