"""
Engine Registry — discover, register, and retrieve composition engines by name.

Loads engine definitions from creative-engines/engines/ (markdown specifications).
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Engine:
    """Metadata for a composition engine."""

    name: str
    description: str
    dependencies: list[str] = field(default_factory=list)
    output_types: list[str] = field(default_factory=list)
    engine_id: str = ""

    def __post_init__(self) -> None:
        if not self.engine_id:
            self.engine_id = self.name.lower().replace(" ", "_").replace("-", "_")


class EngineRegistry:
    """Registry for composition engines. Supports discovery, registration, and lookup by name."""

    def __init__(self) -> None:
        self._engines: dict[str, Engine] = {}

    def register_engine(self, engine: Engine) -> None:
        """Register an engine. Uses engine_id as key."""
        key = engine.engine_id
        self._engines[key] = engine

    def get_engine(self, name: str) -> Optional[Engine]:
        """Get engine by name (engine_id). Accepts with or without .md suffix."""
        key = name.lower().strip()
        if key.endswith(".md"):
            key = key[:-3]
        key = key.replace(" ", "_").replace("-", "_")
        return self._engines.get(key)

    def list_engines(self) -> list[Engine]:
        """Return all registered engines."""
        return list(self._engines.values())

    def engine_ids(self) -> list[str]:
        """Return all registered engine IDs."""
        return list(self._engines.keys())
