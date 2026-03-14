#!/usr/bin/env python3
"""
Andrew Hill Engine Launcher — Generate phrase, validate, export MusicXML.
V4.2 — Uses phrase generator for true generative output.
"""
import os
import sys
from datetime import datetime

# Add runtime to path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ENGINE_DIR = os.path.dirname(SCRIPT_DIR)
RUNTIME_DIR = os.path.join(ENGINE_DIR, "runtime")
OUTPUTS_DIR = os.path.join(ENGINE_DIR, "outputs")

if RUNTIME_DIR not in sys.path:
    sys.path.insert(0, RUNTIME_DIR)

from hill_phrase_generator import generate_valid_phrase, events_to_musicxml


def main():
    os.makedirs(OUTPUTS_DIR, exist_ok=True)

    events, seed = generate_valid_phrase()
    title = f"Hill — Cell {seed['cell']}, Field {seed['field']}, {seed['phrase_structure']}"
    xml_content = events_to_musicxml(events, title)

    timestamp = datetime.now().strftime("%Y_%m_%d_%H%M")
    filename = f"hill_phrase_{timestamp}.musicxml"
    out_path = os.path.join(OUTPUTS_DIR, filename)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(xml_content)

    print("Andrew Hill phrase generated successfully.")
    return 0


if __name__ == "__main__":
    exit(main())
