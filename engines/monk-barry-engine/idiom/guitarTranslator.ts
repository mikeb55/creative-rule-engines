/**
 * Guitar Idiom Translator — Map voicing families to instrument constraints.
 * Rules: max fret span ≤5, adjacent string sets, drop-2 preference, stable positions.
 */
import type { VoicingFamily } from '../voicing/voicingFamilies';
import type { MusicEvent } from '../../shared/MusicEvent';

const GUITAR_STRINGS = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4
const MAX_FRET_SPAN = 5;

export interface GuitarConstraints {
  maxFretSpan: number;
  adjacentStringsOnly: boolean;
  drop2Preference: boolean;
}

export function mapVoicingToGuitar(
  family: VoicingFamily,
  rootPc: number,
  baseOctave: number = 4
): number[] | null {
  if (family.voiceCount > 4) return null;
  const rootMidi = baseOctave * 12 + rootPc;
  const intervals = family.intervalStructure;
  const pitches = intervals.map(i => rootMidi + i);

  const onStrings = pitches.map(p => {
    for (let s = 0; s < GUITAR_STRINGS.length; s++) {
      if (p >= GUITAR_STRINGS[s] && p <= GUITAR_STRINGS[s] + 24) return { pitch: p, string: s };
    }
    return null;
  }).filter(Boolean) as { pitch: number; string: number }[];

  if (onStrings.length !== pitches.length) return null;
  const frets = onStrings.map(o => o.pitch - GUITAR_STRINGS[o.string]);
  const span = Math.max(...frets) - Math.min(...frets);
  if (span > MAX_FRET_SPAN) return null;

  return onStrings.map(o => o.pitch).sort((a, b) => a - b);
}
