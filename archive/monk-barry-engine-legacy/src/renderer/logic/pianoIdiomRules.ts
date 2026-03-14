/**
 * Piano Idiom Rules — Two-hand logic, LH/RH independence, phrase breathing.
 */
import type { Note, Chord } from './types';
import { getChordTones, guideToneDyad, shellVoicing, compactTriad } from './voicingFamilies';
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

export interface PianoTexture {
  rightHand: Note[];
  leftHand: Note[];
}

/** Apply piano idiom: independent LH/RH, shells, guide tones, phrase structure */
export function applyPianoIdiom(
  melody: Note[],
  harmony: Chord[],
  options: {
    bars?: number;
    monkMode?: boolean;
    barryMode?: boolean;
  } = {}
): PianoTexture {
  const bars = options.bars ?? (Math.ceil((melody[melody.length - 1]?.offset ?? 0) / BEATS_PER_BAR) || 8);
  const monkMode = options.monkMode ?? false;
  const barryMode = options.barryMode ?? true;
  const rng = () => Math.random();

  const { starts: phraseStarts, lengths: phraseLengths } = buildPhrases(bars, rng);
  const rightHand: Note[] = [];
  const leftHand: Note[] = [];

  const harmonizeRatio = 0.45;

  for (const n of melody) {
    if (n.rest) continue;
    const offset = n.offset ?? 0;
    const chord = getChordAtBeat(harmony, offset);
    const pitch = Math.min(PIANO_HIGH, Math.max(RH_LOW, n.pitch));
    rightHand.push({
      pitch,
      duration: n.duration ?? 0.5,
      offset,
      rest: false,
    });
    if (chord && rng() < harmonizeRatio) {
      const triad = compactTriad(chord, 4);
      const below = triad.filter(p => p < pitch && p >= RH_LOW).slice(0, 2);
      for (const p of below) {
        rightHand.push({ pitch: p, duration: n.duration ?? 0.5, offset, rest: false });
      }
    }
  }

  let beatIndex = 0;
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
      const target = ZONE_DENSITY[zone] * 0.5;

      const hasLH = chord && rng() < target;

      if (hasLH && chord) {
        const variant = beatIndex % 4;
        const dyad = variant === 0 ? guideToneDyad(chord, 2, '37')
          : variant === 1 ? guideToneDyad(chord, 2, '73')
          : shellVoicing(chord, 2).slice(0, 2);
        const dur = 0.5 + (rng() < 0.25 ? 0.5 : 0);
        for (const p of dyad) {
          if (p >= LH_LOW && p <= LH_HIGH) {
            leftHand.push({ pitch: p, duration: dur, offset, rest: false });
          }
        }
      }
      beatIndex++;
    }
  }

  rightHand.sort((a, b) => ((a.offset ?? 0) - (b.offset ?? 0)) || ((b.pitch ?? 0) - (a.pitch ?? 0)));
  leftHand.sort((a, b) => ((a.offset ?? 0) - (b.offset ?? 0)) || ((b.pitch ?? 0) - (a.pitch ?? 0)));

  return { rightHand, leftHand };
}

/** Reject piano output if LH/RH are same stream or every beat filled */
export function validatePianoIdiom(texture: PianoTexture, bars: number): { pass: boolean; reason?: string } {
  const rh = texture.rightHand.filter(n => !n.rest);
  const lh = texture.leftHand.filter(n => !n.rest);
  const totalBeats = bars * BEATS_PER_BAR;
  const rhBeats = new Set(rh.map(n => Math.floor((n.offset ?? 0) * 4) / 4)).size;
  const lhBeats = new Set(lh.map(n => Math.floor((n.offset ?? 0) * 4) / 4)).size;
  const density = (rhBeats + lhBeats) / (totalBeats * 2);

  if (density > 0.85) return { pass: false, reason: 'Every beat filled' };
  if (lh.length < 4) return { pass: false, reason: 'No LH independence' };
  if (rh.length < 8) return { pass: false, reason: 'Too few RH notes' };
  return { pass: true };
}
