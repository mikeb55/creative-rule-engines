"""Composition prompt generation."""

from datetime import datetime


def slugify(title: str) -> str:
    """Create a URL-safe slug from title."""
    s = "".join(c if c.isalnum() or c in " -_" else "" for c in title)
    return s.strip().replace(" ", "_").replace("-", "_").lower() or "untitled"


def generate_composition_prompt(
    title: str,
    slug: str,
    instrumentation: str,
    structure_engine: dict,
    behaviour_engine: dict,
    modifier_engines: list,
    supporting_engines: list,
    gce_target: float,
    modulation_summary: str = "",
    include_wyble: bool = False,
    length_bars: int = 32,
    tempo: str = "120 bpm",
    key_sig: str = "C major",
    time_sig: str = "4/4",
    form: str = "AABA (32 bars)",
    strict_mode: bool = True,
    quality_mode: str = "album-level",
    composition_type: str = "Lead Sheet",
) -> str:
    """Generate full composition prompt for Cursor Chat."""
    comp_type = composition_type if composition_type == "Full Composition" else "Lead Sheet"

    lines = [
        "# Composition Request",
        "",
        f"**Piece:** {title}",
        f"**Slug:** {slug}",
        f"**Instrumentation:** {instrumentation}",
        f"**Composition Type:** {comp_type}",
        f"**Target GCE:** ≥ {gce_target}",
        "",
        "## Composition Parameters",
        "",
        f"- **Length:** {length_bars} bars",
        f"- **Tempo:** {tempo}",
        f"- **Key:** {key_sig}",
        f"- **Time signature:** {time_sig}",
        f"- **Form:** {form}",
        "",
        "---",
        "",
        "## Engine Configuration",
        "",
        f"**Structure Engine:** {structure_engine.get('name', structure_engine.get('id', '—'))}",
        f"- {structure_engine.get('musical_purpose', structure_engine.get('short_description', ''))}",
        "",
        f"**Behaviour Engine:** {behaviour_engine.get('name', behaviour_engine.get('id', '—'))}",
        f"- {behaviour_engine.get('musical_purpose', behaviour_engine.get('short_description', ''))}",
        "",
    ]

    if modifier_engines:
        lines.append("**Modifier Engines** (use only in intro, bridge, transition, coda, interlude, solo):")
        for m in modifier_engines:
            lines.append(f"- {m.get('name', m.get('id', ''))}: {m.get('short_description', '')}")
        lines.append("")
        lines.append("*Modifiers must NOT generate the whole piece.*")
        lines.append("")

    if supporting_engines:
        lines.append("**Supporting Engines:**")
        for s in supporting_engines:
            lines.append(f"- {s.get('name', s.get('id', ''))}")
        lines.append("")

    # Musical quality constraints
    lines.append("---")
    lines.append("")
    lines.append("## Musical Quality Requirements")
    lines.append("")
    lines.append("**Engine fingerprint:** The structure engine and behaviour engine must leave clear, audible fingerprints in the music. A listener should be able to identify which engines drove the composition.")
    lines.append("")

    if comp_type == "Lead Sheet":
        lines.append("**Lead Sheet focus:** Emphasise melody strength, chord progression identity, player usability, and narrative form. The lead sheet must be immediately playable and musically convincing.")
        lines.append("")
        lines.append("**Section contrast:** Sections (A, B, bridge, return, coda) must feel genuinely differentiated. The bridge or interlude must create a real scene shift, not a harmonic loop.")
        lines.append("")
        lines.append("**Anti-generic:** Reject any output that feels like a technical test, scale exercise, or generic lead-sheet pattern. The piece must feel like a real composition with audible engine identity.")
        lines.append("")
        lines.append("**Anti-exercise:** Do not produce drill-like material. The lead sheet must be something a player would want to play—memorable, shaped, with motivic identity.")
    else:
        lines.append("**Full Composition focus:** Emphasise orchestration, ensemble interaction, texture variation, and structural drama. The piece must have varied textures, clear ensemble roles, and a dynamic arc across the form.")
        lines.append("")
        lines.append("**Section contrast:** Sections must feel genuinely differentiated. The bridge or interlude must create a real scene shift, with orchestration and texture changes.")
        lines.append("")
        lines.append("**Anti-generic:** Reject any output that feels like a technical exercise or generic arrangement. The orchestration must be specific to the engines and the piece.")
        lines.append("")
        lines.append("**Ensemble interaction:** Voices and instruments must interact meaningfully; avoid static block writing.")

    lines.append("")
    lines.append("**Reject if musically bland:** Do not export or finalise any composition that has:")
    if comp_type == "Lead Sheet":
        lines.append("- Melody built mostly from generic scalar filler")
        lines.append("- Chord progression that is loop-based without narrative")
        lines.append("- Bridge that does not create real harmonic contrast")
        lines.append("- Melody containing excessive repetition")
        lines.append("- Engine fingerprint not detectable")
    else:
        lines.append("- Orchestration that remains static throughout")
        lines.append("- Harmonic environment too repetitive")
        lines.append("- No dynamic arc across the form")
        lines.append("- Engine behaviour absent in the writing")
    lines.append("- Obvious bar-by-bar harmonic cycling with no dramatic shape")
    lines.append("- Repeated phrase design longer than 8 bars without meaningful change")
    lines.append("- No motivic recall or foreshadowing")
    lines.append("")

    # Engine-specific requirements
    struct_name = structure_engine.get("name", "")
    behave_name = behaviour_engine.get("name", "")
    if "Shorter" in struct_name:
        lines.append("**Shorter Narrative:** Sections unfold like scenes. Require motivic foreshadowing or recall. The bridge/interlude must create a real narrative shift. Reject static loop logic.")
        lines.append("")
    if "Scofield" in behave_name or "Holland" in behave_name:
        lines.append("**Scofield–Holland Groove:** Require rhythmic lift, active bass implication, and groove-forward harmonic punctuation. Reject static or floating harmonic treatment.")
        lines.append("")
    if "Wyble" in behave_name:
        lines.append("**Wyble Linear Counterpoint:** Require implied two-voice logic, dyadic or contrapuntal motion. Reject plain single-line melody over block changes.")
        lines.append("")
    if "Metheny" in struct_name or "Bacharach" in struct_name:
        lines.append("**Metheny–Bacharach Lyric:** Require melodic inevitability and harmonic surprise. Reject over-busy rhythm.")
        lines.append("")
    if "Frisell" in struct_name:
        lines.append("**Frisell Atmosphere:** Require space and suspension. Reject unnecessary density.")
        lines.append("")
    if "Coleman" in behave_name:
        lines.append("**Coleman Rhythmic Architecture:** Require rhythmic cell transformation. Reject ordinary groove-only writing.")
        lines.append("")

    if modulation_summary:
        lines.append("---")
        lines.append("")
        lines.append("## Modulation Options")
        lines.append("")
        lines.append("Use the following modulation options if musically appropriate:")
        lines.append("")
        lines.append(modulation_summary)
        lines.append("")

    musicxml_path = f"music/{slug}/musicxml/V1.0 - {title}.musicxml"
    notes_path = f"music/{slug}/notes/engine_notes.md"
    revision_path = f"music/{slug}/revisions/revision_log.md"

    lines.extend([
        "---",
        "",
        "## Output Instructions",
        "",
        "**Workspace root:** creative-rule-engines repo root",
        "",
        "**Create folder structure if it does not exist:**",
        f"- music/{slug}/",
        f"- music/{slug}/musicxml/",
        f"- music/{slug}/notes/",
        f"- music/{slug}/revisions/",
        "",
        "**Output file:**",
        f"- {musicxml_path}",
        "",
        "   - Version (Vx.x) must ALWAYS be first in every filename",
        f"   - For revisions: V1.1, V1.2, etc. (e.g. `music/{slug}/musicxml/V1.1 - {title}.musicxml`)",
        "   - Never use timestamps or meaningless numbers",
        "",
        "**Also write:**",
        f"- {notes_path} (engines used, harmonic design summary, form description)",
        f"- {revision_path}",
        "",
        "**Engraving:** Clean notation, meter only when it changes, Sibelius-friendly",
        "**Quality:** Re-evaluate against GCE until all axes ≥ target threshold",
        "",
        "## Automation Rules",
        "",
        "- Preserve asymmetry",
        "- Do not optimise phrasing",
        "- Do not balance symmetry",
        "- Avoid AI-generic repetition",
        "- Avoid repeated time signatures every bar",
        "- Write files directly to workspace using relative paths",
        "",
        "## Final Step",
        "",
        "At the end of generation, confirm the files created and their paths:",
        "",
        f"1. MusicXML: {musicxml_path}",
        f"2. Notes: {notes_path}",
        f"3. Revision log: {revision_path}",
        "",
    ])

    if include_wyble:
        lines.extend([
            "## Wyble Study Follow-up",
            "",
            "After composition, generate Wyble-style two-voice guitar etudes from the piece.",
            "Reference: creative-engines/supporting-engines/wyble-etude-engine/",
            "",
        ])

    lines.extend([
        "---",
        "",
        "Reference: creative-engines/docs/The_Mighty_Ten_Engines_User_Guide.md",
        "Tonality Vault: music/palettes/tonality-vault/",
        "",
    ])
    return "\n".join(lines)


def _vl_label(s) -> str:
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


def format_modulation_summary(ranked, style: str, mighty_engine: str, prog: str) -> str:
    """Format modulation results for inclusion in prompt."""
    lines = [f"Progression: `{prog}` | Style: {style} | Mighty engine: {mighty_engine}", ""]
    for i, s in enumerate(ranked, 1):
        vl = _vl_label(s)
        density = _density_label(s)
        lines.append(f"{i}. **{s.strategy}** → {s.to_region}")
        lines.append(f"   Pivot: {s.pivot_explanation}")
        lines.append(f"   Effect: {s.emotional_tag} | Voice-leading: {vl} | Density: {density}")
        lines.append(f"   Chord path: {', '.join(s.chord_path)}")
        lines.append("")
    return "\n".join(lines)
