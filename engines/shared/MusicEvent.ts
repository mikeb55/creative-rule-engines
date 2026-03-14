/**
 * MusicEvent — Core musical event type.
 * All generators must output MusicEvent objects, not raw pitch lists.
 */
export type MusicEventRole =
  | 'MELODY'
  | 'CHORD'
  | 'BASS'
  | 'COUNTERLINE'
  | 'REST';

export interface MusicEvent {
  id: string;
  role: MusicEventRole;
  /** MIDI pitch numbers (empty for REST) */
  pitches: number[];
  /** Beat position within measure */
  beatPosition: number;
  /** Duration in beats */
  duration: number;
  /** Measure index (0-based) */
  measure: number;
  /** Optional articulation */
  articulation?: string;
  /** Optional staff assignment */
  staff?: number;
  /** Optional voice number */
  voice?: number;
}

export function createRestEvent(
  id: string,
  measure: number,
  beatPosition: number,
  duration: number
): MusicEvent {
  return {
    id,
    role: 'REST',
    pitches: [],
    beatPosition,
    duration,
    measure,
  };
}

export function createMelodyEvent(
  id: string,
  pitch: number,
  measure: number,
  beatPosition: number,
  duration: number,
  opts?: { articulation?: string; staff?: number; voice?: number }
): MusicEvent {
  return {
    id,
    role: 'MELODY',
    pitches: [pitch],
    beatPosition,
    duration,
    measure,
    ...opts,
  };
}

export function createChordEvent(
  id: string,
  pitches: number[],
  measure: number,
  beatPosition: number,
  duration: number,
  opts?: { staff?: number; voice?: number }
): MusicEvent {
  return {
    id,
    role: 'CHORD',
    pitches,
    beatPosition,
    duration,
    measure,
    ...opts,
  };
}

export function createBassEvent(
  id: string,
  pitch: number,
  measure: number,
  beatPosition: number,
  duration: number,
  opts?: { staff?: number; voice?: number }
): MusicEvent {
  return {
    id,
    role: 'BASS',
    pitches: [pitch],
    beatPosition,
    duration,
    measure,
    ...opts,
  };
}

export function createCounterlineEvent(
  id: string,
  pitch: number,
  measure: number,
  beatPosition: number,
  duration: number,
  opts?: { staff?: number; voice?: number }
): MusicEvent {
  return {
    id,
    role: 'COUNTERLINE',
    pitches: [pitch],
    beatPosition,
    duration,
    measure,
    ...opts,
  };
}
