/**
 * Guitar Voicing Optimization — Instrument-specific rules for guitar.
 * Rules: stable fretboard region, shell/dyad/triad preference, guide-tone continuity in top voice.
 */
import type { GuideTonePair } from './guideToneMotion';

const GUITAR_STRINGS = [40, 45, 50, 55, 59, 64];
const MAX_FRET_SPAN = 5;
const MAX_FRET_JUMP_PHRASE_BOUNDARY = 7;

export interface GuitarVoicingContext {
  measure: number;
  beatPosition: number;
  rootPc: number;
  chordQuality: string;
  currentPitches: number[];
  guideTonePair?: GuideTonePair;
  prevPitches?: number[];
  isPhraseBoundary?: boolean;
  textureState: string;
}

export interface GuitarVoicingResult {
  pitches: number[];
  valid: boolean;
  violations: string[];
}

/**
 * Prefer shell (root-3rd-7th), dyad, or triad voicings.
 * Avoid piano-style stacked vertical chords (4+ voices in tight register).
 */
export function preferShellDyadTriad(pitches: number[]): boolean {
  if (pitches.length <= 3) return true;
  const span = Math.max(...pitches) - Math.min(...pitches);
  return span >= 12 || pitches.length <= 3;
}

/**
 * Maintain stable fretboard region per phrase.
 * Prevent >5 fret jumps unless at phrase boundary.
 */
export function checkFretboardStability(
  currentPitches: number[],
  prevPitches: number[] | undefined,
  isPhraseBoundary: boolean
): { valid: boolean; violation?: string } {
  if (!prevPitches || prevPitches.length === 0) return { valid: true };
  const currMin = Math.min(...currentPitches.map(p => p - 40)); // approximate fret
  const prevMin = Math.min(...prevPitches.map(p => p - 40));
  const jump = Math.abs(currMin - prevMin);
  const maxJump = isPhraseBoundary ? MAX_FRET_JUMP_PHRASE_BOUNDARY : MAX_FRET_SPAN;
  if (jump > maxJump) {
    return { valid: false, violation: `fretboard jump ${jump} exceeds ${maxJump}` };
  }
  return { valid: true };
}

/**
 * Preserve guide-tone continuity in top voice.
 */
export function hasGuideToneInTopVoice(pitches: number[], guideTonePair?: GuideTonePair): boolean {
  if (!guideTonePair) return true;
  const topPitch = Math.max(...pitches);
  const upperPc = guideTonePair.upperVoicePitch % 12;
  const lowerPc = guideTonePair.lowerVoicePitch % 12;
  const topPc = topPitch % 12;
  return topPc === upperPc || topPc === lowerPc;
}

/**
 * Optimize guitar voicing for a single chord.
 */
export function optimizeGuitarVoicing(ctx: GuitarVoicingContext): GuitarVoicingResult {
  const violations: string[] = [];
  let pitches = [...ctx.currentPitches].sort((a, b) => a - b);

  if (!preferShellDyadTriad(pitches)) {
    violations.push('avoid piano-style stacked chords');
    if (pitches.length > 3) {
      pitches = pitches.slice(0, 3);
    }
  }

  const stability = checkFretboardStability(
    pitches,
    ctx.prevPitches,
    ctx.isPhraseBoundary ?? false
  );
  if (!stability.valid && stability.violation) {
    violations.push(stability.violation);
  }

  if (!hasGuideToneInTopVoice(pitches, ctx.guideTonePair)) {
    violations.push('guide-tone missing in top voice');
    if (ctx.guideTonePair) {
      const upper = ctx.guideTonePair.upperVoicePitch;
      const inRange = pitches.some(p => Math.abs(p - upper) <= 12);
      if (inRange) {
        const nearest = pitches.reduce((best, p) =>
          Math.abs(p - upper) < Math.abs(best - upper) ? p : best
        );
        const idx = pitches.indexOf(nearest);
        const replacement = upper;
        if (replacement >= 55 && replacement <= 76) {
          pitches[idx] = replacement;
          pitches.sort((a, b) => a - b);
        }
      }
    }
  }

  const span = pitches.length > 0 ? Math.max(...pitches) - Math.min(...pitches) : 0;
  if (span > 24) {
    violations.push('register span too wide');
  }

  return {
    pitches,
    valid: violations.length === 0,
    violations,
  };
}
