/**
 * Monk Harmony Engine — Shell harmony, altered dominants, whole tone fragments.
 * Rules: angular root motion, harmonic displacement.
 * Output: HarmonicTarget objects.
 */
import type { HarmonicTarget } from '../../shared/HarmonicTarget';

const MONK_PROGRESSIONS = [
  [
    { symbol: 'Cmaj7', root: 0, quality: 'maj7' },
    { symbol: 'Am7', root: 9, quality: 'm7' },
    { symbol: 'Dm7', root: 2, quality: 'm7' },
    { symbol: 'G7', root: 7, quality: '7' },
    { symbol: 'Cmaj7', root: 0, quality: 'maj7' },
  ],
  [
    { symbol: 'Cmaj7', root: 0, quality: 'maj7' },
    { symbol: 'Fmaj7', root: 5, quality: 'maj7' },
    { symbol: 'Cmaj7', root: 0, quality: 'maj7' },
    { symbol: 'G7b9', root: 7, quality: '7b9' },
    { symbol: 'Cmaj7', root: 0, quality: 'maj7' },
  ],
];

export interface MonkHarmonyOptions {
  keyCenter: number;
  bars: number;
  shellPreferred?: boolean;
  displacement?: number;
}

export function generateMonkHarmony(options: MonkHarmonyOptions): HarmonicTarget[] {
  const { keyCenter, bars, shellPreferred = true, displacement = 0.3 } = options;
  const prog = MONK_PROGRESSIONS[Math.floor(Math.random() * MONK_PROGRESSIONS.length)];
  const targets: HarmonicTarget[] = [];
  const beatsPerChord = 2;
  let measure = 0;
  let beat = 0;
  let id = 0;

  for (let m = 0; m < bars; m++) {
    for (let i = 0; i < 2; i++) {
      const c = prog[(m * 2 + i) % prog.length];
      const offbeat = displacement > 0.3 && Math.random() < displacement ? 0.5 : 0;

      targets.push({
        id: `monk_${id++}`,
        chord: { symbol: c.symbol, root: (keyCenter + c.root) % 12, quality: c.quality },
        beatPosition: beat + offbeat,
        duration: beatsPerChord,
        measure: m,
        shell: shellPreferred,
        punctuation: c.quality.includes('maj7') && i === 1,
      });

      beat += beatsPerChord;
    }
    beat = 0;
  }

  return targets;
}
