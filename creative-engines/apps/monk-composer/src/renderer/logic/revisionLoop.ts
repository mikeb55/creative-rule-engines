import type { Composition, GCEScores, Warnings } from './types';
import { evaluateGCE } from './gceEvaluator';
import { applyAngularity, addStrategicSilence } from './monkRules';
import { addDiminishedPassing } from './barryRules';
import { generateQuartet } from './quartetEngine';
import type { BarryControls, MonkControls, GlobalControls } from './types';

const MAX_ITERATIONS = 15;

export interface RevisionResult {
  composition: Composition;
  scores: GCEScores;
  revisionCount: number;
  metThreshold: boolean;
}

export interface RevisionOptions {
  target: string;
  threshold: number;
  barry?: BarryControls;
  monk?: MonkControls;
  global?: GlobalControls;
  engine?: string;
}

export function runRevisionLoop(
  initial: Composition,
  target: string,
  threshold: number,
  options?: Partial<RevisionOptions>
): RevisionResult {
  let comp = { ...initial };
  let scores = evaluateGCE(comp, target).scores;
  let revisionCount = 0;
  const opts = options ?? {};
  const barry = opts.barry ?? comp.metadata?.barry as BarryControls | undefined;
  const monk = opts.monk ?? comp.metadata?.monk as MonkControls | undefined;
  const global = opts.global ?? comp.metadata?.global as GlobalControls | undefined;

  while (scores.overall < threshold && revisionCount < MAX_ITERATIONS) {
    const evalResult = evaluateGCE(comp, target);
    scores = evalResult.scores;
    const warnings = evalResult.warnings as Warnings & Record<string, boolean>;

    if (target === 'string_quartet' && comp.texture?.length === 4 && comp.motif && comp.harmony) {
      const quartetFixes = [
        warnings.repeatedBarSyndrome,
        warnings.repeated2BarLoopSyndrome,
        warnings.violaFiller,
        warnings.celloLoop,
        warnings.tooManyAllInstrumentsActive,
        warnings.noTexturalReduction,
        warnings.noMotivicMigration,
        warnings.lackComplementaryRhythm,
        warnings.staticInnerVoice,
        warnings.repeatedAccompanimentCell,
        warnings.noTextureRotation,
        warnings.nonBowable,
        warnings.upperLowerDisconnect,
      ].filter(Boolean);
      if (quartetFixes.length > 0) {
        const result = generateQuartet({
          motif: comp.motif,
          harmony: comp.harmony,
          bars: comp.phrases?.[0]?.bars ?? global?.bars ?? 32,
          density: global?.quartetDensity ?? 'conversational',
          barry: {
            guideToneStrength: barry?.guideToneStrength ?? 0.8,
            diminishedPassingIntensity: barry?.diminishedPassingIntensity ?? 0.4,
          },
          monk: {
            angularity: monk?.angularity ?? 0.7,
            rhythmicLurch: monk?.rhythmicLurch ?? 0.6,
            silenceDensity: monk?.silenceDensity ?? 0.4,
            wrongRightIntensity: monk?.wrongRightIntensity ?? 0.5,
          },
          rotationOffset: revisionCount % 4,
          revisionSeed: revisionCount,
        });
        comp = {
          ...comp,
          texture: [
            { voice: 1, notes: result.vn1 },
            { voice: 2, notes: result.vn2 },
            { voice: 3, notes: result.viola },
            { voice: 4, notes: result.cello },
          ],
          quartetDiagnostics: {
            textureRotationCount: result.textureRotations,
            motifMigrationCount: result.motifMigrations,
            repeatedCellWarnings: result.diagnostics?.repeatedBarWarnings ?? 0,
            bowabilityWarnings: 0,
            innerVoiceIndependenceScore: result.diagnostics?.complementaryRhythmScore ?? 0.8,
            celloIndependenceScore: result.diagnostics?.celloIndependenceScore ?? 0.75,
            violaUsefulnessScore: result.diagnostics?.violaUsefulnessScore ?? 0.8,
            repeatedBarWarnings: result.diagnostics?.repeatedBarWarnings,
            repeated2BarLoopWarnings: result.diagnostics?.repeated2BarLoopWarnings,
            textureReductionCount: result.diagnostics?.textureReductionCount,
            allVoicesActiveOveruse: result.diagnostics?.allVoicesActiveOveruse,
            complementaryRhythmScore: result.diagnostics?.complementaryRhythmScore,
          },
          metadata: { ...comp.metadata, revisionCount: revisionCount + 1 },
        };
      } else {
        const weakest =
          scores.motivicIntegrity < scores.rhythmicPersonality && scores.motivicIntegrity < scores.harmonicCoherence
            ? 'motivic'
            : scores.rhythmicPersonality < scores.harmonicCoherence
            ? 'rhythmic'
            : 'harmonic';
        if (weakest === 'motivic') {
          comp = {
            ...comp,
            motif: applyAngularity(comp.motif, 0.3),
            texture: comp.texture.map(t => ({ ...t, notes: applyAngularity(t.notes, 0.2) })),
          };
        } else if (weakest === 'rhythmic') {
          comp = {
            ...comp,
            motif: addStrategicSilence(comp.motif, 0.2),
            texture: comp.texture.map(t => ({ ...t, notes: addStrategicSilence(t.notes, 0.2) })),
          };
        } else {
          comp = {
            ...comp,
            harmony: addDiminishedPassing(comp.harmony, 0.3),
          };
        }
        comp.metadata = { ...comp.metadata, revisionCount: revisionCount + 1 };
      }
    } else {
      const weakest =
        scores.motivicIntegrity < scores.rhythmicPersonality && scores.motivicIntegrity < scores.harmonicCoherence
          ? 'motivic'
          : scores.rhythmicPersonality < scores.harmonicCoherence
          ? 'rhythmic'
          : 'harmonic';
      if (weakest === 'motivic') {
        comp = {
          ...comp,
          motif: applyAngularity(comp.motif, 0.3),
          texture: comp.texture.map(t => ({ ...t, notes: applyAngularity(t.notes, 0.2) })),
        };
      } else if (weakest === 'rhythmic') {
        comp = {
          ...comp,
          motif: addStrategicSilence(comp.motif, 0.2),
          texture: comp.texture.map(t => ({ ...t, notes: addStrategicSilence(t.notes, 0.2) })),
        };
      } else {
        comp = {
          ...comp,
          harmony: addDiminishedPassing(comp.harmony, 0.3),
        };
      }
      comp.metadata = { ...comp.metadata, revisionCount: revisionCount + 1 };
    }
    const nextEval = evaluateGCE(comp, target);
    scores = nextEval.scores;
    revisionCount++;
  }

  return {
    composition: comp,
    scores,
    revisionCount,
    metThreshold: scores.overall >= threshold,
  };
}
