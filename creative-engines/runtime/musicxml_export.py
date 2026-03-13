"""
MusicXML Export — minimal scaffold for exporting phrases and scores.
"""

from pathlib import Path
from typing import Any, Optional, Union

from composition_pipeline import CompositionContext


def _outputs_dir() -> Path:
    """Path to creative-engines/outputs/."""
    return Path(__file__).resolve().parent.parent / "outputs"


def export_phrase_to_musicxml(
    phrase: list,
    output_path: Optional[Union[Path, str]] = None,
    title: str = "Phrase",
) -> Path:
    """
    Export a single phrase to MusicXML.

    phrase: list of {"pitch": int, "duration": float, "offset": float?}
    """
    path = Path(output_path) if output_path else _outputs_dir() / "phrase.xml"
    path.parent.mkdir(parents=True, exist_ok=True)

    notes_xml = []
    for i, n in enumerate(phrase):
        pitch = n.get("pitch", 60)
        duration = n.get("duration", 0.5)
        offset = n.get("offset", sum(p.get("duration", 0.5) for p in phrase[:i]))
        step = ["C", "D", "E", "F", "G", "A", "B"][pitch % 7]
        octave = pitch // 12 - 1
        alter = 0  # simplified
        divs = 4
        dur = int(duration * divs)
        notes_xml.append(
            f'    <note><pitch><step>{step}</step><octave>{octave}</octave></pitch>'
            f'<duration>{dur}</duration><type>quarter</type></note>'
        )

    xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work><work-title>{title}</work-title></work>
  <part-list><score-part id="P1"><part-name>Part 1</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes><divisions>{divs}</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>
{chr(10).join(notes_xml)}
    </measure>
  </part>
</score-partwise>
'''
    path.write_text(xml, encoding="utf-8")
    return path


def export_score_to_musicxml(ctx: CompositionContext, output_path: Optional[Union[Path, str]] = None) -> Path:
    """
    Export a full composition context to MusicXML.
    """
    path = Path(output_path) if output_path else _outputs_dir() / "composition.xml"
    path.parent.mkdir(parents=True, exist_ok=True)

    # Flatten texture to single phrase for minimal export
    phrase = []
    for layer in ctx.texture:
        phrase.extend(layer.get("notes", []))
    if not phrase and ctx.motif:
        phrase = ctx.motif

    title = "Composition"
    if ctx.metadata.get("harmony_engine"):
        title = f"{ctx.metadata['harmony_engine']} + {ctx.metadata.get('style_engine', '')}"

    return export_phrase_to_musicxml(phrase, path, title=title)
