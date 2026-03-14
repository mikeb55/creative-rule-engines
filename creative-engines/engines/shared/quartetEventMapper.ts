/**
 * Quartet Event Mapper — Maps pipeline events to quartet parts using QuartetRoleMap.
 * Distributes melody, counterline, harmony to Violin1, Violin2, Viola, Cello.
 */
import type { QuartetRoleMap, QuartetRoleAssignment } from './quartetRoleEngine';
import type { QuartetRole } from './quartetTextureRules';
import { getRoleAt } from './quartetRoleEngine';

export type QuartetPart = 'violin1' | 'violin2' | 'viola' | 'cello';

export interface QuartetPartEvent {
  part: QuartetPart;
  pitch: number;
  measure: number;
  beatPosition: number;
  duration: number;
  role: QuartetRole;
  articulation?: string;
}

export interface RawPipelineEvent {
  role: 'MELODY' | 'CHORD' | 'COUNTERLINE';
  pitches: number[];
  measure: number;
  beatPosition: number;
  duration: number;
  articulation?: string;
}

/**
 * Find instrument with given role at bar/beat.
 */
function findInstrumentWithRole(
  assignment: QuartetRoleAssignment,
  role: QuartetRole
): QuartetPart | undefined {
  if (assignment.violin1Role === role) return 'violin1';
  if (assignment.violin2Role === role) return 'violin2';
  if (assignment.violaRole === role) return 'viola';
  if (assignment.celloRole === role) return 'cello';
  return undefined;
}

/**
 * Map pipeline events to quartet part events.
 */
export function mapEventsToQuartet(
  events: RawPipelineEvent[],
  roleMap: QuartetRoleMap,
  bars: number
): QuartetPartEvent[] {
  const result: QuartetPartEvent[] = [];

  for (const e of events) {
    const assignment = getRoleAt(roleMap, e.measure, Math.floor(e.beatPosition));
    if (!assignment) continue;

    if (e.role === 'MELODY' && e.pitches.length > 0) {
      const part = findInstrumentWithRole(assignment, 'melody') ?? 'violin1';
      result.push({
        part,
        pitch: e.pitches[0],
        measure: e.measure,
        beatPosition: e.beatPosition,
        duration: e.duration,
        role: 'melody',
        articulation: e.articulation,
      });
    } else if (e.role === 'COUNTERLINE' && e.pitches.length > 0) {
      const part = findInstrumentWithRole(assignment, 'counterline') ?? 'violin2';
      result.push({
        part,
        pitch: e.pitches[0],
        measure: e.measure,
        beatPosition: e.beatPosition,
        duration: e.duration,
        role: 'counterline',
        articulation: e.articulation,
      });
    } else if (e.role === 'CHORD' && e.pitches.length > 0) {
      const sorted = [...e.pitches].sort((a, b) => a - b);
      const root = sorted[0];
      const upper = sorted.slice(1);

      const bassPart = findInstrumentWithRole(assignment, 'bass');
      if (bassPart) {
        result.push({
          part: bassPart,
          pitch: root,
          measure: e.measure,
          beatPosition: e.beatPosition,
          duration: e.duration,
          role: 'bass',
        });
      }

      const supportPart = findInstrumentWithRole(assignment, 'harmonic_support') ??
        findInstrumentWithRole(assignment, 'inner_motion');
      if (supportPart && upper.length > 0) {
        result.push({
          part: supportPart,
          pitch: upper[0],
          measure: e.measure,
          beatPosition: e.beatPosition,
          duration: e.duration,
          role: 'harmonic_support',
        });
      }
    }
  }

  return result;
}

/**
 * Fill rests for parts that have no events in a bar.
 */
export function fillQuartetRests(
  partEvents: QuartetPartEvent[],
  bars: number
): QuartetPartEvent[] {
  const parts: QuartetPart[] = ['violin1', 'violin2', 'viola', 'cello'];
  const result: QuartetPartEvent[] = [];

  for (let m = 0; m < bars; m++) {
    for (const part of parts) {
      const hasEvent = partEvents.some(
        e => e.part === part && e.measure === m
      );
      if (!hasEvent) {
        result.push({
          part,
          pitch: 0,
          measure: m,
          beatPosition: 0,
          duration: 4,
          role: 'rest',
        });
      }
    }
  }

  return [...partEvents, ...result];
}
