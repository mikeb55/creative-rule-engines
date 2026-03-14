import type { Note, Chord } from './types';

const II_V_I = [
  { symbol: 'Dm7', root: 2, quality: 'm7' },
  { symbol: 'G7', root: 5, quality: '7' },
  { symbol: 'Cmaj7', root: 0, quality: 'maj7' },
];

const CHORD_TONES: Record<string, number[]> = {
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  '7': [0, 4, 7, 10],
  dim7: [0, 3, 6, 9],
};

export function generateIIVProgression(_keyCenter: string, bars: number): Chord[] {
  const chords: Chord[] = [];
  let offset = 0;
  const beatsPerChord = 2;
  for (let i = 0; i < Math.ceil(bars * 4 / (beatsPerChord * 3)); i++) {
    for (const c of II_V_I) {
      chords.push({ symbol: c.symbol, duration: beatsPerChord, offset });
      offset += beatsPerChord;
    }
  }
  return chords.slice(0, Math.ceil(bars * 4 / beatsPerChord));
}

export function chordToneOnStrongBeat(
  chord: Chord,
  keyRoot: number,
  beatPosition: number,
  controls: { guideToneStrength: number; harmonicStrictness: number }
): number {
  const isStrongBeat = beatPosition % 2 === 0;
  const tones = CHORD_TONES['maj7'] || CHORD_TONES['m7'] || CHORD_TONES['7'];
  const root = (chord.symbol.includes('Dm') ? 2 : chord.symbol.includes('G') ? 7 : 0) + keyRoot;
  const basePitch = 60 + root;
  if (isStrongBeat && controls.guideToneStrength > 0.5) {
    return basePitch + tones[1];
  }
  return basePitch + tones[0];
}

export function applyBebopEnclosure(
  targetPitch: number,
  controls: { enclosureUsage: number }
): number[] {
  if (controls.enclosureUsage < 0.3) return [targetPitch];
  return [targetPitch + 1, targetPitch - 1, targetPitch];
}

export function addDiminishedPassing(
  chords: Chord[],
  intensity: number
): Chord[] {
  if (intensity < 0.3) return chords;
  const result: Chord[] = [];
  for (let i = 0; i < chords.length; i++) {
    result.push(chords[i]);
    if (i < chords.length - 1 && intensity > 0.6 && Math.random() < 0.4) {
      result.push({ symbol: 'Bdim7', duration: 0.5, offset: chords[i].offset + chords[i].duration });
    }
  }
  return result;
}

export function evaluateCadenceStrength(chords: Chord[]): number {
  let score = 0.5;
  for (let i = 0; i < chords.length - 1; i++) {
    if (chords[i].symbol.includes('G7') && chords[i + 1].symbol.includes('C')) score += 0.2;
    if (chords[i].symbol.includes('Dm') && chords[i + 1].symbol.includes('G')) score += 0.1;
  }
  return Math.min(1, score);
}

export function evaluateStepwiseMotion(notes: Note[]): number {
  let stepwise = 0;
  for (let i = 1; i < notes.length; i++) {
    const leap = Math.abs(notes[i].pitch - notes[i - 1].pitch);
    if (leap <= 2) stepwise++;
  }
  return notes.length > 1 ? stepwise / (notes.length - 1) : 1;
}

export function generateBebopLine(
  chords: Chord[],
  bars: number,
  controls: { bebopDensity: number; guideToneStrength: number; enclosureUsage: number }
): Note[] {
  const notes: Note[] = [];
  let offset = 0;
  const divisions = bars * 8;
  for (let i = 0; i < divisions; i++) {
    const chordIdx = Math.min(Math.floor(offset / 2), chords.length - 1);
    const chord = chords[chordIdx] || chords[0];
    const root = chord.symbol.includes('Dm') ? 62 : chord.symbol.includes('G') ? 67 : 60;
    const tones = CHORD_TONES['maj7'] || CHORD_TONES['7'];
    const target = root + tones[i % tones.length];
    if (controls.enclosureUsage > 0.4 && i % 4 === 3) {
      const enc = applyBebopEnclosure(target, controls);
      enc.forEach((p, j) => notes.push({ pitch: p, duration: 0.25, offset: offset + j * 0.25 }));
      offset += 0.75;
    } else {
      notes.push({ pitch: target, duration: 0.5, offset });
      offset += 0.5;
    }
  }
  return notes.slice(0, divisions);
}
