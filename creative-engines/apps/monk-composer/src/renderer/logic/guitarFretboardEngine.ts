/**
 * Guitar Fretboard Engine — Map harmonic targets to fretboard positions.
 * Enforces playable stretches, adjacent-string grips, rejects impossible voicings.
 */
import type { Chord } from './types';
import {
  VOICING_FAMILIES,
  getFamiliesForChordType,
  stringNumToIndex,
  type VoicingFamily,
  type VoicingFamilyId,
} from './guitarVoicingFamilies';
import { GUITAR_STRINGS } from './fretboardMapper';

const GUITAR_LOW = 40;
const GUITAR_HIGH = 84;
const MAX_FRET_SPAN = 5;
const MAX_SKIPPED_STRINGS = 1;
const MAX_TOP_VOICE_LEAP = 5; // perfect fourth in semitones

const ROOT_SEMITONE: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

function chordRoot(symbol: string): number {
  const m = symbol.match(/^([A-G][#b]?)/);
  return m ? (ROOT_SEMITONE[m[1]] ?? 0) : 0;
}

export function chordQualityFromSymbol(symbol: string): string {
  if (symbol.includes('dim')) return 'dim7';
  if (symbol.includes('maj7')) return 'maj7';
  if (symbol.includes('m7') || symbol.includes('min7')) return 'm7';
  if (symbol.includes('7')) return '7';
  return 'maj7';
}

export interface FretboardVoicingResult {
  pitches: number[];
  family: VoicingFamily;
  rootFret: number;
  familyId: VoicingFamilyId;
}

function fretForPcOnString(stringIdx: number, pc: number, refFret: number): number {
  const openPc = [4, 9, 2, 7, 11, 4][stringIdx];
  let fret = (pc - openPc + 120) % 12;
  const k = Math.round((refFret - fret) / 12);
  fret += 12 * k;
  if (fret < 0) fret += 12;
  return fret;
}

function realizeFamily(
  family: VoicingFamily,
  rootPc: number,
  rootFret: number
): number[] | null {
  const pitches: number[] = [];
  const frets: number[] = [];

  for (let i = 0; i < family.stringSet.length; i++) {
    const strNum = family.stringSet[i];
    const strIdx = stringNumToIndex(strNum);
    const interval = family.intervalStructure[i];
    const pc = (rootPc + interval) % 12;
    const fret = fretForPcOnString(strIdx, pc, rootFret);
    const pitch = GUITAR_STRINGS[strIdx] + fret;
    if (pitch < GUITAR_LOW || pitch > GUITAR_HIGH) return null;
    pitches.push(pitch);
    frets.push(fret);
  }

  const fretSpan = Math.max(...frets) - Math.min(...frets);
  if (fretSpan > family.maxFretSpan || fretSpan > MAX_FRET_SPAN) return null;

  const stringIndices = family.stringSet.map(stringNumToIndex);
  const stringSpan = Math.max(...stringIndices) - Math.min(...stringIndices);
  const skipped = stringSpan - family.stringSet.length + 1;
  if (skipped > MAX_SKIPPED_STRINGS) return null;

  return pitches.sort((a, b) => a - b);
}

/** Reject if top voice leaps more than a perfect fourth from previous */
function topVoiceLeapOk(
  prevTopPitch: number | null,
  nextPitches: number[],
  maxLeap: number = MAX_TOP_VOICE_LEAP
): boolean {
  if (prevTopPitch == null) return true;
  const nextTop = Math.max(...nextPitches);
  return Math.abs(nextTop - prevTopPitch) <= maxLeap;
}

/** Map harmonic target to playable fretboard voicings from voicing families */
export function getVoicingsForChord(
  chord: Chord,
  families: VoicingFamilyId[] = ['shell', 'guideTone', 'triad'],
  minFret = 3,
  maxFret = 12,
  prevTopPitch: number | null = null
): FretboardVoicingResult[] {
  const rootPc = chordRoot(chord.symbol);
  const quality = chordQualityFromSymbol(chord.symbol);
  const result: FretboardVoicingResult[] = [];

  const eligibleFamilies = VOICING_FAMILIES.filter(
    f => families.includes(f.id) && f.allowableChordTypes.includes(quality)
  );

  for (const family of eligibleFamilies) {
    for (let rootFret = minFret; rootFret <= maxFret; rootFret++) {
      const pitches = realizeFamily(family, rootPc, rootFret);
      if (pitches && topVoiceLeapOk(prevTopPitch, pitches)) {
        result.push({ pitches, family, rootFret, familyId: family.id });
      }
    }
  }
  return result;
}
