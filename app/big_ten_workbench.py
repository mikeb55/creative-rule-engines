"""Big Ten Composer Workbench — composition cockpit for the full engine system."""

import json
import os
from datetime import datetime

import streamlit as st

from utils.modulation import (
    is_modulation_engine_available,
    run_modulation,
    get_modulation_options,
)
from utils.prompt_gen import (
    slugify,
    generate_composition_prompt,
    format_modulation_summary,
)
from utils.music_quality import (
    validate_composition_config,
    get_engine_memory_aid,
)

# Load engine registries
_APP_DIR = os.path.dirname(os.path.abspath(__file__))
_REGISTRY_DIR = os.path.join(_APP_DIR, "engine_registry")
_EXPORTS_DIR = os.path.join(_APP_DIR, "exports")
os.makedirs(_EXPORTS_DIR, exist_ok=True)


def _load_json(name: str) -> list:
    path = os.path.join(_REGISTRY_DIR, f"{name}.json")
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def _structure_engines():
    core = _load_json("core_engines")
    return [e for e in core if e.get("category") == "structure"]


def _behaviour_engines():
    core = _load_json("core_engines")
    return [e for e in core if e.get("category") == "behaviour"]


def _all_core_engines():
    core = _load_json("core_engines")
    struct = [e for e in core if e.get("category") == "structure"]
    behave = [e for e in core if e.get("category") == "behaviour"]
    return struct, behave


st.set_page_config(page_title="Big Ten Composer Workbench", layout="wide")
st.title("Big Ten Composer Workbench")

struct_engines, behave_engines = _all_core_engines()
modifier_engines = _load_json("modifier_engines")
supporting_engines = _load_json("supporting_engines")

# Sidebar
with st.sidebar:
    st.header("Piece Setup")
    title = st.text_input("Piece title", value="Untitled")
    slug = st.text_input("Piece slug", value=slugify(title) if title else "untitled")
    instrumentation = st.text_input("Instrumentation", value="Guitar trio")
    gce_target = st.number_input("Target GCE", min_value=7.0, max_value=10.0, value=9.0, step=0.5)

    st.header("Composition Parameters")
    length_bars = st.number_input("Length (bars)", min_value=8, max_value=128, value=32, step=4)
    tempo = st.text_input("Tempo", value="120 bpm", help="e.g. 120 bpm, medium swing, ballad")
    key_sig = st.selectbox(
        "Key",
        ["C major", "G major", "D major", "A major", "E major", "B major", "F major", "Bb major", "Eb major", "Ab major",
         "A minor", "E minor", "B minor", "F# minor", "D minor", "G minor", "C minor", "F minor"],
        index=0,
    )
    time_sig = st.selectbox("Time signature", ["4/4", "3/4", "6/8", "5/4", "7/8"], index=0)
    form = st.selectbox(
        "Form",
        ["AABA (32 bars)", "AB", "ABA", "Through-composed", "12-bar blues", "Custom (specify in notes)"],
        index=0,
    )

    st.header("Quality Settings")
    composition_type = st.selectbox(
        "Composition Type",
        ["Lead Sheet", "Full Composition"],
        index=0,
        help="Lead Sheet: melody + chords, player-focused. Full Composition: orchestration, ensemble, texture.",
    )
    strict_mode = st.checkbox(
        "Strict musical filtering",
        value=True,
        help="Raise minimum composition threshold; enforce anti-generic constraints, section contrast, motivic recall, audible engine identity.",
    )
    quality_mode = st.selectbox(
        "Quality mode",
        ["Practical", "Strong", "Album-level"],
        index=2,
        help="Practical: good for sketching. Strong: musically convincing. Album-level: GCE ≥ 9, reject weak ideas aggressively.",
    )

    st.header("Engines")
    struct_options = {e["name"]: e for e in struct_engines}
    struct_choice = st.selectbox(
        "Structure Engine",
        list(struct_options.keys()),
        index=0 if struct_options else 0,
    )
    structure_engine = struct_options.get(struct_choice, {})

    behave_options = {e["name"]: e for e in behave_engines}
    behave_choice = st.selectbox(
        "Behaviour Engine",
        list(behave_options.keys()),
        index=0 if behave_options else 0,
    )
    behaviour_engine = behave_options.get(behave_choice, {})

    modifier_names = [m["name"] for m in modifier_engines]
    selected_modifiers = st.multiselect("Modifier Engines (optional)", modifier_names)
    selected_modifier_objs = [m for m in modifier_engines if m["name"] in selected_modifiers]

    supporting_names = [s["name"] for s in supporting_engines]
    selected_supporting = st.multiselect("Supporting Engines", supporting_names)
    selected_supporting_objs = [s for s in supporting_engines if s["name"] in selected_supporting]

    use_modulation = st.checkbox("Use modulation-menu-engine now", value=False)
    include_wyble = st.checkbox("Include Wyble study follow-up", value=False)

    mod_run = False
    if use_modulation:
        st.subheader("Modulation")
        style_options, mighty_options = get_modulation_options()
        if style_options and mighty_options:
            mod_prog = st.text_input("Chord progression", value="C,G,Am,F", key="mod_prog")
            mod_style = st.selectbox("Style", style_options, key="mod_style")
            mod_mighty = st.selectbox("Mighty engine", mighty_options, key="mod_mighty")
            mod_run = st.button("Run modulation", key="mod_run")
        else:
            st.warning("modulation-menu-engine not available. Install: pip install -e creative-engines/supporting-engines/modulation-menu-engine")

    st.header("Generate")
    gen_clicked = st.button("Generate Composition Prompt", type="primary")

# Main area
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "Engine Setup",
    "Modulation",
    "Generated Prompt",
    "Notes / Exports",
    "How It Works",
])

# Modulation
modulation_result = None
if use_modulation and is_modulation_engine_available() and mod_run:
    try:
        ok, res = run_modulation(mod_prog, mod_style, mod_mighty)
        if ok:
            st.session_state["modulation_result"] = res
        else:
            st.error(res)
    except NameError:
        pass
modulation_result = st.session_state.get("modulation_result")

with tab1:
    st.subheader("Structure Engine")
    if structure_engine:
        name = structure_engine.get("name", "—")
        st.markdown(f"**{name}**")
        aid = get_engine_memory_aid(name)
        if aid:
            st.info(f"*{aid}*")
        st.caption(structure_engine.get("musical_purpose", ""))
        st.markdown("**Best use:** " + ", ".join(structure_engine.get("best_use_cases", [])))

    st.subheader("Behaviour Engine")
    if behaviour_engine:
        name = behaviour_engine.get("name", "—")
        st.markdown(f"**{name}**")
        aid = get_engine_memory_aid(name)
        if aid:
            st.info(f"*{aid}*")
        st.caption(behaviour_engine.get("musical_purpose", ""))
        st.markdown("**Best use:** " + ", ".join(behaviour_engine.get("best_use_cases", [])))

    if selected_modifier_objs:
        st.subheader("Modifier Engines")
        for m in selected_modifier_objs:
            st.markdown(f"- **{m['name']}**: {m['short_description']}")
            st.caption(f"Allowed: {', '.join(m.get('allowed_locations', []))}")

with tab2:
    if use_modulation:
        if modulation_result:
            ranked = modulation_result["ranked"]
            st.subheader("Modulation Results")
            table_data = []
            for i, s in enumerate(ranked, 1):
                table_data.append({
                    "Rank": i,
                    "To": s.to_region,
                    "Strategy": s.strategy,
                    "Pivot": s.pivot_explanation[:50] + "..." if len(s.pivot_explanation) > 50 else s.pivot_explanation,
                    "Effect": s.emotional_tag,
                })
            st.dataframe(table_data, use_container_width=True, hide_index=True)
            selected_idx = st.selectbox(
                "View details",
                range(len(ranked)),
                format_func=lambda i: f"#{i+1} {ranked[i].strategy} → {ranked[i].to_region}",
            )
            if selected_idx is not None:
                s = ranked[selected_idx]
                st.markdown(f"**Pivot:** {s.pivot_explanation}")
                st.markdown(f"**Effect:** {s.emotional_tag}")
                st.markdown(f"**Chord path:** {', '.join(s.chord_path)}")
        else:
            st.info("Run modulation from the sidebar to see results.")
    else:
        st.info("Enable 'Use modulation-menu-engine now' in the sidebar to run modulation.")

with tab3:
    modulation_summary = ""
    if modulation_result:
        modulation_summary = format_modulation_summary(
            modulation_result["ranked"],
            modulation_result["style"],
            modulation_result["mighty_engine"],
            modulation_result["prog"],
        )

    validation = validate_composition_config(
        structure_engine=structure_engine,
        behaviour_engine=behaviour_engine,
        form=form,
        length_bars=length_bars,
        strict_mode=strict_mode,
        quality_mode=quality_mode,
        composition_type=composition_type,
    )

    prompt = generate_composition_prompt(
        title=title,
        slug=slug,
        instrumentation=instrumentation,
        structure_engine=structure_engine,
        behaviour_engine=behaviour_engine,
        modifier_engines=selected_modifier_objs,
        supporting_engines=selected_supporting_objs,
        gce_target=gce_target,
        modulation_summary=modulation_summary,
        include_wyble=include_wyble,
        length_bars=length_bars,
        tempo=tempo,
        key_sig=key_sig,
        time_sig=time_sig,
        form=form,
        strict_mode=strict_mode,
        quality_mode=quality_mode,
        composition_type=composition_type,
    )

    # Prompt Preview Warning Panel
    st.subheader("Pre-export Validation")
    st.caption(f"**Validation Profile:** {validation.composition_type}")
    if validation.passed and not validation.warnings:
        st.success(f"✓ Validation passed (score: {validation.overall_score}/10)")
    elif validation.warnings or validation.rejection_reasons:
        if validation.rejection_reasons:
            for r in validation.rejection_reasons:
                st.error(r)
        if validation.warnings:
            for w in validation.warnings:
                st.warning(w)
        if not validation.passed:
            st.error(
                "Validation did not pass. Consider adjusting engines, form, or quality settings before exporting."
            )
        st.caption(f"Overall score: {validation.overall_score}/10")

    if gen_clicked:
        if not validation.passed and strict_mode and quality_mode.lower() == "album-level":
            st.error(
                "Export blocked: validation failed. Adjust engines, form, or quality settings, "
                "or switch to Strong/Practical mode to export anyway."
            )
        else:
            st.session_state["generated_prompt"] = prompt
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            path_md = os.path.join(_EXPORTS_DIR, f"bigten_prompt_{ts}.md")
            path_txt = os.path.join(_EXPORTS_DIR, f"bigten_prompt_{ts}.txt")
            metadata = (
                f"Composition Type: {composition_type}\n"
                f"Quality Mode: {quality_mode}\n"
                f"Strict Mode: {'On' if strict_mode else 'Off'}\n\n"
            )
            full_prompt = metadata + "---\n\n" + prompt
            with open(path_md, "w", encoding="utf-8") as f:
                f.write(full_prompt)
            with open(path_txt, "w", encoding="utf-8") as f:
                f.write(full_prompt)
            st.success(f"Prompt saved to: {path_md}")

    st.subheader("Path output")
    musicxml_out = f"music/{slug}/musicxml/V1.0 - {title}.musicxml"
    notes_out = f"music/{slug}/notes/engine_notes.md"
    revision_out = f"music/{slug}/revisions/revision_log.md"
    st.code(
        f"MusicXML: {musicxml_out}\nNotes: {notes_out}\nRevision log: {revision_out}",
        language=None,
    )

    displayed = st.session_state.get("generated_prompt", prompt)
    st.subheader("Generated prompt (copy-paste ready)")
    st.text_area("Prompt", value=displayed, height=400, key="prompt_area")
    st.download_button("Download as .md", displayed, file_name="bigten_prompt.md", mime="text/markdown")
    st.download_button("Download as .txt", displayed, file_name="bigten_prompt.txt", mime="text/plain")

with tab4:
    st.subheader("Project Notes")
    notes_text = st.text_area(
        "Project notes",
        value=f"# {title}\n\nEngines: {structure_engine.get('name', '—')} + {behaviour_engine.get('name', '—')}\n\nModifiers: {', '.join(m['name'] for m in selected_modifier_objs) or 'None'}\n\nSupporting: {', '.join(s['name'] for s in selected_supporting_objs) or 'None'}\n\n",
        height=200,
    )
    if st.button("Save project notes"):
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        path = os.path.join(_EXPORTS_DIR, f"project_notes_{ts}.md")
        with open(path, "w", encoding="utf-8") as f:
            f.write(notes_text)
        st.success(f"Saved: {path}")

    st.subheader("Exports")
    st.caption(f"Exports saved to: {_EXPORTS_DIR}")

with tab5:
    st.markdown("""
## How It Works

**Structure Engine** — Controls harmonic gravity, form, narrative arc, sectional logic. Choose one per piece.

**Behaviour Engine** — Controls rhythmic motion, phrase density, ensemble interaction. Choose one per piece.

**Modifier Engines** — Optional. Apply only to intro, bridge, transition, coda, interlude, or solo sections. Modifiers must NOT generate the whole piece.

**Supporting Engines** — Assist composition or planning:
- **modulation-menu-engine** — Style-aware modulation suggestions. Keep and integrated as a supporting engine.
- **wyble-etude-engine** — Two-voice guitar studies from the piece
- **orchestration helpers** — Instrumentation guidance
- **voicing helpers** — Tonality Vault voicings

**Workflow:** Choose engines → Generate prompt → Copy to Cursor Chat → Compose.

## Master System Prompt

The global composition model is defined in `.cursor/rules/engine-composition.mdc`.
""")
