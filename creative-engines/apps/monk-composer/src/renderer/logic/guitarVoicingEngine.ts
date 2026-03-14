/**
 * Guitar Voicing Engine — Real chord events, mixed texture.
 * Shells, guide-tone dyads, compact triads; melody on top when required.
 * At least one chord event every two measures. Valid string grouping, realistic fret span.
 */
import type { Note, Chord } from './types';
import type { MusicEvent } from './musicEvents';
import { guideToneDyad, shellVoicing, compactTriad, compact4 } from './voicingFamilies';
import { eventsToTexture } from './musicEvents';

const GUITAR_LOW = 40;
const GUITAR_HIGH = 84;

function getChordAtBeat(harmony: Chord[], offset: number): Chord | undefined {
  for (let i = harmony.length - 1; i >= 0; i--) {
    if (harmony[i].offset <= offset) return harmony[i];
  }
  return harmony[0];
}

const GUITAR_STRINGS = [40, 45, 50, 55, 59, 64];
const MAX_STRING_SPAN = 5;
const MAX_FRET_SPAN = 6;

function stringForPitch(p: number): number {
  for (let s = GUITAR_STRINGS.length - 1; s >= 0; s--) {
    if (p >= GUITAR_STRINGS[s]) return s;
  }
  return 0;
}

function isPlayableGrip(pitches: number[]): boolean {
  if (pitches.length <= 1) return true;
  const sorted = [...pitches].sort((a, b) => a - b);
  if (sorted.some(p => p < GUITAR_LOW || p > GUITAR_HIGH)) return false;
  const strings = sorted.map(p => stringForPitch(p));
  if (Math.max(...strings) - Math.min(...strings) > MAX_STRING_SPAN) return false;
  const frets = sorted.map((p, i) => p - GUITAR_STRINGS[strings[i]]);
  if (Math.max(...frets) - Math.min(...frets) > MAX_FRET_SPAN) return false;
  return true;
}

function filterSupport(melodyPitch: number, candidates: number[]): number[] {
  return candidates
    .map(p => Math.min(GUITAR_HIGH, Math.max(GUITAR_LOW, p)))
    .filter(p => p < melodyPitch && p >= GUITAR_LOW)
    .filter(p => melodyPitch - p <= 24) // keep within 2 octaves for playability
    .slice(0, 3);
}

export interface GuitarVoicingOptions {
  monkMode?: boolean;
  barryMode?: boolean;
  bars?: number;
  keyCenter?: string;
  rng?: () => number;
}

/**
 * Generate guitar events with true chord simultaneity.
 * Guarantees at least one chord event every two measures.
 */
export function generateGuitarEvents(
  melody: Note[],
  harmony: Chord[],
  options: GuitarVoicingOptions = {}
): MusicEvent[] {
  const rng = options.rng ?? (() => Math.random());
  const bars = options.bars ?? (Math.ceil((melody[melody.length - 1]?.offset ?? 0) / 4) || 8);
  const monkMode = options.monkMode ?? false;
  const barryMode = options.barryMode ?? true;

  const events: MusicEvent[] = [];
  const beatsPerBar = 4;

  // Beats that MUST have a chord event (at least 1 per 2 bars)
  const requiredChordBeats = new Set<number>();
  for (let bar = 0; bar < bars; bar += 2) {
    requiredChordBeats.add(bar * beatsPerBar + 1);
  }

  // Track which required beats we've covered
  const coveredChordBeats = new Set<number>();

  // Process melody notes in order
  for (let i = 0; i < melody.length; i++) {
    const n = melody[i];
    const offset = n.offset ?? 0;
    const duration = n.duration ?? 0.5;

    if (n.rest) {
      events.push({
        pitches: [],
        duration,
        beatPosition: offset,
        staff: 1,
        voice: 1,
        role: 'punctuation',
      });
      continue;
    }

    const pitch = Math.min(GUITAR_HIGH, Math.max(GUITAR_LOW, n.pitch));
    const chord = getChordAtBeat(harmony, offset);
    const beatFloor = Math.floor(offset);

    // Force chord if we're at a required beat we haven't covered
    const mustChord = requiredChordBeats.has(beatFloor) && !coveredChordBeats.has(beatFloor);
    const shouldChord = (chord && (mustChord || rng() < 0.72));

    if (!shouldChord || !chord) {
      events.push({
        pitches: [pitch],
        duration,
        beatPosition: offset,
        staff: 1,
        voice: 1,
        role: 'melody',
      });
      continue;
    }

    coveredChordBeats.add(beatFloor);

    const textureRoll = rng();
    let support: number[] = [];

    if (monkMode) {
      if (textureRoll < 0.35) support = guideToneDyad(chord, 3, '37');
      else if (textureRoll < 0.65) support = guideToneDyad(chord, 3, '73');
      else support = shellVoicing(chord, 3).slice(0, 2);
    } else if (barryMode) {
      if (textureRoll < 0.3) support = guideToneDyad(chord, 3, '37');
      else if (textureRoll < 0.55) support = compactTriad(chord, 3).slice(0, 2);
      else if (textureRoll < 0.8) support = shellVoicing(chord, 3).slice(0, 2);
      else support = compactTriad(chord, 3);
    } else {
      support = textureRoll < 0.5 ? guideToneDyad(chord, 3, '37') : guideToneDyad(chord, 3, '73');
    }

    support = filterSupport(pitch, support);

    if (support.length === 2 && rng() < 0.15) {
      const ext = compact4(chord, 3).filter(p => p < pitch && p >= GUITAR_LOW);
      const cand = [...support, ...ext].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
      if (isPlayableGrip([pitch, ...cand])) support = cand;
    }

    let finalPitches = [pitch, ...support].sort((a, b) => a - b);
    if (!isPlayableGrip(finalPitches) && support.length > 0) {
      finalPitches = [pitch, ...support.slice(0, 1)].sort((a, b) => a - b);
    }

    const role = finalPitches.length >= 3 ? 'triad' : finalPitches.length === 2 ? 'shell' : 'melody';
    events.push({
      pitches: finalPitches,
      duration,
      beatPosition: offset,
      staff: 1,
      voice: 1,
      role: role as 'melody' | 'shell' | 'triad' | 'voicing' | 'bass' | 'punctuation',
    });
  }

  // Fill any uncovered required chord beats with shell stabs (no melody)
  for (const beat of requiredChordBeats) {
    if (coveredChordBeats.has(beat)) continue;
    const chord = getChordAtBeat(harmony, beat);
    if (!chord) continue;
    const shell = shellVoicing(chord, 2).filter(p => p >= GUITAR_LOW && p <= GUITAR_HIGH);
    if (shell.length >= 2 && isPlayableGrip(shell)) {
      events.push({
        pitches: shell,
        duration: 0.5,
        beatPosition: beat,
        staff: 1,
        voice: 1,
        role: 'shell',
      });
    }
  }

  events.sort((a, b) => a.beatPosition - b.beatPosition);
  return events;
}

export function guitarEventsToTexture(
  melody: Note[],
  harmony: Chord[],
  options: GuitarVoicingOptions = {}
): { voice: number; notes: Note[] }[] {
  const events = generateGuitarEvents(melody, harmony, options);
  return eventsToTexture(events);
}
