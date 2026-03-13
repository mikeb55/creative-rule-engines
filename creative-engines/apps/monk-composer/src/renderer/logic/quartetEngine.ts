/**
 * Quartet Engine - Chamber composition generation (GCE ≥ 8 target)
 * - Metrics: active duration, attack density, rest ratio, role entropy, motif participation
 * - Viola: ≥50% Vln2 attack density (unless sustained tension), motif every 8-12 bars, rotate roles 2-4 bars
 * - Cello: non-zero rests every 6-10 bars, not always-on
 * - Ensemble: 2-3 active normally; all-4 only at cadence/climax/tutti; exposed duo/trio textures
 */
import type { Note, Chord } from './types';
import { computeQuartetMetrics } from './quartetMetrics';

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
type ViolaRole = 'counterline' | 'imitation' | 'harmonic_wedge' | 'suspension_tension' | 'registral_bridge' | 'motivic_fragment_carrier';
type CelloRole = 'bass_anchor' | 'pedal' | 'counterline' | 'motivic_fragment' | 'registral_punctuation' | 'independent_support';

type CounterpointType = 'imitation' | 'contrary_motion' | 'staggered_entry';

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
  violaVln2Ratio: number;
  celloVln1Ratio: number;
  counterpointEventCount: number;
  motifTransformCountPer16: number;
  densityViolations: number;
  violaMotifBars: number;
  celloMotifBars: number;
  violaRoleByBar: string[];
  celloRoleByBar: string[];
  activeDurationByInstrument: [number, number, number, number];
  attackDensityByInstrument: [number, number, number, number];
  restRatioByInstrument: [number, number, number, number];
  roleEntropyByInstrument: [number, number, number, number];
  motifParticipationByInstrument: [number, number, number, number];
  simultaneousMotionRatio: number;
  exposedDuoTrioBars: number;
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

type MotifTransformType = 'transpose' | 'invert' | 'rhythm_disp' | 'truncate' | 'expand' | 'compress' | 'interval_expand' | 'interval_compress';

function motifTransform(notes: Note[], transform: MotifTransformType, param?: number): Note[] {
  const withOffset = ensureOffset(notes);
  const result: (Note & { offset: number })[] = [];
  const semitones = param ?? 3;
  const halfLen = Math.floor(withOffset.length / 2);
  const pivot = withOffset[0]?.pitch ?? 60;

  for (let i = 0; i < withOffset.length; i++) {
    const n = withOffset[i];
    let pitch = n.pitch;
    let duration = n.duration;
    let offset = n.offset ?? 0;

    if (transform === 'transpose') pitch = pitch + semitones;
    if (transform === 'invert') pitch = 2 * pivot - pitch;
    if (transform === 'rhythm_disp') offset += 0.25;
    if (transform === 'truncate' && i >= halfLen) continue;
    if (transform === 'expand') duration = Math.min(2, duration * 1.5);
    if (transform === 'compress') duration = Math.max(0.25, duration * 0.75);
    if (transform === 'interval_expand') {
      const interval = pitch - pivot;
      pitch = pivot + Math.round(interval * 1.5);
    }
    if (transform === 'interval_compress') {
      const interval = pitch - pivot;
      pitch = pivot + Math.round(interval * 0.66);
    }

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
  const roles: ViolaRole[] = ['counterline', 'imitation', 'harmonic_wedge', 'suspension_tension', 'registral_bridge', 'motivic_fragment_carrier'];
  const cycleLen = 2 + (seed % 3);
  const idx = (Math.floor(bar / cycleLen) + floor.charCodeAt(0) + seed) % roles.length;
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

function isTuttiBar(bar: number, totalBars: number): boolean {
  const climaxBar = Math.floor(totalBars * 0.75);
  const cadenceBars = [totalBars - 2, totalBars - 1, totalBars - 4];
  return bar === climaxBar || cadenceBars.includes(bar) || bar === 0;
}

function getActiveInstruments(bar: number, totalBars: number, seed: number): Set<number> {
  if (isTuttiBar(bar, totalBars)) return new Set([0, 1, 2, 3]);
  const mustRestOrSustain = (bar % 3 === 2);
  const pick = (arr: number[], n: number) => {
    const s = [...arr];
    for (let i = 0; i < n && s.length > 0; i++) {
      const j = (seed + bar * 7 + i) % s.length;
      [s[i], s[j]] = [s[j], s[i]];
    }
    return s.slice(0, n);
  };
  const activeCount = mustRestOrSustain ? 2 : 3;
  return new Set(pick([0, 1, 2, 3], activeCount));
}

function shouldViolaCarryMotif(bar: number): boolean {
  return bar % 10 === 0 || bar % 10 === 5;
}

function shouldCelloRest(bar: number, totalBars: number): boolean {
  if (isTuttiBar(bar, totalBars)) return false;
  return bar % 8 === 5 || bar % 10 === 7;
}

function getCounterpointForBar(bar: number, seed: number): CounterpointType | null {
  if (bar < 4) return null;
  const interval = 8 + (seed % 4);
  if ((bar - 4) % interval !== 0) return null;
  const types: CounterpointType[] = ['imitation', 'contrary_motion', 'staggered_entry'];
  return types[(Math.floor(bar / interval) + seed) % types.length];
}

const MOTIF_TRANSFORMS: MotifTransformType[] = ['transpose', 'invert', 'rhythm_disp', 'truncate', 'expand', 'compress', 'interval_expand', 'interval_compress'];

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
  let motifTransformCount = 0;
  let counterpointEvents = 0;
  let violaMotifBars = 0;
  let densityViolations = 0;
  let textureReductionCount = 0;
  let prevFloor: TextureFloor | null = null;

  const beatsPerBar = 4;
  const totalBars = Math.ceil(melodyEndBeats / beatsPerBar);

  const violaBarSigs: string[] = [];
  const celloBarSigs: string[] = [];
  const viola2BarSigs: string[] = [];
  const cello2BarSigs: string[] = [];
  const violaRoleByBar: string[] = [];
  const celloRoleByBar: string[] = [];
  let celloMotifBars = 0;
  let prevViolaAccomp: string | null = null;
  let violaAccompBarsUnchanged = 0;

  const seedForMask = revisionSeed + rotationOffset;
  const activeCountPerBar: number[] = [];

  for (let bar = 0; bar < totalBars; bar++) {
    const floor = whichTextureFloor(bar, totalBars, rotationOffset);
    if (prevFloor !== floor) {
      textureRotations++;
      prevFloor = floor;
    }

    const barStart = bar * beatsPerBar;
    let barMelody = melody.filter(n => n.offset >= barStart && n.offset < barStart + beatsPerBar);
    if (barMelody.length === 0 && melody.length >= 2) {
      barMelody = melody.slice(0, 4).map((n, i) => ({ ...n, offset: barStart + i * 0.5 }));
    }
    const chord = getChordAtBeat(extendHarmony, barStart);
    const root = chord ? chordRoot(chord.symbol) : 0;
    const fifth = chord ? (root + 7) % 12 : 0;
    const seed = bar + revisionSeed;
    const reduceTexture = shouldReduceTexture(bar);
    const violaRole = violaRoleForBar(bar, floor, seed);
    const celloRole = celloRoleForBar(bar, floor, seed);
    const activeInstruments = getActiveInstruments(bar, totalBars, seedForMask);
    const violaNeedsMotifHere = shouldViolaCarryMotif(bar);
    const counterpointType = getCounterpointForBar(bar, seedForMask);

    if (reduceTexture) textureReductionCount++;
    activeCountPerBar.push(activeInstruments.size);
    violaRoleByBar[bar] = violaRole;
    celloRoleByBar[bar] = celloRole;

    const cRoot = chord ? 36 + root : 36;
    const cFifth = chord ? 36 + fifth : 43;
    const chordTonesForBass = chord ? [root, (root + 4) % 12, (root + 7) % 12, (root + 10) % 12] : [0, 4, 7, 10];
    const nextRoot = chord ? getNextChordRoot(extendHarmony, barStart) : null;

    if (floor === 'A') {
      if (activeInstruments.has(0)) {
        for (const n of barMelody) {
          vn1Notes.push({ ...n, pitch: Math.min(88, Math.max(55, n.pitch)) });
        }
      } else if (chord && barMelody.length > 0) {
        vn1Notes.push({ pitch: 60 + getChordTone(chord.symbol, 0), duration: 4, offset: barStart, rest: false });
      }
      if (activeInstruments.has(1)) {
        for (const n of barMelody) {
          vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch - 5)), offset: (n.offset ?? 0) + 0.25 });
        }
      } else if (chord && barMelody.length > 0) {
        vn2Notes.push({ pitch: 57 + getChordTone(chord.symbol, 1), duration: 4, offset: barStart, rest: false });
      }
      if (chord) {
        if (violaNeedsMotifHere && barMelody.length >= 2 && activeInstruments.has(2)) {
          const frag = motifTransform(barMelody.slice(0, 3), MOTIF_TRANSFORMS[bar % MOTIF_TRANSFORMS.length], (bar % 5) - 2);
          for (const n of frag) {
            violaNotes.push({ ...n, pitch: Math.min(79, Math.max(48, n.pitch - 7)), offset: (n.offset ?? barStart) });
          }
          violaMotifBars++;
          motifTransformCount++;
          motifMigrations++;
        } else if (activeInstruments.has(2)) {
          if (reduceTexture && bar % 2 === 1) {
            violaNotes.push({ pitch: 55 + getChordTone(chord.symbol, 1), duration: 4, offset: barStart, rest: false });
          } else {
            const vTone = getChordTone(chord.symbol, (bar % 3) + (violaRole === 'harmonic_wedge' ? 1 : 0));
            const vReg = 48 + (vTone % 12) + (bar % 2 === 0 ? 0 : 12);
            violaNotes.push({ pitch: Math.min(79, Math.max(48, vReg)), duration: bar % 2 === 0 ? 2 : 1, offset: barStart, rest: false });
            violaNotes.push({ pitch: Math.min(79, Math.max(48, 55 + getChordTone(chord.symbol, 2))), duration: 1, offset: barStart + 2, rest: false });
          }
        } else {
          violaNotes.push({ pitch: 52 + getChordTone(chord.symbol, 0), duration: 4, offset: barStart, rest: false });
        }
        if (activeInstruments.has(3)) {
          if (celloRole === 'pedal') {
            celloNotes.push({ pitch: cRoot, duration: 2, offset: barStart, rest: false });
            celloNotes.push({ pitch: cFifth, duration: 2, offset: barStart + 2, rest: false });
          } else if (celloRole === 'motivic_fragment' && barMelody.length > 0) {
            const frag = motifTransform(barMelody.slice(0, 2), 'transpose', -12);
            for (const n of frag) {
              celloNotes.push({ ...n, pitch: Math.min(72, Math.max(36, n.pitch)), offset: (n.offset ?? barStart) });
            }
            celloMotifBars++;
            if (frag.length >= 2) motifMigrations++;
          } else {
            const walk = walkingBassFigure(barStart, root, fifth, chordTonesForBass, seed + bar, nextRoot);
            celloNotes.push(...walk);
          }
        } else if (chord) {
          celloNotes.push({ pitch: cRoot, duration: 4, offset: barStart, rest: false });
        }
      }
    } else if (floor === 'B') {
      if (counterpointType === 'imitation' && barMelody.length >= 2 && activeInstruments.has(2)) {
        const ans = motifTransform(barMelody.slice(0, 3), 'transpose', -7);
        for (const n of ans) {
          violaNotes.push({ ...n, pitch: Math.min(79, Math.max(48, n.pitch)), offset: (n.offset ?? barStart) + 0.5 });
        }
        counterpointEvents++;
        motifMigrations++;
      }
      if (activeInstruments.has(0) || activeInstruments.has(1)) {
        if (barMelody.length > 0 && bar % 2 === 0) {
          const frag = motifTransform(barMelody.slice(0, 3), 'transpose', -5);
          motifTransformCount++;
          if (activeInstruments.has(1)) {
            for (const n of frag) {
              vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch)), offset: n.offset ?? barStart });
            }
          }
          if (activeInstruments.has(0)) {
            for (const n of barMelody.slice(frag.length)) {
              vn1Notes.push({ ...n, pitch: Math.min(88, Math.max(55, n.pitch)), offset: n.offset ?? barStart });
            }
          }
          motifMigrations++;
        } else {
          if (!reduceTexture || bar % 2 === 1) {
            if (activeInstruments.has(0)) {
              for (const n of barMelody) {
                vn1Notes.push({ ...n, pitch: Math.min(88, Math.max(55, n.pitch)) });
              }
            }
            if (activeInstruments.has(1)) {
              for (const n of barMelody) {
                vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch - 8)), offset: (n.offset ?? 0) + 0.125 });
              }
            }
          } else if (activeInstruments.has(0) && barMelody.length > 0) {
            vn1Notes.push({ ...barMelody[0], pitch: Math.min(88, Math.max(55, barMelody[0].pitch)) });
          }
        }
      } else if (chord && barMelody.length > 0) {
        vn1Notes.push({ pitch: 60 + getChordTone(chord.symbol, 0), duration: 4, offset: barStart, rest: false });
        vn2Notes.push({ pitch: 57 + getChordTone(chord.symbol, 1), duration: 4, offset: barStart, rest: false });
      }
      if (chord) {
        if (violaNeedsMotifHere && barMelody.length >= 2 && activeInstruments.has(2) && !counterpointType) {
          const frag = motifTransform(barMelody.slice(0, 3), MOTIF_TRANSFORMS[(bar + 1) % MOTIF_TRANSFORMS.length], -5);
          for (const n of frag) {
            violaNotes.push({ ...n, pitch: Math.min(79, Math.max(48, n.pitch)), offset: (n.offset ?? barStart) + 0.25 });
          }
          violaMotifBars++;
          motifTransformCount++;
          motifMigrations++;
        } else if (violaRole === 'imitation' && barMelody.length > 0 && activeInstruments.has(2) && !counterpointType) {
          const ans = motifTransform(barMelody.slice(0, 2), 'transpose', -7);
          for (const n of ans) {
            violaNotes.push({ ...n, pitch: Math.min(79, Math.max(48, n.pitch)), offset: (n.offset ?? barStart) + 0.5 });
          }
          motifMigrations++;
        } else if ((violaRole === 'suspension_tension' || reduceTexture) && activeInstruments.has(2)) {
          violaNotes.push({ pitch: 52 + getChordTone(chord.symbol, 1), duration: 4, offset: barStart, rest: false });
        } else if (activeInstruments.has(2)) {
          const v1 = 52 + getChordTone(chord.symbol, (bar % 2) + 1);
          const v2 = 52 + getChordTone(chord.symbol, (bar % 2) + 2);
          violaNotes.push({ pitch: Math.min(79, Math.max(48, v1)), duration: 1, offset: barStart, rest: false });
          violaNotes.push({ pitch: Math.min(79, Math.max(48, v2)), duration: 1.5, offset: barStart + 1.5, rest: false });
        } else {
          violaNotes.push({ pitch: 52 + getChordTone(chord.symbol, 0), duration: 4, offset: barStart, rest: false });
        }
        if (counterpointType === 'staggered_entry' && activeInstruments.has(1) && barMelody.length >= 2) {
          const delayed = motifTransform(barMelody.slice(0, 2), 'rhythm_disp');
          for (const n of delayed) {
            vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch - 5)), offset: (n.offset ?? barStart) + 0.5 });
          }
          counterpointEvents++;
        }
        if (activeInstruments.has(3)) {
          if (celloRole === 'pedal') {
            celloNotes.push({ pitch: cRoot, duration: 2, offset: barStart, rest: false });
            celloNotes.push({ pitch: cFifth, duration: 2, offset: barStart + 2, rest: false });
          } else if (celloRole === 'motivic_fragment' && barMelody.length > 0 && bar % 4 === 1) {
            const frag = motifTransform(barMelody.slice(0, 2), 'invert');
            motifTransformCount++;
            celloMotifBars++;
            for (const n of frag) {
              celloNotes.push({ ...n, pitch: Math.min(72, Math.max(36, n.pitch)), offset: (n.offset ?? barStart) + 0.5 });
            }
            motifMigrations++;
          } else {
            const walk = walkingBassFigure(barStart, root, fifth, chordTonesForBass, seed + bar + 1, nextRoot);
            celloNotes.push(...walk);
          }
        } else {
          celloNotes.push({ pitch: cRoot, duration: 4, offset: barStart, rest: false });
        }
      }
    } else if (floor === 'C') {
      if (counterpointType === 'contrary_motion' && barMelody.length >= 2 && activeInstruments.has(1) && activeInstruments.has(2)) {
        const inv = motifTransform(barMelody.slice(0, 3), 'invert');
        const orig = barMelody.slice(0, inv.length);
        for (let i = 0; i < inv.length; i++) {
          vn2Notes.push({ ...inv[i], pitch: Math.min(84, Math.max(48, inv[i].pitch - 4)), offset: (inv[i].offset ?? barStart) + 0.25 });
          const om = orig[i];
          if (om) violaNotes.push({ ...om, pitch: Math.min(79, Math.max(48, om.pitch - 12)), offset: (om.offset ?? barStart) + 0.5 });
        }
        if (activeInstruments.has(0) && barMelody.length > 0) {
          vn1Notes.push({ ...barMelody[0], pitch: Math.min(88, Math.max(55, barMelody[0].pitch)), offset: barMelody[0].offset ?? barStart });
        }
        counterpointEvents++;
        motifTransformCount++;
      }
      const shared = barMelody.slice(0, Math.min(4, Math.ceil(barMelody.length * 0.7)));
      if (shared.length >= 3 && !counterpointType) {
        motifTransformCount++;
        for (let i = 0; i < shared.length; i++) {
          const n = shared[i];
          const dest = i % 3;
          const off = n.offset ?? barStart + i * 0.5;
          if (dest === 0 && activeInstruments.has(0)) vn1Notes.push({ ...n, pitch: Math.min(88, Math.max(55, n.pitch)), offset: off });
          else if (dest === 1 && activeInstruments.has(1)) vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch - 4)), offset: off + 0.25 });
          else if (dest === 2 && activeInstruments.has(2)) violaNotes.push({ ...n, pitch: Math.min(79, Math.max(48, n.pitch - 12)), offset: off + 0.5 });
        }
        if (shared.length >= 3) motifMigrations++;
      }
      if (activeInstruments.has(0)) {
        for (const n of barMelody.slice(shared.length)) {
          vn1Notes.push({ ...n, pitch: Math.min(88, Math.max(55, n.pitch)) });
        }
      } else if (chord && barMelody.length > 0) {
        vn1Notes.push({ pitch: 60 + getChordTone(chord.symbol, 0), duration: 4, offset: barStart, rest: false });
      }
      if (chord) {
        if ((violaRole === 'motivic_fragment_carrier' || violaNeedsMotifHere) && bar % 4 === 0 && barMelody.length >= 2 && activeInstruments.has(2)) {
          const frag = motifTransform(barMelody.slice(0, 2), MOTIF_TRANSFORMS[bar % MOTIF_TRANSFORMS.length], -5);
          for (const n of frag) {
            violaNotes.push({ ...n, pitch: Math.min(79, Math.max(48, n.pitch - 5)), offset: (n.offset ?? barStart) + 0.25 });
          }
          violaMotifBars++;
          motifTransformCount++;
        } else if (bar % 2 === 1 && !reduceTexture && activeInstruments.has(2)) {
          violaNotes.push({ pitch: 55 + getChordTone(chord.symbol, 0), duration: 2, offset: barStart + 1, rest: false });
        } else if (!activeInstruments.has(2)) {
          violaNotes.push({ pitch: 52 + getChordTone(chord.symbol, 0), duration: 4, offset: barStart, rest: false });
        }
        if (activeInstruments.has(3)) {
          if (celloRole === 'registral_punctuation') {
            celloNotes.push({ pitch: cRoot, duration: 1, offset: barStart, rest: false });
            celloNotes.push({ pitch: cRoot + 7, duration: 1, offset: barStart + 1, rest: false });
            celloNotes.push({ pitch: cRoot + 12, duration: 1, offset: barStart + 2, rest: false });
            celloNotes.push({ pitch: cFifth, duration: 1, offset: barStart + 3, rest: false });
          } else {
            const walk = walkingBassFigure(barStart, root, fifth, chordTonesForBass, seed + bar + 2, nextRoot);
            celloNotes.push(...walk);
          }
        } else {
          celloNotes.push({ pitch: cRoot, duration: 4, offset: barStart, rest: false });
        }
      }
    } else {
      if (bar % 2 === 0) {
        if (activeInstruments.has(0) && barMelody.length > 0 && !reduceTexture) {
          vn1Notes.push({ ...barMelody[0], pitch: Math.min(88, Math.max(55, barMelody[0].pitch)) });
        } else if (chord && barMelody.length > 0) {
          vn1Notes.push({ pitch: 60 + getChordTone(chord.symbol, 0), duration: 4, offset: barStart, rest: false });
        }
        if (chord) {
          if (activeInstruments.has(2)) {
            if (violaRole === 'registral_bridge') {
              violaNotes.push({ pitch: 48 + getChordTone(chord.symbol, 0), duration: 1, offset: barStart, rest: false });
              violaNotes.push({ pitch: 60 + getChordTone(chord.symbol, 1), duration: 3, offset: barStart + 1, rest: false });
            } else {
              violaNotes.push({ pitch: 55 + getChordTone(chord.symbol, (bar % 2) + 1), duration: 3, offset: barStart, rest: false });
              violaNotes.push({ pitch: 55 + getChordTone(chord.symbol, 2), duration: 1, offset: barStart + 3, rest: false });
            }
          } else {
            violaNotes.push({ pitch: 52 + getChordTone(chord.symbol, 0), duration: 4, offset: barStart, rest: false });
          }
          if (activeInstruments.has(3)) {
            const walk = walkingBassFigure(barStart, root, fifth, chordTonesForBass, seed + bar + 3, nextRoot);
            celloNotes.push(...walk);
          } else {
            celloNotes.push({ pitch: cRoot, duration: 4, offset: barStart, rest: false });
          }
        }
      } else {
        if (activeInstruments.has(1) && !reduceTexture) {
          for (const n of barMelody.slice(0, 2)) {
            vn2Notes.push({ ...n, pitch: Math.min(84, Math.max(48, n.pitch - 5)) });
          }
        } else if (chord && barMelody.length > 0) {
          vn2Notes.push({ pitch: 57 + getChordTone(chord.symbol, 1), duration: 4, offset: barStart, rest: false });
        }
        if (chord) {
          if (!activeInstruments.has(2)) {
            violaNotes.push({ pitch: 52 + getChordTone(chord.symbol, 0), duration: 4, offset: barStart, rest: false });
          }
          if (activeInstruments.has(3)) {
            const walk = walkingBassFigure(barStart, root, fifth, chordTonesForBass, seed + bar + 4, nextRoot);
            celloNotes.push(...walk);
          } else {
            celloNotes.push({ pitch: cRoot, duration: 4, offset: barStart, rest: false });
          }
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

  const celloRestBars = new Set<number>();
  for (let bar = 0; bar < totalBars; bar++) {
    if (shouldCelloRest(bar, totalBars)) celloRestBars.add(bar);
  }
  const filteredCello = celloNotes.filter(n => {
    const bar = Math.floor((n.offset ?? 0) / beatsPerBar);
    return !celloRestBars.has(bar);
  });
  for (const bar of celloRestBars) {
    filteredCello.push({ pitch: 0, duration: beatsPerBar, offset: bar * beatsPerBar, rest: true });
  }
  filteredCello.sort((a, b) => (a.offset ?? 0) - (b.offset ?? 0));
  celloNotes.length = 0;
  celloNotes.push(...filteredCello);

  const clamp = (p: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, p));
  const applyBowability = (arr: (Note & { offset: number })[], lo: number, hi: number) => {
    const out = arr.map((n, i) => {
      if (n.rest) return { ...n };
      const prev = i > 0 ? (arr[i - 1].rest ? n.pitch : arr[i - 1].pitch) : n.pitch;
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

  for (let i = 0; i < activeCountPerBar.length; i++) {
    if (!isTuttiBar(i, totalBars) && activeCountPerBar[i] === 4) densityViolations++;
  }

  const violaNoteCount = violaNotes.filter(n => !n.rest).length;
  const vln2NoteCount = vn2Notes.filter(n => !n.rest).length;
  const vln1NoteCount = vn1Notes.filter(n => !n.rest).length;
  const celloNoteCount = celloNotes.filter(n => !n.rest).length;
  const violaVln2Ratio = vln2NoteCount > 0 ? violaNoteCount / vln2NoteCount : 1;
  const celloVln1Ratio = vln1NoteCount > 0 ? celloNoteCount / vln1NoteCount : 1;
  const motifTransformCountPer16 = totalBars > 0 ? (motifTransformCount / totalBars) * 16 : 0;

  const violaUsefulness = Math.max(0.5, 0.95 - repeatedBarWarnings * 0.1 - (violaAccompBarsUnchanged >= MAX_ACCOMPANIMENT_BARS_UNCHANGED ? 0.2 : 0));
  const celloIndependence = Math.max(0.5, 0.9 - repeatedBarWarnings * 0.08 - repeated2BarLoopWarnings * 0.1);
  const allVoicesActiveOveruse = textureReductionCount < Math.floor(totalBars / 4);
  const complementaryScore = Math.min(1, 0.6 + textureReductionCount * 0.05 + (motifMigrations >= 2 ? 0.2 : 0));

  let outViola = [...violaNotes];
  if (violaVln2Ratio < 0.6 && vln2NoteCount > 0) {
    const targetNotes = Math.max(Math.ceil(vln2NoteCount * 0.75), violaNoteCount + 6);
    let added = 0;
    for (let b = 0; b < totalBars && added < targetNotes - violaNoteCount; b++) {
      const barStart = b * beatsPerBar;
      const chord = getChordAtBeat(extendHarmony, barStart);
      if (chord && (b % 2 === 0 || added < 3)) {
        const tone = getChordTone(chord.symbol, (b % 3) + 1);
        outViola.push({ pitch: Math.min(79, Math.max(48, 52 + tone)), duration: 1, offset: barStart + 1.5, rest: false });
        added++;
      }
    }
    outViola.sort((a, b) => (a.offset ?? 0) - (b.offset ?? 0));
  }

  const violaAttackCount = outViola.filter(n => !n.rest).length;
  const vln2AttackCount = vn2Notes.filter(n => !n.rest).length;
  const violaAttackRatio = vln2AttackCount > 0 ? violaAttackCount / vln2AttackCount : 1;
  if (violaAttackRatio < 0.5 && vln2AttackCount > 0) {
    for (let b = 0; b < totalBars; b++) {
      const inBar = outViola.filter(n => !n.rest && (n.offset ?? 0) >= b * beatsPerBar && (n.offset ?? 0) < (b + 1) * beatsPerBar).length;
      if (inBar >= 2) continue;
      const floor = whichTextureFloor(b, totalBars, rotationOffset);
      const vRole = violaRoleForBar(b, floor, b + revisionSeed);
      if (vRole === 'suspension_tension') continue;
      const barStart = b * beatsPerBar;
      const chord = getChordAtBeat(extendHarmony, barStart);
      if (chord) {
        outViola.push({ pitch: 55 + getChordTone(chord.symbol, 1), duration: 0.5, offset: barStart + 1, rest: false });
      }
    }
    outViola.sort((a, b) => (a.offset ?? 0) - (b.offset ?? 0));
  }

  const finalVn1 = applyBowability(vn1Notes, 55, 88);
  const finalVn2 = applyBowability(vn2Notes, 48, 84);
  const finalViola = applyBowability(outViola, 48, 79);
  const finalCello = applyBowability(celloNotes, 36, 72);

  const metrics = computeQuartetMetrics(
    finalVn1, finalVn2, finalViola, finalCello, totalBars,
    { violaRoleByBar, celloRoleByBar, violaMotifBars, celloMotifBars, textureReductionCount }
  );

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
    violaVln2Ratio,
    celloVln1Ratio,
    counterpointEventCount: counterpointEvents,
    motifTransformCountPer16,
    densityViolations,
    violaMotifBars,
    celloMotifBars,
    violaRoleByBar,
    celloRoleByBar,
    activeDurationByInstrument: [
      metrics.vn1.activeDuration, metrics.vn2.activeDuration, metrics.viola.activeDuration, metrics.cello.activeDuration,
    ],
    attackDensityByInstrument: [
      metrics.vn1.attackDensity, metrics.vn2.attackDensity, metrics.viola.attackDensity, metrics.cello.attackDensity,
    ],
    restRatioByInstrument: [
      metrics.vn1.restRatio, metrics.vn2.restRatio, metrics.viola.restRatio, metrics.cello.restRatio,
    ],
    roleEntropyByInstrument: [
      metrics.vn1.roleEntropy, metrics.vn2.roleEntropy, metrics.viola.roleEntropy, metrics.cello.roleEntropy,
    ],
    motifParticipationByInstrument: [
      metrics.vn1.motifParticipation, metrics.vn2.motifParticipation, metrics.viola.motifParticipation, metrics.cello.motifParticipation,
    ],
    simultaneousMotionRatio: metrics.simultaneousMotionRatio,
    exposedDuoTrioBars: metrics.exposedDuoTrioBars,
  };

  return {
    vn1: finalVn1,
    vn2: finalVn2,
    viola: applyBowability(outViola, 48, 79),
    cello: finalCello,
    textureRotations,
    motifMigrations,
    diagnostics,
  };
}
