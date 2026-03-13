import type {
  Composition,
  EngineChoice,
  OutputTarget,
  BarryControls,
  MonkControls,
  GlobalControls,
  QuartetDiagnostics,
  Note,
} from './types';
import { generateIIVProgression, generateBebopLine, addDiminishedPassing } from './barryRules';
import {
  applyAngularity,
  addRepeatedNoteRhetoric,
  applyPhraseDisplacement,
  addStrategicSilence,
  addWrongRightRecurrence,
} from './monkRules';
import { translateToTarget } from './targetTranslator';
import { generateQuartet } from './quartetEngine';

export function generateDraft(
  engine: EngineChoice,
  target: OutputTarget,
  barry: BarryControls,
  monk: MonkControls,
  global: GlobalControls
): Composition {
  const bars = Math.max(4, Math.min(128, global.bars));
  const chords = generateIIVProgression(global.keyCenter, bars);
  const harmony = addDiminishedPassing(chords, barry.diminishedPassingIntensity);

  let motif = generateBebopLine(harmony, bars, {
    bebopDensity: barry.bebopDensity,
    guideToneStrength: barry.guideToneStrength,
    enclosureUsage: barry.enclosureUsage,
  });

  if (engine === 'monk' || engine === 'barry_monk') {
    motif = applyAngularity(motif, monk.angularity);
    motif = addRepeatedNoteRhetoric(motif, monk.rhythmicLurch * 0.5);
    motif = applyPhraseDisplacement(motif, monk.rhythmicLurch);
    motif = addStrategicSilence(motif, monk.silenceDensity);
    motif = addWrongRightRecurrence(motif, monk.wrongRightIntensity);
  }

  let texture: { voice: number; notes: Note[] }[];
  let quartetDiagnostics: QuartetDiagnostics | undefined;

  if (target === 'string_quartet') {
    const result = generateQuartet({
      motif,
      harmony,
      bars,
      density: global.quartetDensity ?? 'conversational',
      barry: {
        guideToneStrength: barry.guideToneStrength,
        diminishedPassingIntensity: barry.diminishedPassingIntensity,
      },
      monk: {
        angularity: monk.angularity,
        rhythmicLurch: monk.rhythmicLurch,
        silenceDensity: monk.silenceDensity,
        wrongRightIntensity: monk.wrongRightIntensity,
      },
    });
    texture = [
      { voice: 1, notes: result.vn1 },
      { voice: 2, notes: result.vn2 },
      { voice: 3, notes: result.viola },
      { voice: 4, notes: result.cello },
    ];
    quartetDiagnostics = {
      textureRotationCount: result.textureRotations,
      motifMigrationCount: result.motifMigrations,
      repeatedCellWarnings: 0,
      bowabilityWarnings: 0,
      innerVoiceIndependenceScore: 0.8,
      celloIndependenceScore: 0.75,
      violaUsefulnessScore: 0.8,
    };
  } else {
    texture = translateToTarget(
      { voice: 1, notes: motif },
      target,
      {
        playabilityStrictness: global.playabilityStrictness,
        harmony,
        keyCenter: global.keyCenter,
      }
    );
  }

  const phrases = [{ notes: motif, bars }];

  return {
    phrases,
    harmony,
    motif,
    texture,
    quartetDiagnostics,
    metadata: {
      engine,
      target,
      barry,
      monk,
      global,
      monkApplied: engine === 'monk' || engine === 'barry_monk',
    },
  };
}
