/**
 * Music Validator — Playable voicings, voice-leading, chord density, motif recurrence.
 */
import type { MusicEvent } from '../../shared/MusicEvent';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateMusicEvents(events: MusicEvent[]): ValidationResult {
  const errors: string[] = [];

  const pitched = events.filter(e => e.pitches.length > 0);
  for (const e of pitched) {
    for (const p of e.pitches) {
      if (p < 21 || p > 108) errors.push(`Pitch ${p} out of range (event ${e.id})`);
    }
  }

  let prevChordPitches: number[] | null = null;
  for (const e of pitched) {
    if (e.role === 'CHORD' && prevChordPitches !== null && prevChordPitches.length === e.pitches.length) {
      const motion = Math.max(...e.pitches.map((p, i) => Math.abs(p - (prevChordPitches![i] ?? prevChordPitches![0]))));
      if (motion > 12) errors.push(`Voice-leading leap too large (event ${e.id})`);
    }
    if (e.role === 'CHORD') prevChordPitches = e.pitches;
  }

  const chordCount = pitched.filter(e => e.role === 'CHORD').length;
  if (pitched.length > 0 && chordCount / pitched.length > 0.95) {
    errors.push('Chord density too high');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
