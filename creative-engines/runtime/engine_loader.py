"""
Engine Loader — scan engines directory, parse markdown metadata, construct Engine objects.
"""

import re
from pathlib import Path
from typing import Optional

from engine_registry import Engine, EngineRegistry


def _engines_dir() -> Path:
    """Path to creative-engines/engines/."""
    return Path(__file__).resolve().parent.parent / "engines"


def _parse_markdown_metadata(filepath: Path) -> dict:
    """Parse engine metadata from a markdown file."""
    text = filepath.read_text(encoding="utf-8")
    engine_id = filepath.stem
    data: dict = {
        "engine_id": engine_id,
        "name": engine_id.replace("_", " ").title(),
        "description": "",
        "dependencies": [],
        "output_types": [],
    }

    # First H1 as display name
    h1_match = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
    if h1_match:
        data["name"] = h1_match.group(1).strip()

    # First substantive paragraph (after H1, before next ##)
    intro = re.search(r"^#\s+.+?\n\n(.+?)(?=\n##|\n---|\Z)", text, re.DOTALL)
    if intro:
        para = intro.group(1).strip()
        # Take first sentence or first 200 chars
        if "." in para:
            data["description"] = para.split(".")[0].strip() + "."
        else:
            data["description"] = para[:200].strip() if len(para) > 200 else para

    # Purpose section often has better description
    purpose_match = re.search(
        r"##\s+(?:1\.\s+)?Purpose\s*\n\n(.+?)(?=\n##|\n---|\Z)",
        text,
        re.DOTALL | re.IGNORECASE,
    )
    if purpose_match:
        purpose = purpose_match.group(1).strip()
        first_para = purpose.split("\n\n")[0].strip()
        if len(first_para) > 20:
            data["description"] = first_para[:300] + ("..." if len(first_para) > 300 else "")

    # Output Types / Expected Outputs table
    output_section = re.search(
        r"##\s+.*(?:Output Types|Expected Outputs).*?\n\n(.+?)(?=\n##|\n---|\Z)",
        text,
        re.DOTALL | re.IGNORECASE,
    )
    if output_section:
        table = output_section.group(1)
        # Parse markdown table: | **X** | ... |
        for row in re.finditer(r"\|\s*\*\*([^*]+)\*\*\s*\|", table):
            data["output_types"].append(row.group(1).strip())

    # Integration with Other Engines / Dependencies table
    integration_section = re.search(
        r"##\s+.*(?:Integration with Other Engines|Integration with GCE|Dependencies).*?\n\n(.+?)(?=\n##|\n---|\Z)",
        text,
        re.DOTALL | re.IGNORECASE,
    )
    if integration_section:
        table = integration_section.group(1)
        for row in re.finditer(r"\|\s*\*\*([^*]+)\s+Engine\*\*\s*\|", table):
            dep = row.group(1).strip().lower().replace(" ", "_")
            if dep and dep != engine_id:
                data["dependencies"].append(dep)
        for row in re.finditer(r"\|\s*\*\*([^*]+)\*\*\s*\|", table):
            cell = row.group(1).strip().lower()
            if "engine" in cell or "atlas" in cell:
                dep = cell.split()[0] if cell.split() else ""
                if dep and dep not in [d.split("_")[0] for d in data["dependencies"]]:
                    data["dependencies"].append(dep.replace(" ", "_"))

    return data


def scan_engines_directory(directory: Optional[Path] = None) -> list[Path]:
    """Scan engines directory for .md files. Returns list of paths."""
    base = directory or _engines_dir()
    if not base.exists():
        return []
    return sorted(base.glob("*.md"))


def load_engine_from_file(filepath: Path) -> Engine:
    """Parse a markdown file and construct an Engine object."""
    data = _parse_markdown_metadata(filepath)
    return Engine(
        name=data["name"],
        description=data["description"],
        dependencies=data["dependencies"],
        output_types=data["output_types"],
        engine_id=data["engine_id"],
    )


def load_all_engines(registry: Optional[EngineRegistry] = None) -> EngineRegistry:
    """Scan engines directory, load all engines, register them. Returns registry."""
    reg = registry or EngineRegistry()
    for path in scan_engines_directory():
        try:
            engine = load_engine_from_file(path)
            reg.register_engine(engine)
        except Exception:
            pass  # Skip malformed files
    return reg
