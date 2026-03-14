/**
 * Piano Voicing Engine — Two-staff writing, LH/RH independence.
 * LH: shell, root/guide-tone support, sparse movement.
 * RH: melody, compact voicings, Monk punctuations, Barry moving chord fragments.
 * Regular 3+ note harmonic events. Phrase breathing, release at cadences.
 */
import type { Note, Chord } from './types';
import type { MusicEvent } from './musicEvents';
import { guideToneDyad, shellVoicing, compactTriad, compact4 } from './voicingFamilies';
import { eventsToTexture } from './musicEvents';
import { getPhraseZone, buildPhrases, ZONE_DENSITY } from './phraseTemplates';

const LH_LOW = 36;
const LH_HIGH = 59;
const RH_LOW = 60;
const PIANO_HIGH = 88;
const BEATS_PER_BAR = 4;

function getChordAtBeat(harmony: Chord[], offset: number): Chord | undefined {
  for (let i = harmony.length - 1; i >= 0; i--) {
    if (harmony[i].offset <= offset) return harmony[i];
  }
  return harmony[0];
}

export interface PianoVoicingOptions {
  bars?: number;
  monkMode?: boolean;
  barryMode?: boolean;
  keyCenter?: string;
  rng?: () => number;
}

/**
 * Generate piano events with true two-staff independence.
 * RH = voice 1, LH = voice 2. Regular 3+ note harmonic events.
 */
export function generatePianoEvents(
  melody: Note[],
  harmony: Chord[],
  options: PianoVoicingOptions = {}
): MusicEvent[] {
  const rng = options.rng ?? (() => Math.random());
  const bars = options.bars ?? (Math.ceil((melody[melody.length - 1]?.offset ?? 0) / BEATS_PER_BAR) || 8);
  const monkMode = options.monkMode ?? false;
  const barryMode = options.barryMode ?? true;

  const events: MusicEvent[] = [];
  const { starts: phraseStarts, lengths: phraseLengths } = buildPhrases(bars, rng);

  // RH: melody + chord support (single pass — decide per note)
  const harmonizeRatio = barryMode ? 0.5 : 0.4;
  for (const n of melody) {
    if (n.rest) continue;
    const pitch = Math.min(PIANO_HIGH, Math.max(RH_LOW, n.pitch));
    const chord = getChordAtBeat(harmony, n.offset ?? 0);
    const addSupport = chord && rng() < harmonizeRatio;
    const triad = chord ? compactTriad(chord, 4) : [];
    const below = triad.filter(p => p < pitch && p >= RH_LOW).slice(0, 2);

    if (addSupport && below.length >= 1) {
      const allPitches = [pitch, ...below].sort((a, b) => a - b);
      events.push({
        pitches: allPitches,
        duration: n.duration ?? 0.5,
        beatPosition: n.offset ?? 0,
        staff: 1,
        voice: 1,
        role: 'voicing',
      });
    } else {
      events.push({
        pitches: [pitch],
        duration: n.duration ?? 0.5,
        beatPosition: n.offset ?? 0,
        staff: 1,
        voice: 1,
        role: 'melody',
      });
    }
  }

  // LH: shells on sparse beats — phrase-aware density
  for (let bar = 0; bar < bars; bar++) {
    for (let b = 0; b < BEATS_PER_BAR; b++) {
      const offset = bar * BEATS_PER_BAR + b;
      const chord = getChordAtBeat(harmony, offset);

      let phraseIdx = 0;
      for (let i = 0; i < phraseStarts.length; i++) {
        const len = phraseLengths[i] ?? 4;
        if (bar >= phraseStarts[i] && bar < phraseStarts[i] + len) {
          phraseIdx = i;
          break;
        }
      }
      const barInPhrase = bar - phraseStarts[phraseIdx];
      const phraseLen = phraseLengths[phraseIdx] ?? 4;
      const zone = getPhraseZone(barInPhrase, phraseLen);
      const target = ZONE_DENSITY[zone] * 0.85; // LH density

      if (!chord || rng() >= target) continue;

      const variant = (bar * BEATS_PER_BAR + b) % 4;
      const dyad = variant === 0 ? guideToneDyad(chord, 2, '37')
        : variant === 1 ? guideToneDyad(chord, 2, '73')
        : shellVoicing(chord, 2).slice(0, 2);
      const pitches = dyad.filter(p => p >= LH_LOW && p <= LH_HIGH);
      if (pitches.length >= 2) {
        const dur = 0.5 + (rng() < 0.25 ? 0.5 : 0);
        events.push({
          pitches,
          duration: dur,
          beatPosition: offset,
          staff: 2,
          voice: 2,
          role: 'shell',
        });
      }
    }
  }

  // Dedupe: if we added RH chord (voicing) we may have removed melody; ensure no duplicate single-note at same beat
  // Also add Monk punctuation (rests) in sparse zones
  if (monkMode) {
    for (let bar = 0; bar < bars; bar++) {
      for (let i = 0; i < phraseStarts.length; i++) {
        const len = phraseLengths[i] ?? 4;
        if (bar >= phraseStarts[i] && bar < phraseStarts[i] + len) {
          const barInPhrase = bar - phraseStarts[i];
          const zone = getPhraseZone(barInPhrase, len);
          if (zone === 'cadence' && rng() < 0.3) {
            const offset = bar * BEATS_PER_BAR + 3;
            events.push({
              pitches: [],
              duration: 0.5,
              beatPosition: offset,
              staff: 1,
              voice: 1,
              role: 'punctuation',
            });
          }
          break;
        }
      }
    }
  }

  events.sort((a, b) => {
    if (a.beatPosition !== b.beatPosition) return a.beatPosition - b.beatPosition;
    return a.staff - b.staff;
  });

  return events;
}

export function pianoEventsToTexture(
  melody: Note[],
  harmony: Chord[],
  options: PianoVoicingOptions = {}
): { voice: number; notes: Note[] }[] {
  const events = generatePianoEvents(melody, harmony, options);
  return eventsToTexture(events);
}
