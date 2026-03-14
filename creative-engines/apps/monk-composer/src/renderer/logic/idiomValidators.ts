/**
 * Hard Idiom Validators — Reject outputs that fail structural requirements.
 * Guitar: playable grips, chord-event %, mixed texture, no monophonic fallback.
 * Piano: two staves, LH/RH independence, simultaneity threshold.
 */
import type { Note } from './types';
import type { MusicEvent } from './musicEvents';
import {
  chordEventCount,
  averageSimultaneity,
  maxSimultaneity,
} from './musicEvents';

const GUITAR_LOW = 40;
const GUITAR_HIGH = 84;
const MAX_FRET_SPAN = 6;
const MAX_STRING_SPAN = 5;

/** Guitar string MIDI (low to high): E2 A2 D3 G3 B3 E4 */
const GUITAR_STRINGS = [40, 45, 50, 55, 59, 64];

/** Heuristic: grip is playable if within range, reasonable span */
export function isPlayableGuitarGrip(pitches: number[]): boolean {
  if (pitches.length <= 1) return true;
  const sorted = [...pitches].sort((a, b) => a - b);
  if (sorted.some(p => p < GUITAR_LOW || p > GUITAR_HIGH)) return false;
  if (sorted.length > 6) return false;
  const pitchSpan = sorted[sorted.length - 1] - sorted[0];
  return pitchSpan <= 28;
}

export interface GuitarValidatorResult {
  pass: boolean;
  reason?: string;
  chordEventPct?: number;
  gripValidity?: number;
  mixedTexture?: boolean;
  singleNotePct?: number;
}

export function validateGuitarIdiomHard(
  texture: { voice: number; notes: Note[] }[]
): GuitarValidatorResult {
  const all = texture.flatMap(t => (t.notes ?? []).filter(n => !n.rest && n.pitch > 0));
  if (all.length < 8) return { pass: false, reason: 'Too few notes' };

  const byOffset = new Map<number, number[]>();
  for (const n of all) {
    const o = Math.round((n.offset ?? 0) * 4) / 4;
    if (!byOffset.has(o)) byOffset.set(o, []);
    byOffset.get(o)!.push(n.pitch);
  }

  const chordEvents = [...byOffset.values()].filter(g => g.length >= 2);
  const totalEvents = byOffset.size;
  const chordEventPct = totalEvents > 0 ? (chordEvents.length / totalEvents) * 100 : 0;
  const singleNoteCount = [...byOffset.values()].filter(g => g.length === 1).length;
  const singleNotePct = totalEvents > 0 ? (singleNoteCount / totalEvents) * 100 : 0;

  if (singleNotePct > 65) return { pass: false, reason: '>65% single-note events', singleNotePct };
  if (chordEventPct < 12) return { pass: false, reason: 'Chord events <12%', chordEventPct };

  let validGrips = 0;
  let totalGrips = 0;
  for (const g of byOffset.values()) {
    if (g.length >= 2) {
      totalGrips++;
      if (isPlayableGuitarGrip(g)) validGrips++;
    }
  }
  const gripValidity = totalGrips > 0 ? validGrips / totalGrips : 1;
  if (gripValidity < 0.5) return { pass: false, reason: 'Unplayable grips', gripValidity };

  const hasLine = singleNoteCount > 0;
  const hasDyad = chordEvents.some(g => g.length === 2);
  const hasTriad = chordEvents.some(g => g.length >= 3);
  const mixedTexture = hasLine && (hasDyad || hasTriad);
  if (!mixedTexture) return { pass: false, reason: 'No mixed texture' };

  const bars = totalEvents > 0 ? Math.ceil(Math.max(...byOffset.keys()) / 4) : 0;
  const minChordEvents = Math.ceil(bars / 2);
  if (chordEvents.length < minChordEvents) return { pass: false, reason: 'Chord events < 1 per 2 bars' };

  return {
    pass: true,
    chordEventPct,
    gripValidity,
    mixedTexture,
    singleNotePct,
  };
}

export interface PianoValidatorResult {
  pass: boolean;
  reason?: string;
  staffCount?: number;
  lhActivityRatio?: number;
  rhActivityRatio?: number;
  avgSimultaneity?: number;
  maxSimultaneity?: number;
  harmonicDensity?: number;
}

export function validatePianoIdiomHard(
  texture: { voice: number; notes: Note[] }[]
): PianoValidatorResult {
  if (!texture || texture.length < 2) return { pass: false, reason: 'Need 2 staves' };

  const rh = texture[0]?.notes ?? [];
  const lh = texture[1]?.notes ?? [];
  const rhPitched = rh.filter(n => !n.rest && n.pitch > 0);
  const lhPitched = lh.filter(n => !n.rest && n.pitch > 0);

  if (rhPitched.length < 4) return { pass: false, reason: 'Too few RH notes' };
  if (lhPitched.length < 4) return { pass: false, reason: 'No LH independence' };

  const avgSim = averageSimultaneity(texture);
  const maxSim = maxSimultaneity(texture);

  const all = texture.flatMap(t => (t.notes ?? []).filter(n => !n.rest && n.pitch > 0));
  const byOffset = new Map<number, number[]>();
  for (const n of all) {
    const o = Math.round((n.offset ?? 0) * 4) / 4;
    if (!byOffset.has(o)) byOffset.set(o, []);
    byOffset.get(o)!.push(n.pitch);
  }
  const threePlus = [...byOffset.values()].filter(g => g.length >= 3).length;
  const totalBeats = byOffset.size;
  const harmonicDensity = totalBeats > 0 ? threePlus / totalBeats : 0;

  const lhBeats = new Set(lhPitched.map(n => Math.round((n.offset ?? 0) * 4) / 4)).size;
  const rhBeats = new Set(rhPitched.map(n => Math.round((n.offset ?? 0) * 4) / 4)).size;
  const totalBeatsWithNotes = Math.max(1, lhBeats + rhBeats);
  const lhActivityRatio = lhBeats / totalBeatsWithNotes;
  const rhActivityRatio = rhBeats / totalBeatsWithNotes;

  if (lhActivityRatio < 0.10) return { pass: false, reason: 'No LH independence', lhActivityRatio };
  if (maxSim < 2 && totalBeats > 4) return { pass: false, reason: 'Max simultaneity < 2', maxSimultaneity: maxSim };
  if (harmonicDensity < 0.08 && totalBeats > 12) return { pass: false, reason: 'Melody + occasional bass', harmonicDensity };

  return {
    pass: true,
    staffCount: 2,
    lhActivityRatio,
    rhActivityRatio,
    avgSimultaneity: avgSim,
    maxSimultaneity: maxSim,
    harmonicDensity,
  };
}
