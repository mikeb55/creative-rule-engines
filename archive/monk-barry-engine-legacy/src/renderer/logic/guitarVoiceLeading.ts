/**
 * Guitar Voice-Leading Engine — Choose next voicing by smallest fret displacement.
 * Rules: preserve common tones, upper voice movement ≤ third when possible,
 * avoid register jumps > fifth.
 */
import type { Chord } from './types';
import type { FretboardVoicingResult } from './guitarFretboardEngine';
import { getVoicingsForChord } from './guitarFretboardEngine';
import type { VoicingFamilyId } from './guitarVoicingFamilies';

export interface VoiceLeadingContext {
  lastVoicing: FretboardVoicingResult | null;
  lastTopPitch: number | null;
}

const MAX_UPPER_VOICE_MOVEMENT = 4; // major third in semitones
const MAX_REGISTER_JUMP = 7; // fifth in semitones

function commonToneCount(a: number[], b: number[]): number {
  const setB = new Set(b.map(p => p % 12));
  return a.filter(p => setB.has(p % 12)).length;
}

function topVoiceDistance(a: number[], b: number[]): number {
  return Math.abs(Math.max(...b) - Math.max(...a));
}

function fretDisplacement(prev: FretboardVoicingResult | null, next: FretboardVoicingResult): number {
  if (!prev) return 0;
  const avgPrev = prev.pitches.reduce((s, p) => s + p, 0) / prev.pitches.length;
  const avgNext = next.pitches.reduce((s, p) => s + p, 0) / next.pitches.length;
  return Math.abs(avgNext - avgPrev);
}

/** Choose best next voicing: smallest displacement, most common tones,
 * minimal top-voice jump (≤ third preferred), register jump ≤ fifth */
export function chooseNextVoicing(
  chord: Chord,
  context: VoiceLeadingContext,
  families: VoicingFamilyId[] = ['shell', 'guideTone', 'triad']
): FretboardVoicingResult | null {
  const candidates = getVoicingsForChord(
    chord,
    families,
    3,
    12,
    context.lastTopPitch ?? null
  );
  if (candidates.length === 0) return null;

  const scored = candidates.map(v => {
    const common = context.lastVoicing
      ? commonToneCount(context.lastVoicing.pitches, v.pitches)
      : 0;
    const topJump = context.lastTopPitch != null
      ? Math.abs(Math.max(...v.pitches) - context.lastTopPitch)
      : 0;
    const displacement = fretDisplacement(context.lastVoicing, v);

    let score = common * 10 - displacement * 0.5;
    if (topJump <= MAX_UPPER_VOICE_MOVEMENT) score += 5;
    else if (topJump > MAX_REGISTER_JUMP) score -= topJump * 3;
    else score -= topJump;
    return { v, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.v ?? null;
}
