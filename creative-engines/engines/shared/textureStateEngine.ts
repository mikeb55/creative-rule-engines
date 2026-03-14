/**
 * Texture State Engine — Controls musical density across phrases.
 * Sits between guide-tone motion and rhythm grammar.
 *
 * Input: PhraseStructure, HarmonicTargets, GuideToneSkeleton
 * Output: TextureStateMap
 *
 * Global rules:
 * - change at phrase boundaries
 * - allow density variation within phrases
 * - avoid full texture on every bar
 * - introduce contrast between phrase segments
 */
import type { PhraseStructure } from './phraseArchitecture';
import type { HarmonicTarget } from '../../../engines/shared/HarmonicTarget';
import type { GuideToneSkeleton } from './guideToneMotion';

export type TextureState =
  | 'MELODY_ONLY'
  | 'MELODY_HARMONY'
  | 'MELODY_COUNTERLINE'
  | 'HARMONY_ONLY'
  | 'SPARSE'
  | 'SILENCE';

export interface TextureStateEntry {
  bar: number;
  beat: number;
  state: TextureState;
}

export type TextureStateMap = Map<string, TextureState>;

export type EngineTextureStyle = 'barry' | 'monk';

export interface TextureStateOptions {
  phraseStructure: PhraseStructure;
  harmonicTargets: HarmonicTarget[];
  guideToneSkeleton?: GuideToneSkeleton;
  engine: EngineTextureStyle;
  bars: number;
}

function key(bar: number, beat: number): string {
  return `${bar}-${beat}`;
}

export function getStateAt(map: TextureStateMap, bar: number, beat: number): TextureState {
  const k = key(bar, beat);
  return map.get(k) ?? map.get(`${bar}-0`) ?? 'MELODY_HARMONY';
}

/**
 * Build texture state map. Delegates to engine-specific rules.
 */
export function buildTextureStateMap(
  options: TextureStateOptions,
  applyEngineRules: (opts: TextureStateOptions) => TextureStateEntry[]
): TextureStateMap {
  const entries = applyEngineRules(options);
  const map: TextureStateMap = new Map();
  for (const e of entries) {
    map.set(key(e.bar, e.beat), e.state);
  }
  return fillGaps(map, options.bars);
}

function fillGaps(map: TextureStateMap, bars: number): TextureStateMap {
  const result: TextureStateMap = new Map(map);
  for (let bar = 0; bar < bars; bar++) {
    for (let beat = 0; beat < 4; beat += 2) {
      const k = key(bar, beat);
      if (!result.has(k)) {
        const prevBar = bar > 0 ? getStateAt(result, bar - 1, 0) : 'MELODY_HARMONY';
        result.set(k, prevBar);
      }
    }
  }
  return result;
}

/**
 * Check if texture state allows harmony at bar/beat.
 */
export function allowsHarmony(state: TextureState): boolean {
  return state === 'MELODY_HARMONY' || state === 'HARMONY_ONLY';
}

/**
 * Check if texture state allows melody at bar/beat.
 */
export function allowsMelody(state: TextureState): boolean {
  return state === 'MELODY_ONLY' || state === 'MELODY_HARMONY' || state === 'MELODY_COUNTERLINE' || state === 'SPARSE';
}

/**
 * Check if texture state allows counterline at bar/beat.
 */
export function allowsCounterline(state: TextureState): boolean {
  return state === 'MELODY_COUNTERLINE';
}

/**
 * Check if texture map has variation (rejects constant density).
 */
export function hasTextureVariation(map: TextureStateMap): boolean {
  const states = [...map.values()];
  const unique = new Set(states);
  return unique.size >= 2;
}

/**
 * Check if silence occurs.
 */
export function hasSilence(map: TextureStateMap): boolean {
  return [...map.values()].some(s => s === 'SILENCE');
}

/**
 * Check if full texture (melody+harmony+counterline) is constant.
 */
export function isTextureOvercrowded(map: TextureStateMap): boolean {
  const states = [...map.values()];
  const melodyHarmonyCount = states.filter(s =>
    s === 'MELODY_HARMONY' || s === 'MELODY_COUNTERLINE'
  ).length;
  return melodyHarmonyCount >= states.length * 0.9;
}
