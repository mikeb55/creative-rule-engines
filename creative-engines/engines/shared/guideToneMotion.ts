/**
 * Guide-Tone Motion Engine — Generates 3rd–7th harmonic skeleton for jazz voice-leading.
 * Sits between phrase architecture and rhythmic grammar.
 *
 * Input: PhraseStructure, HarmonicTargets
 * Output: GuideToneSkeleton
 *
 * Core rules:
 * - Prioritize 3rd–7th motion between adjacent chords
 * - Resolve dominant 7th downward by step
 * - Major-7: upward or hold common tone
 * - Minimize interval leaps (> major third discouraged)
 * - Maintain continuous upper-voice line across phrase
 */
import type { PhraseStructure } from './phraseArchitecture';
import type { HarmonicTarget } from '../../../engines/shared/HarmonicTarget';

export type HarmonicRole = 'third' | 'seventh';

export interface GuideTonePair {
  measure: number;
  beatPosition: number;
  upperVoicePitch: number;
  lowerVoicePitch: number;
  upperRole: HarmonicRole;
  lowerRole: HarmonicRole;
  harmonicTargetIndex: number;
  resolutionTarget?: number;
}

export interface GuideToneSkeleton {
  pairs: GuideTonePair[];
  phraseCadenceTargets: number[];
}

export type EngineGuideToneStyle = 'barry' | 'monk';

export interface GuideToneMotionOptions {
  phraseStructure: PhraseStructure;
  harmonicTargets: HarmonicTarget[];
  engine: EngineGuideToneStyle;
  keyCenter: number;
  baseOctave?: number;
}

/**
 * Build guide-tone skeleton. Delegates to engine-specific rules.
 */
export function buildGuideToneSkeleton(
  options: GuideToneMotionOptions,
  applyEngineRules: (opts: GuideToneMotionOptions) => GuideTonePair[]
): GuideToneSkeleton {
  const { phraseStructure } = options;
  const pairs = applyEngineRules(options);
  const phraseCadenceTargets = phraseStructure.cadencePoints;
  return { pairs, phraseCadenceTargets };
}

/**
 * Check guide-tone continuity (no excessive gaps in upper voice).
 */
export function hasGuideToneContinuity(skeleton: GuideToneSkeleton): boolean {
  if (skeleton.pairs.length < 2) return true;
  const upperPitches = skeleton.pairs.map(p => p.upperVoicePitch);
  for (let i = 1; i < upperPitches.length; i++) {
    const leap = Math.abs(upperPitches[i] - upperPitches[i - 1]);
    if (leap > 12) return false;
  }
  return true;
}

/**
 * Check dominant resolution (V→I present or no dominants).
 */
export function hasDominantResolution(skeleton: GuideToneSkeleton, targets: HarmonicTarget[]): boolean {
  const hasDom = targets.some(t =>
    t.chord.quality.includes('7') && !t.chord.quality.includes('maj7') && !t.chord.quality.includes('m7')
  );
  const hasTonic = targets.some(t => t.chord.quality.includes('maj7') || t.chord.quality.includes('6'));
  if (!hasDom) return true;
  return hasTonic;
}

/**
 * Check for excessive voice-leading leaps (horizontal motion between chords).
 */
export function hasExcessiveLeaps(skeleton: GuideToneSkeleton): boolean {
  if (skeleton.pairs.length < 2) return false;
  for (let i = 1; i < skeleton.pairs.length; i++) {
    const prev = skeleton.pairs[i - 1];
    const curr = skeleton.pairs[i];
    const upperLeap = Math.abs(curr.upperVoicePitch - prev.upperVoicePitch);
    const lowerLeap = Math.abs(curr.lowerVoicePitch - prev.lowerVoicePitch);
    if (upperLeap > 12 || lowerLeap > 12) return true;
  }
  return false;
}

/**
 * Validate skeleton. Returns true if valid.
 */
export function validateGuideToneSkeleton(
  skeleton: GuideToneSkeleton,
  targets: HarmonicTarget[]
): boolean {
  return hasGuideToneContinuity(skeleton) && hasDominantResolution(skeleton, targets) && !hasExcessiveLeaps(skeleton);
}
