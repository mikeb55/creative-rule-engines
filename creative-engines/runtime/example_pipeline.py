"""
Example Pipeline — demonstrate combining Barry Harris, Monk, and Polyphonic Labyrinth engines.
"""

from composition_pipeline import CompositionPipeline
from engine_loader import load_all_engines


def main() -> None:
    # Load and list available engines
    registry = load_all_engines()
    print("Available engines:")
    for e in registry.list_engines():
        print(f"  - {e.engine_id}: {e.name}")

    # Build pipeline: Barry Harris → harmony, Monk → motif/rhythm, Polyphonic Labyrinth → texture
    pipeline = CompositionPipeline(
        harmony_engine="barry_harris_engine",
        style_engine="monk_engine",
        orchestration_engine="polyphonic_labyrinth_engine",
    )

    print("\nRunning pipeline...")
    ctx = pipeline.run()

    print(f"\nHarmony: {ctx.harmony}")
    print(f"Motif: {ctx.motif}")
    print(f"GCE score: {ctx.gce_score}")
    print(f"Revisions: {ctx.revision_count}")

    # Export to MusicXML
    out_path = pipeline.run_and_export()
    print(f"\nExported to: {out_path}")


if __name__ == "__main__":
    main()
