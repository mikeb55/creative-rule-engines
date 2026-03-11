#!/usr/bin/env python3
"""
Add melodic bass voice (voice 2) to Wyble Engine test tunes.
Output: V3_full_wyble_texture.musicxml

Usage: py add_melodic_bass.py [Narrative_Drift|Shifting_Lines|Northern_Thread]

Bass rules:
- Melodic: stepwise motion, chromatic approaches
- No arpeggio patterns (root-3rd-5th)
- Contrary motion where possible
- Guitar range: E2 to G4
"""

import sys
import xml.etree.ElementTree as ET
from pathlib import Path

TUNE_CONFIG = {
    'Narrative_Drift': {'bass_per_bar': 4, 'duration': 256},
    'Northern_Thread': {'bass_per_bar': 4, 'duration': 256},
    'Shifting_Lines': {'bass_per_bar': 3, 'duration': 256},  # 6/8: 3 dotted-quarter bass notes
}

# Guitar range: E2 (MIDI 40) to G4 (MIDI 67)
BASS_MIN_MIDI = 40   # E2
BASS_MAX_MIDI = 67   # G4

# Chromatic scale: C=0, C#=1, D=2, Eb=3, E=4, F=5, F#=6, G=7, Ab=8, A=9, Bb=10, B=11
STEP_TO_PC = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
PC_TO_STEP = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
PC_TO_MUSICXML = [
    ('C', None), ('C', 1), ('D', None), ('E', -1), ('E', None), ('F', None),
    ('F', 1), ('G', None), ('A', -1), ('A', None), ('B', -1), ('B', None)
]

DIVISIONS = 256
QUARTER = 256
HALF = 512
WHOLE = 1024

DURATION_TO_TYPE = {
    128: ('eighth', False),
    256: ('quarter', False),
    384: ('half', True),   # dotted quarter
    512: ('half', False),
    768: ('half', True),   # dotted half
    1024: ('whole', False),
}


def parse_root(harmony_elem):
    """Extract root pitch class from harmony element."""
    root = harmony_elem.find('.//root')
    if root is None:
        return None
    step_elem = root.find('root-step')
    alter_elem = root.find('root-alter')
    step = step_elem.text if step_elem is not None else 'C'
    alter = int(alter_elem.text) if alter_elem is not None and alter_elem.text else 0
    pc = (STEP_TO_PC.get(step, 0) + alter) % 12
    return pc


def pc_to_musicxml(pc):
    """Convert pitch class to (step, alter) for MusicXML."""
    step, alter = PC_TO_MUSICXML[pc]
    return step, alter


def pc_to_midi(pc, octave):
    """Pitch class + octave to MIDI number."""
    return (octave + 1) * 12 + pc


def midi_to_pitch(midi):
    """MIDI to (step, alter, octave) for MusicXML."""
    pc = midi % 12
    octave = (midi // 12) - 1
    step, alter = pc_to_musicxml(pc)
    return step, alter, octave


def clamp_to_range(midi):
    """Clamp MIDI to guitar bass range E2-G4."""
    return max(BASS_MIN_MIDI, min(BASS_MAX_MIDI, midi))


def get_melody_direction(measure_elem):
    """Get overall melody direction: 1=up, -1=down, 0=neutral."""
    pitches = []
    for note in measure_elem.findall('note'):
        if note.find('rest') is not None or note.find('chord') is not None:
            continue
        pitch = note.find('pitch')
        if pitch is None:
            continue
        step = pitch.find('step')
        alter = pitch.find('alter')
        octave = pitch.find('octave')
        if step is None or octave is None:
            continue
        pc = STEP_TO_PC.get(step.text, 0) + (int(alter.text) if alter is not None and alter.text else 0)
        midi = pc_to_midi(pc % 12, int(octave.text))
        pitches.append(midi)
    if len(pitches) < 2:
        return 0
    return 1 if pitches[-1] > pitches[0] else (-1 if pitches[-1] < pitches[0] else 0)


def chromatic_approach_to(target_pc, from_midi):
    """Return MIDI of chromatic approach (half step below) to target, in range."""
    target_midi_c3 = pc_to_midi(target_pc, 2)  # octave 2 = C2
    approach = target_midi_c3 - 1
    approach = clamp_to_range(approach)
    return approach


def stepwise_from(midi, direction, steps=1):
    """Move stepwise (diatonic or chromatic) from midi. direction: 1=up, -1=down."""
    result = midi + (direction * steps)
    return clamp_to_range(result)


def generate_melodic_bass_notes(root_pc, next_root_pc, prev_bass_midi, melody_dir, measure_idx, bass_per_bar):
    """
    Generate bass pitches for one measure.
    - bass_per_bar: 4 for 4/4, 3 for 6/8
    """
    root_midi = pc_to_midi(root_pc, 2)
    root_midi = clamp_to_range(root_midi)
    bass_dir = -melody_dir if melody_dir != 0 else (1 if measure_idx % 2 == 0 else -1)
    step_offset = 1 if bass_dir > 0 else -1
    next_root_midi = clamp_to_range(pc_to_midi(next_root_pc, 2))
    approach = clamp_to_range(next_root_midi - 1)

    if bass_per_bar == 4:
        b1, b2, b3 = root_midi, clamp_to_range(root_midi + step_offset), clamp_to_range(root_midi + 2 * step_offset)
        b4 = approach
        if b1 == b2 == b3 == b4:
            b2, b3 = clamp_to_range(b1 + 1), clamp_to_range(b2 - 1)
        if abs(b2 - b1) in (3, 4) or abs(b3 - b2) == 3:
            b2, b3 = clamp_to_range(b1 + 1), clamp_to_range(b2 + 1)
        return [b1, b2, b3, b4]
    else:
        # 6/8: 3 notes - root, stepwise, chromatic approach
        b1 = root_midi
        b2 = clamp_to_range(b1 + step_offset)
        b3 = approach
        if b1 == b2 == b3:
            b2 = clamp_to_range(b1 + 1)
        return [b1, b2, b3]


def create_note_element(pitch_midi, duration, is_chord=False):
    """Create MusicXML note element for bass voice."""
    step, alter, octave = midi_to_pitch(pitch_midi)
    note_type, dotted = DURATION_TO_TYPE.get(duration, ('quarter', False))
    
    note = ET.Element('note')
    if is_chord:
        note.append(ET.Element('chord'))
    pitch = ET.SubElement(note, 'pitch')
    ET.SubElement(pitch, 'step').text = step
    if alter is not None:
        alt = ET.SubElement(pitch, 'alter')
        alt.text = str(alter)
    ET.SubElement(pitch, 'octave').text = str(octave)
    ET.SubElement(note, 'duration').text = str(duration)
    type_elem = ET.SubElement(note, 'type')
    type_elem.text = note_type
    if dotted:
        ET.SubElement(note, 'dot')
    ET.SubElement(note, 'voice').text = '2'
    ET.SubElement(note, 'stem').text = 'down'
    return note


def get_measure_chord(measure_elem):
    """Get chord root PC from harmony in measure."""
    harmony = measure_elem.find('harmony')
    if harmony is None:
        return None
    return parse_root(harmony)


def add_voice_to_melody_notes(measure_elem):
    """Ensure all melody notes and rests have voice=1, stem=up for notes."""
    for note in measure_elem.findall('note'):
        if note.find('chord') is not None:
            continue
        voice = note.find('voice')
        if voice is None:
            voice = ET.SubElement(note, 'voice')
        voice.text = '1'
        if note.find('rest') is None:
            stem = note.find('stem')
            if stem is None:
                stem = ET.SubElement(note, 'stem')
            stem.text = 'up'


def insert_bass_into_measure(measure_elem, bass_midis, duration=256):
    """Insert bass notes interleaved with melody by onset time."""
    add_voice_to_melody_notes(measure_elem)

    events = []
    offset = 0
    current_onset = 0
    for note in measure_elem.findall('note'):
        chord = note.find('chord')
        duration_elem = note.find('duration')
        if duration_elem is None:
            continue
        dur = int(duration_elem.text)
        if chord is not None:
            onset = current_onset
        else:
            current_onset = offset
            onset = current_onset
            offset += dur
        events.append((onset, dur, note, False))

    for i, midi in enumerate(bass_midis):
        onset = i * duration
        note_elem = create_note_element(midi, duration, is_chord=False)
        events.append((onset, duration, note_elem, True))
    
    # Sort by onset, then melody before bass at same onset
    events.sort(key=lambda e: (e[0], e[3]))  # False(0) before True(1)
    
    # Remove existing notes, then add in sorted order
    for note in measure_elem.findall('note'):
        measure_elem.remove(note)
    
    for _, _, elem, _ in events:
        measure_elem.append(elem)


def main():
    tune = sys.argv[1] if len(sys.argv) > 1 else 'Narrative_Drift'
    if tune not in TUNE_CONFIG:
        print(f'Unknown tune: {tune}. Use: Narrative_Drift, Shifting_Lines, Northern_Thread')
        sys.exit(1)
    cfg = TUNE_CONFIG[tune]
    bass_per_bar = cfg['bass_per_bar']
    duration = cfg['duration']

    script_dir = Path(__file__).parent
    input_path = script_dir / tune / 'musicxml' / 'V1_original.musicxml'
    output_path = script_dir / tune / 'musicxml' / 'V3_full_wyble_texture.musicxml'

    if not input_path.exists():
        print(f'Input not found: {input_path}')
        sys.exit(1)

    tree = ET.parse(input_path)
    root = tree.getroot()

    tune_display = tune.replace('_', ' ')
    work_title = root.find('.//work-title')
    if work_title is not None:
        work_title.text = f'{tune_display} — V3 Full Wyble Texture'

    part_name = root.find('.//part-name')
    if part_name is not None:
        part_name.text = 'Full Wyble Texture (melody + melodic bass)'

    part = root.find('.//part[@id="P1"]')
    if part is None:
        raise ValueError('Part P1 not found')

    measures = part.findall('measure')
    chord_sequence = []
    for m in measures:
        pc = get_measure_chord(m)
        chord_sequence.append(pc if pc is not None else 0)
    chord_sequence.append(chord_sequence[0])

    prev_bass_midi = 40
    for idx, measure_elem in enumerate(measures):
        root_pc = chord_sequence[idx]
        next_root_pc = chord_sequence[idx + 1]
        melody_dir = get_melody_direction(measure_elem)
        bass_midis = generate_melodic_bass_notes(
            root_pc, next_root_pc, prev_bass_midi, melody_dir, idx, bass_per_bar
        )
        prev_bass_midi = bass_midis[-1]
        insert_bass_into_measure(measure_elem, bass_midis, duration)
    
    # Write output with proper XML declaration and DOCTYPE
    output_path.parent.mkdir(parents=True, exist_ok=True)
    tree.write(
        str(output_path),
        encoding='utf-8',
        default_namespace=None,
        xml_declaration=True,
        method='xml'
    )
    # Restore DOCTYPE (ElementTree strips it)
    with open(output_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if '<score-partwise' in content and '<!DOCTYPE' not in content:
        content = content.replace(
            '<score-partwise version="4.0">',
            '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n<score-partwise version="4.0">',
            1
        )
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
    
    print(f'Written: {output_path}')


if __name__ == '__main__':
    main()
