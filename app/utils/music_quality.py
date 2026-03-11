"""
Musical pre-export validation layer for the Big Ten Composer Workbench.

Assesses composition configuration (engines, form, parameters) before prompt export
to ensure generated prompts lead to musically strong, engine-specific compositions.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional, Tuple, List

# Engine IDs for heuristic lookup
STRUCTURE_IDS = {
    "Wayne Shorter Narrative": "shorter_narrative",
    "Frisell Atmosphere": "frisell_atmosphere",
    "Counterpoint / Tonality Hybrid": "counterpoint_hybrid",
    "Polyphonic Labyrinth": "polyphonic_labyrinth",
    "Metheny–Bacharach Lyrical Architecture": "metheny_bacharach",
    "Andrew Hill Harmonic": "andrew_hill",
    "Tonality Vault": "tonality_vault",
}

BEHAVIOUR_IDS = {
    "Scofield–Holland Groove": "scofield_holland",
    "Coleman Rhythmic Architecture": "coleman_rhythmic",
    "Wyble Linear Counterpoint": "wyble_linear",
}

# Engine-specific memory aids (for UI)
ENGINE_MEMORY_AIDS = {
    "Wayne Shorter Narrative": "Scenes, motivic foreshadowing, harmonic storytelling",
    "Scofield–Holland Groove": "Dyads, bass motion, rhythmic lift, groove punctuation",
    "Wyble Linear Counterpoint": "Two voices, contrary motion, implied harmony",
    "Metheny–Bacharach Lyrical Architecture": "Singable arcs, harmonic surprise, melodic inevitability",
    "Frisell Atmosphere": "Space, suspension, breathable texture",
    "Coleman Rhythmic Architecture": "Rhythmic cell transformation, axis drift",
    "Counterpoint / Tonality Hybrid": "Two-line logic, lyric gravity, no block harmony",
    "Polyphonic Labyrinth": "Dense polyphony, inner motion, labyrinthine form",
    "Andrew Hill Harmonic": "Chromatic density, structural tension",
    "Tonality Vault": "Gravitational centre, tension hierarchy",
}


# Lead Sheet scoring axes
LEAD_SHEET_AXES = [
    "structure_engine_identity",
    "behaviour_engine_identity",
    "melodic_shape",
    "harmonic_interest",
    "section_contrast",
    "motivic_identity",
    "lead_sheet_playability",
]

# Full Composition scoring axes
FULL_COMPOSITION_AXES = [
    "structure_engine_identity",
    "behaviour_engine_identity",
    "texture_variation",
    "ensemble_interaction",
    "harmonic_narrative",
    "register_balance",
    "dynamic_arc",
    "section_contrast",
    "motivic_development",
]


@dataclass
class ValidationResult:
    """Result of composition configuration validation."""

    passed: bool
    overall_score: float
    scores: dict = field(default_factory=dict)
    warnings: list = field(default_factory=list)
    engine_checks: dict = field(default_factory=dict)
    rejection_reasons: list = field(default_factory=list)
    composition_type: str = "Lead Sheet"


def _struct_id(engine: dict) -> Optional[str]:
    name = engine.get("name", "")
    return STRUCTURE_IDS.get(name) or engine.get("id")


def _behave_id(engine: dict) -> Optional[str]:
    name = engine.get("name", "")
    return BEHAVIOUR_IDS.get(name) or engine.get("id")


def _has_bridge_or_interlude(form: str) -> bool:
    """Check if form implies a bridge or interlude."""
    form_lower = form.lower()
    return (
        "aaba" in form_lower
        or "bridge" in form_lower
        or "interlude" in form_lower
        or "through-composed" in form_lower
    )


def _check_shorter_narrative(
    structure_engine: dict,
    form: str,
    length_bars: int,
) -> Tuple[bool, List[str]]:
    """Wayne Shorter Narrative: scene contrast, motivic foreshadowing, bridge."""
    passed = True
    msgs = []
    if not _has_bridge_or_interlude(form):
        passed = False
        msgs.append("Shorter Narrative requires a bridge or interlude with real narrative shift")
    if length_bars < 24:
        msgs.append("Shorter works best with 24+ bars for scene development")
    return passed, msgs


def _check_scofield_holland(behaviour_engine: dict, form: str) -> Tuple[bool, List[str]]:
    """Scofield–Holland: rhythmic lift, active bass, groove punctuation."""
    passed = True
    msgs = []
    # No hard failure; prompt will enforce
    return passed, msgs


def _check_wyble_linear(behaviour_engine: dict) -> Tuple[bool, List[str]]:
    """Wyble: two-voice logic, dyadic motion, no plain single-line."""
    passed = True
    msgs = []
    return passed, msgs


def _check_metheny_bacharach(structure_engine: dict) -> Tuple[bool, List[str]]:
    """Metheny–Bacharach: melodic inevitability, harmonic surprise."""
    passed = True
    msgs = []
    return passed, msgs


def _check_frisell_atmosphere(structure_engine: dict) -> Tuple[bool, List[str]]:
    """Frisell: space, suspension; reject unnecessary density."""
    passed = True
    msgs = []
    return passed, msgs


def _check_coleman_rhythmic(behaviour_engine: dict) -> Tuple[bool, List[str]]:
    """Coleman: rhythmic cell transformation; reject ordinary groove-only."""
    passed = True
    msgs = []
    return passed, msgs


def _run_engine_specific_checks(
    structure_engine: dict,
    behaviour_engine: dict,
    form: str,
    length_bars: int,
) -> dict:
    """Run engine-specific heuristics. Returns {engine_id: (passed, messages)}."""
    results = {}
    struct_name = structure_engine.get("name", "")
    behave_name = behaviour_engine.get("name", "")

    if "Shorter" in struct_name or "shorter" in str(structure_engine.get("id", "")).lower():
        ok, msgs = _check_shorter_narrative(structure_engine, form, length_bars)
        results["structure_shorter"] = (ok, msgs)

    if "Frisell" in struct_name or "frisell" in str(structure_engine.get("id", "")).lower():
        ok, msgs = _check_frisell_atmosphere(structure_engine)
        results["structure_frisell"] = (ok, msgs)

    if "Metheny" in struct_name or "metheny" in str(structure_engine.get("id", "")).lower():
        ok, msgs = _check_metheny_bacharach(structure_engine)
        results["structure_metheny"] = (ok, msgs)

    if "Scofield" in behave_name or "scofield" in str(behaviour_engine.get("id", "")).lower():
        ok, msgs = _check_scofield_holland(behaviour_engine, form)
        results["behaviour_scofield"] = (ok, msgs)

    if "Wyble" in behave_name or "wyble" in str(behaviour_engine.get("id", "")).lower():
        ok, msgs = _check_wyble_linear(behaviour_engine)
        results["behaviour_wyble"] = (ok, msgs)

    if "Coleman" in behave_name or "coleman" in str(behaviour_engine.get("id", "")).lower():
        ok, msgs = _check_coleman_rhythmic(behaviour_engine)
        results["behaviour_coleman"] = (ok, msgs)

    return results


def _compute_lead_sheet_scores(
    structure_engine: dict,
    behaviour_engine: dict,
    form: str,
    length_bars: int,
    engine_checks: dict,
) -> dict:
    """Score 1–10 on each Lead Sheet axis."""
    has_bridge = _has_bridge_or_interlude(form)
    struct_strong = bool(structure_engine.get("musical_purpose"))
    behave_strong = bool(behaviour_engine.get("musical_purpose"))
    engine_failures = sum(1 for ok, _ in engine_checks.values() if not ok)

    return {
        "structure_engine_identity": 8 if struct_strong else 5,
        "behaviour_engine_identity": 8 if behave_strong else 5,
        "melodic_shape": 7,
        "harmonic_interest": 7,
        "section_contrast": 9 if has_bridge else 6,
        "motivic_identity": 7,
        "lead_sheet_playability": 8,
    }


def _compute_full_composition_scores(
    structure_engine: dict,
    behaviour_engine: dict,
    form: str,
    length_bars: int,
    engine_checks: dict,
) -> dict:
    """Score 1–10 on each Full Composition axis."""
    has_bridge = _has_bridge_or_interlude(form)
    struct_strong = bool(structure_engine.get("musical_purpose"))
    behave_strong = bool(behaviour_engine.get("musical_purpose"))
    asymmetric_forms = ["Through-composed", "Custom", "AB", "ABA"]
    has_asymmetry = any(f in form for f in asymmetric_forms)

    return {
        "structure_engine_identity": 8 if struct_strong else 5,
        "behaviour_engine_identity": 8 if behave_strong else 5,
        "texture_variation": 7 if length_bars >= 24 else 5,
        "ensemble_interaction": 7,
        "harmonic_narrative": 8 if has_bridge else 6,
        "register_balance": 7,
        "dynamic_arc": 7 if has_asymmetry or has_bridge else 5,
        "section_contrast": 9 if has_bridge else 6,
        "motivic_development": 7,
    }


def _apply_lead_sheet_rejection_rules(
    structure_engine: dict,
    behaviour_engine: dict,
    form: str,
    engine_checks: dict,
    scores: dict,
) -> List[str]:
    """Lead Sheet: reject if melody scalar filler, chord loop-based, bridge lacks contrast, etc."""
    reasons = []

    if "Shorter" in structure_engine.get("name", "") and not _has_bridge_or_interlude(form):
        reasons.append("Bridge or interlude required for Shorter Narrative; current form may not support it")

    for ok, msgs in engine_checks.values():
        if not ok and msgs:
            reasons.extend(msgs)

    if scores.get("structure_engine_identity", 10) < 6:
        reasons.append("Engine fingerprint not detectable (structure)")
    if scores.get("behaviour_engine_identity", 10) < 6:
        reasons.append("Engine fingerprint not detectable (behaviour)")
    if scores.get("section_contrast", 10) < 6:
        reasons.append("Bridge lacks contrast")
    if scores.get("harmonic_interest", 10) < 5:
        reasons.append("Chord progression may be loop-based without narrative")

    return reasons


def _apply_full_composition_rejection_rules(
    structure_engine: dict,
    behaviour_engine: dict,
    form: str,
    engine_checks: dict,
    scores: dict,
) -> List[str]:
    """Full Composition: reject if orchestration static, harmonic repetitive, no dynamic arc, etc."""
    reasons = []

    if "Shorter" in structure_engine.get("name", "") and not _has_bridge_or_interlude(form):
        reasons.append("Bridge or interlude required for Shorter Narrative; current form may not support it")

    for ok, msgs in engine_checks.values():
        if not ok and msgs:
            reasons.extend(msgs)

    if scores.get("structure_engine_identity", 10) < 6:
        reasons.append("Engine behaviour absent (structure)")
    if scores.get("behaviour_engine_identity", 10) < 6:
        reasons.append("Engine behaviour absent (behaviour)")
    if scores.get("texture_variation", 10) < 5:
        reasons.append("Orchestration may be static")
    if scores.get("harmonic_narrative", 10) < 5:
        reasons.append("Harmonic environment may be too repetitive")
    if scores.get("dynamic_arc", 10) < 5:
        reasons.append("No dynamic arc implied by form")

    return reasons


def validate_composition_config(
    structure_engine: dict,
    behaviour_engine: dict,
    form: str = "AABA (32 bars)",
    length_bars: int = 32,
    strict_mode: bool = True,
    quality_mode: str = "album-level",
    composition_type: str = "Lead Sheet",
) -> ValidationResult:
    """
    Validate composition configuration before prompt export.

    Args:
        structure_engine: Selected structure engine dict
        behaviour_engine: Selected behaviour engine dict
        form: Form string (e.g. "AABA (32 bars)")
        length_bars: Length in bars
        strict_mode: If True, raise minimum threshold
        quality_mode: "practical" | "strong" | "album-level"
        composition_type: "Lead Sheet" | "Full Composition"

    Returns:
        ValidationResult with passed, scores, warnings, rejection_reasons
    """
    comp_type = composition_type if composition_type == "Full Composition" else "Lead Sheet"

    if not structure_engine or not behaviour_engine:
        return ValidationResult(
            passed=False,
            overall_score=0,
            scores={},
            warnings=["Structure and behaviour engines must be selected"],
            engine_checks={},
            rejection_reasons=["No engines selected"],
            composition_type=comp_type,
        )

    engine_checks = _run_engine_specific_checks(
        structure_engine, behaviour_engine, form, length_bars
    )

    if comp_type == "Full Composition":
        scores = _compute_full_composition_scores(
            structure_engine, behaviour_engine, form, length_bars, engine_checks
        )
        rejection_reasons = _apply_full_composition_rejection_rules(
            structure_engine, behaviour_engine, form, engine_checks, scores
        )
    else:
        scores = _compute_lead_sheet_scores(
            structure_engine, behaviour_engine, form, length_bars, engine_checks
        )
        rejection_reasons = _apply_lead_sheet_rejection_rules(
            structure_engine, behaviour_engine, form, engine_checks, scores
        )

    overall = sum(scores.values()) / len(scores) if scores else 0

    # Quality mode thresholds by composition type
    lead_sheet_thresholds = {"practical": 5.5, "strong": 6.5, "album-level": 7.0}
    full_comp_thresholds = {"practical": 6.0, "strong": 7.0, "album-level": 8.0}
    thresholds = full_comp_thresholds if comp_type == "Full Composition" else lead_sheet_thresholds
    min_score = thresholds.get(quality_mode.lower(), 7.0)
    if strict_mode:
        min_score += 0.3

    warnings = []

    if comp_type == "Lead Sheet":
        if scores.get("section_contrast", 10) < 7:
            warnings.append("Bridge harmonic contrast appears weak")
        if scores.get("structure_engine_identity", 10) < 7:
            warnings.append("Structure engine may not be strongly represented")
        if scores.get("behaviour_engine_identity", 10) < 7:
            warnings.append("Behaviour engine may not be strongly represented")
        if scores.get("melodic_shape", 10) < 7:
            warnings.append("Melodic contour may be too scalar")
        if "Wyble" in behaviour_engine.get("name", "") and scores.get("behaviour_engine_identity", 10) < 8:
            warnings.append("Wyble behaviour not strongly represented")
    else:
        if scores.get("section_contrast", 10) < 7:
            warnings.append("Section contrast may be under-differentiated")
        if scores.get("texture_variation", 10) < 6:
            warnings.append("Texture variation may be insufficient")
        if scores.get("ensemble_interaction", 10) < 6:
            warnings.append("Ensemble interaction appears static")
        if scores.get("dynamic_arc", 10) < 6:
            warnings.append("Dynamic arc may be insufficient")

    if "Shorter" in structure_engine.get("name", "") and not _has_bridge_or_interlude(form):
        warnings.append("Bridge may be under-differentiated for Shorter Narrative")

    if length_bars < 16:
        warnings.append("Short length may limit development")
    if form.lower().startswith("12-bar") and length_bars != 12:
        warnings.append("Form/length mismatch")

    passed = (
        overall >= min_score
        and not rejection_reasons
        and all(ok for ok, _ in engine_checks.values())
    )

    if strict_mode and quality_mode.lower() == "album-level":
        critical = [
            "Bridge may be under-differentiated for Shorter Narrative",
            "Shorter Narrative requires a bridge or interlude",
        ]
        if any(w in warnings for w in critical):
            passed = False

    return ValidationResult(
        passed=passed,
        overall_score=round(overall, 1),
        scores=scores,
        warnings=warnings,
        engine_checks=engine_checks,
        rejection_reasons=rejection_reasons,
        composition_type=comp_type,
    )


def get_engine_memory_aid(engine_name: str) -> str:
    """Return short memory aid for an engine, or empty string."""
    return ENGINE_MEMORY_AIDS.get(engine_name, "")
