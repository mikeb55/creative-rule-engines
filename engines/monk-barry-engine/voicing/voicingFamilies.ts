/**
 * Voicing Families — No raw pitch stacking.
 * Each voicing: interval structure, allowed chord types, voice count, register range.
 */
export type VoicingFamilyId = 'shell' | 'triad' | 'drop2' | 'quartal' | 'guideTone';

export interface VoicingFamily {
  id: VoicingFamilyId;
  /** Interval structure in semitones from root */
  intervalStructure: number[];
  allowableChordTypes: string[];
  voiceCount: number;
  registerMin: number;
  registerMax: number;
}

export const VOICING_FAMILIES: VoicingFamily[] = [
  {
    id: 'shell',
    intervalStructure: [0, 4, 10],
    allowableChordTypes: ['maj7', 'm7', '7'],
    voiceCount: 3,
    registerMin: 48,
    registerMax: 72,
  },
  {
    id: 'shell',
    intervalStructure: [0, 3, 10],
    allowableChordTypes: ['m7'],
    voiceCount: 3,
    registerMin: 48,
    registerMax: 72,
  },
  {
    id: 'triad',
    intervalStructure: [0, 4, 7],
    allowableChordTypes: ['maj7', 'm7', '7'],
    voiceCount: 3,
    registerMin: 48,
    registerMax: 84,
  },
  {
    id: 'triad',
    intervalStructure: [0, 3, 7],
    allowableChordTypes: ['m7'],
    voiceCount: 3,
    registerMin: 48,
    registerMax: 84,
  },
  {
    id: 'drop2',
    intervalStructure: [0, 7, 10, 14],
    allowableChordTypes: ['maj7', 'm7', '7'],
    voiceCount: 4,
    registerMin: 48,
    registerMax: 72,
  },
  {
    id: 'quartal',
    intervalStructure: [0, 5, 10],
    allowableChordTypes: ['maj7', 'm7', '7'],
    voiceCount: 3,
    registerMin: 48,
    registerMax: 72,
  },
  {
    id: 'guideTone',
    intervalStructure: [0, 7],
    allowableChordTypes: ['maj7', 'm7', '7'],
    voiceCount: 2,
    registerMin: 55,
    registerMax: 72,
  },
];
