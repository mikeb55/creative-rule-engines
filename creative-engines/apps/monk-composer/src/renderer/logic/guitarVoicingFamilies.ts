/**
 * Guitar Voicing Families — Explicit fretboard voicing library.
 * All chord generation must come from these families. No pitch stacking.
 * String numbering: 6=low E, 1=high E. Internal indices: 0=6, 5=1.
 */
export type VoicingFamilyId = 'shell' | 'triad' | 'drop2' | 'guideTone' | 'quartal';

export interface VoicingFamily {
  id: VoicingFamilyId;
  /** Guitar string numbers (6=low E, 1=high E) */
  stringSet: number[];
  /** Interval structure in semitones from root: 0=root, 4=M3, 7=P5, 10=m7, 11=M7 */
  intervalStructure: number[];
  /** Chord types this family supports */
  allowableChordTypes: string[];
  /** Maximum fret span (≤5) */
  maxFretSpan: number;
}

/** Convert guitar string number (6-1) to internal index (0-5) */
export function stringNumToIndex(s: number): number {
  return 6 - s;
}

const GUITAR_STRINGS = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4

export const VOICING_FAMILIES: VoicingFamily[] = [
  // SHELLS — root, 3rd, 7th
  {
    id: 'shell',
    stringSet: [6, 4, 3],
    intervalStructure: [0, 4, 10],
    allowableChordTypes: ['maj7', 'm7', '7'],
    maxFretSpan: 5,
  },
  {
    id: 'shell',
    stringSet: [5, 4, 3],
    intervalStructure: [0, 4, 11],
    allowableChordTypes: ['maj7'],
    maxFretSpan: 5,
  },
  {
    id: 'shell',
    stringSet: [5, 4, 3],
    intervalStructure: [0, 3, 10],
    allowableChordTypes: ['m7'],
    maxFretSpan: 5,
  },
  // TRIADS
  {
    id: 'triad',
    stringSet: [1, 2, 3],
    intervalStructure: [0, 4, 7],
    allowableChordTypes: ['maj7', 'm7', '7'],
    maxFretSpan: 5,
  },
  {
    id: 'triad',
    stringSet: [1, 2, 3],
    intervalStructure: [0, 3, 7],
    allowableChordTypes: ['m7'],
    maxFretSpan: 5,
  },
  {
    id: 'triad',
    stringSet: [2, 3, 4],
    intervalStructure: [0, 3, 6],
    allowableChordTypes: ['dim7'],
    maxFretSpan: 5,
  },
  {
    id: 'triad',
    stringSet: [2, 3, 4],
    intervalStructure: [0, 4, 7],
    allowableChordTypes: ['maj7', 'm7', '7'],
    maxFretSpan: 5,
  },
  {
    id: 'triad',
    stringSet: [3, 4, 5],
    intervalStructure: [0, 4, 7],
    allowableChordTypes: ['maj7', 'm7', '7'],
    maxFretSpan: 5,
  },
  // DROP-2
  {
    id: 'drop2',
    stringSet: [1, 2, 3, 4],
    intervalStructure: [0, 7, 4, 10],
    allowableChordTypes: ['maj7', 'm7', '7'],
    maxFretSpan: 5,
  },
  {
    id: 'drop2',
    stringSet: [2, 3, 4, 5],
    intervalStructure: [0, 7, 4, 10],
    allowableChordTypes: ['maj7', 'm7', '7'],
    maxFretSpan: 5,
  },
  // GUIDE-TONE DYADS — 3rd + 7th
  {
    id: 'guideTone',
    stringSet: [3, 4],
    intervalStructure: [4, 10],
    allowableChordTypes: ['maj7', 'm7', '7'],
    maxFretSpan: 5,
  },
  {
    id: 'guideTone',
    stringSet: [2, 3],
    intervalStructure: [4, 10],
    allowableChordTypes: ['maj7', 'm7', '7'],
    maxFretSpan: 5,
  },
  {
    id: 'guideTone',
    stringSet: [4, 5],
    intervalStructure: [4, 10],
    allowableChordTypes: ['maj7', 'm7', '7'],
    maxFretSpan: 5,
  },
  // QUARTAL GRIPS
  {
    id: 'quartal',
    stringSet: [1, 2, 3],
    intervalStructure: [0, 5, 10],
    allowableChordTypes: ['maj7', 'm7', '7'],
    maxFretSpan: 5,
  },
  {
    id: 'quartal',
    stringSet: [2, 3, 4],
    intervalStructure: [0, 5, 10],
    allowableChordTypes: ['maj7', 'm7', '7'],
    maxFretSpan: 5,
  },
];

export function getFamiliesForChordType(chordType: string): VoicingFamily[] {
  return VOICING_FAMILIES.filter(f =>
    f.allowableChordTypes.includes(chordType)
  );
}

export function getFamiliesById(id: VoicingFamilyId): VoicingFamily[] {
  return VOICING_FAMILIES.filter(f => f.id === id);
}
