/**
 * Big Band Idiom Rules — Hierarchical 6-staff sketch generation.
 * Pipeline: motif → melody (Alto) → counterline (Tenor) → pads (Trombone) → comping (Piano) → bass (Bass).
 * Trumpet: punctuation hits, upper harmony reinforcement.
 */
import type { Note, Chord } from './types';
import { getChordTones, guideToneDyad, shellVoicing, compactTriad } from './voicingFamilies';
import { getPhraseZone, buildPhrases, ZONE_DENSITY } from './phraseTemplates';
import { BIG_BAND_TEMPLATE } from './bigBandTemplate';

const BEATS_PER_BAR = 4;
const ALTO_RANGE = [55, 84];
const TENOR_RANGE = [48, 76];
const TROMBONE_RANGE = [36, 60];
const TRUMPET_RANGE = [60, 84];
const PIANO_RH = [60, 88];
const PIANO_LH = [36, 60];
const BASS_RANGE = [28, 48];

function getChordAtBeat(harmony: Chord[], offset: number): Chord | undefined {
  for (let i = harmony.length - 1; i >= 0; i--) {
    if (harmony[i].offset <= offset) return harmony[i];
  }
  return harmony[0];
}

function clamp(p: number, [lo, hi]: [number, number]): number {
  return Math.min(hi, Math.max(lo, p));
}

/** Section density: opening = melody+bass only; development = full texture; release = reduce */
function getSectionDensity(zone: string, partRole: string): number {
  const base = ZONE_DENSITY[zone as keyof typeof ZONE_DENSITY] ?? 0.5;
  if (zone === 'opening') {
    if (partRole === 'melody' || partRole === 'bass') return base * 1.2;
    return 0;
  }
  if (zone === 'development') {
    if (partRole === 'melody' || partRole === 'bass') return base;
    if (partRole === 'counterline' || partRole === 'comping') return base * 0.7;
    if (partRole === 'pad' || partRole === 'punctuation') return base * 0.5;
    return 0;
  }
  if (zone === 'release') {
    if (partRole === 'melody' || partRole === 'bass') return base * 0.9;
    if (partRole === 'counterline' || partRole === 'comping') return base * 0.4;
    if (partRole === 'pad' || partRole === 'punctuation') return base * 0.15;
    return 0;
  }
  if (zone === 'cadence') {
    if (partRole === 'melody' || partRole === 'bass') return base;
    return base * 0.25;
  }
  return base;
}

export function applyBigBandIdiom(
  melody: Note[],
  harmony: Chord[],
  options: {
    bars?: number;
    monkMode?: boolean;
    barryMode?: boolean;
  } = {}
): { voice: number; notes: (Note & { _voice?: number })[] }[] {
  const bars = options.bars ?? (Math.ceil((melody[melody.length - 1]?.offset ?? 0) / BEATS_PER_BAR) || 8);
  const rng = () => Math.random();
  const { starts: phraseStarts, lengths: phraseLengths } = buildPhrases(bars, rng);

  const trumpet: Note[] = [];
  const altoSax: Note[] = [];
  const tenorSax: Note[] = [];
  const trombone: Note[] = [];
  const pianoRH: (Note & { _voice?: number })[] = [];
  const pianoLH: (Note & { _voice?: number })[] = [];
  const bass: Note[] = [];

  // 1. Melody → Alto Sax (primary melody carrier)
  for (const n of melody) {
    if (n.rest) continue;
    altoSax.push({
      pitch: clamp(n.pitch, ALTO_RANGE),
      duration: n.duration ?? 0.5,
      offset: n.offset ?? 0,
      rest: false,
    });
  }

  // 2. Bass (root motion, walking fragments)
  for (let bar = 0; bar < bars; bar++) {
    for (let b = 0; b < BEATS_PER_BAR; b++) {
      const offset = bar * BEATS_PER_BAR + b;
      const chord = getChordAtBeat(harmony, offset);
      if (!chord) continue;
      const pcs = getChordTones(chord.symbol);
      const root = pcs[0];
      const pitch = 36 + root + (bar % 2) * 12;
      if (rng() < 0.75) {
        bass.push({ pitch: clamp(pitch, BASS_RANGE), duration: 0.5, offset, rest: false });
      }
    }
  }

  // 3. Counterline (Tenor Sax) — derived from harmony, complementary to melody
  for (let bar = 0; bar < bars; bar++) {
    const phraseIdx = phraseStarts.findIndex((s, i) => bar >= s && bar < s + (phraseLengths[i] ?? 4));
    const phraseStart = phraseIdx >= 0 ? phraseStarts[phraseIdx]! : 0;
    const phraseLen = phraseIdx >= 0 ? (phraseLengths[phraseIdx] ?? 4) : 4;
    const zone = getPhraseZone(bar - phraseStart, phraseLen);
    const density = getSectionDensity(zone, 'counterline');
    if (density <= 0 && zone !== 'development') continue;

    const offset = bar * BEATS_PER_BAR + (rng() < 0.5 ? 1 : 2.5);
    const chord = getChordAtBeat(harmony, offset);
    const threshold = zone === 'opening' ? 0 : Math.max(0.5, density);
    if (chord && rng() < threshold) {
      const dyad = guideToneDyad(chord, 4, rng() < 0.5 ? '37' : '73');
      for (const p of dyad) {
        tenorSax.push({ pitch: clamp(p, TENOR_RANGE), duration: 0.5, offset, rest: false });
      }
    }
  }
  if (tenorSax.length < 4) {
    for (let i = 0; i < 2; i++) {
      const bar = Math.floor(i * bars / 2);
      const offset = bar * BEATS_PER_BAR + 1;
      const chord = getChordAtBeat(harmony, offset);
      if (chord) {
        const dyad = guideToneDyad(chord, 4, '37');
        for (const p of dyad) {
          tenorSax.push({ pitch: clamp(p, TENOR_RANGE), duration: 0.5, offset, rest: false });
        }
      }
    }
  }

  // 4. Harmonic pads (Trombone) — sustained, lower harmony
  for (let bar = 0; bar < bars; bar++) {
    const phraseIdx = phraseStarts.findIndex((s, i) => bar >= s && bar < s + (phraseLengths[i] ?? 4));
    const phraseStart = phraseIdx >= 0 ? phraseStarts[phraseIdx]! : 0;
    const phraseLen = phraseIdx >= 0 ? (phraseLengths[phraseIdx] ?? 4) : 4;
    const zone = getPhraseZone(bar - phraseStart, phraseLen);
    const density = getSectionDensity(zone, 'pad');
    if (density <= 0 || zone === 'opening') continue;

    const offset = bar * BEATS_PER_BAR + 1;
    const chord = getChordAtBeat(harmony, offset);
    if (chord && rng() < Math.max(0.4, density)) {
      const shell = shellVoicing(chord, 2);
      for (const p of shell.slice(0, 2)) {
        trombone.push({ pitch: clamp(p, TROMBONE_RANGE), duration: 1.5, offset, rest: false });
      }
    }
  }

  // 5. Comping (Piano) — harmonic rhythm, chord reinforcement
  for (let bar = 0; bar < bars; bar++) {
    const phraseIdx = phraseStarts.findIndex((s, i) => bar >= s && bar < s + (phraseLengths[i] ?? 4));
    const phraseStart = phraseIdx >= 0 ? phraseStarts[phraseIdx]! : 0;
    const phraseLen = phraseIdx >= 0 ? (phraseLengths[phraseIdx] ?? 4) : 4;
    const zone = getPhraseZone(bar - phraseStart, phraseLen);
    const density = getSectionDensity(zone, 'comping');
    if (density <= 0) continue;

    for (let b = 0; b < BEATS_PER_BAR; b += 2) {
      const offset = bar * BEATS_PER_BAR + b;
      const chord = getChordAtBeat(harmony, offset);
      if (chord && rng() < density * 0.6) {
        const shell = shellVoicing(chord, 3);
        for (const p of shell.slice(0, 2)) {
          if (p >= 60) {
            pianoRH.push({ pitch: clamp(p, PIANO_RH), duration: 0.5, offset, rest: false, _voice: 1 });
          } else {
            pianoLH.push({ pitch: clamp(p, PIANO_LH), duration: 0.5, offset, rest: false, _voice: 2 });
          }
        }
      }
    }
  }

  // 6. Trumpet — punctuation hits, upper harmony reinforcement
  for (let bar = 0; bar < bars; bar++) {
    const phraseIdx = phraseStarts.findIndex((s, i) => bar >= s && bar < s + (phraseLengths[i] ?? 4));
    const phraseStart = phraseIdx >= 0 ? phraseStarts[phraseIdx]! : 0;
    const phraseLen = phraseIdx >= 0 ? (phraseLengths[phraseIdx] ?? 4) : 4;
    const zone = getPhraseZone(bar - phraseStart, phraseLen);
    const density = getSectionDensity(zone, 'punctuation');
    if (density <= 0 || zone === 'opening' || zone === 'cadence') continue;

    const offset = bar * BEATS_PER_BAR + (bar % 2 === 0 ? 0 : 2);
    const chord = getChordAtBeat(harmony, offset);
    if (chord && rng() < density) {
      const triad = compactTriad(chord, 5);
      const top = triad[triad.length - 1];
      trumpet.push({ pitch: clamp(top, TRUMPET_RANGE), duration: 0.25, offset, rest: false });
    }
  }

  const pianoNotes = [...pianoRH, ...pianoLH].sort((a, b) => (a.offset ?? 0) - (b.offset ?? 0));

  return [
    { voice: 1, notes: trumpet },
    { voice: 2, notes: altoSax },
    { voice: 3, notes: tenorSax },
    { voice: 4, notes: trombone },
    { voice: 5, notes: pianoNotes },
    { voice: 6, notes: bass },
  ];
}

export function validateBigBandIdiom(parts: { voice: number; notes: Note[] }[]): { pass: boolean; reason?: string } {
  if (!parts || parts.length !== 6) return { pass: false, reason: 'Need 6 parts' };

  const melodyPart = parts[1]?.notes ?? [];
  const counterPart = parts[2]?.notes ?? [];
  const padPart = parts[3]?.notes ?? [];
  const bassPart = parts[5]?.notes ?? [];

  if (melodyPart.filter(n => !n.rest).length < 4) return { pass: false, reason: 'No melody layer' };
  if (counterPart.filter(n => !n.rest).length < 4) return { pass: false, reason: 'No counterline layer' };
  if (padPart.filter(n => !n.rest).length < 2) return { pass: false, reason: 'No harmonic pad layer' };
  if (bassPart.filter(n => !n.rest).length < 4) return { pass: false, reason: 'No bass line' };

  const totalNotes = parts.reduce((s, p) => s + (p.notes?.filter(n => !n.rest).length ?? 0), 0);
  if (totalNotes < 24) return { pass: false, reason: 'Too few notes' };

  const byOffset = new Map<number, number>();
  for (const p of parts) {
    for (const n of p.notes ?? []) {
      if (n.rest) continue;
      const o = Math.round((n.offset ?? 0) * 4) / 4;
      byOffset.set(o, (byOffset.get(o) ?? 0) + 1);
    }
  }
  const maxSimul = Math.max(0, ...byOffset.values());
  if (maxSimul < 2) return { pass: false, reason: 'Ensemble simultaneity trivial' };

  const activeParts = parts.filter(p => (p.notes?.filter(n => !n.rest).length ?? 0) > 0).length;
  if (activeParts < 2) return { pass: false, reason: 'Only one staff has notes' };

  return { pass: true };
}
