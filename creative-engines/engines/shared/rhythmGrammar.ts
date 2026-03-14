/**
 * Rhythmic Grammar Engine — Converts phrase structure into rhythmic behavior.
 * Sits between phrase architecture and melodic realization.
 *
 * Input: PhraseStructure, HarmonicTargets
 * Output: RhythmicEventGrid
 */
import type { PhraseStructure } from './phraseArchitecture';
import type { HarmonicTarget } from '../../../engines/shared/HarmonicTarget';

export type RhythmicEventType = 'chord' | 'stab' | 'rest' | 'pickup' | 'line';

export interface RhythmicEvent {
  measure: number;
  beatPosition: number;
  duration: number;
  eventType: RhythmicEventType;
  /** Optional link to harmonic target index */
  harmonicTargetIndex?: number;
}

export interface RhythmicEventGrid {
  events: RhythmicEvent[];
  phraseLength: number;
  bars: number;
}

export type EngineRhythmStyle = 'barry' | 'monk';

export interface RhythmGrammarOptions {
  phraseStructure: PhraseStructure;
  harmonicTargets: HarmonicTarget[];
  engine: EngineRhythmStyle;
  bars: number;
}

/**
 * Build rhythmic event grid from phrase structure and harmonic targets.
 * Delegates to engine-specific rules (barryRhythmRules / monkRhythmRules).
 */
export function buildRhythmicEventGrid(
  options: RhythmGrammarOptions,
  applyEngineRules: (opts: RhythmGrammarOptions) => RhythmicEvent[]
): RhythmicEventGrid {
  const { phraseStructure, bars } = options;
  const events = applyEngineRules(options);
  return {
    events,
    phraseLength: phraseStructure.phraseLength,
    bars,
  };
}

/**
 * Check if rhythmic grid has sufficient diversity (rejects uniform density).
 */
export function hasRhythmicDiversity(grid: RhythmicEventGrid): boolean {
  if (grid.events.length < 3) return false;
  const types = grid.events.map(e => e.eventType);
  const typeCount = new Map<RhythmicEventType, number>();
  for (const t of types) {
    typeCount.set(t, (typeCount.get(t) ?? 0) + 1);
  }
  if (typeCount.size < 2) return false;
  const beatPositions = grid.events.map(e => Math.floor(e.beatPosition * 2) / 2);
  const uniqueBeats = new Set(beatPositions);
  return uniqueBeats.size >= 3;
}

/**
 * Check if grid contains syncopation (off-beat attacks).
 */
export function hasSyncopation(grid: RhythmicEventGrid): boolean {
  const offBeats = [0.5, 1.5, 2.5, 3.5];
  return grid.events.some(e => offBeats.some(b => Math.abs(e.beatPosition - b) < 0.1));
}
