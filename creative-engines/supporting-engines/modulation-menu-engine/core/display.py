"""Display helpers for modulation suggestions. Shared by CLI and app."""


def voice_leading_label(s) -> str:
    if s.strategy in ("common_tone", "pivot_chord", "modal_interchange"):
        return "High"
    if s.strategy == "chromatic_mediant":
        return "Medium"
    return "Low"


def density_label(s) -> str:
    if s.emotional_tag in ("dramatic lift", "colour shift"):
        return "Lift"
    if s.emotional_tag in ("direct resolution", "smooth transition"):
        return "Build"
    if s.emotional_tag == "subtle drift":
        return "Thin"
    if s.strategy in ("chromatic_mediant", "dominant_injection") and s.cadence_type == "None":
        return "Fracture"
    return "Build"


def strategy_explanation(s, style: str, mighty_engine: str) -> str:
    """Generate explanation text for a suggestion."""
    lines = []
    lines.append(f"**Why it works:** {s.pivot_explanation}")
    lines.append(f"**Effect:** {s.emotional_tag}")
    lines.append(f"**Cadence:** {s.cadence_type}")
    if style != "default":
        lines.append(f"**Style bias:** {style} favours this type of modulation")
    if mighty_engine != "default":
        lines.append(f"**Mighty engine:** {mighty_engine} modifier applied")
    lines.append(f"**Chord path:** {', '.join(s.chord_path)}")
    return "\n\n".join(lines)
