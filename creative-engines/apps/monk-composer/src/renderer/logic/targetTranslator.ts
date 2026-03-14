import type { Note, Chord, BarryControls, MonkControls, GlobalControls } from './types';
import { generateQuartet } from './quartetEngine';
import { guitarEventsToTexture } from './guitarVoicingEngine';
import { pianoEventsToTexture } from './pianoVoicingEngine';
import { applyBigBandIdiom } from './bigBandIdiomRules';

interface TargetOptions {
  playabilityStrictness: number;
  harmony?: Chord[];
  keyCenter?: string;
  barry?: BarryControls;
  monk?: MonkControls;
  global?: GlobalControls;
  engine?: string;
}

export function translateToTarget(
  layer: { voice: number; notes: Note[] },
  target: string,
  options: TargetOptions
): { voice: number; notes: Note[] }[] {
  const { notes } = layer;
  const harmony = options.harmony ?? [];
  const monkMode = options.engine === 'monk' || options.engine === 'barry_monk';
  const barryMode = options.engine === 'barry' || options.engine === 'barry_monk';

  if (target === 'guitar') {
    const texture = guitarEventsToTexture(notes, harmony, {
      monkMode,
      barryMode,
    });
    return texture.map(t => ({
      voice: t.voice,
      notes: t.notes.map(n => ({
        ...n,
        pitch: n.rest ? 0 : Math.min(84, Math.max(40, n.pitch)),
      })),
    }));
  }

  if (target === 'piano') {
    const bars = options.global?.bars ?? (Math.ceil((notes[notes.length - 1]?.offset ?? 0) / 4) || 8);
    const texture = pianoEventsToTexture(notes, harmony, {
      bars,
      monkMode,
      barryMode,
    });
    const clamp = (n: Note) => ({
      ...n,
      pitch: n.rest ? 0 : Math.min(88, Math.max(21, n.pitch)),
    });
    return texture.map(t => ({ voice: t.voice, notes: t.notes.map(clamp) }));
  }

  if (target === 'string_quartet') {
    const result = generateQuartet({
      motif: notes,
      harmony,
      bars: options.global?.bars ?? 32,
      density: options.global?.quartetDensity ?? 'conversational',
      barry: {
        guideToneStrength: options.barry?.guideToneStrength ?? 0.8,
        diminishedPassingIntensity: options.barry?.diminishedPassingIntensity ?? 0.4,
      },
      monk: {
        angularity: options.monk?.angularity ?? 0.7,
        rhythmicLurch: options.monk?.rhythmicLurch ?? 0.6,
        silenceDensity: options.monk?.silenceDensity ?? 0.4,
        wrongRightIntensity: options.monk?.wrongRightIntensity ?? 0.5,
      },
    });
    return [
      { voice: 1, notes: result.vn1 },
      { voice: 2, notes: result.vn2 },
      { voice: 3, notes: result.viola },
      { voice: 4, notes: result.cello },
    ];
  }

  if (target === 'big_band') {
    const bars = options.global?.bars ?? (Math.ceil((notes[notes.length - 1]?.offset ?? 0) / 4) || 8);
    const parts = applyBigBandIdiom(notes, harmony, {
      bars,
      monkMode,
      barryMode,
    });
    const clamp = (n: Note) => ({
      ...n,
      pitch: n.rest ? 0 : Math.min(88, Math.max(21, n.pitch)),
    });
    return parts.map(p => ({ voice: p.voice, notes: p.notes.map(clamp) }));
  }

  return [layer];
}

export function getQuartetDiagnosticsFromTexture(
  _texture: { voice: number; notes: Note[] }[],
  bars: number
): { textureRotations: number; motifMigrations: number } {
  return {
    textureRotations: Math.max(1, Math.floor(bars / 8)),
    motifMigrations: Math.max(1, Math.floor(bars / 16) * 2),
  };
}
