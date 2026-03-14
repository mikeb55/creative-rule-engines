/**
 * Guitar Rhythm Templates — Comping patterns per phrase.
 * No random chord placement; one template per phrase.
 */
export type CompPattern = 'A' | 'B' | 'C' | 'D';

export interface RhythmTemplate {
  pattern: CompPattern;
  chordBeats: number[];  // beat positions (0-3 per bar) for chord stabs
  allowLine: boolean;
}

/** Pattern A: beat 2 and 4 chord */
export const PATTERN_A: RhythmTemplate = {
  pattern: 'A',
  chordBeats: [1, 3],
  allowLine: true,
};

/** Pattern B: syncopated off-beat stab */
export const PATTERN_B: RhythmTemplate = {
  pattern: 'B',
  chordBeats: [1.5, 3.5],
  allowLine: true,
};

/** Pattern C: chord + melodic fragment (chord on 1, line on 2-4) */
export const PATTERN_C: RhythmTemplate = {
  pattern: 'C',
  chordBeats: [0],
  allowLine: true,
};

/** Pattern D: shell comping under line (chords on 2) */
export const PATTERN_D: RhythmTemplate = {
  pattern: 'D',
  chordBeats: [1],
  allowLine: true,
};

export const RHYTHM_TEMPLATES: RhythmTemplate[] = [PATTERN_A, PATTERN_B, PATTERN_C, PATTERN_D];

/** Get chord beat positions for a bar given pattern and bar-in-phrase */
export function getChordBeatsForBar(
  pattern: CompPattern,
  barInPhrase: number,
  phraseLength: number,
  _beatsPerBar: number
): number[] {
  const t = RHYTHM_TEMPLATES.find(r => r.pattern === pattern) ?? PATTERN_A;
  return [...t.chordBeats];
}
