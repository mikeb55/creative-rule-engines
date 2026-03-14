/**
 * Big Band Template — Normalized structural scaffold for big band MusicXML.
 * Part order, names, transpositions from Beatrice/Bora-style layout.
 * Use as blank scaffold only; no pitched/rhythmic content from source.
 */
export interface BigBandPartDef {
  id: string;
  name: string;
  transposition: number; // semitones: Bb = -2, Eb = -9, etc.
  clef: 'treble' | 'bass';
}

export const BIG_BAND_TEMPLATE: BigBandPartDef[] = [
  { id: 'P1', name: 'Trumpet 1', transposition: -2, clef: 'treble' },
  { id: 'P2', name: 'Alto Sax 1', transposition: -9, clef: 'treble' },
  { id: 'P3', name: 'Tenor Sax 1', transposition: -14, clef: 'treble' },
  { id: 'P4', name: 'Trombone 1', transposition: 0, clef: 'bass' },
  { id: 'P5', name: 'Piano', transposition: 0, clef: 'treble' },
  { id: 'P6', name: 'Bass', transposition: 0, clef: 'bass' },
];

export function getBigBandPartList(): string {
  return BIG_BAND_TEMPLATE.map(p => `<score-part id="${p.id}"><part-name>${escapeXml(p.name)}</part-name></score-part>`).join('');
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
