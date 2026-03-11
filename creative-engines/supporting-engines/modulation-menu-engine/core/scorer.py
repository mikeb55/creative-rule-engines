"""Score and rank modulation suggestions."""

from .strategies import ModulationSuggestion


def _voice_leading_score(s: ModulationSuggestion) -> float:
    """Voice-leading simplicity: pivot and common-tone favour smooth."""
    if s.strategy in ("common_tone", "pivot_chord", "modal_interchange"):
        return 0.9
    if s.strategy == "chromatic_mediant":
        return 0.6
    return 0.5  # dominant_injection


def _harmonic_distance_score(s: ModulationSuggestion) -> float:
    """Harmonic distance: closer = higher for smooth, farther for dramatic."""
    if s.strategy in ("chromatic_mediant", "dominant_injection"):
        return 0.7
    return 0.8


def _cadence_strength_score(s: ModulationSuggestion) -> float:
    """Cadence strength contribution."""
    if s.cadence_type == "Strong":
        return 0.9
    if s.cadence_type == "Weak":
        return 0.6
    return 0.3


def _style_alignment_score(s: ModulationSuggestion, weights: dict) -> float:
    """Apply style weights to strategy."""
    strategy_key = f"strategy_{s.strategy}"
    return weights.get(strategy_key, 1.0)


def _mighty_modifier(s: ModulationSuggestion, engine: str) -> float:
    """Mighty Ten engine modifier. See creative-engines/docs/The_Mighty_Ten_Engines_User_Guide.md
    """
    if engine == "default":
        return 1.0
    # Scofield–Holland: groove, bass movement → reward dominant, pivot
    if engine == "scofield_holland":
        if s.strategy in ("dominant_injection", "pivot_chord"):
            return 1.2
        return 1.0
    # Shorter Narrative: motivic, sectional → reward pivot, common-tone
    if engine == "shorter_narrative":
        if s.strategy in ("pivot_chord", "common_tone"):
            return 1.2
        return 1.0
    # Frisell Atmosphere: space, restraint → reward common-tone, chromatic mediant; penalise strong cadence
    if engine == "frisell_atmosphere":
        if s.strategy in ("common_tone", "chromatic_mediant"):
            return 1.2
        if s.cadence_type == "Strong":
            return 0.8
        return 1.0
    # Wheeler Lyric: melody, warmth, harmonic surprise → reward chromatic mediant, common-tone
    if engine == "wheeler_lyric":
        if s.strategy in ("chromatic_mediant", "common_tone"):
            return 1.2
        return 1.0
    # Stravinsky Pulse: pulse, irregularity → reward chromatic mediant, dominant
    if engine == "stravinsky_pulse":
        if s.strategy in ("chromatic_mediant", "dominant_injection"):
            return 1.15
        return 1.0
    # Zappa Disruption: disruption, controlled chaos → reward abrupt contrast
    if engine == "zappa_disruption":
        if s.strategy in ("chromatic_mediant", "dominant_injection"):
            return 1.2
        if s.strategy == "common_tone":
            return 0.9
        return 1.0
    # Slonimsky Harmonic: interval cycles → reward chromatic mediant, modal interchange
    if engine == "slonimsky_harmonic":
        if s.strategy in ("chromatic_mediant", "modal_interchange"):
            return 1.2
        return 1.0
    # Bartók Night: polymodal, dark → reward modal interchange, chromatic mediant
    if engine == "bartok_night":
        if s.strategy in ("modal_interchange", "chromatic_mediant"):
            return 1.2
        return 1.0
    # Counterpoint Hybrid: two-line logic → reward pivot, common-tone
    if engine == "counterpoint_hybrid":
        if s.strategy in ("pivot_chord", "common_tone"):
            return 1.2
        return 1.0
    # Polyphonic Labyrinth: dense polyphony → reward modal interchange, pivot
    if engine == "polyphonic_labyrinth":
        if s.strategy in ("modal_interchange", "pivot_chord"):
            return 1.15
        return 1.0
    # Legacy aliases (metheny, coleman, schneider)
    if engine == "metheny":
        if s.strategy in ("chromatic_mediant", "common_tone"):
            return 1.2
        return 1.0
    if engine == "coleman":
        if s.strategy in ("common_tone", "chromatic_mediant"):
            return 1.15
        if s.cadence_type == "Strong":
            return 0.8
        return 1.0
    if engine == "schneider":
        if s.strategy in ("chromatic_mediant", "modal_interchange", "common_tone"):
            return 1.15
        return 1.0
    return 1.0


def score_and_rank(
    suggestions: list[ModulationSuggestion],
    weights: dict,
    mighty_engine: str = "default",
    max_results: int = 5,
) -> list[ModulationSuggestion]:
    """Score and return top N suggestions."""
    scored = []
    for s in suggestions:
        vl = _voice_leading_score(s) * weights.get("voice_leading", 1.0)
        hd = _harmonic_distance_score(s) * weights.get("harmonic_distance", 1.0)
        cs = _cadence_strength_score(s) * weights.get("cadence_strength", 1.0)
        sa = _style_alignment_score(s, weights)
        mighty = _mighty_modifier(s, mighty_engine)
        total = (vl + hd + cs) * sa * mighty
        scored.append((total, s))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [s for _, s in scored[:max_results]]
