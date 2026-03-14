# Andrew Hill Event Schema

All Hill engine outputs must use a structured event model.

Each event must contain:

- event_id
- pitches
- role
- staff
- beat_position
- duration
- register_band
- articulation
- source_interval_cell
- source_harmonic_field
- phrase_group
- rhythmic_layer

## Example Event

```
event_id: HILL_001
pitches: [C4, Db4, E4]
role: melody_fragment
staff: treble
beat_position: 1.5
duration: 1.0
register_band: middle
articulation: accent
source_interval_cell: Cell A
source_harmonic_field: Field A
phrase_group: 3+5
rhythmic_layer: displacement
```
