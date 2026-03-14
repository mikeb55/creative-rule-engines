/**
 * Quartet Phrase Boundary Rules — Use phrase boundaries to trigger:
 * - texture shifts
 * - role reassignment
 * - lead rotation
 * - density reduction or build
 */
import type { TextureState } from './textureStateEngine';

export interface PhraseBoundaryAction {
  bar: number;
  beat: number;
  isBoundary: boolean;
  /** Suggest density change: -1 reduce, 0 hold, 1 build */
  densityDirection: number;
  /** Allow role reassignment */
  allowRoleChange: boolean;
  /** Allow lead rotation */
  allowLeadRotation: boolean;
}

export interface PhraseBoundaryOptions {
  bars: number;
  cadencePoints: number[];
  phraseLength: number;
  tensionCurve?: number[];
}

/**
 * Detect phrase boundaries and suggest actions.
 */
export function detectPhraseBoundaries(options: PhraseBoundaryOptions): PhraseBoundaryAction[] {
  const { bars, cadencePoints, phraseLength, tensionCurve } = options;
  const actions: PhraseBoundaryAction[] = [];

  for (let bar = 0; bar < bars; bar++) {
    for (let beat = 0; beat < 4; beat += 2) {
      const pos = bar * 4 + beat;
      const isCadence = cadencePoints.some(cp => Math.abs(cp - pos) < 1.5);
      const isPhraseStart = bar % phraseLength === 0 && beat === 0;
      const isBoundary = isCadence || isPhraseStart;

      let densityDirection = 0;
      if (tensionCurve && bar < tensionCurve.length) {
        const t = tensionCurve[bar];
        if (isBoundary && bar > 0 && t < 0.5) densityDirection = -1;
        else if (isBoundary && t > 0.6) densityDirection = 1;
      }

      actions.push({
        bar,
        beat,
        isBoundary,
        densityDirection,
        allowRoleChange: isBoundary,
        allowLeadRotation: isBoundary,
      });
    }
  }

  return actions;
}

/**
 * Check if position is a phrase boundary.
 */
export function isPhraseBoundaryAt(
  actions: PhraseBoundaryAction[],
  bar: number,
  beat: number
): boolean {
  const b = Math.floor(beat);
  return actions.some(a => a.bar === bar && a.beat === b && a.isBoundary);
}
