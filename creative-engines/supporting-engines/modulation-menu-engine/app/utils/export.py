"""Export helpers for modulation results."""

import os
from datetime import datetime


def _ensure_exports_dir() -> str:
    app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    exports_dir = os.path.join(app_dir, "exports")
    os.makedirs(exports_dir, exist_ok=True)
    return exports_dir


def _timestamp_filename(ext: str) -> str:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"modmenu_{ts}.{ext}"


def format_as_text(ranked, style: str, mighty_engine: str, prog: str):
    """Format results as plain text."""
    from core.display import voice_leading_label, density_label

    lines = [f"Modulation Menu Engine — {datetime.now().isoformat()}", ""]
    lines.append(f"Progression: {prog}")
    lines.append(f"Style: {style} | Mighty engine: {mighty_engine}")
    lines.append("")
    for i, s in enumerate(ranked, 1):
        vl = voice_leading_label(s)
        density = density_label(s)
        lines.append(f"Suggestion #{i}")
        lines.append(f"  From: {s.from_region}")
        lines.append(f"  To: {s.to_region}")
        lines.append(f"  Strategy: {s.strategy}")
        lines.append(f"  Pivot: {s.pivot_explanation}")
        lines.append(f"  Voice-leading: {vl} | Cadence: {s.cadence_type} | Density: {density}")
        lines.append(f"  Effect: {s.emotional_tag}")
        lines.append(f"  Chord path: {', '.join(s.chord_path)}")
        lines.append("")
    return "\n".join(lines)


def format_as_markdown(ranked, style: str, mighty_engine: str, prog: str):
    """Format results as markdown."""
    from core.display import voice_leading_label, density_label

    lines = ["# Modulation Menu Engine", ""]
    lines.append(f"**Progression:** `{prog}`")
    lines.append(f"**Style:** {style} | **Mighty engine:** {mighty_engine}")
    lines.append("")
    lines.append("## Results")
    lines.append("")
    for i, s in enumerate(ranked, 1):
        vl = voice_leading_label(s)
        density = density_label(s)
        lines.append(f"### Suggestion #{i}")
        lines.append(f"- **From:** {s.from_region} → **To:** {s.to_region}")
        lines.append(f"- **Strategy:** {s.strategy}")
        lines.append(f"- **Pivot:** {s.pivot_explanation}")
        lines.append(f"- **Voice-leading:** {vl} | **Cadence:** {s.cadence_type} | **Density:** {density}")
        lines.append(f"- **Effect:** {s.emotional_tag}")
        lines.append(f"- **Chord path:** {', '.join(s.chord_path)}")
        lines.append("")
    return "\n".join(lines)


def export_results(ranked, style: str, mighty_engine: str, prog: str, fmt: str) -> str:
    """Export to file. Returns path to saved file."""
    exports_dir = _ensure_exports_dir()
    filename = _timestamp_filename(fmt)
    filepath = os.path.join(exports_dir, filename)
    if fmt == "md":
        content = format_as_markdown(ranked, style, mighty_engine, prog)
    else:
        content = format_as_text(ranked, style, mighty_engine, prog)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    return filepath
