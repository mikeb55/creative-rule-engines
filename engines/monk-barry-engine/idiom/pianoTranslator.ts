/**
 * Piano Idiom Translator — Map voicing families to piano constraints.
 * Rules: LH shells, RH color tones, independence between hands.
 */
import type { VoicingFamily } from '../voicing/voicingFamilies';

const LH_REGISTER_MAX = 60;
const RH_REGISTER_MIN = 60;

export interface PianoHandAssignment {
  leftHand: number[];
  rightHand: number[];
}

export function mapVoicingToPiano(
  family: VoicingFamily,
  rootPc: number,
  baseOctave: number = 4
): PianoHandAssignment | null {
  const rootMidi = baseOctave * 12 + rootPc;
  const intervals = family.intervalStructure;
  const allPitches = intervals.map(i => rootMidi + i).sort((a, b) => a - b);

  const leftHand: number[] = [];
  const rightHand: number[] = [];

  for (const p of allPitches) {
    if (p <= LH_REGISTER_MAX) leftHand.push(p);
    else rightHand.push(p);
  }

  if (leftHand.length === 0 && rightHand.length > 0) {
    leftHand.push(allPitches[0]);
    rightHand.shift();
  }

  return { leftHand, rightHand };
}
