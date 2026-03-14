/**
 * Monk Guide-Tone Rules — Angular leaps, register shifts.
 *
 * Behavior:
 * - Allow angular leaps between guide tones
 * - Permit sudden register shifts
 * - Allow interrupted motion across phrase boundaries
 * - Maintain harmonic clarity despite rhythmic displacement
 *
 * Reject: motion becomes purely scalar, voice-leading overly smooth
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

export function applyMonkGuideToneRules(opts: GuideToneMotionOptions): GuideTonePair[] {
  const { harmonicTargets, phraseStructure, baseOctave = 4 } = opts;
  const pairs: GuideTonePair[] = [];

  for (let i = 0; i < harmonicTargets.length; i++) {
    const t = harmonicTargets[i];
    const rootPc = t.chord.root;
    const quality = t.chord.quality;
    const t3 = thirdPc(rootPc, quality);
    const t7 = seventhPc(rootPc, quality);

    const useAngularLeap = i > 0 && (i % 3 === 0 || phraseStructure.tensionCurve[t.measure] > 0.7);
    const octaveShift = useAngularLeap ? (Math.random() < 0.5 ? 1 : -1) : 0;

    const upperPc = t7;
    const lowerPc = t3;
    const upperOctave = baseOctave + octaveShift;
    const lowerOctave = baseOctave - 1 + (useAngularLeap && octaveShift < 0 ? -1 : 0);

    pairs.push({
      measure: t.measure,
      beatPosition: t.beatPosition,
      upperVoicePitch: pcToMidi(upperPc, upperOctave),
      lowerVoicePitch: pcToMidi(lowerPc, Math.max(2, lowerOctave)),
      upperRole: 'seventh',
      lowerRole: 'third',
      harmonicTargetIndex: i,
    });
  }

  return pairs;
}
