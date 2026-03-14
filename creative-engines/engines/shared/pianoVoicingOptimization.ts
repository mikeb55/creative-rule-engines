/**
 * Piano Voicing Optimization — Instrument-specific rules for piano.
 * Rules: LH shells/guide tones/sparse bass; RH melody or upper harmony; avoid dense chords in both hands.
 */
import type { GuideTonePair } from './guideToneMotion';

const LH_REGISTER_MAX = 60;
const RH_REGISTER_MIN = 60;
const MAX_LH_VOICES = 3;
const MAX_RH_VOICES = 4;

export interface PianoVoicingContext {
  measure: number;
  beatPosition: number;
  rootPc: number;
  chordQuality: string;
  leftHand: number[];
  rightHand: number[];
  guideTonePair?: GuideTonePair;
  prevLeftHand?: number[];
  prevRightHand?: number[];
  textureState: string;
}

export interface PianoVoicingResult {
  leftHand: number[];
  rightHand: number[];
  valid: boolean;
  violations: string[];
}

/**
 * LH: shells, guide tones, sparse bass. Max 3 voices.
 */
export function enforceLHShellSparse(leftHand: number[]): boolean {
  return leftHand.length <= MAX_LH_VOICES && leftHand.every(p => p <= LH_REGISTER_MAX);
}

/**
 * RH: melody or upper harmony. Max 4 voices.
 */
export function enforceRHUpperHarmony(rightHand: number[]): boolean {
  return rightHand.length <= MAX_RH_VOICES && rightHand.every(p => p >= RH_REGISTER_MIN - 12);
}

/**
 * Avoid both hands stacking dense chords simultaneously.
 */
export function avoidDenseBothHands(leftHand: number[], rightHand: number[]): boolean {
  const lhDense = leftHand.length >= 3;
  const rhDense = rightHand.length >= 3;
  return !(lhDense && rhDense);
}

/**
 * Enforce smooth voice-leading between chord changes.
 */
export function voiceLeadingDistance(
  curr: number[],
  prev: number[] | undefined
): number {
  if (!prev || prev.length === 0) return 0;
  let total = 0;
  const used = new Set<number>();
  for (const c of curr) {
    let minDist = 999;
    for (const p of prev) {
      if (used.has(p)) continue;
      const d = Math.abs(c - p);
      if (d < minDist) minDist = d;
    }
    total += minDist;
  }
  return total;
}

/**
 * Optimize piano voicing for a single chord.
 */
export function optimizePianoVoicing(ctx: PianoVoicingContext): PianoVoicingResult {
  const violations: string[] = [];
  let leftHand = [...ctx.leftHand].sort((a, b) => a - b);
  let rightHand = [...ctx.rightHand].sort((a, b) => a - b);

  if (!enforceLHShellSparse(leftHand)) {
    violations.push('LH exceeds shell/sparse limit');
    if (leftHand.length > MAX_LH_VOICES) {
      leftHand = leftHand.slice(0, MAX_LH_VOICES);
    }
    leftHand = leftHand.filter(p => p <= LH_REGISTER_MAX);
  }

  if (!enforceRHUpperHarmony(rightHand)) {
    violations.push('RH below register');
    rightHand = rightHand.filter(p => p >= RH_REGISTER_MIN - 12);
    if (rightHand.length === 0 && leftHand.length > 0) {
      const highest = Math.max(...leftHand);
      rightHand = [highest + 7];
    }
  }

  if (!avoidDenseBothHands(leftHand, rightHand)) {
    violations.push('both hands too dense');
    if (leftHand.length >= 3) {
      leftHand = leftHand.slice(0, 2);
    }
  }

  if (ctx.guideTonePair) {
    const upper = ctx.guideTonePair.upperVoicePitch;
    const inRH = rightHand.some(p => p % 12 === upper % 12);
    const inLH = leftHand.some(p => p % 12 === upper % 12);
    if (!inRH && !inLH) {
      violations.push('guide-tone missing');
      if (rightHand.length > 0) {
        const idx = rightHand.findIndex(p => Math.abs((p % 12) - (upper % 12)) <= 2);
        if (idx >= 0) {
          rightHand[idx] = upper;
        } else {
          rightHand.push(upper);
          rightHand.sort((a, b) => a - b);
          if (rightHand.length > MAX_RH_VOICES) rightHand.pop();
        }
      }
    }
  }

  const dist = voiceLeadingDistance(
    [...leftHand, ...rightHand],
    ctx.prevLeftHand && ctx.prevRightHand
      ? [...ctx.prevLeftHand, ...ctx.prevRightHand]
      : undefined
  );
  if (dist > 24 && (ctx.prevLeftHand?.length ?? 0) > 0) {
    violations.push('excessive voice-leading jump');
  }

  return {
    leftHand,
    rightHand,
    valid: violations.length === 0,
    violations,
  };
}
