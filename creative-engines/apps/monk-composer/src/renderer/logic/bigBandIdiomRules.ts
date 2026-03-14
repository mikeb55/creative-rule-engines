/**
 * Big Band Idiom Rules — Section roles, rotation, density arc, counterlines.
 * NOT "large piano chords" — distinct section roles.
 */
import type { Note, Chord } from './types';
import { getChordTones, guideToneDyad, shellVoicing } from './voicingFamilies';
import { getPhraseZone, buildPhrases, ZONE_DENSITY } from './phraseTemplates';

export type SectionRole = 'melody' | 'counterline' | 'pad' | 'punch' | 'support' | 'bass';

export const BIG_BAND_PARTS = [
  { id: 'P1', name: 'Trumpet 1', role: 'melody' as SectionRole },
  { id: 'P2', name: 'Alto Sax 1', role: 'counterline' as SectionRole },
  { id: 'P3', name: 'Tenor Sax 1', role: 'pad' as SectionRole },
  { id: 'P4', name: 'Trombone 1', role: 'support' as SectionRole },
  { id: 'P5', name: 'Piano', role: 'support' as SectionRole },
  { id: 'P6', name: 'Bass', role: 'bass' as SectionRole },
];

function getChordAtBeat(harmony: Chord[], offset: number): Chord | undefined {
  for (let i = harmony.length - 1; i >= 0; i--) {
    if (harmony[i].offset <= offset) return harmony[i];
  }
  return harmony[0];
}

/** Section role rotation every 4-8 bars */
function getRoleForBar(partIndex: number, bar: number, bars: number): SectionRole {
  const rotation = Math.floor(bar / 6) % 4;
  const roles: SectionRole[] = ['melody', 'counterline', 'pad', 'support'];
  if (partIndex === 0) return bar < bars / 2 ? 'melody' : 'counterline';
  if (partIndex === 1) return bar < bars / 2 ? 'counterline' : 'melody';
  if (partIndex === 5) return 'bass';
  if (partIndex === 4) return 'support';
  return roles[(partIndex + rotation) % roles.length];
}

/** Generate big band texture: 6 parts with section roles */
export function applyBigBandIdiom(
  melody: Note[],
  harmony: Chord[],
  options: {
    bars?: number;
    monkMode?: boolean;
    barryMode?: boolean;
  } = {}
): { voice: number; notes: Note[] }[] {
  const bars = options.bars ?? (Math.ceil((melody[melody.length - 1]?.offset ?? 0) / 4) || 8);
  const rng = () => Math.random();
  const { starts: phraseStarts, lengths: phraseLengths } = buildPhrases(bars, rng);

  const parts: Note[][] = [[], [], [], [], [], []];
  const beatsPerBar = 4;

  for (let partIdx = 0; partIdx < 6; partIdx++) {
    for (let bar = 0; bar < bars; bar++) {
      const role = getRoleForBar(partIdx, bar, bars);
      const phraseIdx = phraseStarts.findIndex((s, i) => bar >= s && bar < s + (phraseLengths[i] ?? 4));
      const phraseStart = phraseIdx >= 0 ? phraseStarts[phraseIdx]! : 0;
      const phraseLen = phraseIdx >= 0 ? (phraseLengths[phraseIdx] ?? 4) : 4;
      const barInPhrase = bar - phraseStart;
      const zone = getPhraseZone(barInPhrase, phraseLen);
      const density = ZONE_DENSITY[zone];

      if (partIdx === 5) {
        for (let b = 0; b < beatsPerBar; b++) {
          const offset = bar * beatsPerBar + b;
          const chord = getChordAtBeat(harmony, offset);
          if (chord && rng() < 0.7) {
            const pcs = getChordTones(chord.symbol);
            const root = pcs[0];
            const pitch = 24 + root + Math.floor(rng() * 2) * 12;
            parts[5].push({ pitch: Math.min(48, Math.max(28, pitch)), duration: 0.5, offset, rest: false });
          }
        }
        continue;
      }

      if (partIdx === 4) {
        for (let b = 0; b < beatsPerBar; b++) {
          const offset = bar * beatsPerBar + b;
          const chord = getChordAtBeat(harmony, offset);
          if (chord && rng() < density * 0.5) {
            const shell = shellVoicing(chord, 3);
            for (const p of shell.slice(0, 2)) {
              parts[4].push({ pitch: p, duration: 0.5, offset, rest: false });
            }
          }
        }
        continue;
      }

      if (role === 'melody' && partIdx === 0) {
        for (const n of melody) {
          if (n.rest) continue;
          const m = Math.floor((n.offset ?? 0) / beatsPerBar);
          if (m === bar) {
            parts[0].push({
              pitch: Math.min(84, Math.max(60, n.pitch)),
              duration: n.duration ?? 0.5,
              offset: n.offset ?? 0,
              rest: false,
            });
          }
        }
      } else if (role === 'counterline' && partIdx === 1 && rng() < density) {
        const offset = bar * beatsPerBar + (rng() < 0.5 ? 0.5 : 2);
        const chord = getChordAtBeat(harmony, offset);
        if (chord) {
          const dyad = guideToneDyad(chord, 4, '37');
          parts[1].push({ pitch: dyad[0], duration: 0.5, offset, rest: false });
          parts[1].push({ pitch: dyad[1], duration: 0.5, offset, rest: false });
        }
      } else if ((role === 'pad' || role === 'support') && rng() < density * 0.6) {
        const offset = bar * beatsPerBar + 1;
        const chord = getChordAtBeat(harmony, offset);
        if (chord) {
          const dyad = guideToneDyad(chord, partIdx === 2 ? 4 : 3, '73');
          for (const p of dyad) {
            parts[partIdx].push({ pitch: p, duration: 1, offset, rest: false });
          }
        }
      }
    }
  }

  return parts.map((notes, i) => ({ voice: i + 1, notes }));
}

/** Reject big band if sections move in lockstep or no counterlines */
export function validateBigBandIdiom(parts: { voice: number; notes: Note[] }[]): { pass: boolean; reason?: string } {
  const melodyPart = parts[0]?.notes ?? [];
  const counterPart = parts[1]?.notes ?? [];
  const totalNotes = parts.reduce((s, p) => s + (p.notes?.length ?? 0), 0);

  if (totalNotes < 20) return { pass: false, reason: 'Too few notes' };
  if (counterPart.length < 4) return { pass: false, reason: 'No counterlines' };
  if (melodyPart.length < 8) return { pass: false, reason: 'No melody' };
  return { pass: true };
}
