"""Smoke test for modulation menu engine."""

from core.parser import parse_progression
from core.strategies import generate_suggestions
from core.scorer import score_and_rank
from styles import get_weights


def test_smoke():
    prog = "C,G,Am,F"
    chords = parse_progression(prog)
    assert len(chords) == 4
    assert chords[0].root == "C"
    assert chords[0].original == "C"

    suggestions = generate_suggestions(prog)
    assert len(suggestions) >= 3

    weights = get_weights("default")
    ranked = score_and_rank(suggestions, weights, max_results=5)
    assert len(ranked) >= 3

    for s in ranked:
        assert hasattr(s, "strategy")
        assert hasattr(s, "chord_path")
        assert hasattr(s, "cadence_type")
        assert hasattr(s, "emotional_tag")
        assert s.strategy
        assert s.chord_path
        assert s.cadence_type
        assert s.emotional_tag


if __name__ == "__main__":
    test_smoke()
    print("Smoke test passed.")
