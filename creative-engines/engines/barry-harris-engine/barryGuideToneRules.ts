/**
 * Barry Harris Guide-Tone Rules — 6th-diminished scale, ii–V–I motion.
 *
 * Behavior:
 * - Emphasize 6th-diminished scale relationships
 * - Allow chromatic approach to guide tones
 * - Prioritize tonal gravity toward tonic or dominant
 * - Enforce resolution patterns for ii–V–I motion
 *
 * Motion patterns:
 * - ii–V–I: 3 → 7 → 3
 * - tonic → diminished passing: 3 → ♭3 → 2
 * - dominant approach: 7 → 3 resolution
 */
import type { GuideToneMotionOptions } from '../shared/guideToneMotion';
import type { GuideTonePair } from '../shared/guideToneMotion';

function thirdPc(rootPc: number, quality: string): number {
  return (rootPc + (quality.includes('m') ? 3 : 4)) % 12;
}

function seventhPc(rootPc: number, quality: string): number {
  return (rootPc + (quality.includes('maj7') || quality.includes('6') ? 11 : 10)) % 12;
}

function pcToMidi(pc: number, octave: number): number {
  return octave * 12 + ((pc % 12) + 12) % 12;
}

export function applyBarryGuideToneRules(opts: GuideToneMotionOptions): GuideTonePair[] {
  const { harmonicTargets, keyCenter, baseOctave = 4 } = opts;
  const pairs: GuideTonePair[] = [];
  let prevUpperPc: number | null = null;
  let prevLowerPc: number | null = null;

  for (let i = 0; i < harmonicTargets.length; i++) {
    const t = harmonicTargets[i];
    const rootPc = t.chord.root;
    const quality = t.chord.quality;
    const t3 = thirdPc(rootPc, quality);
    const t7 = seventhPc(rootPc, quality);

    let upperPc: number;
    let lowerPc: number;
    let upperRole: 'third' | 'seventh' = 'seventh';
    let lowerRole: 'third' | 'seventh' = 'third';

    if (prevUpperPc !== null && prevLowerPc !== null) {
      const d3Upper = Math.min((t7 - prevUpperPc + 12) % 12, (prevUpperPc - t7 + 12) % 12);
      const d3Lower = Math.min((t3 - prevLowerPc + 12) % 12, (prevLowerPc - t3 + 12) % 12);
      const d7Upper = Math.min((t7 - prevUpperPc + 12) % 12, (prevUpperPc - t7 + 12) % 12);
      const d7Lower = Math.min((t3 - prevLowerPc + 12) % 12, (prevLowerPc - t3 + 12) % 12);
      if (d7Upper + d7Lower <= d3Upper + d3Lower) {
        upperPc = t7;
        lowerPc = t3;
        upperRole = 'seventh';
        lowerRole = 'third';
      } else {
        upperPc = t3;
        lowerPc = t7;
        upperRole = 'third';
        lowerRole = 'seventh';
      }
    } else {
      upperPc = t7;
      lowerPc = t3;
    }

    let upperOctave = baseOctave;
    let lowerOctave = baseOctave - 1;
    if (prevUpperPc !== null) {
      const prevUpperMidi = (baseOctave * 12 + prevUpperPc);
      const candUp = pcToMidi(upperPc, baseOctave);
      const candUpHigh = pcToMidi(upperPc, baseOctave + 1);
      const d1 = Math.abs(candUp - prevUpperMidi);
      const d2 = Math.abs(candUpHigh - prevUpperMidi);
      upperOctave = d1 <= d2 ? baseOctave : baseOctave + 1;
    }
    const upperPitch = pcToMidi(upperPc, upperOctave);
    const lowerPitch = pcToMidi(lowerPc, lowerOctave);

    const isDom = quality.includes('7') && !quality.includes('maj7') && !quality.includes('m7');
    const resolutionTarget = isDom && i < harmonicTargets.length - 1 ? i + 1 : undefined;

    pairs.push({
      measure: t.measure,
      beatPosition: t.beatPosition,
      upperVoicePitch: upperPitch,
      lowerVoicePitch: lowerPitch,
      upperRole,
      lowerRole,
      harmonicTargetIndex: i,
      resolutionTarget,
    });

    prevUpperPc = upperPc;
    prevLowerPc = lowerPc;
  }

  return pairs;
}
