/**
 * Barry Harris Chord Motion Grammar — Models Barry Harris tonal gravity.
 * Sits between harmony generation and melodic realization.
 *
 * Motion families:
 * 1. tonic → diminished passing
 * 2. tonic → ii → V
 * 3. dominant → tonic
 * 4. dominant → tritone substitute
 * 5. diminished pivot
 * 6. chromatic dominant approach
 * 7. major6 ↔ diminished alternation
 *
 * 6th–diminished system: Major6 → derived diminished → resolution target
 */
import type { HarmonicTarget } from '../../../../engines/shared/HarmonicTarget';

export type MotionFamily =
  | 'tonic_diminished_passing'
  | 'tonic_ii_V'
  | 'dominant_tonic'
  | 'dominant_tritone_sub'
  | 'diminished_pivot'
  | 'chromatic_dominant_approach'
  | 'major6_diminished_alternation';

export interface BarryMotionOptions {
  keyCenter: number;
  targets: HarmonicTarget[];
  motionFamily?: MotionFamily;
}

const MOTION_FAMILIES: MotionFamily[] = [
  'tonic_diminished_passing',
  'tonic_ii_V',
  'dominant_tonic',
  'dominant_tritone_sub',
  'diminished_pivot',
  'chromatic_dominant_approach',
  'major6_diminished_alternation',
];

const TONIC6_QUALITIES = ['maj7', '6'];
const DIM7_ROOT_OFFSETS = [1, 3, 6, 8];
const II_V_ROOTS = [2, 7, 0];
const TRITONE_SUB_OFFSET = 6;

function applyMotionFamily(
  target: HarmonicTarget,
  family: MotionFamily,
  keyCenter: number,
  index: number
): HarmonicTarget {
  const root = target.chord.root;
  const quality = target.chord.quality;

  switch (family) {
    case 'tonic_diminished_passing':
      if (TONIC6_QUALITIES.some(q => quality.includes(q))) {
        const dimRoot = (root + DIM7_ROOT_OFFSETS[index % 4]) % 12;
        return {
          ...target,
          chord: { symbol: `${dimRoot}dim7`, root: dimRoot, quality: 'dim7' },
          enclosure: true,
        };
      }
      break;

    case 'tonic_ii_V':
      if (TONIC6_QUALITIES.some(q => quality.includes(q)) && index % 3 === 1) {
        const iiRoot = (keyCenter + 2) % 12;
        return {
          ...target,
          chord: { symbol: `${iiRoot}m7`, root: iiRoot, quality: 'm7' },
          guideTones: [3, 7],
        };
      }
      if (quality.includes('7') && index % 3 === 2) {
        return { ...target, punctuation: true };
      }
      break;

    case 'dominant_tonic':
      if (quality.includes('7') && index > 0) {
        return {
          ...target,
          chord: { symbol: `${keyCenter}maj7`, root: keyCenter, quality: 'maj7' },
          punctuation: true,
        };
      }
      break;

    case 'dominant_tritone_sub':
      if (quality.includes('7')) {
        const tritoneRoot = (root + TRITONE_SUB_OFFSET) % 12;
        return {
          ...target,
          chord: { symbol: `${tritoneRoot}7`, root: tritoneRoot, quality: '7' },
          guideTones: [3, 7],
        };
      }
      break;

    case 'diminished_pivot':
      if (quality.includes('dim7')) {
        const nextRoot = (root + 3) % 12;
        return {
          ...target,
          chord: { symbol: `${nextRoot}dim7`, root: nextRoot, quality: 'dim7' },
        };
      }
      break;

    case 'chromatic_dominant_approach':
      if (quality.includes('7')) {
        const approachRoot = (root + 11) % 12;
        return {
          ...target,
          chord: { symbol: `${approachRoot}7`, root: approachRoot, quality: '7' },
          enclosure: true,
        };
      }
      break;

    case 'major6_diminished_alternation':
      if (TONIC6_QUALITIES.some(q => quality.includes(q)) && index % 2 === 1) {
        const dimRoot = (root + 1) % 12;
        return {
          ...target,
          chord: { symbol: `${dimRoot}dim7`, root: dimRoot, quality: 'dim7' },
        };
      }
      break;
  }

  return target;
}

export function applyBarryMotionGrammar(options: BarryMotionOptions): HarmonicTarget[] {
  const {
    keyCenter,
    targets,
    motionFamily = MOTION_FAMILIES[Math.floor(Math.random() * MOTION_FAMILIES.length)],
  } = options;

  return targets.map((t, i) => applyMotionFamily(t, motionFamily, keyCenter, i));
}

export function hasDirectionalMotion(targets: HarmonicTarget[]): boolean {
  if (targets.length < 2) return true;
  const roots = targets.map(t => t.chord.root);
  let directionChanges = 0;
  for (let i = 1; i < roots.length; i++) {
    const prev = roots[i - 1];
    const curr = roots[i];
    const motion = (curr - prev + 12) % 12;
    if (motion !== 0 && motion !== 6) directionChanges++;
  }
  return directionChanges >= 1;
}

export function rejectRandomChordChains(targets: HarmonicTarget[]): boolean {
  return !hasDirectionalMotion(targets);
}
