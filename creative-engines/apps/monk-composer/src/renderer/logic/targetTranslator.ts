import type { Note, Chord, BarryControls, MonkControls, GlobalControls } from './types';
import { generateQuartet } from './quartetEngine';
import { applyGuitarVoicing } from './guitarVoicingEngine';
import { applyPianoVoicing } from './pianoVoicingEngine';

interface TargetOptions {
  playabilityStrictness: number;
  harmony?: Chord[];
  keyCenter?: string;
  barry?: BarryControls;
  monk?: MonkControls;
  global?: GlobalControls;
}

export function translateToTarget(
  layer: { voice: number; notes: Note[] },
  target: string,
  options: TargetOptions
): { voice: number; notes: Note[] }[] {
  const { notes } = layer;
  const harmony = options.harmony ?? [];

  if (target === 'guitar') {
    const harmonized = applyGuitarVoicing(notes, harmony, {
      harmonizeRatio: 0.5,
      keyCenter: options.keyCenter ?? 'C',
    });
    return [
      {
        voice: 1,
        notes: harmonized.map(n => ({
          ...n,
          pitch: n.rest ? 0 : Math.min(84, Math.max(40, n.pitch)),
        })),
      },
    ];
  }

  if (target === 'piano') {
    const harmonized = applyPianoVoicing(notes, harmony, {
      harmonizeRatio: 0.5,
      keyCenter: options.keyCenter ?? 'C',
    });
    return [
      {
        voice: 1,
        notes: harmonized.map(n => ({
          ...n,
          pitch: n.rest ? 0 : Math.min(88, Math.max(21, n.pitch)),
        })),
      },
    ];
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
    const harmonized = applyPianoVoicing(notes, harmony, {
      harmonizeRatio: 0.5,
      keyCenter: options.keyCenter ?? 'C',
    });
    return [
      {
        voice: 1,
        notes: harmonized.map(n => ({
          ...n,
          pitch: n.rest ? 0 : Math.min(88, Math.max(21, n.pitch)),
        })),
      },
    ];
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
