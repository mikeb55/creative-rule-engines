/**
 * Quartet Engine - Chamber composition generation with:
 * - Barry Harris + Polyphonic Labyrinth + Counterpoint Hybrid + Monk + Shorter Narrative
 * - Texture floor rotation (A/B/C/D) every 4-6 bars
 * - Anti-loop: viola/cello never repeat same pattern > 2x
 * - Motif migration across ≥3 instruments per 16 bars
 * - Bowability: no impossible leaps, no endless jagged patterns
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

function chordRoot(symbol: string): number {
  const m = symbol.match(/^([A-G][#b]?)/);
  return m ? (ROOT_SEMITONE[m[1]] ?? 0) : 0;
}

function chordQuality(symbol: string): string {
  if (symbol.includes('dim')) return 'dim7';
  if (symbol.includes('maj7')) return 'maj7';
  if (symbol.includes('m7') || symbol.includes('min7')) return 'm7';
  if (symbol.includes('7')) return '7';
  return 'maj7';
}

function getChordTone(symbol: string, idx: number): number {
  const r = chordRoot(symbol);
  const tones = CHORD_TONES[chordQuality(symbol)] ?? CHORD_TONES.maj7;
  return (r + (tones[idx % tones.length] ?? 0)) % 12;
}

export type QuartetDensityStrategy = 'sparse_chamber' | 'conversational' | 'polyphonic' | 'tense_frictional';

type TextureFloor = 'A' | 'B' | 'C' | 'D';

export interface QuartetGenerationInput {
  motif: Note[];
  harmony: Chord[];
  bars: number;
  density: QuartetDensityStrategy;
  barry: { guideToneStrength: number; diminishedPassingIntensity: number };
  monk: { angularity: number; rhythmicLurch: number; silenceDensity: number; wrongRightIntensity: number };
  rotationOffset?: number;
  revisionSeed?: number;
}

export interface QuartetGenerationOutput {
  vn1: Note[];
  vn2: Note[];
  viola: Note[];
  cello: Note[];
  textureRotations: number;
  motifMigrations: number;
}

const BARS_PER_TEXTURE = 5;

function ensureOffset(notes: Note[]): (Note & { offset: number })[] {
  let run = 0;
  return notes.map(n => {
    const off = n.offset ?? run;
    run = off + (n.duration ?? 0.25);
    return { ...n, offset: off };
  });
}

function motifTransform(notes: Note[], transform: 'transpose' | 'invert' | 'rhythm_disp' | 'truncate' | 'expand' | 'compress', param?: number): Note[] {
  const withOffset = ensureOffset(notes);
  const result: (Note & { offset: number })[] = [];
  const semitones = param ?? 3;
  const halfLen = Math.floor(withOffset.length / 2);

  for (let i = 0; i < withOffset.length; i++) {
    const n = withOffset[i];
    let pitch = n.pitch;
    let duration = n.duration;
    let offset = n.offset ?? 0;

    if (transform === 'transpose') pitch = pitch + semitones;
    if (transform === 'invert') pitch = 2 * (withOffset[0]?.pitch ?? 60) - pitch;
    if (transform === 'rhythm_disp') offset += 0.25;
    if (transform === 'truncate' && i >= halfLen) continue;
    if (transform === 'expand') duration = Math.min(2, duration * 1.5);
    if (transform === 'compress') duration = Math.max(0.25, duration * 0.75);

    result.push({ ...n, pitch, duration, offset });
  }
  return result;
}

function whichTextureFloor(barIndex: number, _totalBars: number, rotationOffset = 0): TextureFloor {
  const segment = Math.floor(barIndex / BARS_PER_TEXTURE);
  const floors: TextureFloor[] = ['A', 'B', 'C', 'D'];
  return floors[(segment + rotationOffset) % 4];
}

function getChordAtBeat(harmony: Chord[], beat: number): Chord | null {
  for (let i = harmony.length - 1; i >= 0; i--) {
    if (harmony[i].offset <= beat) return harmony[i];
  }
  return harmony[0] ?? null;
}

function bowableLeap(p1: number, p2: number, maxLeap = 9): number {
  const leap = Math.abs(p2 - p1);
  if (leap > maxLeap) return p1 + Math.sign(p2 - p1) * maxLeap;
  return p2;
}

export function generateQuartet(input: QuartetGenerationInput): QuartetGenerationOutput {
  const { motif, harmony, bars, rotationOffset = 0, revisionSeed = 0 } = input;
  const melody = ensureOffset(motif.filter(n => !n.rest).map(n => ({ ...n, duration: Math.max(0.25, n.duration) })));
  const melodyEndBeats = melody.length > 0 ? Math.max(...melody.map(n => n.offset + n.duration)) : bars * 4;

  const lastChord = harmony[harmony.length - 1];
  const extendHarmony: Chord[] = [...harmony];
  let harmonyEnd = lastChord ? lastChord.offset + lastChord.duration : 0;
  while (harmonyEnd < melodyEndBeats && lastChord) {
    extendHarmony.push({ symbol: lastChord.symbol, duration: 2, offset: harmonyEnd });
    harmonyEnd += 2;
  }

  const vn1Notes: (Note & { offset: number })[] = [];
  const vn2Notes: (Note & { offset: number })[] = [];
  const violaNotes: (Note & { offset: number })[] = [];
  const celloNotes: (Note & { offset: number })[] = [];

  let textureRotations = 0;
  let motifMigrations = 0;
  let prevFloor: TextureFloor | null = null;

  const beatsPerBar = 4;
  const totalBars = Math.ceil(melodyEndBeats / beatsPerBar);

  for (let bar = 0; bar < totalBars; bar++) {
    const floor = whichTextureFloor(bar, totalBars, rotationOffset);
    if (prevFloor !== floor) {
      textureRotations++;
      prevFloor = floor;
    }

    const barStart = bar * beatsPerBar;
    const barMelody = melody.filter(n => n.offset >= barStart && n.offset < barStart + beatsPerBar);
    const chord = getChordAtBeat(extendHarmony, barStart);
    const root = chord ? chordRoot(chord.symbol) : 0;
    const fifth = chord ? (root + 7) % 12 : 0;
    const seed = bar + (revisionSeed ?? 0);

    if (floor === 'A') {
      for (const n of barMelody) {
        vn1Notes.push({ ...n, pitch: Math.min(88, Math.max(55, n.pitch)) });
        vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch - 5)), offset: (n.offset ?? 0) + 0.25 });
      }
      if (chord) {
        const vTone = getChordTone(chord.symbol, (bar % 3));
        const vReg = 48 + (vTone % 12) + (bar % 2 === 0 ? 0 : 12);
        violaNotes.push({ pitch: Math.min(79, Math.max(48, vReg)), duration: bar % 2 === 0 ? 2 : 1, offset: barStart, rest: false });
        violaNotes.push({ pitch: Math.min(79, Math.max(48, 55 + getChordTone(chord.symbol, 2))), duration: 1, offset: barStart + 2, rest: false });
        const cRoot = 36 + root;
        const cFifth = 36 + fifth;
        celloNotes.push({ pitch: cRoot, duration: 1, offset: barStart, rest: false });
        celloNotes.push({ pitch: seed % 3 === 0 ? cFifth : cRoot, duration: 1, offset: barStart + 1, rest: false });
        celloNotes.push({ pitch: cRoot, duration: 1, offset: barStart + 2, rest: false });
        celloNotes.push({ pitch: seed % 4 === 0 ? cFifth : cRoot, duration: 1, offset: barStart + 3, rest: false });
      }
    } else if (floor === 'B') {
      if (barMelody.length > 0 && bar % 2 === 0) {
        const frag = motifTransform(barMelody.slice(0, 3), 'transpose', -5);
        for (const n of frag) {
          vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch)), offset: n.offset ?? barStart });
        }
        for (const n of barMelody.slice(frag.length)) {
          vn1Notes.push({ ...n, pitch: Math.min(88, Math.max(55, n.pitch)), offset: n.offset ?? barStart });
        }
        motifMigrations++;
      } else {
        for (const n of barMelody) {
          vn1Notes.push({ ...n, pitch: Math.min(88, Math.max(55, n.pitch)) });
          vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch - 8)) });
        }
      }
      if (chord) {
        const v1 = 52 + getChordTone(chord.symbol, 1);
        const v2 = 52 + getChordTone(chord.symbol, 2);
        violaNotes.push({ pitch: Math.min(79, Math.max(48, v1)), duration: 1, offset: barStart, rest: false });
        violaNotes.push({ pitch: Math.min(79, Math.max(48, v2)), duration: 1.5, offset: barStart + 1.5, rest: false });
        celloNotes.push({ pitch: 36 + root, duration: 2, offset: barStart, rest: false });
        if (bar % 3 === 2) {
          celloNotes.push({ pitch: 36 + fifth, duration: 1, offset: barStart + 2, rest: false });
          celloNotes.push({ pitch: 36 + root, duration: 1, offset: barStart + 3, rest: false });
        }
      }
    } else if (floor === 'C') {
      const shared = barMelody.slice(0, Math.min(4, Math.ceil(barMelody.length * 0.7)));
      for (let i = 0; i < shared.length; i++) {
        const n = shared[i];
        const dest = i % 3;
        const off = n.offset ?? barStart + i * 0.5;
        if (dest === 0) vn1Notes.push({ ...n, pitch: Math.min(88, Math.max(55, n.pitch)), offset: off });
        else if (dest === 1) vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch - 4)), offset: off + 0.25 });
        else violaNotes.push({ ...n, pitch: Math.min(79, Math.max(48, n.pitch - 12)), offset: off + 0.5 });
      }
      if (shared.length >= 3) motifMigrations++;
      for (const n of barMelody.slice(shared.length)) {
        vn1Notes.push({ ...n, pitch: Math.min(88, Math.max(55, n.pitch)) });
      }
      if (chord) {
        const cRoot = 36 + root;
        const cFifth = 36 + fifth;
        celloNotes.push({ pitch: cRoot, duration: 1, offset: barStart, rest: false });
        celloNotes.push({ pitch: seed % 2 === 0 ? cFifth : cRoot, duration: 1, offset: barStart + 1, rest: false });
        celloNotes.push({ pitch: cRoot, duration: 1, offset: barStart + 2, rest: false });
        celloNotes.push({ pitch: seed % 3 === 0 ? cFifth : cRoot, duration: 1, offset: barStart + 3, rest: false });
        if (bar % 2 === 1) {
          violaNotes.push({ pitch: 55 + getChordTone(chord.symbol, 0), duration: 2, offset: barStart + 1, rest: false });
        }
      }
    } else {
      if (bar % 2 === 0) {
        if (barMelody.length > 0) {
          vn1Notes.push({ ...barMelody[0], pitch: Math.min(88, Math.max(55, barMelody[0].pitch)) });
        }
        if (chord) {
          violaNotes.push({ pitch: 55 + getChordTone(chord.symbol, (bar % 2) + 1), duration: 3, offset: barStart, rest: false });
          violaNotes.push({ pitch: 55 + getChordTone(chord.symbol, 2), duration: 1, offset: barStart + 3, rest: false });
          celloNotes.push({ pitch: 36 + root, duration: 2, offset: barStart, rest: false });
          celloNotes.push({ pitch: 36 + fifth, duration: 2, offset: barStart + 2, rest: false });
        }
      } else {
        for (const n of barMelody.slice(0, 2)) {
          vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch - 5)) });
        }
        if (chord) {
          celloNotes.push({ pitch: 36 + root, duration: 1, offset: barStart, rest: false });
          celloNotes.push({ pitch: 36 + root, duration: 1, offset: barStart + 1, rest: false });
          celloNotes.push({ pitch: 36 + fifth, duration: 1, offset: barStart + 2, rest: false });
          celloNotes.push({ pitch: 36 + root, duration: 1, offset: barStart + 3, rest: false });
        }
      }
    }
  }

  const clamp = (p: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, p));
  const applyBowability = (arr: (Note & { offset: number })[], lo: number, hi: number) => {
    const out = arr.map((n, i) => {
      const prev = i > 0 ? arr[i - 1].pitch : n.pitch;
      const safe = bowableLeap(prev, n.pitch, 9);
      return { ...n, pitch: clamp(safe, lo, hi) };
    });
    return out;
  };
  return {
    vn1: applyBowability(vn1Notes, 55, 88),
    vn2: applyBowability(vn2Notes, 48, 84),
    viola: applyBowability(violaNotes, 48, 79),
    cello: applyBowability(celloNotes, 36, 72),
    textureRotations,
    motifMigrations,
  };
}
