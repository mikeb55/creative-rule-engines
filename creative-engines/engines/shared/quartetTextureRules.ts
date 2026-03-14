/**
 * Quartet Texture Rules — Map texture states into quartet realizations.
 * Defines how MELODY_ONLY, MELODY_HARMONY, etc. translate to quartet roles.
 */
import type { TextureState } from './textureStateEngine';

export type QuartetRole =
  | 'melody'
  | 'counterline'
  | 'inner_motion'
  | 'harmonic_support'
  | 'bass'
  | 'rest'
  | 'pedal'
  | 'punctuation';

export interface QuartetTextureRealization {
  /** Number of active voices (1–4) */
  activeCount: number;
  /** Allowed roles per texture state */
  allowedRoles: QuartetRole[];
  /** Max simultaneous active voices */
  maxSimultaneous: number;
  /** Whether full block (all 4) is forbidden */
  forbidBlock: boolean;
}

/**
 * Map texture state to quartet realization.
 */
export function textureToQuartetRealization(state: TextureState): QuartetTextureRealization {
  switch (state) {
    case 'MELODY_ONLY':
      return {
        activeCount: 1,
        allowedRoles: ['melody', 'rest', 'pedal'],
        maxSimultaneous: 1,
        forbidBlock: true,
      };
    case 'MELODY_HARMONY':
      return {
        activeCount: 3,
        allowedRoles: ['melody', 'harmonic_support', 'bass', 'rest', 'pedal'],
        maxSimultaneous: 3,
        forbidBlock: true,
      };
    case 'MELODY_COUNTERLINE':
      return {
        activeCount: 3,
        allowedRoles: ['melody', 'counterline', 'inner_motion', 'harmonic_support', 'bass', 'rest', 'pedal'],
        maxSimultaneous: 3,
        forbidBlock: true,
      };
    case 'HARMONY_ONLY':
      return {
        activeCount: 2,
        allowedRoles: ['harmonic_support', 'bass', 'pedal', 'rest'],
        maxSimultaneous: 3,
        forbidBlock: false,
      };
    case 'SPARSE':
      return {
        activeCount: 2,
        allowedRoles: ['melody', 'counterline', 'bass', 'punctuation', 'rest', 'pedal'],
        maxSimultaneous: 2,
        forbidBlock: true,
      };
    case 'SILENCE':
      return {
        activeCount: 0,
        allowedRoles: ['rest', 'pedal'],
        maxSimultaneous: 1,
        forbidBlock: true,
      };
    default:
      return {
        activeCount: 2,
        allowedRoles: ['melody', 'harmonic_support', 'bass', 'rest', 'pedal'],
        maxSimultaneous: 2,
        forbidBlock: true,
      };
  }
}
