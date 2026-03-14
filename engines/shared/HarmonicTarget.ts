/**
 * HarmonicTarget — Harmonic instruction from harmony layer.
 * Not final instrumental notation; voicing layer resolves to pitches.
 */
export interface ChordSymbol {
  symbol: string;
  root: number;  // pitch class 0-11
  quality: string;
}

export interface HarmonicTarget {
  id: string;
  chord: ChordSymbol;
  beatPosition: number;
  duration: number;
  measure: number;
  /** Guide tones for voice-leading (optional) */
  guideTones?: number[];
  /** Shell voicing requested (Monk) */
  shell?: boolean;
  /** Enclosure / bebop ornament (Barry) */
  enclosure?: boolean;
  /** Cadence punctuation */
  punctuation?: boolean;
}
