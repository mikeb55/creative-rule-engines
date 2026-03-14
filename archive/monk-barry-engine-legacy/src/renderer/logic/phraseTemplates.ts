/**
 * Phrase Templates — Opening, development, release, cadence.
 * Mandatory structure for piano and big band.
 */
export type PhraseZone = 'opening' | 'development' | 'release' | 'cadence';

export function getPhraseZone(barInPhrase: number, phraseLength: number): PhraseZone {
  if (barInPhrase === 0) return 'opening';
  if (barInPhrase >= phraseLength - 1) return 'cadence';
  if (barInPhrase === phraseLength - 2) return 'release';
  return 'development';
}

/** Target density per zone: 0 = sparse, 1 = full */
export const ZONE_DENSITY: Record<PhraseZone, number> = {
  opening: 0.35,
  development: 0.55,
  release: 0.4,
  cadence: 0.3,
};

/** Build 4–8 bar phrase boundaries */
export function buildPhrases(bars: number, rng: () => number): { starts: number[]; lengths: number[] } {
  const starts: number[] = [0];
  const lengths: number[] = [];
  let pos = 0;
  while (pos < bars) {
    const len = 4 + Math.floor(rng() * 5);
    const actual = Math.min(len, bars - pos);
    lengths.push(actual);
    pos += actual;
    if (pos < bars) starts.push(pos);
  }
  return { starts, lengths };
}
