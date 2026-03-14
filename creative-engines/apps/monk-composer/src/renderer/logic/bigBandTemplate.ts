/**
 * Big Band Template — Reduced 6-staff sketch template.
 * Hierarchical generation only; no independent melodic streams.
 */
export interface BigBandPartDef {
  id: string;
  name: string;
  transposition: number;
  clef: 'treble' | 'bass';
  staves?: number;
}

/** Reduced 6-part sketch template — exact names per spec */
export const BIG_BAND_TEMPLATE: BigBandPartDef[] = [
  { id: 'P1', name: 'Trumpet', transposition: -2, clef: 'treble' },
  { id: 'P2', name: 'Alto Sax', transposition: -9, clef: 'treble' },
  { id: 'P3', name: 'Tenor Sax', transposition: -14, clef: 'treble' },
  { id: 'P4', name: 'Trombone', transposition: 0, clef: 'bass' },
  { id: 'P5', name: 'Piano', transposition: 0, clef: 'treble', staves: 2 },
  { id: 'P6', name: 'Bass', transposition: 0, clef: 'bass' },
];

export type SectionRole =
  | 'punctuation'
  | 'melody'
  | 'counterline'
  | 'pad'
  | 'comping'
  | 'bass';

export const PART_ROLES: SectionRole[] = [
  'punctuation',   // Trumpet
  'melody',        // Alto Sax
  'counterline',   // Tenor Sax
  'pad',           // Trombone
  'comping',       // Piano
  'bass',          // Bass
];
