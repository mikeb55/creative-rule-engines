"""ECM axis style: reward common-tone, chromatic mediant; penalise strong dominant."""

WEIGHTS = {
    "voice_leading": 1.0,
    "harmonic_distance": 1.0,
    "cadence_strength": 0.6,
    "strategy_pivot_chord": 0.9,
    "strategy_common_tone": 1.3,
    "strategy_chromatic_mediant": 1.3,
    "strategy_dominant_injection": 0.5,
    "strategy_modal_interchange": 1.0,
}
