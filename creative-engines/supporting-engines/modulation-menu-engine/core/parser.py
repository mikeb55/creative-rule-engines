"""Best-effort chord progression parser."""

import re
from dataclasses import dataclass


@dataclass
class ParsedChord:
    """Single parsed chord with root and quality."""

    original: str
    root: str
    quality: str  # maj, min, dom, dim, aug, sus, or unknown


_ROOT_PATTERN = re.compile(r"^([A-G][#b]?)")
_QUALITY_PATTERNS = [
    (r"maj7|M7|Δ7|ma7", "maj7"),
    (r"maj|M|Δ|ma", "maj"),
    (r"min7|m7|mi7|-7", "min7"),
    (r"min|m|mi|-", "min"),
    (r"7|dom7", "dom"),
    (r"dim7|°7", "dim7"),
    (r"dim|°|o", "dim"),
    (r"aug|\+", "aug"),
    (r"sus2|sus4|sus", "sus"),
    (r"9|11|13", "ext"),  # extended
]


def _parse_single(symbol: str) -> ParsedChord:
    """Parse one chord symbol. Best-effort only."""
    symbol = symbol.strip()
    root_match = _ROOT_PATTERN.match(symbol)
    root = root_match.group(1) if root_match else "C"
    quality = "unknown"
    remainder = symbol[len(root):] if root_match else symbol
    for pattern, q in _QUALITY_PATTERNS:
        if re.search(pattern, remainder, re.IGNORECASE):
            quality = q
            break
    if quality == "unknown" and not remainder:
        quality = "maj"
    return ParsedChord(original=symbol, root=root, quality=quality)


def parse_progression(prog_str: str) -> list[ParsedChord]:
    """
    Parse comma-separated chord progression.
    Preserves original chord symbols.
    """
    if not prog_str or not prog_str.strip():
        return []
    parts = [p.strip() for p in prog_str.split(",") if p.strip()]
    return [_parse_single(p) for p in parts]
