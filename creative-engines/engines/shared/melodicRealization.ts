/**
 * Melodic Realization Engine — Generates melodic events from harmony and rhythm.
 * Sits between rhythmic grammar and instrument idiom.
 *
 * Input: HarmonicTargets, PhraseStructure, RhythmicEventGrid
 * Output: MelodicEvents
 */
import type { PhraseStructure } from './phraseArchitecture';
import type { HarmonicTarget } from '../../../engines/shared/HarmonicTarget';
import type { RhythmicEventGrid } from './rhythmGrammar';
import type { GuideToneSkeleton } from './guideToneMotion';

export type MelodicRole = 'guideTone' | 'enclosure' | 'chordTone' | 'passingTone';

export interface MelodicEvent {
  pitch: number;
  measure: number;
  beatPosition: number;
  duration: number;
  articulation?: string;
  role: MelodicRole;
  harmonicTargetIndex?: number;
}

export type EngineMelodicStyle = 'barry' | 'monk';

export interface MelodicRealizationOptions {
  phraseStructure: PhraseStructure;
  harmonicTargets: HarmonicTarget[];
  rhythmicGrid: RhythmicEventGrid;
  engine: EngineMelodicStyle;
  keyCenter: number;
  bars: number;
  guideToneSkeleton?: GuideToneSkeleton;
}

/**
 * Build melodic events from harmonic targets and rhythmic grid.
 * Delegates to engine-specific rules.
 */
export function buildMelodicEvents(
  options: MelodicRealizationOptions,
  applyEngineRules: (opts: MelodicRealizationOptions) => MelodicEvent[]
): MelodicEvent[] {
  return applyEngineRules(options);
}

/**
 * Check if melodic events follow harmonic direction (target chord tones).
 */
export function melodyFollowsHarmony(
  events: MelodicEvent[],
  targets: HarmonicTarget[],
  keyCenter: number
): boolean {
  if (events.length === 0 || targets.length === 0) return true;
  const chordToneOrGuide = events.filter(e =>
    e.role === 'chordTone' || e.role === 'guideTone'
  ).length;
  return chordToneOrGuide >= events.length * 0.4;
}

/**
 * Check if melody has sufficient guide-tone targeting (Barry).
 */
export function hasGuideToneTargeting(events: MelodicEvent[]): boolean {
  return events.some(e => e.role === 'guideTone');
}

/**
 * Check if melody has rhythmic interruption (Monk).
 */
export function hasRhythmicInterruption(
  events: MelodicEvent[],
  grid: RhythmicEventGrid
): boolean {
  const restCount = grid.events.filter(e => e.eventType === 'rest').length;
  const stabCount = grid.events.filter(e => e.eventType === 'stab').length;
  return restCount > 0 || stabCount >= 2;
}
