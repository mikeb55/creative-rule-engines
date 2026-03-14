/**
 * Piano Voicing Engine
 * Converts single-note melody into polyphonic piano texture:
 * triads, shell voicings, guide-tone dyads, melody + bass.
 */
import type { Note, Chord } from './types';

const ROOT_SEMITONE: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

const CHORD_TONES: Record<string, number[]> = {
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  '7': [0, 4, 7, 10],
  dim7: [0, 3, 6, 9],
};

function chordQuality(symbol: string): string {
  if (symbol.includes('dim')) return 'dim7';
  if (symbol.includes('maj7')) return 'maj7';
  if (symbol.includes('m7') || symbol.includes('min7')) return 'm7';
  if (symbol.includes('7')) return '7';
  return 'maj7';
}

function chordRoot(symbol: string): number {
  const m = symbol.match(/^([A-G][#b]?)/);
  return m ? (ROOT_SEMITONE[m[1]] ?? 0) : 0;
}

function getChordTones(symbol: string): number[] {
  const root = chordRoot(symbol);
  const quality = chordQuality(symbol);
  const tones = CHORD_TONES[quality] ?? CHORD_TONES.maj7;
  return tones.map(t => (root + t) % 12);
}

function getChordAtBeat(harmony: Chord[], offset: number): Chord | undefined {
  for (let i = harmony.length - 1; i >= 0; i--) {
    if (harmony[i].offset <= offset) return harmony[i];
  }
  return harmony[0];
}

const PIANO_LOW = 21;
const PIANO_HIGH = 88;
/** Minimum pitch for support tones - avoid sub-bass that clutters notation */
const PIANO_SUPPORT_LOW = 36; // C2

function supportTonesForMelody(
  melodyPitch: number,
  chord: Chord,
  voicingType: 'dyad' | 'shell' | 'triad'
): number[] {
  const pcs = getChordTones(chord.symbol);
  const refOct = Math.floor(melodyPitch / 12);
  const candidates: number[] = [];

  for (let oct = Math.max(2, refOct - 2); oct <= refOct; oct++) {
    for (const pc of pcs) {
      const p = oct * 12 + pc;
      if (p < melodyPitch && p >= PIANO_SUPPORT_LOW && p <= PIANO_HIGH) {
        candidates.push(p);
      }
    }
  }

  const unique = [...new Set(candidates)].sort((a, b) => b - a);
  if (unique.length === 0) return [];

  const pcOf = (midi: number) => ((midi % 12) + 12) % 12;

  if (voicingType === 'dyad') {
    const third = pcs[1];
    const seventh = pcs[3] ?? pcs[2];
    return unique.filter(p => pcOf(p) === third || pcOf(p) === seventh).slice(0, 2).sort((a, b) => a - b);
  }

  if (voicingType === 'shell') {
    const root = pcs[0];
    const third = pcs[1];
    const seventh = pcs[3] ?? pcs[2];
    const out: number[] = [];
    const r = unique.find(p => pcOf(p) === root);
    if (r) out.push(r);
    const t = unique.find(p => pcOf(p) === third);
    if (t && !out.includes(t)) out.push(t);
    else {
      const s = unique.find(p => pcOf(p) === seventh);
      if (s && !out.includes(s)) out.push(s);
    }
    return out.sort((a, b) => a - b).slice(0, 2);
  }

  const [r, t, f] = [pcs[0], pcs[1], pcs[2]];
  const out: number[] = [];
  for (const u of unique) {
    const pc = pcOf(u);
    if (pc === r || pc === t || pc === f) out.push(u);
  }
  return [...new Set(out)].sort((a, b) => a - b).slice(0, 3);
}

export interface PianoVoicingOptions {
  harmonizeRatio?: number;
  keyCenter?: string;
}

export function applyPianoVoicing(
  melody: Note[],
  harmony: Chord[],
  _options: PianoVoicingOptions = {}
): Note[] {
  const voicingTypes: ('dyad' | 'shell' | 'triad')[] = ['dyad', 'shell', 'dyad', 'shell'];
  const result: Note[] = [];

  for (let i = 0; i < melody.length; i++) {
    const n = melody[i];
    const pitch = Math.min(PIANO_HIGH, Math.max(PIANO_LOW, n.pitch));
    const offset = n.offset ?? 0;
    const duration = n.duration ?? 0.5;

    if (n.rest) {
      result.push({ pitch: 0, duration, offset, rest: true });
      continue;
    }

    const chord = getChordAtBeat(harmony, offset);
    const shouldHarmonize = chord && (i % 4 === 0 || (i % 8 === 2 && Math.random() < 0.4));

    if (!shouldHarmonize || !chord) {
      result.push({ pitch, duration, offset, rest: false });
      continue;
    }

    const voicingType = voicingTypes[i % voicingTypes.length];
    let support = supportTonesForMelody(pitch, chord, voicingType);

    if (support.length === 0) {
      const fallback = pitch - 7;
      if (fallback >= PIANO_SUPPORT_LOW && fallback < pitch) support = [fallback];
    }

    result.push({ pitch, duration, offset, rest: false });
    for (const p of support) {
      result.push({ pitch: p, duration, offset, rest: false });
    }
  }

  return result.sort((a, b) => {
    const oa = a.offset ?? 0;
    const ob = b.offset ?? 0;
    if (oa !== ob) return oa - ob;
    return (b.pitch ?? 0) - (a.pitch ?? 0);
  });
}
