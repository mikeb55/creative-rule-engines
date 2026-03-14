/**
 * Motif Engine — Motif-first generation.
 * Pipeline: motif → variation → harmonic interpretation → target idiom translation.
 * Motif length 2–5 notes; must recur in transformed form.
 */
import type { Note, Chord } from './types';
import { getChordTones } from './voicingFamilies';

const ROOT_SEMITONE: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

/** Generate seed motif (2–5 notes) from triad/quadratonic + chromatic connectors */
export function generateSeedMotif(
  harmony: Chord[],
  keyCenter: string,
  rng: () => number
): Note[] {
  const keyRoot = ROOT_SEMITONE[keyCenter] ?? 0;
  const chord = harmony[0] ?? { symbol: 'Cmaj7', duration: 2, offset: 0 };
  const pcs = getChordTones(chord.symbol);
  const len = 2 + Math.floor(rng() * 4);
  const notes: Note[] = [];
  let offset = 0;
  const baseOctave = 5;
  const base = (baseOctave + 1) * 12 + keyRoot;

  for (let i = 0; i < len; i++) {
    const pc = pcs[i % pcs.length];
    const chromatic = rng() < 0.3 ? (rng() > 0.5 ? 1 : -1) : 0;
    const pitch = base + pc + chromatic;
    notes.push({
      pitch: Math.max(48, Math.min(84, pitch)),
      duration: 0.5,
      offset,
      rest: false,
    });
    offset += 0.5;
  }
  return notes;
}

/** Expand motif with variations across harmony */
export function expandMotifWithVariations(
  seed: Note[],
  harmony: Chord[],
  bars: number,
  rng: () => number
): Note[] {
  const result: Note[] = [];
  const beatsPerBar = 4;
  const totalBeats = bars * beatsPerBar;
  let offset = 0;

  while (offset < totalBeats) {
    const chordIdx = Math.min(Math.floor(offset / 2), harmony.length - 1);
    const chord = harmony[chordIdx] ?? harmony[0];
    const pcs = getChordTones(chord.symbol);

    const transform = Math.floor(rng() * 4);
    for (let i = 0; i < seed.length && offset < totalBeats; i++) {
      const s = seed[i];
      let pitch = s.pitch;
      if (transform === 0) {
        pitch = (pitch % 12) + Math.floor(pitch / 12) * 12;
        const nearest = pcs.reduce((a, b) =>
          Math.abs((b + 60) - pitch) < Math.abs((a + 60) - pitch) ? b : a
        );
        pitch = Math.floor(pitch / 12) * 12 + nearest;
      } else if (transform === 1) {
        pitch = pitch - 5;
      } else if (transform === 2) {
        pitch = pitch + 7;
      }
      pitch = Math.max(40, Math.min(84, pitch));
      result.push({
        pitch,
        duration: s.duration ?? 0.5,
        offset,
        rest: false,
      });
      offset += s.duration ?? 0.5;
    }
    offset += 0.5;
  }
  return result;
}

/** Count motif recurrences (transformed) */
export function countMotifRecurrences(notes: Note[], seedLen: number): number {
  if (notes.length < seedLen * 2) return 0;
  let count = 0;
  const seedIntervals = [];
  for (let i = 1; i < Math.min(seedLen, notes.length); i++) {
    seedIntervals.push((notes[i].pitch ?? 0) - (notes[i - 1].pitch ?? 0));
  }
  for (let j = seedLen; j <= notes.length - seedLen; j++) {
    let match = 0;
    for (let k = 1; k < seedLen; k++) {
      const curr = (notes[j + k].pitch ?? 0) - (notes[j + k - 1].pitch ?? 0);
      if (Math.abs(curr - seedIntervals[k - 1]) <= 2) match++;
    }
    if (match >= seedLen - 1) count++;
  }
  return count;
}
