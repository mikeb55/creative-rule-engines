/**
 * Fretboard Mapper — Map harmonic target to playable voicings from dictionary.
 * Enforces max stretch, adjacent strings, rejects impossible grips.
 */
import type { Chord } from './types';
import {
  GUITAR_VOICING_SHAPES,
  chordQualityFromSymbol,
  type GuitarVoicingShape,
  type VoicingFamily,
} from './guitarVoicingDictionary';

export const GUITAR_STRINGS = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4
const GUITAR_LOW = 40;
const GUITAR_HIGH = 84;
const MAX_FRET_SPAN = 5;
const MAX_SKIPPED_STRINGS = 1;

const CHORD_INTERVALS: Record<string, number[]> = {
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  '7': [0, 4, 7, 10],
  dim7: [0, 3, 6, 9],
};

const ROOT_SEMITONE: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

function chordRoot(symbol: string): number {
  const m = symbol.match(/^([A-G][#b]?)/);
  return m ? (ROOT_SEMITONE[m[1]] ?? 0) : 0;
}

export interface FretboardVoicing {
  pitches: number[];
  shape: GuitarVoicingShape;
  rootFret: number;
}

function shapeMatchesChord(shape: GuitarVoicingShape, quality: string): boolean {
  const chordTones = CHORD_INTERVALS[quality] ?? CHORD_INTERVALS.maj7;
  return shape.intervals.every(i => {
    const pc = (i + 12) % 12;
    return chordTones.includes(i) || chordTones.includes(pc);
  });
}

/** Compute fret on string for a given pitch class, near refFret */
function fretForPcOnString(stringIdx: number, pc: number, refFret: number): number {
  const openPc = [4, 9, 2, 7, 11, 4][stringIdx];
  let fret = (pc - openPc + 120) % 12;
  const k = Math.round((refFret - fret) / 12);
  fret += 12 * k;
  if (fret < 0) fret += 12;
  return fret;
}

/** Try to realize shape at rootFret for chord. Returns pitches or null if impossible. */
function realizeShape(
  shape: GuitarVoicingShape,
  rootPc: number,
  rootFret: number
): number[] | null {
  const pitches: number[] = [];
  const frets: number[] = [];

  for (let i = 0; i < shape.strings.length; i++) {
    const strIdx = shape.strings[i];
    const interval = shape.intervals[i];
    const pc = (rootPc + interval) % 12;
    const fret = fretForPcOnString(strIdx, pc, rootFret);
    const pitch = GUITAR_STRINGS[strIdx] + fret;
    if (pitch < GUITAR_LOW || pitch > GUITAR_HIGH) return null;
    pitches.push(pitch);
    frets.push(fret);
  }

  const fretSpan = Math.max(...frets) - Math.min(...frets);
  if (fretSpan > shape.maxFretSpan || fretSpan > MAX_FRET_SPAN) return null;

  const stringSpan = Math.max(...shape.strings) - Math.min(...shape.strings);
  const skipped = stringSpan - shape.strings.length + 1;
  if (skipped > MAX_SKIPPED_STRINGS) return null;

  return pitches.sort((a, b) => a - b);
}

/** Get all playable voicings for chord in fret range */
export function getVoicingsForChord(
  chord: Chord,
  families: VoicingFamily[] = ['shell', 'guideTone', 'triad'],
  minFret = 3,
  maxFret = 12
): FretboardVoicing[] {
  const rootPc = chordRoot(chord.symbol);
  const quality = chordQualityFromSymbol(chord.symbol);
  const result: FretboardVoicing[] = [];

  const shapes = GUITAR_VOICING_SHAPES.filter(
    s => families.includes(s.family) && shapeMatchesChord(s, quality)
  );

  for (const shape of shapes) {
    for (let rootFret = minFret; rootFret <= maxFret; rootFret++) {
      const pitches = realizeShape(shape, rootPc, rootFret);
      if (pitches) {
        result.push({ pitches, shape, rootFret });
      }
    }
  }
  return result;
}

/** Reject voicing if impossible: fret span, string span, range */
export function isValidGrip(pitches: number[]): boolean {
  if (pitches.length <= 1) return true;
  const sorted = [...pitches].sort((a, b) => a - b);
  if (sorted.some(p => p < GUITAR_LOW || p > GUITAR_HIGH)) return false;
  if (sorted.length > 6) return false;
  const pitchSpan = sorted[sorted.length - 1] - sorted[0];
  if (pitchSpan > 24) return false;

  const assignments: { stringIdx: number; fret: number }[] = [];
  const usedStrings = new Set<number>();
  for (const p of sorted) {
    let best: { s: number; f: number } | null = null;
    for (let s = 0; s <= 5; s++) {
      if (p >= GUITAR_STRINGS[s] && !usedStrings.has(s)) {
        const fret = p - GUITAR_STRINGS[s];
        if (fret >= 0 && fret <= 24) {
          best = { s, f: fret };
          break;
        }
      }
    }
    if (!best) return false;
    assignments.push({ stringIdx: best.s, fret: best.f });
    usedStrings.add(best.s);
  }
  const frets = assignments.map(a => a.fret);
  const strings = assignments.map(a => a.stringIdx);
  const fretSpan = Math.max(...frets) - Math.min(...frets);
  if (fretSpan > MAX_FRET_SPAN) return false;
  const stringSpan = Math.max(...strings) - Math.min(...strings);
  if (stringSpan - strings.length + 1 > MAX_SKIPPED_STRINGS) return false;
  return true;
}

/** Return fret span for a grip, or null if invalid. Uses same assignment as isValidGrip. */
export function getFretSpanForGrip(pitches: number[]): number | null {
  if (pitches.length <= 1) return 0;
  const sorted = [...pitches].sort((a, b) => a - b);
  const assignments: { fret: number }[] = [];
  const usedStrings = new Set<number>();
  for (const p of sorted) {
    let best: { s: number; f: number } | null = null;
    for (let s = 0; s <= 5; s++) {
      if (p >= GUITAR_STRINGS[s] && !usedStrings.has(s)) {
        const fret = p - GUITAR_STRINGS[s];
        if (fret >= 0 && fret <= 24) {
          best = { s, f: fret };
          break;
        }
      }
    }
    if (!best) return null;
    assignments.push({ fret: best.f });
    usedStrings.add(best.s);
  }
  const frets = assignments.map(a => a.fret);
  return Math.max(...frets) - Math.min(...frets);
}
