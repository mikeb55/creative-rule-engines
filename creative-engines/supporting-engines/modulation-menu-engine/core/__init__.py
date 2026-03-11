"""Modulation Menu Engine core."""

from .parser import parse_progression
from .strategies import generate_suggestions
from .scorer import score_and_rank

__all__ = ["parse_progression", "generate_suggestions", "score_and_rank"]
