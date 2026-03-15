/**
 * Andrew Hill Quartet Rules — Engine-specific quartet behavior.
 * Sparse textures, cluster punctuation, register bands, phrase asymmetry.
 */
import type { QuartetRole } from '../shared/quartetTextureRules';

export interface HillQuartetModifiers {
  /** Sparse role use, avoid block writing */
  preferSparse: boolean;
  /** Cluster color as punctuation (viola/cello) */
  clusterAsPunctuation: boolean;
  /** Register band awareness */
  registerBandAware: boolean;
  /** Phrase asymmetry respected */
  phraseAsymmetry: boolean;
}

export function getHillQuartetModifiers(): HillQuartetModifiers {
  return {
    preferSparse: true,
    clusterAsPunctuation: true,
    registerBandAware: true,
    phraseAsymmetry: true,
  };
}

/**
 * Adjust role assignment for Hill: cluster_color → punctuation on viola/cello.
 * Melody fragments and counterlines distributed across quartet.
 */
export function applyHillQuartetRules(
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
