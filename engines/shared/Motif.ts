/**
 * Motif — Melodic motif structure.
 * Output of motif engine; input to phrase/harmony layer.
 */
export interface Motif {
  id: string;
  /** MIDI pitches (3–7 notes) */
  pitches: number[];
  /** Durations in beats */
  durations: number[];
  /** Beat offsets within motif */
  offsets: number[];
  /** Interval structure (semitones between consecutive pitches) */
  intervals: number[];
}
