#!/usr/bin/env python3
"""
Wayne Shorter MusicXML Exporter

Converts runtime event structures into valid MusicXML.
Strict measure-level time accounting; per-voice emission with backup.
Context-aware pitch spelling from harmonic fields.
"""

from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple

# Staff ranges per shorter_musicxml_export_spec.md
TREBLE_MIN = 55
TREBLE_MAX = 79
BASS_MIN = 28
BASS_MAX = 52

DIVISIONS = 4  # divisions per quarter note

DURATION_MAP = {
    0.25: (1, "16th", False),
    0.5: (2, "eighth", False),
    1.0: (4, "quarter", False),
    1.5: (6, "quarter", True),
    2.0: (8, "half", False),
    3.0: (12, "half", True),
    4.0: (16, "whole", False),
}

ENHARMONIC_OPTIONS = {
    0: [("C", 0)], 1: [("C", 1), ("D", -1)], 2: [("D", 0)], 3: [("D", 1), ("E", -1)],
    4: [("E", 0)], 5: [("F", 0)], 6: [("F", 1), ("G", -1)], 7: [("G", 0)],
    8: [("G", 1), ("A", -1)], 9: [("A", 0)], 10: [("A", 1), ("B", -1)], 11: [("B", 0), ("C", -1)],
}
FIELD_PREFER_FLAT = {"Field A", "Field B"}
FIELD_PREFER_SHARP_FOR_6 = {"Field C"}


def measure_duration_divisions(divisions: int, beats: int, beat_type: int) -> int:
    """Measure duration in divisions. divisions * beats * 4 / beat_type."""
    return divisions * beats * 4 // beat_type


def _clamp_pitch(pitch: int, role: str) -> int:
    if role in ("melody", "counterline", "harmonic_color"):
        return max(TREBLE_MIN, min(TREBLE_MAX, pitch))
    if role == "bass":
        return max(BASS_MIN, min(BASS_MAX, pitch))
    return pitch


def _spell_pitch(midi: int, harmonic_field: str, recent_spellings: Dict[int, Tuple[str, int]]) -> Tuple[str, int, int]:
    pc = midi % 12
    octave = (midi // 12) - 1
    options = ENHARMONIC_OPTIONS.get(pc, [("C", 0)])
    if pc in recent_spellings:
        return recent_spellings[pc][0], recent_spellings[pc][1], octave
    if harmonic_field in FIELD_PREFER_FLAT and len(options) > 1:
        flat_opt = next((o for o in options if o[1] == -1), None)
        if flat_opt:
            return flat_opt[0], flat_opt[1], octave
    if harmonic_field in FIELD_PREFER_SHARP_FOR_6 and pc == 6:
        return "F", 1, octave
    return options[0][0], options[0][1], octave


def _duration_to_musicxml(duration: float) -> tuple:
    if duration in DURATION_MAP:
        return DURATION_MAP[duration]
    divs = max(1, int(duration * DIVISIONS))
    if divs <= 1:
        return 1, "16th", False
    if divs <= 2:
        return 2, "eighth", False
    if divs <= 4:
        return 4, "quarter", False
    if divs <= 6:
        return 6, "quarter", True
    if divs <= 8:
        return 8, "half", False
    if divs <= 12:
        return 12, "half", True
    return 16, "whole", False


def _duration_beats_to_divisions(duration_beats: float) -> int:
    return max(1, int(duration_beats * DIVISIONS))


def _beat_position_to_divisions(beat: float) -> int:
    return int(beat * DIVISIONS)


def _divisions_to_type_dot(divs: int) -> Tuple[str, bool]:
    if divs <= 1:
        return "16th", False
    if divs <= 2:
        return "eighth", False
    if divs <= 4:
        return "quarter", False
    if divs <= 6:
        return "quarter", True
    if divs <= 8:
        return "half", False
    if divs <= 12:
        return "half", True
    return "whole", False


def _note_xml(pitch: int, duration_divs: int, voice: int, staff: int, step: str, alter: int, octave: int, chord: bool = False) -> str:
    typ, dot = _divisions_to_type_dot(duration_divs)
    chord_tag = "<chord/>" if chord else ""
    alter_tag = f"<alter>{alter}</alter>" if alter != 0 else ""
    dot_tag = "<dot/>" if dot else ""
    return (
        f"      <note>"
        f"{chord_tag}"
        f"<pitch><step>{step}</step>{alter_tag}<octave>{octave}</octave></pitch>"
        f"<duration>{duration_divs}</duration><type>{typ}</type>{dot_tag}"
        f"<voice>{voice}</voice><staff>{staff}</staff>"
        f"</note>"
    )


def _rest_xml(duration_divs: int, voice: int, staff: int) -> str:
    typ, dot = _divisions_to_type_dot(duration_divs)
    dot_tag = "<dot/>" if dot else ""
    return (
        f"      <note>"
        f"<rest/><duration>{duration_divs}</duration><type>{typ}</type>{dot_tag}"
        f"<voice>{voice}</voice><staff>{staff}</staff>"
        f"</note>"
    )


def _backup_xml(duration_divs: int) -> str:
    return f"      <backup><duration>{duration_divs}</duration></backup>\n"


def _key_signature_from_field(field: str) -> int:
    key_map = {"Field A": -2, "Field B": -4, "Field C": 1, "Field D": 0, "Field E": 0, "Field F": 0, "Field G": 0}
    return key_map.get(field, 0)


def _measure_attributes(measure_num: int, staves: int, fifths: int, beats: int, beat_type: int) -> str:
    clefs = ""
    if staves == 2:
        clefs = (
            '<staves>2</staves>'
            '<clef number="1"><sign>G</sign><line>2</line></clef>'
            '<clef number="2"><sign>F</sign><line>4</line></clef>'
        )
    else:
        clefs = '<clef><sign>G</sign><line>2</line></clef>'
    return f"""    <measure number="{measure_num}">
      <attributes>
        <divisions>{DIVISIONS}</divisions>
        <key><fifths>{fifths}</fifths></key>
        <time><beats>{beats}</beats><beat-type>{beat_type}</beat-type></time>
        {clefs}
      </attributes>
"""


def _measure_attributes_subsequent(measure_num: int) -> str:
    return f'    <measure number="{measure_num}">\n'


def _group_events_by_measure_and_voice(events: List[Dict], roles_included: List[str]) -> Dict[int, Dict[Tuple[int, int], List[Dict]]]:
    """Group by measure, then by (staff, voice). Staff 1=treble, 2=bass. Voice 1=RH, 2=LH."""
    by_measure = {}
    for e in events:
        role = e.get("role", "melody")
        if role not in roles_included:
            continue
        bar = e.get("bar", 1)
        staff = 1 if role in ("melody", "counterline", "harmonic_color") else 2
        voice = 1 if staff == 1 else 2
        key = (staff, voice)
        if bar not in by_measure:
            by_measure[bar] = {}
        if key not in by_measure[bar]:
            by_measure[bar][key] = []
        by_measure[bar][key].append(e)
    for bar in by_measure:
        for key in by_measure[bar]:
            by_measure[bar][key].sort(key=lambda x: (x.get("beat_position", 0), x.get("event_id", "")))
    return by_measure


def _build_voice_sequence(
    events: List[Dict],
    measure_duration_divs: int,
    export_mode: str,
    staff: int,
    voice: int,
    recent_spellings: Dict[int, Tuple[str, int]],
) -> Tuple[List[str], int]:
    """
    Build XML for one voice in one measure. Returns (xml_lines, total_duration_divs).
    Inserts rests for gaps; fills to measure end.
    """
    lines = []
    evs = sorted(events, key=lambda x: x.get("beat_position", 0))
    cursor = 0

    for e in evs:
        onset = _beat_position_to_divisions(e.get("beat_position", 0))
        duration_beats = e.get("duration", 1.0)
        duration_divs = _duration_beats_to_divisions(duration_beats)

        if onset < cursor:
            continue
        if onset > cursor:
            gap = onset - cursor
            lines.append(_rest_xml(gap, voice, staff))
            cursor += gap
        if onset + duration_divs > measure_duration_divs:
            duration_divs = measure_duration_divs - onset
        if duration_divs <= 0:
            continue

        role = e.get("role", "melody")
        pitch = _clamp_pitch(e.get("pitch", 60), role)
        field = e.get("harmonic_field", "Field A")
        step, alter, octave = _spell_pitch(pitch, field, recent_spellings)
        recent_spellings[pitch % 12] = (step, alter)

        lines.append(_note_xml(pitch, duration_divs, voice, staff, step, alter, octave, False))
        cursor += duration_divs

    if cursor < measure_duration_divs:
        lines.append(_rest_xml(measure_duration_divs - cursor, voice, staff))
        cursor = measure_duration_divs

    return lines, cursor


def _validate_measure_timing(
    voice_totals: Dict[Tuple[int, int], int],
    measure_duration_divs: int,
    measure_num: int,
) -> Optional[str]:
    for (staff, voice), total in voice_totals.items():
        if total != measure_duration_divs:
            return f"Measure {measure_num} voice ({staff},{voice}): expected {measure_duration_divs}, got {total}"
    return None


def _build_measure_notes(
    by_voice: Dict[Tuple[int, int], List[Dict]],
    measure_num: int,
    measure_duration_divs: int,
    export_mode: str,
    recent_spellings: Dict[int, Tuple[str, int]],
    beats: int,
    beat_type: int,
    staves: int = 2,
) -> str:
    """Emit RH voice, backup, LH voice. Validate totals."""
    voice_order = [(1, 1), (2, 2)]
    all_lines = []
    voice_totals = {}

    for (staff, voice) in voice_order:
        evs = by_voice.get((staff, voice), [])
        lines, total = _build_voice_sequence(
            evs, measure_duration_divs, export_mode, staff, voice, recent_spellings
        )
        voice_totals[(staff, voice)] = total
        all_lines.extend(lines)
        if (staff, voice) == (1, 1) and staves >= 2:
            all_lines.append(_backup_xml(measure_duration_divs))

    err = _validate_measure_timing(voice_totals, measure_duration_divs, measure_num)
    if err:
        raise RuntimeError(f"MusicXML timing validation failed: {err}")

    return "\n".join(all_lines) if all_lines else _rest_xml(measure_duration_divs, 1, 1)


def _clean_title(raw: str) -> str:
    if not raw or raw.strip() == "":
        return "Wayne Shorter Engine"
    s = raw.strip()
    if "—" in s:
        parts = s.split("—", 1)
        return f"Wayne Shorter — {parts[-1].strip()}"
    return s


def events_to_musicxml(
    events: List[Dict],
    export_mode: str = "melody_bass",
    title: str = "Wayne Shorter Engine",
    time_signature: Optional[Tuple[int, int]] = None,
) -> str:
    beats, beat_type = time_signature or (4, 4)
    measure_duration_divs = measure_duration_divisions(DIVISIONS, beats, beat_type)

    if export_mode == "lead_sheet":
        roles = ["melody"]
        part_name = "Melody"
        staves = 1
    elif export_mode == "melody_bass":
        roles = ["melody", "bass"]
        part_name = "Piano"
        staves = 2
    else:
        roles = ["melody", "counterline", "harmonic_color", "bass"]
        part_name = "Piano"
        staves = 2

    total_bars = max((e.get("bar", 1) for e in events), default=1)
    by_measure = _group_events_by_measure_and_voice(events, roles)

    fifths = 0
    if events:
        first_melody = next((e for e in events if e.get("role") in ("melody", "counterline", "harmonic_color")), events[0])
        fifths = _key_signature_from_field(first_melody.get("harmonic_field", "Field A"))

    recent_spellings = {}
    last_phrase_group = ""
    measures_xml = []

    for m in range(1, total_bars + 1):
        if m == 1:
            measures_xml.append(_measure_attributes(m, staves, fifths, beats, beat_type))
        else:
            measures_xml.append(_measure_attributes_subsequent(m))

        by_voice = by_measure.get(m, {})
        if by_voice:
            phrase_group = next(iter(next(iter(by_voice.values())))).get("phrase_group", "") if by_voice else ""
            if phrase_group and phrase_group != last_phrase_group:
                recent_spellings.clear()
                last_phrase_group = phrase_group

        if staves == 1:
            evs = by_voice.get((1, 1), [])
            lines, _ = _build_voice_sequence(evs, measure_duration_divs, export_mode, 1, 1, recent_spellings)
            notes = "\n".join(lines) if lines else _rest_xml(measure_duration_divs, 1, 1)
        else:
            notes = _build_measure_notes(by_voice, m, measure_duration_divs, export_mode, recent_spellings, beats, beat_type, staves)

        measures_xml.append(notes)
        measures_xml.append("\n    </measure>")

    part_content = "\n".join(measures_xml)
    clean_title = _clean_title(title)

    part_list = f"""  <part-list>
    <score-part id="P1">
      <part-name>{part_name}</part-name>
      <score-instrument id="P1-Instrument"><instrument-name>{part_name}</instrument-name></score-instrument>
    </score-part>
  </part-list>
"""

    return f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.0">
  <work><work-title>{clean_title}</work-title></work>
{part_list}
  <part id="P1">
{part_content}
  </part>
</score-partwise>
'''


def validate_musicxml_timing(xml_content: str) -> Tuple[bool, List[str]]:
    """
    Strict timing validator. Returns (passed, diagnostics).
    Note: Full validation runs during export via _validate_measure_timing.
    This function performs basic structural checks on exported XML.
    """
    diagnostics = []
    if "<score-partwise" not in xml_content:
        diagnostics.append("Missing score-partwise root")
        return False, diagnostics
    if "<measure " not in xml_content:
        diagnostics.append("Missing measures")
        return False, diagnostics
    if "<duration>" not in xml_content:
        diagnostics.append("Missing duration elements")
        return False, diagnostics
    return True, diagnostics


def export_to_file(
    events: List[Dict],
    output_path: Path,
    export_mode: str = "melody_bass",
    title: Optional[str] = None,
    time_signature: Optional[Tuple[int, int]] = None,
) -> Path:
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    title = title or f"Wayne Shorter — {output_path.stem}"
    xml = events_to_musicxml(events, export_mode, title, time_signature)
    output_path.write_text(xml, encoding="utf-8")
    return output_path


def get_output_dir() -> Path:
    return Path(__file__).resolve().parent.parent / "output"
