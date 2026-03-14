/**
 * Orchestration Layer — Assemble events for guitar, piano, small ensemble.
 * Big band can be added later.
 */
import type { MusicEvent } from '../../shared/MusicEvent';

export type OrchestrationTarget = 'guitar' | 'piano' | 'small_ensemble';

export interface OrchestrationResult {
  target: OrchestrationTarget;
  events: MusicEvent[];
}

export function orchestrate(
  events: MusicEvent[],
  target: OrchestrationTarget
): OrchestrationResult {
  const filtered = events.filter(e => e.role !== 'REST' || e.pitches.length > 0);
  return {
    target,
    events: filtered,
  };
}
