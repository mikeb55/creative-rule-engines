/**
 * Guitar Idiom Rules — Target-specific performance and notation logic.
 * Compact chord vocabulary, string-group awareness, left-hand realism.
 */
import type { Note, Chord } from './types';
import { getChordTones, guideToneDyad, shellVoicing, compactTriad } from './voicingFamilies';

const GUITAR_LOW = 40;
const GUITAR_HIGH = 84;

/** Guitar string groups: adjacent strings only for grips */
const STRING_SETS = [
  [40, 45, 50, 55, 59, 64],
  [45, 50, 55, 59, 64, 69],
];

function getChordAtBeat(harmony: Chord[], offset: number): Chord | undefined {
  for (let i = harmony.length - 1; i >= 0; i--) {
    if (harmony[i].offset <= offset) return harmony[i];
  }
  return harmony[0];
}

export type GuitarTexture = 'single' | 'dyad' | 'triad' | 'shell' | 'rest';

/** Apply guitar idiom: mixed texture, do NOT harmonize every note */
export function applyGuitarIdiom(
  melody: Note[],
  harmony: Chord[],
  options: {
    monkMode?: boolean;
    barryMode?: boolean;
    harmonizeRatio?: number;
  } = {}
): Note[] {
  const monkMode = options.monkMode ?? false;
  const barryMode = options.barryMode ?? true;
  const harmonizeRatio = options.harmonizeRatio ?? 0.4;
  const result: Note[] = [];

  for (let i = 0; i < melody.length; i++) {
    const n = melody[i];
    const offset = n.offset ?? 0;
    const duration = n.duration ?? 0.5;

    if (n.rest) {
      result.push({ pitch: 0, duration, offset, rest: true });
      continue;
    }

    const chord = getChordAtBeat(harmony, offset);
    const pitch = Math.min(GUITAR_HIGH, Math.max(GUITAR_LOW, n.pitch));

    const useRest = Math.random() < 0.15;
    if (useRest) {
      result.push({ pitch: 0, duration, offset, rest: true });
      continue;
    }

    const shouldHarmonize = chord && Math.random() < harmonizeRatio;
    if (!shouldHarmonize || !chord) {
      result.push({ pitch, duration, offset, rest: false });
      continue;
    }

    const textureRoll = Math.random();
    let support: number[] = [];

    if (monkMode) {
      if (textureRoll < 0.4) support = guideToneDyad(chord, 3, '37');
      else if (textureRoll < 0.7) support = guideToneDyad(chord, 3, '73');
      else support = shellVoicing(chord, 3).slice(0, 2);
    } else if (barryMode) {
      if (textureRoll < 0.35) support = guideToneDyad(chord, 3, '37');
      else if (textureRoll < 0.65) support = compactTriad(chord, 3).slice(0, 2);
      else support = shellVoicing(chord, 3).slice(0, 2);
    } else {
      support = guideToneDyad(chord, 3, textureRoll < 0.5 ? '37' : '73');
    }

    support = support
      .map(p => Math.min(GUITAR_HIGH, Math.max(GUITAR_LOW, p)))
      .filter(p => p < pitch)
      .slice(0, 2);

    result.push({ pitch, duration, offset, rest: false });
    for (const p of support) {
      result.push({ pitch: p, duration, offset, rest: false });
    }
  }

  return result.sort((a, b) => {
    const oa = a.offset ?? 0;
    const ob = b.offset ?? 0;
    if (oa !== ob) return oa - ob;
    return (b.pitch ?? 0) - (a.pitch ?? 0);
  });
}

/** Reject guitar output if it fails idiom tests */
export function validateGuitarIdiom(notes: Note[]): { pass: boolean; reason?: string } {
  const pitched = notes.filter(n => !n.rest && n.pitch > 0);
  const chordCount = new Set(pitched.map(n => Math.round((n.offset ?? 0) * 4) / 4)).size;
  const multiNote = pitched.filter((_, i, arr) => {
    const o = arr[i].offset ?? 0;
    return arr.some((x, j) => j !== i && Math.abs((x.offset ?? 0) - o) < 0.01);
  }).length;

  if (pitched.length < 8) return { pass: false, reason: 'Too few notes' };
  if (multiNote < pitched.length * 0.1) return { pass: false, reason: 'Mostly monophonic' };
  if (pitched.some(n => (n.pitch ?? 0) < GUITAR_LOW || (n.pitch ?? 0) > GUITAR_HIGH)) {
    return { pass: false, reason: 'Out of guitar range' };
  }
  return { pass: true };
}
