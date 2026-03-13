"""
Composition Pipeline — combine engines to generate compositions with GCE evaluation.
"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Optional, Union

from engine_loader import load_all_engines
from engine_registry import EngineRegistry


@dataclass
class CompositionContext:
    """Mutable context passed through pipeline stages."""

    harmony: list[dict[str, Any]] = field(default_factory=list)
    motif: list[dict[str, Any]] = field(default_factory=list)
    rhythm: list[dict[str, Any]] = field(default_factory=list)
    texture: list[dict[str, Any]] = field(default_factory=list)
    gce_score: float = 0.0
    revision_count: int = 0
    metadata: dict[str, Any] = field(default_factory=dict)


class CompositionPipeline:
    """
    Pipeline that combines engines for generative composition.

    Stages:
    1. Generate harmony (harmony_engine)
    2. Generate motif (style_engine)
    3. Apply rhythmic behaviour (style_engine)
    4. Translate to instrumentation (orchestration_engine)
    5. Evaluate using GCE
    6. Revise until GCE >= 9.0
    7. Export MusicXML
    """

    def __init__(
        self,
        harmony_engine: str = "barry_harris_engine",
        style_engine: str = "monk_engine",
        orchestration_engine: str = "polyphonic_labyrinth_engine",
        gce_threshold: float = 9.0,
        max_revisions: int = 10,
    ) -> None:
        self.harmony_engine = harmony_engine
        self.style_engine = style_engine
        self.orchestration_engine = orchestration_engine
        self.gce_threshold = gce_threshold
        self.max_revisions = max_revisions
        self._registry = load_all_engines()

    def _stage_generate_harmony(self, ctx: CompositionContext) -> None:
        """Stage 1: Generate harmonic structure using harmony engine."""
        engine = self._registry.get_engine(self.harmony_engine)
        if engine:
            # Placeholder: real implementation would call engine logic
            ctx.harmony = [{"chord": "Dm7", "duration": 2}, {"chord": "G7", "duration": 2}, {"chord": "Cmaj7", "duration": 4}]
            ctx.metadata["harmony_engine"] = engine.name
        else:
            ctx.harmony = []

    def _stage_generate_motif(self, ctx: CompositionContext) -> None:
        """Stage 2: Generate motif using style engine."""
        engine = self._registry.get_engine(self.style_engine)
        if engine:
            # Placeholder: real implementation would call engine logic
            ctx.motif = [{"pitch": 60, "duration": 0.5}, {"pitch": 62, "duration": 0.5}, {"pitch": 64, "duration": 1.0}]
            ctx.metadata["style_engine"] = engine.name
        else:
            ctx.motif = []

    def _stage_apply_rhythm(self, ctx: CompositionContext) -> None:
        """Stage 3: Apply rhythmic behaviour from style engine."""
        engine = self._registry.get_engine(self.style_engine)
        if engine:
            # Placeholder: real implementation would apply displacement, accents, etc.
            ctx.rhythm = [{"offset": 0.0, "duration": 0.5}, {"offset": 0.5, "duration": 0.5}, {"offset": 1.25, "duration": 1.0}]
        else:
            ctx.rhythm = ctx.motif

    def _stage_translate_instrumentation(self, ctx: CompositionContext) -> None:
        """Stage 4: Translate to instrumentation via orchestration engine."""
        engine = self._registry.get_engine(self.orchestration_engine)
        if engine:
            # Placeholder: real implementation would expand to multiple voices
            ctx.texture = [{"voice": 1, "notes": ctx.motif}]
            ctx.metadata["orchestration_engine"] = engine.name
        else:
            ctx.texture = [{"voice": 1, "notes": ctx.motif}]

    def _stage_evaluate_gce(self, ctx: CompositionContext) -> float:
        """Stage 5: Evaluate using GCE. Returns score 0–10."""
        # Placeholder: real implementation would call GCE evaluation
        base = 7.0
        if ctx.harmony:
            base += 0.5
        if ctx.motif:
            base += 0.5
        if ctx.texture:
            base += 0.5
        ctx.gce_score = min(10.0, base + ctx.revision_count * 0.2)
        return ctx.gce_score

    def _stage_revise(self, ctx: CompositionContext) -> bool:
        """Stage 6: Revise if GCE < threshold. Returns True if revision was applied."""
        if ctx.gce_score >= self.gce_threshold:
            return False
        if ctx.revision_count >= self.max_revisions:
            return False
        ctx.revision_count += 1
        # Placeholder: real implementation would modify motif/harmony
        return True

    def run(self) -> CompositionContext:
        """Execute full pipeline. Iterates until GCE >= threshold or max revisions."""
        ctx = CompositionContext()
        self._stage_generate_harmony(ctx)
        self._stage_generate_motif(ctx)
        self._stage_apply_rhythm(ctx)
        self._stage_translate_instrumentation(ctx)

        while True:
            self._stage_evaluate_gce(ctx)
            if ctx.gce_score >= self.gce_threshold:
                break
            if not self._stage_revise(ctx):
                break

        return ctx

    def run_and_export(self, output_path: Optional[Union[Path, str]] = None) -> Path:
        """Run pipeline and export to MusicXML. Returns path to exported file."""
        from musicxml_export import export_score_to_musicxml

        ctx = self.run()
        path = Path(output_path) if output_path else Path(__file__).resolve().parent.parent / "outputs" / "composition.xml"
        path.parent.mkdir(parents=True, exist_ok=True)
        export_score_to_musicxml(ctx, path)
        return path
