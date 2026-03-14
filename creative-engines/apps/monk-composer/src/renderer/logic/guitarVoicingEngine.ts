/**
 * Guitar Voicing Engine — Fretboard-first, voicing-family only.
 * No pitch stacking. All chords from guitarVoicingFamilies via guitarFretboardEngine.
 * Voice-leading, comp patterns, texture mix enforced.
 */
import type { Note, Chord } from './types';
import type { MusicEvent } from './musicEvents';
import { eventsToTexture } from './musicEvents';
import { chooseNextVoicing, type VoiceLeadingContext } from './guitarVoiceLeading';
import {
  COMP_PATTERNS,
  getChordBeatsForBar,
  type CompPattern,
  type CompPatternId,
} from './guitarCompPatterns';
import { buildPhrases } from './phraseTemplates';
import type { VoicingFamilyId } from './guitarVoicingFamilies';

const GUITAR_LOW = 40;
const GUITAR_HIGH = 84;
const BEATS_PER_BAR = 4;
const MAX_SINGLE_NOTE_MEASURES = 3;

function getChordAtBeat(harmony: Chord[], offset: number): Chord | undefined {
  for (let i = harmony.length - 1; i >= 0; i--) {
    if (harmony[i].offset <= offset) return harmony[i];
  }
  return harmony[0];
}

export interface GuitarVoicingOptions {
  monkMode?: boolean;
  barryMode?: boolean;
  bars?: number;
  keyCenter?: string;
  rng?: () => number;
  revisionSeed?: number;
}

export interface GuitarGenerationResult {
  events: MusicEvent[];
  compPattern: CompPatternId;
  usedFamilyIds: VoicingFamilyId[];
}

const FAMILY_ORDERS: VoicingFamilyId[][] = [
  ['shell', 'guideTone', 'triad'],
  ['guideTone', 'shell', 'triad'],
  ['triad', 'shell', 'guideTone'],
  ['shell', 'triad', 'guideTone'],
  ['guideTone', 'triad', 'shell'],
];

/**
 * Generate guitar events from voicing families only. No pitch stacking.
 * Texture mix: at least one chord every 2 measures, max 3 consecutive single-note measures.
 */
export function generateGuitarEvents(
  melody: Note[],
  harmony: Chord[],
  options: GuitarVoicingOptions = {}
): GuitarGenerationResult {
  const rng = options.rng ?? (() => Math.random());
  const seed = options.revisionSeed ?? 0;
  const bars = options.bars ?? (Math.ceil((melody[melody.length - 1]?.offset ?? 0) / 4) || 8);
  const { starts: phraseStarts, lengths: phraseLengths } = buildPhrases(bars, rng);

  const pattern = COMP_PATTERNS[(seed % COMP_PATTERNS.length + COMP_PATTERNS.length) % COMP_PATTERNS.length];
  const voiceContext: VoiceLeadingContext = { lastVoicing: null, lastTopPitch: null };
  const events: MusicEvent[] = [];
  const usedFamilyIds = new Set<VoicingFamilyId>();

  const families = FAMILY_ORDERS[seed % FAMILY_ORDERS.length];
  let singleNoteRun = 0;

  for (let i = 0; i < melody.length; i++) {
    const n = melody[i];
    const offset = n.offset ?? 0;
    const duration = n.duration ?? 0.5;
    const bar = Math.floor(offset / BEATS_PER_BAR);
    const barInBar = offset - bar * BEATS_PER_BAR;

    if (n.rest) {
      events.push({
        pitches: [],
        duration,
        beatPosition: offset,
        staff: 1,
        voice: 1,
        role: 'punctuation',
      });
      singleNoteRun = 0;
      continue;
    }

    const pitch = Math.min(GUITAR_HIGH, Math.max(GUITAR_LOW, n.pitch));
    const chord = getChordAtBeat(harmony, offset);

    let phraseIdx = 0;
    for (let p = 0; p < phraseStarts.length; p++) {
      const len = phraseLengths[p] ?? 4;
      if (bar >= phraseStarts[p] && bar < phraseStarts[p] + len) {
        phraseIdx = p;
        break;
      }
    }
    const phraseStart = phraseStarts[phraseIdx] ?? 0;
    const phraseLen = phraseLengths[phraseIdx] ?? 4;
    const barInPhrase = bar - phraseStart;
    const chordBeats = getChordBeatsForBar(pattern, barInPhrase, phraseLen, BEATS_PER_BAR);
    const globalChordBeats = chordBeats.map(b => bar * BEATS_PER_BAR + b);

    const nearChordBeat = globalChordBeats.some(cb => Math.abs(cb - offset) < 0.6);
    const forceChord = singleNoteRun >= MAX_SINGLE_NOTE_MEASURES * 4;
    const onStrongBeat = Math.abs(offset % 1) < 0.2 || Math.abs(offset % 1 - 0.5) < 0.2;
    const shouldChord = chord && (nearChordBeat || forceChord || onStrongBeat) && rng() < 0.7;

    if (shouldChord && chord) {
      const voicing = chooseNextVoicing(chord, voiceContext, families);
      if (voicing && voicing.pitches.length >= 2) {
        usedFamilyIds.add(voicing.familyId);
        voiceContext.lastVoicing = voicing;
        voiceContext.lastTopPitch = Math.max(...voicing.pitches);
        events.push({
          pitches: voicing.pitches,
          duration,
          beatPosition: offset,
          staff: 1,
          voice: 1,
          role: voicing.pitches.length >= 3 ? 'triad' : 'shell',
        });
        singleNoteRun = 0;
        continue;
      }
    }

    events.push({
      pitches: [pitch],
      duration,
      beatPosition: offset,
      staff: 1,
      voice: 1,
      role: 'melody',
    });
    singleNoteRun++;
  }

  for (let bar = 0; bar < bars; bar++) {
    let phraseIdx = 0;
    for (let p = 0; p < phraseStarts.length; p++) {
      const len = phraseLengths[p] ?? 4;
      if (bar >= phraseStarts[p] && bar < phraseStarts[p] + len) {
        phraseIdx = p;
        break;
      }
    }
    const phraseStart = phraseStarts[phraseIdx] ?? 0;
    const phraseLen = phraseLengths[phraseIdx] ?? 4;
    const barInPhrase = bar - phraseStart;
    const chordBeats = getChordBeatsForBar(pattern, barInPhrase, phraseLen, BEATS_PER_BAR);

    const hasChordInBar = events.some(
      e => e.pitches.length >= 2 && Math.floor(e.beatPosition / BEATS_PER_BAR) === bar
    );
    if (!hasChordInBar && chordBeats.length > 0) {
      const beat = chordBeats[0];
      const offset = bar * BEATS_PER_BAR + beat;
      const chord = getChordAtBeat(harmony, offset);
      if (chord) {
        const voicing = chooseNextVoicing(chord, voiceContext, ['shell', 'guideTone']);
        if (voicing) {
          usedFamilyIds.add(voicing.familyId);
          voiceContext.lastVoicing = voicing;
          voiceContext.lastTopPitch = Math.max(...voicing.pitches);
          events.push({
            pitches: voicing.pitches,
            duration: 0.5,
            beatPosition: offset,
            staff: 1,
            voice: 1,
            role: 'shell',
          });
        }
      }
    }
  }

  events.sort((a, b) => a.beatPosition - b.beatPosition);
  return {
    events,
    compPattern: pattern.id,
    usedFamilyIds: [...usedFamilyIds],
  };
}

export interface GuitarTextureResult {
  texture: { voice: number; notes: Note[] }[];
  compPattern: CompPatternId;
  usedFamilyIds: VoicingFamilyId[];
}

export function guitarEventsToTexture(
  melody: Note[],
  harmony: Chord[],
  options: GuitarVoicingOptions = {}
): GuitarTextureResult {
  const result = generateGuitarEvents(melody, harmony, options);
  return {
    texture: eventsToTexture(result.events),
    compPattern: result.compPattern,
    usedFamilyIds: result.usedFamilyIds,
  };
}
