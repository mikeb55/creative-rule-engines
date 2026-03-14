/**
 * Barry Harris Quartet Rules — Engine-specific quartet behavior.
 * Smoother role continuity, inner moving lines, gradual density shifts.
 */
import type { QuartetRole } from '../shared/quartetTextureRules';

export interface BarryQuartetModifiers {
  /** Smoother role continuity */
  smoothContinuity: boolean;
  /** Inner moving lines preferred */
  innerMotionPreferred: boolean;
  /** Cello bass / guide-tone grounding */
  celloBassGrounding: boolean;
  /** Counterline support through Vln2 / Viola */
  counterlineSupport: boolean;
}

export function getBarryQuartetModifiers(): BarryQuartetModifiers {
  return {
    smoothContinuity: true,
    innerMotionPreferred: true,
    celloBassGrounding: true,
    counterlineSupport: true,
  };
}

/**
 * Adjust role assignment for Barry: cello bass, Vln2/Vla counterline.
 */
export function applyBarryQuartetRules(
  role: QuartetRole,
  instrument: 'violin1' | 'violin2' | 'viola' | 'cello',
  _isPhraseBoundary: boolean
): QuartetRole {
  if (instrument === 'cello' && role === 'harmonic_support') {
    return 'bass';
  }
  if ((instrument === 'violin2' || instrument === 'viola') && role === 'harmonic_support') {
    return 'inner_motion';
  }
  return role;
}
