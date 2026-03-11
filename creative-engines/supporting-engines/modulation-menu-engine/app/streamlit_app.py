"""Modulation Menu Engine — Streamlit web app."""

import sys
import os

# Ensure engine root and app dir are on path
_app_dir = os.path.dirname(os.path.abspath(__file__))
_engine_root = os.path.dirname(_app_dir)
for p in (_engine_root, _app_dir):
    if p not in sys.path:
        sys.path.insert(0, p)

import streamlit as st
from core.parser import parse_progression
from core.strategies import generate_suggestions
from core.scorer import score_and_rank
from core.display import voice_leading_label, density_label, strategy_explanation
from styles import get_weights, STYLE_OPTIONS, MIGHTY_ENGINES

MIGHTY_ENGINE_LABELS = {
    "default": "Default (no modifier)",
    "scofield_holland": "Scofield–Holland Groove",
    "shorter_narrative": "Wayne Shorter Narrative",
    "frisell_atmosphere": "Frisell Atmosphere",
    "wheeler_lyric": "Wheeler Lyric",
    "stravinsky_pulse": "Stravinsky Pulse",
    "zappa_disruption": "Zappa Disruption",
    "slonimsky_harmonic": "Slonimsky Harmonic",
    "bartok_night": "Bartók Night",
    "counterpoint_hybrid": "Counterpoint Hybrid",
    "polyphonic_labyrinth": "Polyphonic Labyrinth",
}
from app.utils.export import export_results, format_as_text, format_as_markdown

st.set_page_config(page_title="Modulation Menu Engine", layout="wide")
st.title("Modulation Menu Engine")

# Presets
PRESETS = [
    ("C,G,Am,F", "Basic pop"),
    ("Dm,G7,Cmaj7,A7", "Jazz ii-V"),
    ("Em,C,G,D", "Folk cycle"),
    ("Fmaj7,Abmaj7,Bbm7,Eb7", "Colour progression"),
    ("Dm9,F/G,Cmaj9", "Modern jazz"),
]


def normalize_progression(text: str) -> str:
    """Normalize multiline or comma-separated input."""
    if not text or not text.strip():
        return ""
    # Replace newlines with commas, collapse spaces
    parts = [p.strip() for p in text.replace("\n", ",").split(",") if p.strip()]
    return ",".join(parts)


def validate_progression(prog: str):
    """Validate progression. Returns (ok, error_message)."""
    if not prog or not prog.strip():
        return False, "Enter a chord progression."
    normalized = normalize_progression(prog)
    chords = parse_progression(normalized)
    if len(chords) < 2:
        return False, "Need at least 2 chords. Use comma-separated format, e.g. C,G,Am,F"
    return True, ""


# Sidebar
if "prog_input" not in st.session_state:
    st.session_state["prog_input"] = "C,G,Am,F"

with st.sidebar:
    st.header("Input")
    preset_choice = st.selectbox(
        "Quick presets",
        ["(custom)"] + [f"{label}: {prog}" for prog, label in PRESETS],
        index=0,
    )
    if preset_choice != "(custom)":
        for prog, label in PRESETS:
            if f"{label}: {prog}" == preset_choice:
                st.session_state["prog_input"] = prog
                break
    prog_input = st.text_area(
        "Chord progression",
        value=st.session_state["prog_input"],
        height=80,
        key="prog_area",
        help="Comma-separated chords, e.g. C,G,Am,F or Dm9,G13,Cmaj7",
    )
    st.session_state["prog_input"] = prog_input

    style = st.selectbox("Style", STYLE_OPTIONS, index=0)
    mighty_engine = st.selectbox(
        "Mighty engine",
        MIGHTY_ENGINES,
        index=0,
        format_func=lambda x: MIGHTY_ENGINE_LABELS.get(x, x),
    )
    max_results = st.slider("Max suggestions", 3, 10, 5)
    run_clicked = st.button("Run", type="primary")

# Main area
tab1, tab2, tab3, tab4 = st.tabs(["Results", "Explanations", "Examples", "How To Use"])

with tab4:
    st.subheader("How to use this")
    st.markdown("""
- **Progression format:** Comma-separated chords. Examples: `C,G,Am,F` or `Dm9,G13,Cmaj7`
- **Styles:** Each style weights modulation strategies differently (e.g. ecm_axis favours common-tone, jazz_rock favours dominant injection)
- **Mighty engine:** Extra weighting layer from The Mighty Ten (metheny, coleman, zappa, schneider)
- **Ranked results:** Higher-ranked suggestions fit the chosen style and engine better
- **Export:** Save results as markdown or plain text to the `app/exports/` folder
""")

with tab3:
    st.subheader("Example progressions")
    for preset_prog, preset_label in PRESETS:
        st.code(preset_prog, language=None)
        st.caption(preset_label)

# Run engine
ranked = []
prog_final = ""
if run_clicked:
    prog_final = normalize_progression(prog_input)
    ok, err = validate_progression(prog_final)
    if not ok:
        st.error(err)
        st.info("Expected format: comma-separated chords, e.g. C,G,Am,F")
    else:
        weights = get_weights(style)
        suggestions = generate_suggestions(prog_final)
        ranked = score_and_rank(
            suggestions,
            weights,
            mighty_engine=mighty_engine,
            max_results=max_results,
        )
        st.session_state["last_results"] = ranked
        st.session_state["last_style"] = style
        st.session_state["last_mighty"] = mighty_engine
        st.session_state["last_prog"] = prog_final

# Use cached results if we have them and didn't just run
if "last_results" in st.session_state and not ranked:
    ranked = st.session_state.get("last_results", [])
    style = st.session_state.get("last_style", style)
    mighty_engine = st.session_state.get("last_mighty", mighty_engine)
    prog_final = st.session_state.get("last_prog", prog_final)
elif ranked:
    prog_final = st.session_state.get("last_prog", prog_final)

with tab1:
    if prog_final:
        st.subheader("Settings")
        st.caption(f"Progression: `{prog_final}` | Style: {style} | Mighty engine: {mighty_engine}")

    if ranked:
        # Table data
        table_data = []
        for i, s in enumerate(ranked, 1):
            vl = voice_leading_label(s)
            density = density_label(s)
            table_data.append({
                "Rank": i,
                "To": s.to_region,
                "Strategy": s.strategy,
                "Pivot": s.pivot_explanation[:40] + "..." if len(s.pivot_explanation) > 40 else s.pivot_explanation,
                "Density": density,
                "Effect": s.emotional_tag,
            })
        st.dataframe(table_data, use_container_width=True, hide_index=True)

        # Selected result explanation
        selected_idx = st.selectbox(
            "View details for",
            range(len(ranked)),
            format_func=lambda i: f"#{i+1} {ranked[i].strategy} → {ranked[i].to_region}",
        )
        if selected_idx is not None:
            s = ranked[selected_idx]
            st.markdown(strategy_explanation(s, style, mighty_engine))

        # Export
        st.subheader("Export")
        col1, col2, col3 = st.columns(3)
        with col1:
            if st.button("Export as Markdown"):
                path = export_results(ranked, style, mighty_engine, prog_final, "md")
                st.success(f"Saved: {path}")
        with col2:
            if st.button("Export as TXT"):
                path = export_results(ranked, style, mighty_engine, prog_final, "txt")
                st.success(f"Saved: {path}")
        with col3:
            copy_text = format_as_text(ranked, style, mighty_engine, prog_final)
            st.download_button("Download TXT", copy_text, file_name="modmenu_results.txt", mime="text/plain")

        st.subheader("Copyable summary")
        st.code(format_as_text(ranked, style, mighty_engine, prog_final), language=None)
    else:
        st.info("Enter a progression and click Run to see results.")

with tab2:
    if ranked:
        for i, s in enumerate(ranked, 1):
            with st.expander(f"#{i} {s.strategy} → {s.to_region}"):
                st.markdown(strategy_explanation(s, style, mighty_engine))
    else:
        st.info("Run the engine first to see explanations.")
