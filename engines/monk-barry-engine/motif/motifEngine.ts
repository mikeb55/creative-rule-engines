/**
 * Motif Engine — Generate and develop motifs.
 * Rules: motif length 3–7 notes, interval variety, repetition with variation.
 * Output: Motif objects.
 */
import type { Motif } from '../../shared/Motif';

const MOTIF_LENGTH_MIN = 3;
const MOTIF_LENGTH_MAX = 7;
const INTERVAL_VARIETY = [-2, -1, 1, 2, 3, 4, 5, 7, 12];

export interface MotifOptions {
  keyCenter?: number;
  register?: 'low' | 'middle' | 'upper';
  length?: number;
}

function getRegisterBase(register: string): number {
  switch (register) {
    case 'low': return 48;
    case 'upper': return 72;
    default: return 60;
  }
}

export function generateMotif(options: MotifOptions = {}): Motif {
  const keyCenter = options.keyCenter ?? 60;
  const register = options.register ?? 'middle';
  const base = getRegisterBase(register);
  const len = options.length ?? MOTIF_LENGTH_MIN + Math.floor(Math.random() * (MOTIF_LENGTH_MAX - MOTIF_LENGTH_MIN + 1));

  const pitches: number[] = [];
  const intervals: number[] = [];
  let p = base + (keyCenter % 12);

  for (let i = 0; i < len; i++) {
    pitches.push(p);
    if (i < len - 1) {
      const iv = INTERVAL_VARIETY[Math.floor(Math.random() * INTERVAL_VARIETY.length)];
      intervals.push(iv);
      p += iv;
    }
  }

  const durations = pitches.map(() => 0.5);
  const offsets = pitches.map((_, i) => i * 0.5);

  return {
    id: `motif_${Date.now()}`,
    pitches,
    durations,
    offsets,
    intervals,
  };
}

export function developMotif(motif: Motif, variation: 'transpose' | 'invert' | 'retrograde'): Motif {
  const { pitches, durations, offsets, intervals } = motif;
  let newPitches: number[];

  switch (variation) {
    case 'transpose':
      const shift = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.floor(Math.random() * 3));
      newPitches = pitches.map(p => p + shift);
      break;
    case 'invert':
      const axis = pitches[0];
      newPitches = pitches.map(p => axis - (p - axis));
      break;
    case 'retrograde':
      newPitches = [...pitches].reverse();
      break;
    default:
      newPitches = [...pitches];
  }

  const newIntervals = newPitches.slice(1).map((p, i) => p - newPitches[i]);

  return {
    id: `${motif.id}_dev`,
    pitches: newPitches,
    durations: [...durations],
    offsets: [...offsets],
    intervals: newIntervals,
  };
}

export function repeatMotif(motif: Motif, times: number): Motif[] {
  const result: Motif[] = [motif];
  for (let i = 1; i < times; i++) {
    result.push(developMotif(motif, i % 2 === 0 ? 'transpose' : 'retrograde'));
  }
  return result;
}
