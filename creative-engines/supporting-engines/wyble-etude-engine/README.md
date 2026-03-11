# Wyble Etude Generation Engine

Supporting engine for generating Jimmy Wyble–style two-line guitar etudes from existing composition material.

## Purpose

When creating Wyble etudes from source MusicXML, apply the full system prompt in `wyble_etude_generation_engine.md`.

## Usage

- **Reference:** `creative-engines/supporting-engines/wyble-etude-engine/wyble_etude_generation_engine.md`
- **Cursor rule:** `.cursor/rules/wyble-etude-generation.mdc` applies when `*.musicxml` files are in context

To ensure the engine is used, either:
- @-mention the engine file when requesting Wyble etudes, or
- Open a MusicXML file when making the request (the rule applies automatically)

## Integration

Sits alongside The Mighty Ten and the modulation-menu-engine as a shared supporting engine. Complements the Counterpoint Hybrid engine for guitar-specific two-line reduction.
