"""Modulation-menu-engine integration. Fails gracefully if engine unavailable."""

import sys
import os

_MOD_ENGINE_AVAILABLE = None
_MOD_RESULT = None


def _ensure_mod_engine_path():
    """Add modulation-menu-engine to path."""
    app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    repo_root = os.path.dirname(app_dir)
    mod_engine = os.path.join(repo_root, "creative-engines", "supporting-engines", "modulation-menu-engine")
    if mod_engine not in sys.path:
        sys.path.insert(0, mod_engine)


def is_modulation_engine_available():
    """Check if modulation-menu-engine can be imported."""
    global _MOD_ENGINE_AVAILABLE
    if _MOD_ENGINE_AVAILABLE is not None:
        return _MOD_ENGINE_AVAILABLE
    try:
        _ensure_mod_engine_path()
        from core.parser import parse_progression  # noqa: F401
        from core.strategies import generate_suggestions  # noqa: F401
        from core.scorer import score_and_rank  # noqa: F401
        from styles import get_weights, STYLE_OPTIONS, MIGHTY_ENGINES  # noqa: F401
        _MOD_ENGINE_AVAILABLE = True
    except Exception:
        _MOD_ENGINE_AVAILABLE = False
    return _MOD_ENGINE_AVAILABLE


def run_modulation(prog: str, style: str = "default", mighty_engine: str = "default", max_results: int = 5):
    """Run modulation engine. Returns (success, result_or_error_message)."""
    global _MOD_RESULT
    if not is_modulation_engine_available():
        return False, "modulation-menu-engine not found. Install it: pip install -e creative-engines/supporting-engines/modulation-menu-engine"
    try:
        from core.parser import parse_progression
        from core.strategies import generate_suggestions
        from core.scorer import score_and_rank
        from styles import get_weights

        prog_clean = ",".join(p.strip() for p in prog.replace("\n", ",").split(",") if p.strip())
        chords = parse_progression(prog_clean)
        if len(chords) < 2:
            return False, "Need at least 2 chords. Use comma-separated format."
        weights = get_weights(style)
        suggestions = generate_suggestions(prog_clean)
        ranked = score_and_rank(suggestions, weights, mighty_engine=mighty_engine, max_results=max_results)
        _MOD_RESULT = {"ranked": ranked, "prog": prog_clean, "style": style, "mighty_engine": mighty_engine}
        return True, _MOD_RESULT
    except Exception as e:
        return False, str(e)


def get_modulation_options():
    """Get style and mighty engine options if available."""
    if not is_modulation_engine_available():
        return [], []
    try:
        from styles import STYLE_OPTIONS, MIGHTY_ENGINES
        return STYLE_OPTIONS, MIGHTY_ENGINES
    except Exception:
        return [], []
