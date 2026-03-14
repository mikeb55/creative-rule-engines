/**
 * Barry Harris Harmony Engine — 6th–diminished scale logic.
 * Rules: dominant movement, guide tone motion, chromatic passing harmony.
 * Output: HarmonicTarget objects.
 */
import type { HarmonicTarget } from '../../shared/HarmonicTarget';

const II_V_I = [
  { symbol: 'Dm7', root: 2, quality: 'm7' },
  { symbol: 'G7', root: 7, quality: '7' },
  { symbol: 'Cmaj7', root: 0, quality: 'maj7' },
];

export interface BarryHarrisOptions {
  keyCenter: number;
  bars: number;
  guideToneStrength?: number;
  diminishedPassing?: number;
}

export function generateBarryHarrisHarmony(options: BarryHarrisOptions): HarmonicTarget[] {
  const { keyCenter, bars, guideToneStrength = 0.7, diminishedPassing = 0.4 } = options;
  const targets: HarmonicTarget[] = [];
  const beatsPerChord = 2;
  let measure = 0;
  let beat = 0;
  let id = 0;

  while (measure < bars) {
    for (const c of II_V_I) {
      if (measure >= bars) break;
      const isCadence = c.quality === 'maj7' && beat === 0;
      const addDim = diminishedPassing > 0.5 && Math.random() < 0.3 && c.quality === '7';

      targets.push({
        id: `bh_${id++}`,
        chord: { symbol: c.symbol, root: (keyCenter + c.root) % 12, quality: c.quality },
        beatPosition: beat,
        duration: beatsPerChord,
        measure,
        guideTones: guideToneStrength > 0.5 ? [3, 7] : undefined,
        punctuation: isCadence,
      });

      if (addDim) {
        targets.push({
          id: `bh_${id++}`,
          chord: { symbol: 'Bdim7', root: 11, quality: 'dim7' },
          beatPosition: beat + 1,
          duration: 0.5,
          measure,
          enclosure: true,
        });
      }

      beat += beatsPerChord;
      if (beat >= 4) {
        beat = 0;
        measure++;
      }
    }
  }

  return targets.slice(0, Math.ceil(bars * 4 / beatsPerChord) * 3);
}
