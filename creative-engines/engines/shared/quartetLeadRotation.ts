/**
 * Quartet Lead Rotation — Rotate melodic prominence every 2–4 bars.
 * Violin 1 is not always lead; Vln2, Viola, Cello may lead.
 */
import type { QuartetInstrument } from './quartetAnchorVoice';

export interface LeadRotationPlan {
  bar: number;
  beat: number;
  lead: QuartetInstrument;
  rotationPoint: boolean;
}

const INSTRUMENTS: QuartetInstrument[] = ['violin1', 'violin2', 'viola', 'cello'];

/**
 * Build lead rotation plan. Rotate every 2–4 bars when musically appropriate.
 */
export function buildLeadRotationPlan(
  bars: number,
  cadencePoints: number[],
  phraseLength: number,
  seed?: number
): LeadRotationPlan[] {
  const plans: LeadRotationPlan[] = [];
  const rng = seed !== undefined ? seededRandom(seed) : Math.random;
  let leadIndex = 0;

  for (let bar = 0; bar < bars; bar++) {
    for (let beat = 0; beat < 4; beat += 2) {
      const pos = bar * 4 + beat;
      const isCadence = cadencePoints.some(cp => Math.abs(cp - pos) < 1.5);
      const phraseStart = bar % phraseLength === 0;
      const rotationInterval = 2 + Math.floor(rng() * 2);

      const shouldRotate =
        (isCadence || phraseStart) &&
        bar > 0 &&
        bar % rotationInterval === 0;

      if (shouldRotate) {
        leadIndex = (leadIndex + 1) % INSTRUMENTS.length;
      }

      plans.push({
        bar,
        beat,
        lead: INSTRUMENTS[leadIndex],
        rotationPoint: shouldRotate,
      });
    }
  }

  return plans;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/**
 * Get lead at bar/beat.
 */
export function getLeadAt(
  plans: LeadRotationPlan[],
  bar: number,
  beat: number
): QuartetInstrument {
  const b = Math.floor(beat);
  return plans.find(p => p.bar === bar && p.beat === b)?.lead ?? 'violin1';
}
