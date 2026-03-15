/**
 * Big Band Section Engine — Maps pipeline events to big band parts.
 * Distributes melody, counterline, harmony across SAXES, TRUMPETS, TROMBONES.
 */
import type { MusicEvent } from '../../shared/MusicEvent';

export type BigBandPart =
  | 'alto1' | 'alto2' | 'tenor1' | 'tenor2' | 'baritone'
  | 'trumpet1' | 'trumpet2' | 'trumpet3' | 'trumpet4'
  | 'trombone1' | 'trombone2' | 'trombone3' | 'bassTrombone';

export interface BigBandPartEvent {
  part: BigBandPart;
  pitch: number;
  measure: number;
  beatPosition: number;
  duration: number;
  role: 'melody' | 'counterline' | 'harmony' | 'bass';
}

const PART_ORDER: BigBandPart[] = [
  'alto1', 'alto2', 'tenor1', 'tenor2', 'baritone',
  'trumpet1', 'trumpet2', 'trumpet3', 'trumpet4',
  'trombone1', 'trombone2', 'trombone3', 'bassTrombone',
];

export function mapEventsToBigBand(
  events: MusicEvent[],
  bars: number
): BigBandPartEvent[] {
  const result: BigBandPartEvent[] = [];
  const chordEvents = events.filter(e => e.role === 'CHORD');
  const melodyEvents = events.filter(e => e.role === 'MELODY');
  const counterEvents = events.filter(e => e.role === 'COUNTERLINE');

  for (const e of melodyEvents) {
    if (e.pitches.length > 0) {
      result.push({
        part: 'alto1',
        pitch: e.pitches[0],
        measure: e.measure,
        beatPosition: e.beatPosition,
        duration: e.duration,
        role: 'melody',
      });
    }
  }

  for (const e of counterEvents) {
    if (e.pitches.length > 0) {
      result.push({
        part: 'tenor1',
        pitch: e.pitches[0],
        measure: e.measure,
        beatPosition: e.beatPosition,
        duration: e.duration,
        role: 'counterline',
      });
    }
  }

  const harmonyParts: BigBandPart[] = ['alto2', 'tenor2', 'baritone', 'trumpet1', 'trumpet2', 'trombone1', 'trombone2'];
  let chordIdx = 0;
  for (const e of chordEvents) {
    if (e.pitches.length === 0) continue;
    for (let i = 0; i < e.pitches.length; i++) {
      const part = harmonyParts[chordIdx % harmonyParts.length];
      result.push({
        part,
        pitch: e.pitches[i],
        measure: e.measure,
        beatPosition: e.beatPosition,
        duration: e.duration,
        role: 'harmony',
      });
      chordIdx++;
    }
  }

  return result.sort((a, b) => a.measure * 4 + a.beatPosition - (b.measure * 4 + b.beatPosition));
}

export { PART_ORDER };
