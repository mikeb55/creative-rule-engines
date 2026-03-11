"""CLI for modmenu."""

import argparse
from core.parser import parse_progression
from core.strategies import generate_suggestions
from core.scorer import score_and_rank
from styles import get_weights


def _voice_leading_label(s) -> str:
    if s.strategy in ("common_tone", "pivot_chord", "modal_interchange"):
        return "High"
    if s.strategy == "chromatic_mediant":
        return "Medium"
    return "Low"


def _density_label(s) -> str:
    if s.emotional_tag in ("dramatic lift", "colour shift"):
        return "Lift"
    if s.emotional_tag in ("direct resolution", "smooth transition"):
        return "Build"
    if s.emotional_tag == "subtle drift":
        return "Thin"
    return "Build"


def main() -> None:
    parser = argparse.ArgumentParser(description="Modulation Menu Engine")
    parser.add_argument("--prog", required=True, help="Comma-separated chord progression")
    parser.add_argument("--style", default="default", help="Style profile")
    parser.add_argument("--mighty_engine", default="default", help="Mighty Ten engine modifier")
    parser.add_argument("--max", type=int, default=5, help="Max suggestions")
    args = parser.parse_args()

    weights = get_weights(args.style)
    suggestions = generate_suggestions(args.prog)
    ranked = score_and_rank(
        suggestions,
        weights,
        mighty_engine=args.mighty_engine,
        max_results=args.max,
    )

    for i, s in enumerate(ranked, 1):
        vl = _voice_leading_label(s)
        cad = s.cadence_type
        density = _density_label(s)
        style_align = "aligned" if args.style != "default" else "neutral"
        print(f"Suggestion #{i}")
        print(f"From: {s.from_region}")
        print(f"To: {s.to_region}")
        print(f"Strategy: {s.strategy}")
        print(f"Style alignment: {style_align}")
        print(f"Pivot: {s.pivot_explanation}")
        print(f"Voice-leading: {vl}")
        print(f"Cadence: {cad}")
        print(f"Effect: {s.emotional_tag}")
        print(f"Chord path: {', '.join(s.chord_path)}")
        print(f"Density: {density}")
        print()


if __name__ == "__main__":
    main()
