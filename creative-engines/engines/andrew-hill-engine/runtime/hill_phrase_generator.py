#!/usr/bin/env python3
"""
Andrew Hill Engine — Phrase Generator (V4.2)
Generates phrase events from cell + harmonic field + phrase structure.
Uses Hill event schema, rhythm stability rules, and validator.
"""
import random
from typing import Any, Optional

# Field pitch pools (pitch classes 0-11)
FIELD_POOLS = {
    "A": [0, 3, 6, 7],   # C Eb F# G
    "B": [2, 5, 7, 10],  # D F G Bb
    "C": [4, 7, 10, 1],  # E G Bb C#
    "D": [5, 8, 11, 0],  # F Ab B C
}

CELLS = ["A", "B", "C", "D", "E"]
FIELDS = ["A", "B", "C", "D"]
PHRASE_STRUCTURES = ["3+5", "5+4", "4+4+3", "7+5"]
LAYER_COMBOS = [
    ("base_pulse", "delayed_entry"),
    ("base_pulse", "pulse_displacement"),
    ("base_pulse", "phrase_stretch"),
]
ROLES = ["melody_fragment", "counterline", "cluster_color"]
REGISTER_OCTAVES = {"low": 2, "middle": 3, "high": 4}
BASS_MIDI_MIN = 28
BASS_MIDI_MAX = 55
# Piano: RH treble (60-79), LH bass (36-55). Melody +12 for treble.
PIANO_RH_MIN = 60
PIANO_RH_MAX = 79
PIANO_LH_MIN = 36
PIANO_LH_MAX = 55
MELODY_OCTAVE_BOOST = 24  # Shift melody up 2 octaves for treble staff

# Drum staff positions (Beatrice/Sibelius convention: percussion clef)
# display-step, display-octave, notehead, stem
DRUM_MAP = {
    "hihat": ("F", 5, "x", "up"),   # Hi-hat on top space
    "kick": ("F", 4, "normal", "down"),  # Bass drum
    "snare": ("D", 4, "x", "down"),  # Snare on middle space
}
# Instrument IDs for drums (GM: kick=36, snare=38, hi-hat closed=42)
DRUM_INSTRUMENT_IDS = {"kick": "P3-Kick", "snare": "P3-Snare", "hihat": "P3-Hihat"}


def generate_drum_events() -> list[dict[str, Any]]:
    """Generate simple jazz drum pattern: hi-hat 8ths, kick 1&3, snare 2&4."""
    events: list[dict[str, Any]] = []
    for bar in range(1, 9):
        # Hi-hat: 8th notes (beat 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5)
        for beat in [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5]:
            events.append({"bar": bar, "beat_position": beat, "duration": 0.5, "drum_type": "hihat"})
        # Kick on 1 and 3
        events.append({"bar": bar, "beat_position": 0.0, "duration": 1.0, "drum_type": "kick"})
        events.append({"bar": bar, "beat_position": 2.0, "duration": 1.0, "drum_type": "kick"})
        # Snare on 2 and 4
        events.append({"bar": bar, "beat_position": 1.0, "duration": 1.0, "drum_type": "snare"})
        events.append({"bar": bar, "beat_position": 3.0, "duration": 1.0, "drum_type": "snare"})
    return events


def pc_to_midi(pc: int, octave: int) -> int:
    return ((pc % 12) + 12) % 12 + octave * 12


def pick_from_field(field: str, count: int, octave: int) -> list[int]:
    pool = FIELD_POOLS.get(field, FIELD_POOLS["C"])
    return [pc_to_midi(random.choice(pool), octave) for _ in range(count)]


def create_event(
    event_id: str,
    bar: int,
    beat_position: float,
    duration: float,
    pitches: list[int],
    role: str,
    register_band: str,
    phrase_group: str,
    rhythmic_layer: str,
    cell: str,
    field: str,
    articulation: str = "accent",
) -> dict[str, Any]:
    return {
        "event_id": event_id,
        "bar": bar,
        "beat_position": beat_position,
        "duration": duration,
        "pitches": pitches,
        "role": role,
        "register_band": register_band,
        "phrase_group": phrase_group,
        "rhythmic_layer": rhythmic_layer,
        "source_interval_cell": f"Cell {cell}",
        "source_harmonic_field": f"Field {field}",
        "articulation": articulation,
    }


def generate_phrase(
    cell: str,
    field: str,
    phrase_structure: str,
) -> tuple[list[dict[str, Any]], dict[str, str]]:
    """Generate phrase events. Returns (events, seed)."""
    seed = {"cell": cell, "field": field, "phrase_structure": phrase_structure}
    layers = random.choice(LAYER_COMBOS)
    base_layer, second_layer = layers

    events: list[dict[str, Any]] = []
    ev_id = 0

    # 8-bar phrase, ~12-16 events, convergence at bar 6
    bars = 8
    pool = FIELD_POOLS.get(field, FIELD_POOLS["C"])

    # Event templates: (bar, beat, duration, role, register, layer, pitch_count)
    templates = [
        (1, 0.0, 1.0, "melody_fragment", "middle", base_layer, 3),
        (1, 1.5, 0.5, "cluster_color", "middle", second_layer, 1),
        (1, 2.0, 1.5, "counterline", "low", base_layer, 2),
        (2, 0.5, 1.0, "melody_fragment", "middle", second_layer, 2),
        (2, 2.0, 0.5, "cluster_color", "middle", base_layer, 4),
        (3, 0.0, 1.5, "counterline", "middle", base_layer, 2),
        (3, 1.5, 0.5, "melody_fragment", "low", second_layer, 2),
        (4, 0.0, 1.0, "melody_fragment", "middle", base_layer, 3),
        (4, 1.5, 0.5, "counterline", "high", second_layer, 2),
        (5, 0.0, 1.0, "melody_fragment", "middle", base_layer, 2),
        (6, 0.0, 1.0, "melody_fragment", "middle", base_layer, 4),
        (6, 0.0, 1.0, "counterline", "low", base_layer, 2),
        (8, 0.0, 1.5, "melody_fragment", "middle", base_layer, 3),
        (8, 2.5, 0.5, "cluster_color", "middle", second_layer, 2),
    ]

    for bar, beat, dur, role, reg, layer, n_pitches in templates:
        octave = REGISTER_OCTAVES.get(reg, 3)
        pitches = pick_from_field(field, n_pitches, octave)
        art = "staccato" if "cluster" in role or layer == "delayed_entry" else ("legato" if "counter" in role else "accent")
        events.append(
            create_event(
                f"HILL_{ev_id:03d}",
                bar,
                beat,
                dur,
                pitches,
                role,
                reg,
                phrase_structure,
                layer,
                cell,
                field,
                art,
            )
        )
        ev_id += 1

    return events, seed


def validate_phrase(events: list[dict[str, Any]]) -> bool:
    """Pulse anchor, layer compatibility, convergence checks."""
    layers = {e["rhythmic_layer"] for e in events}
    has_base = "base_pulse" in layers
    has_displacement = "delayed_entry" in layers or "pulse_displacement" in layers

    # Layer compatibility: if two layers, at least one base_pulse
    if has_displacement and not has_base:
        return False

    # Forbidden: delayed_entry + pulse_displacement as sole pair
    if "delayed_entry" in layers and "pulse_displacement" in layers and not has_base:
        return False

    # Pulse anchor: each 2-bar span with displacement must have base_pulse
    if has_displacement:
        for start_bar in range(0, 8, 2):
            span_events = [e for e in events if start_bar <= e["bar"] < start_bar + 2]
            span_layers = {e["rhythmic_layer"] for e in span_events}
            if (span_layers & {"delayed_entry", "pulse_displacement"}) and "base_pulse" not in span_layers:
                return False

    # Convergence: bar 6 has melody + counterline at same beat
    conv_events = [e for e in events if e["bar"] == 6 and e["beat_position"] == 0]
    if len(conv_events) < 2:
        return False

    return len(events) >= 10


def generate_valid_phrase(max_attempts: int = 10) -> tuple[list[dict[str, Any]], dict[str, str]]:
    """Generate phrase until validation passes."""
    for _ in range(max_attempts):
        cell = random.choice(CELLS)
        field = random.choice(FIELDS)
        phrase_structure = random.choice(PHRASE_STRUCTURES)
        events, seed = generate_phrase(cell, field, phrase_structure)
        if validate_phrase(events):
            return events, seed
    # Fallback: return last attempt
    cell = random.choice(CELLS)
    field = random.choice(FIELDS)
    phrase_structure = random.choice(PHRASE_STRUCTURES)
    return generate_phrase(cell, field, phrase_structure)


# --- MusicXML export (hill_v30_output_spec.md) ---
PITCH_STEPS = ["C", "D", "E", "F", "G", "A", "B"]
# Key-aware spelling: sharp keys use sharps, flat keys use flats. Avoid double accidentals.
# (step, alter) for pc 0-11. Use only alter in [-1, 0, 1].
PC_TO_STEP_ALTER_SHARP = [  # Prefer sharps (for sharp keys)
    ("C", 0), ("C", 1), ("D", 0), ("D", 1), ("E", 0), ("F", 0),
    ("F", 1), ("G", 0), ("G", 1), ("A", 0), ("A", 1), ("B", 0),
]
PC_TO_STEP_ALTER_FLAT = [   # Prefer flats (for flat keys)
    ("C", 0), ("D", -1), ("D", 0), ("E", -1), ("E", 0), ("F", 0),
    ("G", -1), ("G", 0), ("A", -1), ("A", 0), ("B", -1), ("B", 0),
]


def midi_to_xml_pitch(midi: int, fifths: int = 0) -> tuple[str, int, int]:
    """Convert MIDI to (step, octave, alter). Use fifths for key-aware spelling."""
    pc = ((midi % 12) + 12) % 12
    octave = midi // 12 - 1
    table = PC_TO_STEP_ALTER_SHARP if fifths >= 0 else PC_TO_STEP_ALTER_FLAT
    step, alter = table[pc]
    return step, octave, alter


def events_to_musicxml(events: list[dict[str, Any]], title: str, fifths: int = 0) -> str:
    """Convert Hill events to MusicXML (hill_v30_output_spec). fifths=0 for C major."""
    divs = 4
    header = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.0">
  <work><work-title>{title}</work-title></work>
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
      <score-instrument id="P1-Piano"><instrument-name>Piano</instrument-name></score-instrument>
    </score-part>
    <score-part id="P2">
      <part-name>Bass</part-name>
      <score-instrument id="P2-Bass"><instrument-name>Acoustic Bass</instrument-name></score-instrument>
    </score-part>
    <score-part id="P3">
      <part-name>Drum Set</part-name>
      <score-instrument id="P3-Drums"><instrument-name>Drum Set</instrument-name></score-instrument>
      <score-instrument id="P3-Kick"><instrument-name>Bass Drum</instrument-name></score-instrument>
      <score-instrument id="P3-Snare"><instrument-name>Snare Drum</instrument-name></score-instrument>
      <score-instrument id="P3-Hihat"><instrument-name>Hi-Hat Closed</instrument-name></score-instrument>
      <midi-instrument id="P3-Kick"><midi-channel>10</midi-channel><midi-program>1</midi-program><midi-unpitched>36</midi-unpitched></midi-instrument>
      <midi-instrument id="P3-Snare"><midi-channel>10</midi-channel><midi-program>1</midi-program><midi-unpitched>38</midi-unpitched></midi-instrument>
      <midi-instrument id="P3-Hihat"><midi-channel>10</midi-channel><midi-program>1</midi-program><midi-unpitched>42</midi-unpitched></midi-instrument>
    </score-part>
  </part-list>
''' + "\n"

    drum_events = generate_drum_events()

    # Group by part and measure
    piano_rh: dict[int, list[dict]] = {}
    piano_lh: dict[int, list[dict]] = {}
    bass: dict[int, list[dict]] = {}
    drums: dict[int, list[dict]] = {}

    for ev in drum_events:
        m = ev["bar"]
        drums.setdefault(m, []).append(ev)

    for ev in events:
        m = ev["bar"]  # bar 1 -> measure 1
        role = ev["role"]
        if role == "melody_fragment":
            piano_rh.setdefault(m, []).append(ev)
        elif role == "cluster_color":
            piano_lh.setdefault(m, []).append(ev)
        else:
            # Acoustic bass: single notes only. Take lowest pitch, clamp to range.
            clamped = [max(BASS_MIDI_MIN, min(BASS_MIDI_MAX, p)) for p in ev["pitches"]]
            ev_copy = {**ev, "pitches": [min(clamped)] if clamped else []}  # Single bass note
            if ev_copy["pitches"]:
                bass.setdefault(m, []).append(ev_copy)

    def drum_note_xml(drum_type: str, dur_divs: int, beat_pos: float, is_chord: bool = False) -> str:
        """Build unpitched drum note (Beatrice convention: F5=hihat, F4=kick, D4=snare)."""
        step, octave, notehead, stem = DRUM_MAP[drum_type]
        inst_id = DRUM_INSTRUMENT_IDS[drum_type]
        type_map = {2: "eighth", 4: "quarter", 6: "quarter", 8: "half", 16: "whole"}
        ntype = type_map.get(dur_divs, "quarter")
        dot = "<dot/>" if dur_divs == 6 else ""
        chord_tag = "<chord/>" if is_chord else ""
        nh = f'<notehead>{notehead}</notehead>' if notehead != "normal" else ""
        return f'<note>{chord_tag}<unpitched><display-step>{step}</display-step><display-octave>{octave}</display-octave></unpitched><duration>{dur_divs}</duration><instrument id="{inst_id}"/><type>{ntype}</type>{dot}<stem>{stem}</stem>{nh}</note>'

    def note_xml(pitches: list[int], dur_divs: int, staff: Optional[int], is_chord: bool = False, pitch_clamp: Optional[tuple[int, int]] = None) -> str:
        out = []
        type_map = {2: "eighth", 4: "quarter", 6: "quarter", 8: "half", 16: "whole"}
        ntype = type_map.get(dur_divs, "quarter")
        dot = "<dot/>" if dur_divs == 6 else ""
        staff_tag = f"<staff>{staff}</staff>" if staff else ""
        lo, hi = pitch_clamp or (0, 127)
        for i, p in enumerate(pitches):
            p = max(lo, min(hi, p))
            step, oct, alt = midi_to_xml_pitch(p, fifths)
            alt_tag = f"<alter>{alt}</alter>" if alt else ""
            chord_tag = "<chord/>" if is_chord and i > 0 else ""
            out.append(f'<note>{chord_tag}<pitch><step>{step}</step>{alt_tag}<octave>{oct}</octave></pitch><duration>{dur_divs}</duration><type>{ntype}</type>{dot}{staff_tag}</note>')
        return "".join(out)

    # Build piano part (RH staff 1, LH staff 2). Boost melody for treble range.
    piano_measures: dict[int, list[tuple[int, dict]]] = {}
    for m, evs in piano_rh.items():
        for ev in evs:
            boosted = {**ev, "pitches": [p + MELODY_OCTAVE_BOOST for p in ev["pitches"]]}
            piano_measures.setdefault(m, []).append((1, boosted))
    for m, evs in piano_lh.items():
        for ev in evs:
            piano_measures.setdefault(m, []).append((2, ev))

    # Measure range: templates use bar 1-8
    measure_range = range(1, 9)

    xml = header
    xml += '  <part id="P1">\n'
    for m in measure_range:
        xml += f'    <measure number="{m}">\n'
        if m == 1:
            xml += f"      <attributes>\n        <divisions>4</divisions>\n        <key number=\"1\"><fifths>{fifths}</fifths></key>\n        <key number=\"2\"><fifths>{fifths}</fifths></key>\n        <time><beats>4</beats><beat-type>4</beat-type></time>\n        <staves>2</staves>\n        <clef number=\"1\"><sign>G</sign><line>2</line></clef>\n        <clef number=\"2\"><sign>F</sign><line>4</line></clef>\n      </attributes>\n"
        evts = sorted(piano_measures.get(m, []), key=lambda x: (x[1]["beat_position"], x[0]))
        for staff, ev in evts:
            dur = max(2, min(16, int(ev["duration"] * divs)))
            pitches = ev["pitches"]
            clamp = (PIANO_RH_MIN, PIANO_RH_MAX) if staff == 1 else (PIANO_LH_MIN, PIANO_LH_MAX)
            xml += "      " + note_xml(pitches, dur, staff, len(pitches) > 1, clamp) + "\n"
        if m not in piano_measures:
            xml += '      <note><rest/><duration>16</duration><type>whole</type><staff>1</staff></note>\n'
            xml += '      <note><rest/><duration>16</duration><type>whole</type><staff>2</staff></note>\n'
        xml += "    </measure>\n"
    xml += "  </part>\n"

    xml += '  <part id="P2">\n'
    for m in range(1, 9):
        xml += f'    <measure number="{m}">\n'
        if m == 1:
            xml += f"      <attributes>\n        <divisions>4</divisions>\n        <key><fifths>{fifths}</fifths></key>\n        <time><beats>4</beats><beat-type>4</beat-type></time>\n        <clef><sign>F</sign><line>4</line></clef>\n      </attributes>\n"
        evts = sorted(bass.get(m, []), key=lambda e: e["beat_position"])
        for ev in evts:
            dur = max(2, min(16, int(ev["duration"] * divs)))
            pitches = ev["pitches"]
            xml += "      " + note_xml(pitches, dur, None, len(pitches) > 1, (BASS_MIDI_MIN, BASS_MIDI_MAX)) + "\n"
        if m not in bass:
            xml += '      <note><rest/><duration>16</duration><type>whole</type></note>\n'
        xml += "    </measure>\n"
    xml += "  </part>\n"

    xml += '  <part id="P3">\n'
    for m in measure_range:
        xml += f'    <measure number="{m}">\n'
        if m == 1:
            xml += f"      <attributes>\n        <divisions>4</divisions>\n        <key><fifths>{fifths}</fifths></key>\n        <time><beats>4</beats><beat-type>4</beat-type></time>\n        <clef><sign>percussion</sign></clef>\n      </attributes>\n"
        evts = sorted(drums.get(m, []), key=lambda e: (e["beat_position"], 0 if e["drum_type"] == "hihat" else 1))
        # Voice 1 (hi-hat, upstem): output first
        v1 = [e for e in evts if e["drum_type"] == "hihat"]
        for ev in v1:
            dur = max(2, min(16, int(ev["duration"] * divs)))
            xml += "      " + drum_note_xml(ev["drum_type"], dur, ev["beat_position"]) + "\n"
        if v1:
            xml += f"      <backup><duration>{len(v1) * 2}</duration></backup>\n"  # 2 divs per hi-hat
        # Voice 2 (kick, snare, downstem)
        v2 = [e for e in evts if e["drum_type"] in ("kick", "snare")]
        for ev in v2:
            dur = max(2, min(16, int(ev["duration"] * divs)))
            xml += "      " + drum_note_xml(ev["drum_type"], dur, ev["beat_position"]) + "\n"
        if not evts:
            xml += '      <note><rest/><duration>16</duration><type>whole</type></note>\n'
        xml += "    </measure>\n"
    xml += "  </part>\n"

    xml += "</score-partwise>"
    return xml
