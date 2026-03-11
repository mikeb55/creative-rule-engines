"""Pop colour: reward chromatic mediant, emotional lift; penalise complex pivot chains."""

WEIGHTS = {
    "voice_leading": 1.1,
    "harmonic_distance": 1.0,
    "cadence_strength": 0.9,
    "strategy_pivot_chord": 0.7,
    "strategy_common_tone": 1.0,
    "strategy_chromatic_mediant": 1.4,
    "strategy_dominant_injection": 0.8,
    "strategy_modal_interchange": 1.1,
}
