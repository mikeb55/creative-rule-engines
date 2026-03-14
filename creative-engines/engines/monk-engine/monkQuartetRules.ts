/**
 * Monk Quartet Rules — Engine-specific quartet behavior.
 * Punctuated entries, abrupt texture contrasts, sparse role use.
 */
import type { QuartetRole } from '../shared/quartetTextureRules';

export interface MonkQuartetModifiers {
  /** Prefer sparse role use */
  preferSparse: boolean;
  /** Viola/cello as dark interruption voices */
  violaCelloAsInterruption: boolean;
  /** Allow repeated-note interruptions */
  repeatedNoteInterruption: boolean;
  /** Abrupt texture contrasts */
  abruptContrasts: boolean;
}

export function getMonkQuartetModifiers(): MonkQuartetModifiers {
  return {
    preferSparse: true,
    violaCelloAsInterruption: true,
    repeatedNoteInterruption: true,
    abruptContrasts: true,
  };
}

/**
 * Adjust role assignment for Monk: viola and cello may take punctuation/interruption.
 */
export function applyMonkQuartetRules(
  role: QuartetRole,
  instrument: 'violin1' | 'violin2' | 'viola' | 'cello',
  isPhraseBoundary: boolean
): QuartetRole {
  if (instrument === 'viola' || instrument === 'cello') {
    if (isPhraseBoundary) {
      return 'punctuation';
    }
  }
  return role;
}
