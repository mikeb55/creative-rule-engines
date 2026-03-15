/**
 * Big Band Voicing Engine — Adjusts pitches for big band instrument ranges.
 * Clamps to playable ranges per section.
 */
import type { BigBandPartEvent } from './bigBandSectionEngine';

const RANGES: Record<string, { min: number; max: number }> = {
  alto1: { min: 55, max: 84 },
  alto2: { min: 55, max: 84 },
  tenor1: { min: 48, max: 76 },
  tenor2: { min: 48, max: 76 },
  baritone: { min: 36, max: 67 },
  trumpet1: { min: 55, max: 88 },
  trumpet2: { min: 52, max: 84 },
  trumpet3: { min: 48, max: 79 },
  trumpet4: { min: 48, max: 76 },
  trombone1: { min: 40, max: 72 },
  trombone2: { min: 36, max: 67 },
  trombone3: { min: 36, max: 64 },
  bassTrombone: { min: 28, max: 60 },
};

export function applyBigBandVoicing(events: BigBandPartEvent[]): BigBandPartEvent[] {
  return events.map(e => {
    const range = RANGES[e.part] ?? { min: 36, max: 84 };
    const pitch = Math.max(range.min, Math.min(range.max, e.pitch));
    return { ...e, pitch };
  });
}
