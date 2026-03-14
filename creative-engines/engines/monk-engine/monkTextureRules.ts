/**
 * Monk Texture Rules — Sparse punctuation, abrupt shifts, structural silence.
 *
 * Behavior:
 * - sparse punctuation
 * - abrupt texture shifts
 * - silence used structurally
 * - counterline as interruption
 *
 * Allow sudden contrast between dense and empty bars.
 */
import type { TextureStateOptions, TextureStateEntry, TextureState } from '../shared/textureStateEngine';

export function applyMonkTextureRules(opts: TextureStateOptions): TextureStateEntry[] {
  const { phraseStructure, bars } = opts;
  const entries: TextureStateEntry[] = [];

  for (let bar = 0; bar < bars; bar++) {
    const beat = 0;
    const tension = phraseStructure.tensionCurve[bar] ?? 0.5;
    const atBoundary = bar === 0 || bar === phraseStructure.phraseLength - 1 || bar % 4 === 3;

    let state: TextureState;

    if (atBoundary && Math.random() < 0.35) {
      state = 'SILENCE';
    } else if (tension < 0.4 && Math.random() < 0.5) {
      state = 'SPARSE';
    } else if (Math.random() < 0.25) {
      state = 'MELODY_COUNTERLINE';
    } else if (Math.random() < 0.4) {
      state = 'MELODY_ONLY';
    } else if (Math.random() < 0.3) {
      state = 'HARMONY_ONLY';
    } else {
      state = 'MELODY_HARMONY';
    }

    entries.push({ bar, beat, state });
  }

  return entries;
}
