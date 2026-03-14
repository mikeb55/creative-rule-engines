/**
 * Piano Voicing Engine — Idiomatic Jazz Piano Reductions
 *
 * Two-hand architecture:
 * - Left hand: guide-tone shells (3–7 or 7–3), occasional root–7/root–3, sparse placement
 * - Right hand: melody fragments, triads/quartal shapes, Monk clusters, Barry Harris passing chords
 * - Never full triads in both hands simultaneously unless for emphasis
 *
 * Density: 40–60% of beats contain notes; bars must breathe.
 * Phrase structure: 4–8 bar phrases with opening → development → release → cadence.
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
/** Minimum pitch for left-hand support tones */
const LH_LOW = 36; // C2
const LH_HIGH = 59; // B3
const RH_LOW = 60; // Middle C

const BEATS_PER_BAR = 4;

export interface PianoVoicingOptions {
  harmonizeRatio?: number;
  keyCenter?: string;
  bars?: number;
}

/** Phrase zone within a phrase: opening | development | release | cadence */
type PhraseZone = 'opening' | 'development' | 'release' | 'cadence';

function getPhraseZone(barInPhrase: number, phraseLength: number): PhraseZone {
  if (barInPhrase === 0) return 'opening';
  if (barInPhrase >= phraseLength - 1) return 'cadence';
  if (barInPhrase === phraseLength - 2) return 'release';
  return 'development';
}

/** Target density per zone: 0 = no notes, 1 = full */
const ZONE_DENSITY: Record<PhraseZone, number> = {
  opening: 0.35,
  development: 0.55,
  release: 0.4,
  cadence: 0.3,
};

/** Decide if a beat should have LH activity (guide-tone shell) */
function shouldPlaceLH(
  barIndex: number,
  phraseStarts: number[],
  phraseLengths: number[],
  rng: () => number
): boolean {
  let phraseIdx = 0;
  for (let i = 0; i < phraseStarts.length; i++) {
    const len = phraseLengths[i] ?? 4;
    if (barIndex >= phraseStarts[i] && barIndex < phraseStarts[i] + len) {
      phraseIdx = i;
      break;
    }
  }
  const barInPhrase = barIndex - phraseStarts[phraseIdx];
  const phraseLen = phraseLengths[phraseIdx] ?? 4;
  const zone = getPhraseZone(barInPhrase, phraseLen);
  const target = ZONE_DENSITY[zone] * 0.5; // LH gets ~half of density
  return rng() < target;
}

/** Decide if a beat should have RH chord (triad/quartal) — not when LH has full chord */
function shouldPlaceRHChord(
  barIndex: number,
  phraseStarts: number[],
  phraseLengths: number[],
  hasLH: boolean,
  rng: () => number
): boolean {
  if (hasLH) return false; // avoid both hands full
  let phraseIdx = 0;
  for (let i = 0; i < phraseStarts.length; i++) {
    const len = phraseLengths[i] ?? 4;
    if (barIndex >= phraseStarts[i] && barIndex < phraseStarts[i] + len) {
      phraseIdx = i;
      break;
    }
  }
  const barInPhrase = barIndex - phraseStarts[phraseIdx];
  const phraseLen = phraseLengths[phraseIdx] ?? 4;
  const zone = getPhraseZone(barInPhrase, phraseLen);
  const target = ZONE_DENSITY[zone] * 0.35; // RH chord on ~35% of non-LH beats
  return rng() < target;
}

/** Build phrase boundaries: 4–8 bar phrases */
function buildPhrases(bars: number, rng: () => number): { starts: number[]; lengths: number[] } {
  const starts: number[] = [0];
  const lengths: number[] = [];
  let pos = 0;
  while (pos < bars) {
    const len = 4 + Math.floor(rng() * 5); // 4–8
    const actual = Math.min(len, bars - pos);
    lengths.push(actual);
    pos += actual;
    if (pos < bars) starts.push(pos);
  }
  return { starts, lengths };
}

/** Left-hand guide-tone shell: 3–7, 7–3, root–7, or root–3 */
function leftHandShellPitches(chord: Chord, octave: number, variant: '37' | '73' | 'r7' | 'r3'): number[] {
  const pcs = getChordTones(chord.symbol);
  const root = pcs[0];
  const third = pcs[1];
  const seventh = pcs[3] ?? pcs[2];
  const base = 12 * (octave + 1); // octave 2 -> C2 = 36
  const toMidi = (pc: number) => {
    let p = base + pc;
    while (p < LH_LOW) p += 12;
    while (p > LH_HIGH) p -= 12;
    return p;
  };
  if (variant === '37') return [toMidi(third), toMidi(seventh)].sort((a, b) => a - b);
  if (variant === '73') return [toMidi(seventh), toMidi(third)].sort((a, b) => a - b);
  if (variant === 'r7') return [toMidi(root), toMidi(seventh)].sort((a, b) => a - b);
  return [toMidi(root), toMidi(third)].sort((a, b) => a - b);
}

/** Right-hand triad (root, 3rd, 5th) below melody */
function rightHandTriadPitches(chord: Chord, refPitch: number): number[] {
  const pcs = getChordTones(chord.symbol);
  const [r, t, f] = [pcs[0], pcs[1], pcs[2]];
  const maxPc = Math.max(r, t, f);
  let oct = Math.floor(refPitch / 12);
  while (oct * 12 + maxPc >= refPitch - 2) oct--;
  const out: number[] = [];
  for (const pc of [r, t, f]) {
    let p = oct * 12 + pc;
    while (p < RH_LOW) p += 12;
    while (p > PIANO_HIGH) p -= 12;
    out.push(p);
  }
  return [...new Set(out)].sort((a, b) => a - b).slice(0, 3);
}

/** Quartal shape: stacked 4ths (5 semitones each) */
function rightHandQuartal(chord: Chord, refPitch: number): number[] {
  const pcs = getChordTones(chord.symbol);
  const third = pcs[1];
  const stack2 = (third + 5) % 12;
  const stack3 = (third + 10) % 12;
  let oct = Math.floor(refPitch / 12);
  const out: number[] = [];
  for (const pc of [third, stack2, stack3]) {
    let p = oct * 12 + pc;
    while (p < RH_LOW) p += 12;
    while (p > PIANO_HIGH) p -= 12;
    out.push(p);
  }
  return [...new Set(out)].sort((a, b) => a - b).slice(0, 3);
}

/** Monk-style cluster: adjacent semitones */
function rightHandMonkCluster(chord: Chord, refPitch: number): number[] {
  const pcs = getChordTones(chord.symbol);
  const third = pcs[1];
  const cluster = [third, (third + 1) % 12, (third + 2) % 12];
  let oct = Math.floor(refPitch / 12);
  const out: number[] = [];
  for (const pc of cluster) {
    let p = oct * 12 + pc;
    while (p < RH_LOW) p += 12;
    while (p > PIANO_HIGH) p -= 12;
    out.push(p);
  }
  return [...new Set(out)].sort((a, b) => a - b).slice(0, 3);
}

export interface PianoTexture {
  rightHand: Note[];
  leftHand: Note[];
}

export function applyPianoVoicing(
  melody: Note[],
  harmony: Chord[],
  options: PianoVoicingOptions = {}
): PianoTexture {
  const bars = options.bars ?? (Math.ceil((melody[melody.length - 1]?.offset ?? 0) / BEATS_PER_BAR) || 8);
  const rng = () => Math.random();
  const { starts: phraseStarts, lengths: phraseLengths } = buildPhrases(bars, rng);

  const rightHand: Note[] = [];
  const leftHand: Note[] = [];

  const LH_VARIANTS: Array<'37' | '73' | 'r7' | 'r3'> = ['37', '73', 'r7', 'r3'];
  const RH_VARIANTS: Array<'triad' | 'quartal' | 'monk'> = ['triad', 'quartal', 'triad', 'monk'];

  // All melody notes go to right hand
  for (const n of melody) {
    if (n.rest) continue;
    rightHand.push({
      pitch: Math.min(PIANO_HIGH, Math.max(PIANO_LOW, n.pitch)),
      duration: n.duration ?? 0.5,
      offset: n.offset ?? 0,
      rest: false,
    });
  }

  // Find melody near a beat for RH chord placement
  const melodyNearBeat = (offset: number) =>
    melody.find(n => !n.rest && Math.abs((n.offset ?? 0) - offset) < 0.6);

  let beatIndex = 0;
  for (let bar = 0; bar < bars; bar++) {
    for (let b = 0; b < BEATS_PER_BAR; b++) {
      const offset = bar * BEATS_PER_BAR + b;
      const chord = getChordAtBeat(harmony, offset);
      const hasLH = !!(chord && shouldPlaceLH(bar, phraseStarts, phraseLengths, rng));
      const hasRHChord = chord && shouldPlaceRHChord(bar, phraseStarts, phraseLengths, hasLH, rng);
      const melodyNote = melodyNearBeat(offset);

      // Left hand: guide-tone shell (sparse)
      if (hasLH && chord) {
        const variant = LH_VARIANTS[beatIndex % LH_VARIANTS.length];
        const pitches = leftHandShellPitches(chord, 2, variant);
        const dur = 0.5 + (rng() < 0.25 ? 0.5 : 0);
        for (const p of pitches) {
          if (p >= LH_LOW && p <= LH_HIGH) {
            leftHand.push({ pitch: p, duration: dur, offset, rest: false });
          }
        }
      }

      // Right hand: optional chord (triad/quartal/Monk) — never when LH has shell
      if (hasRHChord && chord && melodyNote) {
        const variant = RH_VARIANTS[beatIndex % RH_VARIANTS.length];
        const refPitch = melodyNote.pitch;
        let pitches: number[];
        if (variant === 'triad') pitches = rightHandTriadPitches(chord, refPitch);
        else if (variant === 'quartal') pitches = rightHandQuartal(chord, refPitch);
        else pitches = rightHandMonkCluster(chord, refPitch);
        const dur = 0.5;
        for (const p of pitches) {
          if (p < refPitch && p >= RH_LOW) {
            rightHand.push({ pitch: p, duration: dur, offset, rest: false });
          }
        }
      }

      beatIndex++;
    }
  }

  // Add rests for breathing — density rule: ensure we're not exceeding 60%
  // Sort and dedupe
  const sortNotes = (arr: Note[]) =>
    arr.sort((a, b) => {
      const oa = a.offset ?? 0;
      const ob = b.offset ?? 0;
      if (oa !== ob) return oa - ob;
      return (b.pitch ?? 0) - (a.pitch ?? 0);
    });

  sortNotes(leftHand);
  sortNotes(rightHand);

  return { rightHand, leftHand };
}
