/**
 * Guitar Voicing Dictionary — Predefined fretboard shapes only.
 * No pitch stacking; all chords from dictionary.
 */
export type VoicingFamily = 'shell' | 'triad' | 'drop2' | 'quartal' | 'guideTone';

export interface GuitarVoicingShape {
  family: VoicingFamily;
  strings: number[];       // 0=low E, 5=high E
  intervals: number[];     // semitones from root: 0=root, 4=M3, 7=P5, 10=m7, 11=M7
  rootOnString: number;    // which string index has root
  maxFretSpan: number;
}

/** Open string pitch classes: E A D G B E */
const OPEN_PC = [4, 9, 2, 7, 11, 4];

/** Chord quality -> chord tones (pc) */
const CHORD_INTERVALS: Record<string, number[]> = {
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  '7': [0, 4, 7, 10],
  dim7: [0, 3, 6, 9],
};

/** String indices: 0=low E(40), 1=A(45), 2=D(50), 3=G(55), 4=B(59), 5=high E(64) */
export const GUITAR_VOICING_SHAPES: GuitarVoicingShape[] = [
  // SHELL: root, 3rd, 7th — strings 5-4-3 (A D G)
  { family: 'shell', strings: [1, 2, 3], intervals: [0, 4, 10], rootOnString: 0, maxFretSpan: 5 },
  { family: 'shell', strings: [1, 2, 3], intervals: [0, 4, 11], rootOnString: 0, maxFretSpan: 5 },
  { family: 'shell', strings: [2, 3, 4], intervals: [0, 4, 10], rootOnString: 0, maxFretSpan: 5 },
  { family: 'shell', strings: [2, 3, 4], intervals: [0, 3, 10], rootOnString: 0, maxFretSpan: 5 },
  { family: 'shell', strings: [3, 4, 5], intervals: [0, 4, 10], rootOnString: 0, maxFretSpan: 5 },
  // TRIAD
  { family: 'triad', strings: [3, 4, 5], intervals: [0, 4, 7], rootOnString: 0, maxFretSpan: 5 },
  { family: 'triad', strings: [2, 3, 4], intervals: [0, 4, 7], rootOnString: 0, maxFretSpan: 5 },
  { family: 'triad', strings: [1, 2, 3], intervals: [0, 4, 7], rootOnString: 0, maxFretSpan: 5 },
  { family: 'triad', strings: [1, 2, 3], intervals: [0, 3, 7], rootOnString: 0, maxFretSpan: 5 },
  // DROP-2
  { family: 'drop2', strings: [1, 2, 3, 4], intervals: [0, 7, 4, 10], rootOnString: 0, maxFretSpan: 5 },
  { family: 'drop2', strings: [2, 3, 4, 5], intervals: [0, 7, 4, 10], rootOnString: 0, maxFretSpan: 5 },
  // QUARTAL
  { family: 'quartal', strings: [3, 4, 5], intervals: [0, 5, 10], rootOnString: 0, maxFretSpan: 5 },
  { family: 'quartal', strings: [2, 3, 4], intervals: [0, 5, 10], rootOnString: 0, maxFretSpan: 5 },
  // GUIDE-TONE DYADS
  { family: 'guideTone', strings: [1, 2], intervals: [4, 10], rootOnString: 0, maxFretSpan: 4 },
  { family: 'guideTone', strings: [1, 2], intervals: [10, 4], rootOnString: 1, maxFretSpan: 4 },
  { family: 'guideTone', strings: [2, 3], intervals: [4, 10], rootOnString: 0, maxFretSpan: 4 },
  { family: 'guideTone', strings: [3, 4], intervals: [4, 10], rootOnString: 0, maxFretSpan: 4 },
];

export function getShapesForFamily(family: VoicingFamily): GuitarVoicingShape[] {
  return GUITAR_VOICING_SHAPES.filter(s => s.family === family);
}

export function getShapesForChordQuality(quality: string): GuitarVoicingShape[] {
  const intervals = CHORD_INTERVALS[quality] ?? CHORD_INTERVALS.maj7;
  return GUITAR_VOICING_SHAPES.filter(s => {
    return s.intervals.every(i => intervals.includes(i) || intervals.includes((i + 12) % 12));
  });
}

export function chordQualityFromSymbol(symbol: string): string {
  if (symbol.includes('dim')) return 'dim7';
  if (symbol.includes('maj7')) return 'maj7';
  if (symbol.includes('m7') || symbol.includes('min7')) return 'm7';
  if (symbol.includes('7')) return '7';
  return 'maj7';
}
