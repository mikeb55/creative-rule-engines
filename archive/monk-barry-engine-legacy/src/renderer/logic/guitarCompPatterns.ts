/**
 * Guitar Comp Patterns — One pattern per phrase. No random chord placement.
 */
export type CompPatternId = 'PATTERN_A' | 'PATTERN_B' | 'PATTERN_C' | 'PATTERN_D';

export interface CompPattern {
  id: CompPatternId;
  /** Beat positions (0-3) for chord stabs */
  chordBeats: number[];
  allowLine: boolean;
  description: string;
}

/** PATTERN_A: beat-2 / beat-4 shell */
export const PATTERN_A: CompPattern = {
  id: 'PATTERN_A',
  chordBeats: [1, 3],
  allowLine: true,
  description: 'beat-2 / beat-4 shell',
};

/** PATTERN_B: syncopated off-beat stab */
export const PATTERN_B: CompPattern = {
  id: 'PATTERN_B',
  chordBeats: [1.5, 3.5],
  allowLine: true,
  description: 'syncopated off-beat stab',
};

/** PATTERN_C: chord + melodic fragment */
export const PATTERN_C: CompPattern = {
  id: 'PATTERN_C',
  chordBeats: [0],
  allowLine: true,
  description: 'chord + melodic fragment',
};

/** PATTERN_D: drop-2 sustained hit */
export const PATTERN_D: CompPattern = {
  id: 'PATTERN_D',
  chordBeats: [1],
  allowLine: true,
  description: 'drop-2 sustained hit',
};

export const COMP_PATTERNS: CompPattern[] = [PATTERN_A, PATTERN_B, PATTERN_C, PATTERN_D];

export function getChordBeatsForBar(
  pattern: CompPattern,
  _barInPhrase: number,
  _phraseLength: number,
  _beatsPerBar: number
): number[] {
  return [...pattern.chordBeats];
}
