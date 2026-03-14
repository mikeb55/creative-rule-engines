/**
 * Guitar Voice-Leading Engine — Choose next voicing by smallest fret displacement.
 * Minimize top-voice movement, prefer common tones, avoid jumps > 4th in upper voice.
 */
import type { Chord } from './types';
import type { FretboardVoicing } from './fretboardMapper';
import { getVoicingsForChord } from './fretboardMapper';

export interface VoiceLeadingContext {
  lastVoicing: FretboardVoicing | null;
  lastTopPitch: number | null;
}

function commonToneCount(a: number[], b: number[]): number {
  const setB = new Set(b.map(p => p % 12));
  return a.filter(p => setB.has(p % 12)).length;
}

function topVoiceDistance(a: number[], b: number[]): number {
  const topA = Math.max(...a);
  const topB = Math.max(...b);
  return Math.abs(topB - topA);
}

function fretDisplacement(prev: FretboardVoicing | null, next: FretboardVoicing): number {
  if (!prev) return 0;
  const avgPrev = prev.pitches.reduce((s, p) => s + p, 0) / prev.pitches.length;
  const avgNext = next.pitches.reduce((s, p) => s + p, 0) / next.pitches.length;
  return Math.abs(avgNext - avgPrev);
}

/** Choose best next voicing: smallest displacement, most common tones, minimal top-voice jump */
export function chooseNextVoicing(
  chord: Chord,
  context: VoiceLeadingContext,
  families: ('shell' | 'guideTone' | 'triad')[] = ['shell', 'guideTone', 'triad']
): FretboardVoicing | null {
  const candidates = getVoicingsForChord(chord, families);
  if (candidates.length === 0) return null;

  const scored = candidates.map(v => {
    const common = context.lastVoicing ? commonToneCount(context.lastVoicing.pitches, v.pitches) : 0;
    const topJump = context.lastTopPitch != null ? Math.abs(Math.max(...v.pitches) - context.lastTopPitch) : 0;
    const displacement = fretDisplacement(context.lastVoicing, v);
    const topPenalty = topJump > 5 ? topJump * 2 : 0;
    const score = common * 10 - displacement - topPenalty - topJump * 0.5;
    return { v, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.v ?? null;
}
