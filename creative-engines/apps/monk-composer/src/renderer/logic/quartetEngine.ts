/**
 * Quartet Engine - Chamber composition generation with:
 * - Barry Harris + Polyphonic Labyrinth + Counterpoint Hybrid + Monk + Shorter Narrative
 * - Texture floor rotation (A/B/C/D) every 4-6 bars
 * - Anti-repetition: no 1-bar cell >2 repeats, no 2-bar loop >2, accompaniment varies every 4 bars
 * - Viola role rotation: counterline, imitation, harmonic wedge, sustained tension, registral bridge, brief lead
 * - Cello role rotation: bass anchor, pedal, counterline, motivic fragment, registral punctuation, independent support
 * - Texture contrast: rests/sustains every 2-4 bars, avoid all-4-same-figure, complementary figures
 * - Motif migration across ≥3 instruments per section
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
type ViolaRole = 'counterline' | 'imitation' | 'harmonic_wedge' | 'sustained_tension' | 'registral_bridge' | 'brief_lead';
type CelloRole = 'bass_anchor' | 'pedal' | 'counterline' | 'motivic_fragment' | 'registral_punctuation' | 'independent_support';

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

export interface QuartetDiagnosticsOutput {
  textureRotationCount: number;
  motifMigrationCount: number;
  repeatedBarWarnings: number;
  repeated2BarLoopWarnings: number;
  violaUsefulnessScore: number;
  celloIndependenceScore: number;
  textureReductionCount: number;
  allVoicesActiveOveruse: boolean;
  complementaryRhythmScore: number;
}

export interface QuartetGenerationOutput {
  vn1: Note[];
  vn2: Note[];
  viola: Note[];
  cello: Note[];
  textureRotations: number;
  motifMigrations: number;
  diagnostics: QuartetDiagnosticsOutput;
}

const BARS_PER_TEXTURE = 4;
const MAX_ACCOMPANIMENT_BARS_UNCHANGED = 4;
const TEXTURAL_REDUCTION_INTERVAL = 3;

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

function shouldReduceTexture(bar: number): boolean {
  return bar % TEXTURAL_REDUCTION_INTERVAL === 2;
}

function violaRoleForBar(bar: number, floor: TextureFloor, seed: number): ViolaRole {
  const roles: ViolaRole[] = ['counterline', 'imitation', 'harmonic_wedge', 'sustained_tension', 'registral_bridge', 'brief_lead'];
  const idx = (Math.floor(bar / 2) + floor.charCodeAt(0) + seed) % roles.length;
  return roles[idx];
}

function celloRoleForBar(bar: number, floor: TextureFloor, seed: number): CelloRole {
  const roles: CelloRole[] = ['bass_anchor', 'pedal', 'counterline', 'motivic_fragment', 'registral_punctuation', 'independent_support'];
  const idx = (Math.floor(bar / 2) + floor.charCodeAt(0) + seed + 2) % roles.length;
  return roles[idx];
}

/** Jazz walking-bass figure: quarter-note motion through chord tones + chromatic approach. */
function walkingBassFigure(
  barStart: number,
  root: number,
  fifth: number,
  chordTones: number[],
  seed: number,
  nextRoot: number | null
): (Note & { offset: number })[] {
  const baseOctave = 36;
  const r = baseOctave + (root % 12);
  const f = baseOctave + (fifth % 12);
  const tones = chordTones.map(t => baseOctave + (t % 12)).filter(p => p >= 36 && p <= 60);
  const unique = [r, ...tones.filter(p => p !== r)];
  const u = [r, f, unique[1] ?? r + 4, unique[2] ?? r + 7];
  const notes: (Note & { offset: number })[] = [];
  const pattern = seed % 5;
  if (pattern === 0) {
    notes.push({ pitch: r, duration: 1, offset: barStart, rest: false });
    notes.push({ pitch: f, duration: 1, offset: barStart + 1, rest: false });
    notes.push({ pitch: r, duration: 1, offset: barStart + 2, rest: false });
    notes.push({ pitch: nextRoot != null ? baseOctave + ((nextRoot - 1 + 12) % 12) : u[(seed + 2) % u.length], duration: 1, offset: barStart + 3, rest: false });
  } else if (pattern === 1) {
    notes.push({ pitch: r, duration: 1, offset: barStart, rest: false });
    notes.push({ pitch: u[1], duration: 1, offset: barStart + 1, rest: false });
    notes.push({ pitch: u[2], duration: 1, offset: barStart + 2, rest: false });
    notes.push({ pitch: u[3], duration: 1, offset: barStart + 3, rest: false });
  } else if (pattern === 2) {
    notes.push({ pitch: r, duration: 1, offset: barStart, rest: false });
    notes.push({ pitch: f, duration: 1, offset: barStart + 1, rest: false });
    notes.push({ pitch: Math.min(60, f + 1), duration: 1, offset: barStart + 2, rest: false });
    notes.push({ pitch: nextRoot != null ? baseOctave + (nextRoot % 12) : r, duration: 1, offset: barStart + 3, rest: false });
  } else if (pattern === 3) {
    notes.push({ pitch: r, duration: 1, offset: barStart, rest: false });
    notes.push({ pitch: Math.min(60, r + 4), duration: 1, offset: barStart + 1, rest: false });
    notes.push({ pitch: f, duration: 1, offset: barStart + 2, rest: false });
    notes.push({ pitch: Math.min(60, r + 7), duration: 1, offset: barStart + 3, rest: false });
  } else {
    notes.push({ pitch: r, duration: 1, offset: barStart, rest: false });
    notes.push({ pitch: Math.max(36, r - 1), duration: 1, offset: barStart + 1, rest: false });
    notes.push({ pitch: r, duration: 1, offset: barStart + 2, rest: false });
    notes.push({ pitch: f, duration: 1, offset: barStart + 3, rest: false });
  }
  return notes;
}

function getNextChordRoot(harmony: Chord[], barStart: number): number | null {
  for (const c of harmony) {
    if (c.offset > barStart + 3.5) return chordRoot(c.symbol);
  }
  return null;
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
  let textureReductionCount = 0;
  let prevFloor: TextureFloor | null = null;

  const beatsPerBar = 4;
  const totalBars = Math.ceil(melodyEndBeats / beatsPerBar);

  const violaBarSigs: string[] = [];
  const celloBarSigs: string[] = [];
  const viola2BarSigs: string[] = [];
  const cello2BarSigs: string[] = [];
  let prevViolaAccomp: string | null = null;
  let violaAccompBarsUnchanged = 0;

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
    const seed = bar + revisionSeed;
    const reduceTexture = shouldReduceTexture(bar);
    const violaRole = violaRoleForBar(bar, floor, seed);
    const celloRole = celloRoleForBar(bar, floor, seed);

    if (reduceTexture) textureReductionCount++;

    const cRoot = chord ? 36 + root : 36;
    const cFifth = chord ? 36 + fifth : 43;
    const chordTonesForBass = chord ? [root, (root + 4) % 12, (root + 7) % 12, (root + 10) % 12] : [0, 4, 7, 10];
    const nextRoot = chord ? getNextChordRoot(extendHarmony, barStart) : null;

    if (floor === 'A') {
      for (const n of barMelody) {
        vn1Notes.push({ ...n, pitch: Math.min(88, Math.max(55, n.pitch)) });
        vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch - 5)), offset: (n.offset ?? 0) + 0.25 });
      }
      if (chord) {
        if (reduceTexture && bar % 2 === 1) {
          violaNotes.push({ pitch: 55 + getChordTone(chord.symbol, 1), duration: 4, offset: barStart, rest: false });
        } else {
          const vTone = getChordTone(chord.symbol, (bar % 3) + (violaRole === 'harmonic_wedge' ? 1 : 0));
          const vReg = 48 + (vTone % 12) + (bar % 2 === 0 ? 0 : 12);
          violaNotes.push({ pitch: Math.min(79, Math.max(48, vReg)), duration: bar % 2 === 0 ? 2 : 1, offset: barStart, rest: false });
          violaNotes.push({ pitch: Math.min(79, Math.max(48, 55 + getChordTone(chord.symbol, 2))), duration: 1, offset: barStart + 2, rest: false });
        }
        if (celloRole === 'pedal') {
          celloNotes.push({ pitch: cRoot, duration: 2, offset: barStart, rest: false });
          celloNotes.push({ pitch: cFifth, duration: 2, offset: barStart + 2, rest: false });
        } else if (celloRole === 'motivic_fragment' && barMelody.length > 0) {
          const frag = motifTransform(barMelody.slice(0, 2), 'transpose', -12);
          for (const n of frag) {
            celloNotes.push({ ...n, pitch: Math.min(72, Math.max(36, n.pitch)), offset: (n.offset ?? barStart) });
          }
          if (frag.length >= 2) motifMigrations++;
        } else {
          const walk = walkingBassFigure(barStart, root, fifth, chordTonesForBass, seed + bar, nextRoot);
          celloNotes.push(...walk);
        }
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
        if (!reduceTexture || bar % 2 === 1) {
          for (const n of barMelody) {
            vn1Notes.push({ ...n, pitch: Math.min(88, Math.max(55, n.pitch)) });
            vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch - 8)), offset: (n.offset ?? 0) + 0.125 });
          }
        } else {
          vn1Notes.push({ ...barMelody[0], pitch: Math.min(88, Math.max(55, barMelody[0].pitch)) });
        }
      }
      if (chord) {
        if (violaRole === 'imitation' && barMelody.length > 0) {
          const ans = motifTransform(barMelody.slice(0, 2), 'transpose', -7);
          for (const n of ans) {
            violaNotes.push({ ...n, pitch: Math.min(79, Math.max(48, n.pitch)), offset: (n.offset ?? barStart) + 0.5 });
          }
          motifMigrations++;
        } else if (violaRole === 'sustained_tension' || reduceTexture) {
          violaNotes.push({ pitch: 52 + getChordTone(chord.symbol, 1), duration: 4, offset: barStart, rest: false });
        } else {
          const v1 = 52 + getChordTone(chord.symbol, (bar % 2) + 1);
          const v2 = 52 + getChordTone(chord.symbol, (bar % 2) + 2);
          violaNotes.push({ pitch: Math.min(79, Math.max(48, v1)), duration: 1, offset: barStart, rest: false });
          violaNotes.push({ pitch: Math.min(79, Math.max(48, v2)), duration: 1.5, offset: barStart + 1.5, rest: false });
        }
        if (celloRole === 'pedal') {
          celloNotes.push({ pitch: cRoot, duration: 2, offset: barStart, rest: false });
          celloNotes.push({ pitch: cFifth, duration: 2, offset: barStart + 2, rest: false });
        } else if (celloRole === 'motivic_fragment' && barMelody.length > 0 && bar % 4 === 1) {
          const frag = motifTransform(barMelody.slice(0, 2), 'invert');
          for (const n of frag) {
            celloNotes.push({ ...n, pitch: Math.min(72, Math.max(36, n.pitch)), offset: (n.offset ?? barStart) + 0.5 });
          }
          motifMigrations++;
        } else {
          const walk = walkingBassFigure(barStart, root, fifth, chordTonesForBass, seed + bar + 1, nextRoot);
          celloNotes.push(...walk);
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
        if (violaRole === 'brief_lead' && bar % 4 === 0) {
          const frag = barMelody.slice(0, 2);
          for (const n of frag) {
            violaNotes.push({ ...n, pitch: Math.min(79, Math.max(48, n.pitch - 5)), offset: (n.offset ?? barStart) + 0.25 });
          }
        } else if (bar % 2 === 1 && !reduceTexture) {
          violaNotes.push({ pitch: 55 + getChordTone(chord.symbol, 0), duration: 2, offset: barStart + 1, rest: false });
        }
        if (celloRole === 'registral_punctuation') {
          celloNotes.push({ pitch: cRoot, duration: 1, offset: barStart, rest: false });
          celloNotes.push({ pitch: cRoot + 7, duration: 1, offset: barStart + 1, rest: false });
          celloNotes.push({ pitch: cRoot + 12, duration: 1, offset: barStart + 2, rest: false });
          celloNotes.push({ pitch: cFifth, duration: 1, offset: barStart + 3, rest: false });
        } else {
          const walk = walkingBassFigure(barStart, root, fifth, chordTonesForBass, seed + bar + 2, nextRoot);
          celloNotes.push(...walk);
        }
      }
    } else {
      if (bar % 2 === 0) {
        if (barMelody.length > 0 && !reduceTexture) {
          vn1Notes.push({ ...barMelody[0], pitch: Math.min(88, Math.max(55, barMelody[0].pitch)) });
        }
        if (chord) {
          if (violaRole === 'registral_bridge') {
            violaNotes.push({ pitch: 48 + getChordTone(chord.symbol, 0), duration: 1, offset: barStart, rest: false });
            violaNotes.push({ pitch: 60 + getChordTone(chord.symbol, 1), duration: 3, offset: barStart + 1, rest: false });
          } else {
            violaNotes.push({ pitch: 55 + getChordTone(chord.symbol, (bar % 2) + 1), duration: 3, offset: barStart, rest: false });
            violaNotes.push({ pitch: 55 + getChordTone(chord.symbol, 2), duration: 1, offset: barStart + 3, rest: false });
          }
          const walk = walkingBassFigure(barStart, root, fifth, chordTonesForBass, seed + bar + 3, nextRoot);
          celloNotes.push(...walk);
        }
      } else {
        if (!reduceTexture) {
          for (const n of barMelody.slice(0, 2)) {
            vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch - 5)) });
          }
        }
        if (chord) {
          const walk = walkingBassFigure(barStart, root, fifth, chordTonesForBass, seed + bar + 4, nextRoot);
          celloNotes.push(...walk);
        }
      }
    }

    if (chord) {
      const vNotes = violaNotes.filter(n => n.offset >= barStart && n.offset < barStart + beatsPerBar && !n.rest);
      const cNotes = celloNotes.filter(n => n.offset >= barStart && n.offset < barStart + beatsPerBar && !n.rest);
      const vSig = vNotes.map(n => `${n.pitch}-${Math.round((n.duration ?? 0.25) * 4)}`).sort().join(',');
      const cSig = cNotes.map(n => `${n.pitch}-${Math.round((n.duration ?? 0.25) * 4)}`).sort().join(',');
      violaBarSigs.push(vSig);
      celloBarSigs.push(cSig);
      if (vSig === prevViolaAccomp) violaAccompBarsUnchanged++;
      else { prevViolaAccomp = vSig; violaAccompBarsUnchanged = 1; }
      if (bar >= 1) {
        viola2BarSigs.push(violaBarSigs[bar - 1] + '|' + vSig);
        cello2BarSigs.push(celloBarSigs[bar - 1] + '|' + cSig);
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

  let repeatedBarWarnings = 0;
  for (let i = 2; i < violaBarSigs.length; i++) {
    if (violaBarSigs[i] === violaBarSigs[i - 1] && violaBarSigs[i - 1] === violaBarSigs[i - 2]) repeatedBarWarnings++;
  }
  for (let i = 2; i < celloBarSigs.length; i++) {
    if (celloBarSigs[i] === celloBarSigs[i - 1] && celloBarSigs[i - 1] === celloBarSigs[i - 2]) repeatedBarWarnings++;
  }

  let repeated2BarLoopWarnings = 0;
  for (let i = 2; i < viola2BarSigs.length; i++) {
    if (viola2BarSigs[i] === viola2BarSigs[i - 2]) repeated2BarLoopWarnings++;
  }
  for (let i = 2; i < cello2BarSigs.length; i++) {
    if (cello2BarSigs[i] === cello2BarSigs[i - 2]) repeated2BarLoopWarnings++;
  }

  const violaUsefulness = Math.max(0.5, 0.95 - repeatedBarWarnings * 0.1 - (violaAccompBarsUnchanged >= MAX_ACCOMPANIMENT_BARS_UNCHANGED ? 0.2 : 0));
  const celloIndependence = Math.max(0.5, 0.9 - repeatedBarWarnings * 0.08 - repeated2BarLoopWarnings * 0.1);
  const allVoicesActiveOveruse = textureReductionCount < Math.floor(totalBars / 4);
  const complementaryScore = Math.min(1, 0.6 + textureReductionCount * 0.05 + (motifMigrations >= 2 ? 0.2 : 0));

  const diagnostics: QuartetDiagnosticsOutput = {
    textureRotationCount: textureRotations,
    motifMigrationCount: motifMigrations,
    repeatedBarWarnings,
    repeated2BarLoopWarnings,
    violaUsefulnessScore: violaUsefulness,
    celloIndependenceScore: celloIndependence,
    textureReductionCount,
    allVoicesActiveOveruse,
    complementaryRhythmScore: complementaryScore,
  };

  return {
    vn1: applyBowability(vn1Notes, 55, 88),
    vn2: applyBowability(vn2Notes, 48, 84),
    viola: applyBowability(violaNotes, 48, 79),
    cello: applyBowability(celloNotes, 36, 72),
    textureRotations,
    motifMigrations,
    diagnostics,
  };
}
