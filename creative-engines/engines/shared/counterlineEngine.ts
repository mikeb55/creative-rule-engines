/**
 * Counterline Engine — Generates a secondary line from motif, phrase structure, harmony, and guide-tone skeleton.
 * Sits between melodic realization and instrument idiom.
 *
 * Input: PhraseStructure, HarmonicTargets, GuideToneSkeleton, MelodicEvents
 * Output: CounterlineEvents
 *
 * Global rules:
 * - derive from motif or guide-tone material
 * - avoid duplicating the main line exactly
 * - support harmonic movement
 * - leave silence when needed
 * - be sparser than the main line by default
 * - enter at structurally meaningful moments
 */
import type { PhraseStructure } from './phraseArchitecture';
import type { HarmonicTarget } from '../../../engines/shared/HarmonicTarget';
import type { GuideToneSkeleton } from './guideToneMotion';
import type { MelodicEvent } from './melodicRealization';

export type RelationshipToMainLine =
  | 'contrary'
  | 'oblique'
  | 'echo'
  | 'answer'
  | 'innerMotion';

export interface CounterlineEvent {
  pitch: number;
  duration: number;
  articulation?: string;
  relationshipToMainLine: RelationshipToMainLine;
  harmonicRole: 'chordTone' | 'guideTone' | 'passing' | 'enclosure';
  bar: number;
  beatPosition: number;
  harmonicTargetIndex?: number;
}

export type EngineCounterlineStyle = 'barry' | 'monk';

export interface CounterlineEngineOptions {
  phraseStructure: PhraseStructure;
  harmonicTargets: HarmonicTarget[];
  guideToneSkeleton?: GuideToneSkeleton;
  melodicEvents: MelodicEvent[];
  engine: EngineCounterlineStyle;
  keyCenter: number;
  bars: number;
}

/**
 * Build counterline events. Delegates to engine-specific rules.
 * Returns sparse counterline (fewer events than main line).
 */
export function buildCounterlineEvents(
  options: CounterlineEngineOptions,
  applyEngineRules: (opts: CounterlineEngineOptions) => CounterlineEvent[]
): CounterlineEvent[] {
  const events = applyEngineRules(options);
  return filterValidCounterline(events, options.melodicEvents);
}

/**
 * Reject counterlines that shadow main line, create constant parallel motion,
 * or become too dense.
 */
function filterValidCounterline(
  events: CounterlineEvent[],
  melodicEvents: MelodicEvent[]
): CounterlineEvent[] {
  const mainPositions = new Set(
    melodicEvents.map(m => `${m.measure}-${Math.floor(m.beatPosition * 2) / 2}`)
  );
  const out: CounterlineEvent[] = [];
  let parallelCount = 0;

  for (const e of events) {
    const pos = `${e.bar}-${Math.floor(e.beatPosition * 2) / 2}`;
    if (mainPositions.has(pos)) {
      parallelCount++;
      if (parallelCount > events.length * 0.5) continue;
    }
    out.push(e);
  }

  if (out.length > melodicEvents.length * 0.8) {
    return out.slice(0, Math.ceil(melodicEvents.length * 0.6));
  }
  return out;
}

/**
 * Check if counterline exists and is rhythmically distinct from main line.
 */
export function hasCounterlineDistinction(
  counterline: CounterlineEvent[],
  melodicEvents: MelodicEvent[]
): boolean {
  if (counterline.length === 0) return false;
  const mainBeats = new Set(melodicEvents.map(m => m.measure * 4 + m.beatPosition));
  const counterBeats = counterline.map(c => c.bar * 4 + c.beatPosition);
  const distinct = counterBeats.filter(b => !mainBeats.has(b)).length;
  return distinct >= Math.min(2, counterline.length);
}

/**
 * Check if counterline respects harmonic targets.
 */
export function counterlineRespectsHarmony(
  counterline: CounterlineEvent[],
  targets: HarmonicTarget[]
): boolean {
  if (counterline.length === 0 || targets.length === 0) return true;
  const chordToneOrGuide = counterline.filter(
    c => c.harmonicRole === 'chordTone' || c.harmonicRole === 'guideTone'
  ).length;
  return chordToneOrGuide >= counterline.length * 0.5;
}
