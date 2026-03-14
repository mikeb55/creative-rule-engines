/**
 * Voicing Optimization Engine — Refines harmonic spacing, guide-tone placement, register logic.
 * Sits between voicing engine and export.
 *
 * Input: HarmonicTargets, GuideToneSkeleton, TextureStateMap, InstrumentType, ChordEvents
 * Output: OptimizedVoicingEvents
 *
 * Global rules:
 * - Guide tones must appear in upper voices when possible
 * - Voice-leading distance between chords minimized
 * - Register jumps > octave discouraged
 * - Avoid stacked seconds unless Monk engine allows
 * - Avoid parallel fifth/octave chains when unintended
 *
 * Reject voicings where:
 * - Guide tones disappear
 * - Chord density exceeds texture state
 * - Register instability appears
 */
import type { HarmonicTarget } from '../../../engines/shared/HarmonicTarget';
import type { GuideToneSkeleton, GuideTonePair } from './guideToneMotion';
import type { TextureStateMap, TextureState } from './textureStateEngine';
import { getStateAt } from './textureStateEngine';
import { optimizeGuitarVoicing } from './guitarVoicingOptimization';
import { optimizePianoVoicing } from './pianoVoicingOptimization';

export type InstrumentType = 'guitar' | 'piano';

export interface ChordEventInput {
  id: string;
  pitches: number[];
  measure: number;
  beatPosition: number;
  duration: number;
  harmonicTargetIndex: number;
  staff?: number;
  voice?: number;
}

export interface OptimizedVoicingEvent {
  id: string;
  pitches: number[];
  measure: number;
  beatPosition: number;
  duration: number;
  staff?: number;
  voice?: number;
  /** Piano: leftHand/rightHand split; guitar: single array */
  leftHand?: number[];
  rightHand?: number[];
}

export interface VoicingOptimizationInput {
  harmonicTargets: HarmonicTarget[];
  guideToneSkeleton: GuideToneSkeleton;
  textureStateMap: TextureStateMap;
  instrument: InstrumentType;
  chordEvents: ChordEventInput[];
  cadencePoints?: number[];
  engine?: 'barry' | 'monk';
}

export interface VoicingOptimizationResult {
  events: OptimizedVoicingEvent[];
  valid: boolean;
  violations: string[];
}

const MAX_VOICES_SPARSE = 2;
const MAX_VOICES_HARMONY = 4;
const REGISTER_JUMP_THRESHOLD = 12;

/**
 * Get max chord density allowed by texture state.
 */
function getMaxDensity(state: TextureState): number {
  if (state === 'SPARSE' || state === 'SILENCE') return MAX_VOICES_SPARSE;
  if (state === 'MELODY_ONLY') return 0;
  return MAX_VOICES_HARMONY;
}

/**
 * Find guide-tone pair for a chord position (measure, beat).
 */
function findGuideTonePair(
  skeleton: GuideToneSkeleton,
  measure: number,
  beatPosition: number,
  harmonicTargetIndex: number
): GuideTonePair | undefined {
  const beat = Math.floor(beatPosition);
  return skeleton.pairs.find(
    p =>
      p.measure === measure &&
      Math.floor(p.beatPosition) === beat &&
      p.harmonicTargetIndex === harmonicTargetIndex
  ) ?? skeleton.pairs.find(
    p => p.measure === measure && p.harmonicTargetIndex === harmonicTargetIndex
  );
}

/**
 * Check if position is phrase boundary (cadence point).
 */
function isPhraseBoundary(measure: number, beatPosition: number, cadencePoints: number[]): boolean {
  const pos = measure * 4 + beatPosition;
  return cadencePoints.some(cp => Math.abs(cp - pos) < 1);
}

/**
 * Detect parallel fifths/octaves (simplified).
 */
function hasParallelFifthOctave(prev: number[], curr: number[]): boolean {
  if (prev.length < 2 || curr.length < 2) return false;
  const prevSorted = [...prev].sort((a, b) => a - b);
  const currSorted = [...curr].sort((a, b) => a - b);
  for (let i = 0; i < prevSorted.length - 1; i++) {
    const d1 = (prevSorted[i + 1] - prevSorted[i]) % 12;
    for (let j = 0; j < currSorted.length - 1; j++) {
      const d2 = (currSorted[j + 1] - currSorted[j]) % 12;
      if ((d1 === 7 || d1 === 5) && d1 === d2) return true;
      if (d1 === 0 && d2 === 0) return true;
    }
  }
  return false;
}

/**
 * Check if guide tones are present in voicing.
 */
function hasGuideTones(pitches: number[], pair?: GuideTonePair): boolean {
  if (!pair) return true;
  const upperPc = pair.upperVoicePitch % 12;
  const lowerPc = pair.lowerVoicePitch % 12;
  return pitches.some(p => (p % 12) === upperPc || (p % 12) === lowerPc);
}

/**
 * Check for excessive register jump.
 */
function hasRegisterJump(prev: number[], curr: number[]): boolean {
  if (prev.length === 0 || curr.length === 0) return false;
  const prevTop = Math.max(...prev);
  const currTop = Math.max(...curr);
  return Math.abs(currTop - prevTop) > REGISTER_JUMP_THRESHOLD;
}

/**
 * Main voicing optimization.
 */
export function optimizeVoicings(input: VoicingOptimizationInput): VoicingOptimizationResult {
  const {
    harmonicTargets,
    guideToneSkeleton,
    textureStateMap,
    instrument,
    chordEvents,
    cadencePoints = [],
    engine = 'barry',
  } = input;

  const violations: string[] = [];
  const events: OptimizedVoicingEvent[] = [];
  let prevPitches: number[] = [];
  let prevLeftHand: number[] | undefined;
  let prevRightHand: number[] | undefined;

  for (const ce of chordEvents) {
    const h = harmonicTargets[ce.harmonicTargetIndex];
    if (!h) {
      events.push({
        id: ce.id,
        pitches: ce.pitches,
        measure: ce.measure,
        beatPosition: ce.beatPosition,
        duration: ce.duration,
        staff: ce.staff,
        voice: ce.voice,
      });
      continue;
    }

    const state = getStateAt(textureStateMap, ce.measure, Math.floor(ce.beatPosition));
    const maxDensity = getMaxDensity(state);
    if (maxDensity === 0) continue;

    const guideTonePair = findGuideTonePair(
      guideToneSkeleton,
      ce.measure,
      ce.beatPosition,
      ce.harmonicTargetIndex
    );
    const phraseBoundary = isPhraseBoundary(ce.measure, ce.beatPosition, cadencePoints);

    let optimizedPitches: number[];
    let leftHand: number[] | undefined;
    let rightHand: number[] | undefined;

    if (instrument === 'guitar') {
      const result = optimizeGuitarVoicing({
        measure: ce.measure,
        beatPosition: ce.beatPosition,
        rootPc: h.chord.root,
        chordQuality: h.chord.quality,
        currentPitches: ce.pitches,
        guideTonePair,
        prevPitches,
        isPhraseBoundary: phraseBoundary,
        textureState: state,
      });
      optimizedPitches = result.pitches;
      violations.push(...result.violations);
    } else {
      const lh = ce.pitches.filter(p => p <= 60);
      const rh = ce.pitches.filter(p => p > 60);
      if (lh.length === 0 && rh.length > 0) {
        lh.push(ce.pitches[0]);
        rh.shift();
      }
      const result = optimizePianoVoicing({
        measure: ce.measure,
        beatPosition: ce.beatPosition,
        rootPc: h.chord.root,
        chordQuality: h.chord.quality,
        leftHand: lh,
        rightHand: rh,
        guideTonePair,
        prevLeftHand,
        prevRightHand,
        textureState: state,
      });
      leftHand = result.leftHand;
      rightHand = result.rightHand;
      optimizedPitches = [...result.leftHand, ...result.rightHand].sort((a, b) => a - b);
      violations.push(...result.violations);
      prevLeftHand = result.leftHand;
      prevRightHand = result.rightHand;
    }

    if (optimizedPitches.length > maxDensity) {
      optimizedPitches = optimizedPitches.slice(0, maxDensity);
      violations.push('chord density exceeds texture state');
    }

    if (!hasGuideTones(optimizedPitches, guideTonePair)) {
      violations.push('guide tones disappear');
    }

    if (hasRegisterJump(prevPitches, optimizedPitches) && !phraseBoundary) {
      violations.push('register instability');
    }

    if (hasParallelFifthOctave(prevPitches, optimizedPitches) && engine === 'barry') {
      violations.push('parallel fifth/octave');
    }

    prevPitches = optimizedPitches;

    events.push({
      id: ce.id,
      pitches: optimizedPitches,
      measure: ce.measure,
      beatPosition: ce.beatPosition,
      duration: ce.duration,
      staff: ce.staff,
      voice: ce.voice,
      leftHand,
      rightHand,
    });
  }

  return {
    events,
    valid: violations.length === 0,
    violations: [...new Set(violations)],
  };
}
