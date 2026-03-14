/**
 * Quartet Role Engine — Maps musical layers into quartet roles and texture states.
 * Sits after texture state engine, before rhythm grammar.
 *
 * Input: PhraseStructure, TextureStateMap, HarmonicTargets, GuideToneSkeleton
 * Output: QuartetRoleMap
 *
 * Rules:
 * - Violin 1 is not always the lead
 * - Viola and cello must receive meaningful material
 * - Role assignment follows texture state
 * - Duo / trio / full textures allowed
 * - Phrase boundaries may trigger role changes
 * - Lead rotation every 2–4 bars
 */
import type { PhraseStructure } from './phraseArchitecture';
import type { TextureStateMap, TextureState } from './textureStateEngine';
import type { HarmonicTarget } from '../../../engines/shared/HarmonicTarget';
import type { GuideToneSkeleton } from './guideToneMotion';
import type { QuartetRole } from './quartetTextureRules';
import { getStateAt } from './textureStateEngine';
import { textureToQuartetRealization } from './quartetTextureRules';
import { computeAnchorAssignments, getAnchorAt, type QuartetInstrument } from './quartetAnchorVoice';
import { buildLeadRotationPlan, getLeadAt } from './quartetLeadRotation';
import { detectPhraseBoundaries, isPhraseBoundaryAt } from './quartetPhraseBoundaryRules';

export type QuartetRoleAssignment = {
  bar: number;
  beat: number;
  violin1Role: QuartetRole;
  violin2Role: QuartetRole;
  violaRole: QuartetRole;
  celloRole: QuartetRole;
};

export type QuartetRoleMap = Map<string, QuartetRoleAssignment>;

export type EngineQuartetStyle = 'barry' | 'monk';

export interface QuartetRoleEngineOptions {
  phraseStructure: PhraseStructure;
  textureStateMap: TextureStateMap;
  harmonicTargets: HarmonicTarget[];
  guideToneSkeleton: GuideToneSkeleton;
  engine: EngineQuartetStyle;
  bars: number;
  applyEngineRules?: (
    role: QuartetRole,
    instrument: 'violin1' | 'violin2' | 'viola' | 'cello',
    isPhraseBoundary: boolean
  ) => QuartetRole;
}

function key(bar: number, beat: number): string {
  return `${bar}-${beat}`;
}

/**
 * Assign roles for a texture state, respecting lead and anchor.
 */
function assignRolesForState(
  state: TextureState,
  lead: QuartetInstrument,
  anchor: QuartetInstrument,
  isBoundary: boolean,
  applyEngine: (r: QuartetRole, i: 'violin1' | 'violin2' | 'viola' | 'cello', b: boolean) => QuartetRole
): { violin1Role: QuartetRole; violin2Role: QuartetRole; violaRole: QuartetRole; celloRole: QuartetRole } {
  const real = textureToQuartetRealization(state);
  const instruments: ('violin1' | 'violin2' | 'viola' | 'cello')[] = ['violin1', 'violin2', 'viola', 'cello'];

  const roles: Record<string, QuartetRole> = {
    violin1: 'rest',
    violin2: 'rest',
    viola: 'rest',
    cello: 'rest',
  };

  if (state === 'SILENCE') {
    return {
      violin1Role: applyEngine('rest', 'violin1', isBoundary),
      violin2Role: applyEngine('rest', 'violin2', isBoundary),
      violaRole: applyEngine('rest', 'viola', isBoundary),
      celloRole: applyEngine('rest', 'cello', isBoundary),
    };
  }

  if (state === 'MELODY_ONLY') {
    roles[lead] = 'melody';
  } else if (state === 'MELODY_HARMONY') {
    roles[lead] = 'melody';
    roles['cello'] = 'bass';
    roles['viola'] = 'harmonic_support';
  } else if (state === 'MELODY_COUNTERLINE') {
    roles[lead] = 'melody';
    const counter = lead === 'violin1' ? 'viola' : lead === 'viola' ? 'violin2' : 'viola';
    roles[counter] = 'counterline';
    roles['cello'] = 'bass';
  } else if (state === 'HARMONY_ONLY') {
    roles['cello'] = 'bass';
    roles[anchor === 'cello' ? 'viola' : anchor] = 'harmonic_support';
    if (real.maxSimultaneous >= 3) {
      const third = instruments.find(i => roles[i] === 'rest');
      if (third) roles[third] = 'inner_motion';
    }
  } else if (state === 'SPARSE') {
    roles[lead] = 'melody';
    const other = lead === 'violin1' ? 'viola' : lead === 'viola' ? 'cello' : 'violin1';
    roles[other] = 'punctuation';
  }

  return {
    violin1Role: applyEngine(roles.violin1, 'violin1', isBoundary),
    violin2Role: applyEngine(roles.violin2, 'violin2', isBoundary),
    violaRole: applyEngine(roles.viola, 'viola', isBoundary),
    celloRole: applyEngine(roles.cello, 'cello', isBoundary),
  };
}

/**
 * Build quartet role map.
 */
export function buildQuartetRoleMap(options: QuartetRoleEngineOptions): QuartetRoleMap {
  const {
    phraseStructure,
    textureStateMap,
    engine,
    bars,
    applyEngineRules = (r) => r,
  } = options;

  const cadencePoints = phraseStructure.cadencePoints ?? [];
  const phraseLength = phraseStructure.phraseLength || 4;

  const anchorAssignments = computeAnchorAssignments({
    bars,
    cadencePoints,
    phraseLength,
  });

  const leadPlans = buildLeadRotationPlan(bars, cadencePoints, phraseLength);

  const boundaryActions = detectPhraseBoundaries({
    bars,
    cadencePoints,
    phraseLength,
    tensionCurve: phraseStructure.tensionCurve,
  });

  const map: QuartetRoleMap = new Map();

  for (let bar = 0; bar < bars; bar++) {
    for (let beat = 0; beat < 4; beat += 2) {
      const state = getStateAt(textureStateMap, bar, beat);
      const lead = getLeadAt(leadPlans, bar, beat);
      const anchor = getAnchorAt(anchorAssignments, bar, beat) ?? 'violin1';
      const isBoundary = isPhraseBoundaryAt(boundaryActions, bar, beat);

      const roles = assignRolesForState(
        state,
        lead,
        anchor,
        isBoundary,
        applyEngineRules
      );

      map.set(key(bar, beat), {
        bar,
        beat,
        ...roles,
      });
    }
  }

  return map;
}

export function getRoleAt(map: QuartetRoleMap, bar: number, beat: number): QuartetRoleAssignment | undefined {
  const b = Math.floor(beat);
  return map.get(key(bar, b)) ?? map.get(key(bar, 0));
}
