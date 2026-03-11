"""Style profiles for modulation weighting."""

from .default import WEIGHTS as default_weights
from .ecm_axis import WEIGHTS as ecm_axis_weights
from .jazz_modern import WEIGHTS as jazz_modern_weights
from .jazz_rock import WEIGHTS as jazz_rock_weights
from .pop_colour import WEIGHTS as pop_colour_weights
from .classical_structural import WEIGHTS as classical_structural_weights

STYLE_REGISTRY = {
    "default": default_weights,
    "ecm_axis": ecm_axis_weights,
    "jazz_modern": jazz_modern_weights,
    "jazz_rock": jazz_rock_weights,
    "pop_colour": pop_colour_weights,
    "classical_structural": classical_structural_weights,
}

STYLE_OPTIONS = list(STYLE_REGISTRY.keys())

# Mighty Ten engines (from creative-engines/docs/The_Mighty_Ten_Engines_User_Guide.md)
MIGHTY_ENGINES = [
    "default",
    "scofield_holland",
    "shorter_narrative",
    "frisell_atmosphere",
    "wheeler_lyric",
    "stravinsky_pulse",
    "zappa_disruption",
    "slonimsky_harmonic",
    "bartok_night",
    "counterpoint_hybrid",
    "polyphonic_labyrinth",
]

# Display labels for UI
MIGHTY_ENGINE_LABELS = {
    "default": "Default (no modifier)",
    "scofield_holland": "Scofield–Holland Groove",
    "shorter_narrative": "Wayne Shorter Narrative",
    "frisell_atmosphere": "Frisell Atmosphere",
    "wheeler_lyric": "Wheeler Lyric",
    "stravinsky_pulse": "Stravinsky Pulse",
    "zappa_disruption": "Zappa Disruption",
    "slonimsky_harmonic": "Slonimsky Harmonic",
    "bartok_night": "Bartók Night",
    "counterpoint_hybrid": "Counterpoint Hybrid",
    "polyphonic_labyrinth": "Polyphonic Labyrinth",
}


def get_weights(style_name: str) -> dict:
    """Return WEIGHTS dict for given style."""
    return STYLE_REGISTRY.get(style_name, default_weights)
