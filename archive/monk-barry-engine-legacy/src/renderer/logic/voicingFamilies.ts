/**
 * Voicing Families — Shared chord voicing structures for guitar, piano, big band.
 * Compact vocabulary: shells, guide-tone dyads, triads, selective 4-note grips.
 */
import type { Chord } from './types';

const ROOT_SEMITONE: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

const CHORD_TONES: Record<string, number[]> = {
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  '7': [0, 4, 7, 10],
  dim7: [0, 3, 6, 9],
};

function chordQuality(symbol: string): string {
  if (symbol.includes('dim')) return 'dim7';
  if (symbol.includes('maj7')) return 'maj7';
  if (symbol.includes('m7') || symbol.includes('min7')) return 'm7';
  if (symbol.includes('7')) return '7';
  return 'maj7';
}

function chordRoot(symbol: string): number {
  const m = symbol.match(/^([A-G][#b]?)/);
  return m ? (ROOT_SEMITONE[m[1]] ?? 0) : 0;
}

export function getChordTones(symbol: string): number[] {
  const root = chordRoot(symbol);
  const quality = chordQuality(symbol);
  const tones = CHORD_TONES[quality] ?? CHORD_TONES.maj7;
  return tones.map(t => (root + t) % 12);
}

export type VoicingType = 'shell' | 'dyad' | 'triad' | 'compact4' | 'melody_shell' | 'melody_triad';

/** Shell: root, 3rd, 7th (or 6th for tonic) — max 3 notes. refOctave 3 = C2 (36) */
export function shellVoicing(chord: Chord, refOctave: number): number[] {
  const pcs = getChordTones(chord.symbol);
  const root = pcs[0];
  const third = pcs[1];
  const seventh = pcs[3] ?? pcs[2];
  const base = (refOctave + 1) * 12;
  return [root, third, seventh].map(pc => base + pc).sort((a, b) => a - b);
}

/** Guide-tone dyad: 3–7 or 7–3. refOctave 2 = C2 (36) */
export function guideToneDyad(chord: Chord, refOctave: number, variant: '37' | '73' = '37'): number[] {
  const pcs = getChordTones(chord.symbol);
  const third = pcs[1];
  const seventh = pcs[3] ?? pcs[2];
  const base = (refOctave + 1) * 12;
  return variant === '37'
    ? [base + third, base + seventh].sort((a, b) => a - b)
    : [base + seventh, base + third].sort((a, b) => a - b);
}

/** Compact triad: root, 3rd, 5th */
export function compactTriad(chord: Chord, refOctave: number): number[] {
  const pcs = getChordTones(chord.symbol);
  const [r, t, f] = [pcs[0], pcs[1], pcs[2]];
  const base = (refOctave + 1) * 12;
  return [r, t, f].map(pc => base + pc).sort((a, b) => a - b);
}

/** Compact 4-note: shell + 9th or 5th */
export function compact4(chord: Chord, refOctave: number): number[] {
  const pcs = getChordTones(chord.symbol);
  const root = pcs[0];
  const third = pcs[1];
  const fifth = pcs[2];
  const ninth = (pcs[1] + 7) % 12;
  const base = (refOctave + 1) * 12;
  return [root, third, fifth, ninth].map(pc => base + pc).sort((a, b) => a - b).slice(0, 4);
}

/** Parental augmented form: C+ = C E G# — for movement */
export function augmentedTriad(rootPc: number, refOctave: number): number[] {
  const base = (refOctave + 1) * 12;
  return [rootPc, (rootPc + 4) % 12, (rootPc + 8) % 12].map(pc => base + pc).sort((a, b) => a - b);
}

/** Parental diminished: dim7 tones for connectors */
export function diminishedTones(rootPc: number): number[] {
  return [rootPc, (rootPc + 3) % 12, (rootPc + 6) % 12, (rootPc + 9) % 12];
}
