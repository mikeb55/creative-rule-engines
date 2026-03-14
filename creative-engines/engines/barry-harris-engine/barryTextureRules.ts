/**
 * Barry Harris Texture Rules — Melody + harmony dominant, gradual density shifts.
 *
 * Behavior:
 * - melody + harmony dominant texture
 * - occasional melody-only moments
 * - counterline appears mostly in transitions
 * - harmony-only moments before cadences
 *
 * Prefer gradual density shifts.
 */
import type { TextureStateOptions, TextureStateEntry, TextureState } from '../shared/textureStateEngine';

export function applyBarryTextureRules(opts: TextureStateOptions): TextureStateEntry[] {
  const { phraseStructure, bars } = opts;
  const entries: TextureStateEntry[] = [];
  const cadenceBars = new Set(
    phraseStructure.cadencePoints.map(cp => Math.floor(cp / 4))
  );

  for (let bar = 0; bar < bars; bar++) {
    const beat = 0;
    const atCadence = cadenceBars.has(bar);
    const prevBar = bar - 1;
    const isTransition = bar > 0 && (bar % 4 === 0 || bar === Math.floor(phraseStructure.phraseLength / 2));

    let state: TextureState;

    if (atCadence && Math.random() < 0.4) {
      state = 'HARMONY_ONLY';
    } else if (isTransition && Math.random() < 0.5) {
      state = 'MELODY_COUNTERLINE';
    } else if (bar % 4 === 1 && Math.random() < 0.3) {
      state = 'MELODY_ONLY';
    } else if (Math.random() < 0.7) {
      state = 'MELODY_HARMONY';
    } else {
      state = Math.random() < 0.5 ? 'MELODY_ONLY' : 'SPARSE';
    }

    entries.push({ bar, beat, state });
  }

  return entries;
}
