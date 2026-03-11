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


def get_weights(style_name: str) -> dict:
    """Return WEIGHTS dict for given style."""
    return STYLE_REGISTRY.get(style_name, default_weights)
