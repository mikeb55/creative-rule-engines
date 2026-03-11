"""Modulation strategy generators."""

from dataclasses import dataclass
from typing import Optional
from .parser import ParsedChord, parse_progression


@dataclass
class ModulationSuggestion:
    """Single modulation suggestion."""

    from_region: str
    to_region: str
    strategy: str
    pivot_explanation: str
    chord_path: list[str]
    cadence_type: str
    emotional_tag: str


# Simple region mapping from roots (best-effort)
_REGIONS = {
    "C": "C major", "C#": "C# major", "Db": "Db major", "D": "D major",
    "D#": "Eb major", "Eb": "Eb major", "E": "E major", "F": "F major",
    "F#": "F# major", "Gb": "Gb major", "G": "G major", "G#": "Ab major",
    "Ab": "Ab major", "A": "A major", "A#": "Bb major", "Bb": "Bb major",
    "B": "B major",
}


def _root_to_region(root: str) -> str:
    return _REGIONS.get(root, f"{root} region")


def _get_roots(chords: list[ParsedChord]) -> list[str]:
    return [c.root for c in chords]


def _pivot_chord(chords: list[ParsedChord]) -> Optional[ModulationSuggestion]:
    if len(chords) < 2:
        return None
    roots = _get_roots(chords)
    from_r = _root_to_region(roots[0])
    to_r = _root_to_region(roots[-1])
    pivot = chords[len(chords) // 2].original if len(chords) > 2 else chords[0].original
    path = [c.original for c in chords]
    return ModulationSuggestion(
        from_region=from_r,
        to_region=to_r,
        strategy="pivot_chord",
        pivot_explanation=f"{pivot} functions in both keys",
        chord_path=path,
        cadence_type="Strong",
        emotional_tag="smooth transition",
    )


def _common_tone(chords: list[ParsedChord]) -> Optional[ModulationSuggestion]:
    if len(chords) < 2:
        return None
    roots = _get_roots(chords)
    from_r = _root_to_region(roots[0])
    to_r = _root_to_region(roots[-1])
    path = [c.original for c in chords]
    return ModulationSuggestion(
        from_region=from_r,
        to_region=to_r,
        strategy="common_tone",
        pivot_explanation="shared tone bridges keys",
        chord_path=path,
        cadence_type="Weak",
        emotional_tag="subtle drift",
    )


def _chromatic_mediant(chords: list[ParsedChord]) -> Optional[ModulationSuggestion]:
    if len(chords) < 2:
        return None
    roots = _get_roots(chords)
    from_r = _root_to_region(roots[0])
    to_r = _root_to_region(roots[-1])
    path = [c.original for c in chords]
    return ModulationSuggestion(
        from_region=from_r,
        to_region=to_r,
        strategy="chromatic_mediant",
        pivot_explanation="mediant relation creates colour shift",
        chord_path=path,
        cadence_type="None",
        emotional_tag="dramatic lift",
    )


def _dominant_injection(chords: list[ParsedChord]) -> Optional[ModulationSuggestion]:
    if len(chords) < 2:
        return None
    roots = _get_roots(chords)
    from_r = _root_to_region(roots[0])
    to_r = _root_to_region(roots[-1])
    path = [c.original for c in chords]
    return ModulationSuggestion(
        from_region=from_r,
        to_region=to_r,
        strategy="dominant_injection",
        pivot_explanation="V of new key prepares arrival",
        chord_path=path,
        cadence_type="Strong",
        emotional_tag="direct resolution",
    )


def _modal_interchange(chords: list[ParsedChord]) -> Optional[ModulationSuggestion]:
    if len(chords) < 2:
        return None
    roots = _get_roots(chords)
    from_r = _root_to_region(roots[0])
    to_r = _root_to_region(roots[-1])
    path = [c.original for c in chords]
    return ModulationSuggestion(
        from_region=from_r,
        to_region=to_r,
        strategy="modal_interchange",
        pivot_explanation="parallel mode borrows colour",
        chord_path=path,
        cadence_type="Weak",
        emotional_tag="colour shift",
    )


_STRATEGY_FUNCS = [
    _pivot_chord,
    _common_tone,
    _chromatic_mediant,
    _dominant_injection,
    _modal_interchange,
]


def generate_suggestions(prog_str: str) -> list[ModulationSuggestion]:
    """Generate modulation suggestions for a chord progression."""
    chords = parse_progression(prog_str)
    if not chords:
        return []
    suggestions = []
    for fn in _STRATEGY_FUNCS:
        s = fn(chords)
        if s:
            suggestions.append(s)
    return suggestions
