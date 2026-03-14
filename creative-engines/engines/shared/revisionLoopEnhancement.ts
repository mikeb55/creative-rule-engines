/**
 * Revision Loop Enhancement — Evaluates generated output and triggers regeneration when quality is insufficient.
 * Runs after validation, before final export.
 *
 * Evaluation checks:
 * - Guide-tone continuity
 * - Harmonic direction
 * - Rhythmic diversity
 * - Texture variation
 * - Voicing clarity
 * - Instrument idiom compliance
 *
 * Regeneration triggers:
 * - guideToneContinuityBroken
 * - textureUniform
 * - rhythmGrammarMissing
 * - counterlineTooDense
 * - voicingUnstable
 * - instrumentIdiomViolation
 *
 * Max 5 regeneration cycles. Select highest-scoring output.
 */
export type RevisionTrigger =
  | 'guideToneContinuityBroken'
  | 'textureUniform'
  | 'rhythmGrammarMissing'
  | 'counterlineTooDense'
  | 'voicingUnstable'
  | 'instrumentIdiomViolation';

export type RegenerateLayer = 'melodic' | 'counterline' | 'voicing';

export interface PipelineMetadata {
  phraseArchitectureApplied?: boolean;
  harmonicDirectionPresent?: boolean;
  motionGrammarUsed?: boolean;
  guideToneSkeletonValid?: boolean;
  guideToneContinuityBroken?: boolean;
  dominantResolutionMissing?: boolean;
  excessiveVoiceLeadingLeap?: boolean;
  rhythmGrammarApplied?: boolean;
  melodicRealizationApplied?: boolean;
  rhythmicDensityUniform?: boolean;
  melodyIgnoresHarmony?: boolean;
  counterlineApplied?: boolean;
  counterlineTooDense?: boolean;
  textureStateApplied?: boolean;
  textureUniform?: boolean;
  textureOvercrowded?: boolean;
  textureMissingContrast?: boolean;
  voicingOptimizationValid?: boolean;
  voicingGuideToneMissing?: boolean;
  voicingRegisterJump?: boolean;
  voicingTextureConflict?: boolean;
  voicingInstrumentViolation?: boolean;
  instrumentIdiomViolation?: boolean;
}

export interface RevisionEvaluationInput {
  metadata: PipelineMetadata;
  eventsCount: number;
  chordEventsCount: number;
  melodicEventsCount: number;
  counterlineEventsCount: number;
  instrument: 'guitar' | 'piano';
  engine: 'barry' | 'monk';
}

export interface RevisionEvaluationResult {
  shouldRegenerate: boolean;
  triggers: RevisionTrigger[];
  regenerateLayers: RegenerateLayer[];
  score: number;
  maxCyclesReached: boolean;
}

const MAX_REVISION_CYCLES = 5;

/**
 * Map triggers to layers to regenerate.
 */
function triggersToLayers(triggers: RevisionTrigger[]): RegenerateLayer[] {
  const layers = new Set<RegenerateLayer>();
  for (const t of triggers) {
    if (t === 'guideToneContinuityBroken') {
      layers.add('melodic');
    }
    if (t === 'counterlineTooDense') {
      layers.add('counterline');
    }
    if (t === 'voicingUnstable' || t === 'instrumentIdiomViolation') {
      layers.add('voicing');
    }
  }
  if (triggers.includes('textureUniform') || triggers.includes('rhythmGrammarMissing')) {
    layers.add('melodic');
    layers.add('counterline');
  }
  return [...layers];
}

/**
 * Compute quality score from metadata (0–10).
 */
function computeScore(meta: PipelineMetadata): number {
  let score = 7;
  if (meta.guideToneContinuityBroken) score -= 1.5;
  if (meta.textureUniform) score -= 1.0;
  if (meta.rhythmGrammarApplied === false) score -= 1.5;
  if (meta.counterlineTooDense) score -= 1.0;
  if (meta.voicingOptimizationValid === false) score -= 1.5;
  if (meta.voicingGuideToneMissing) score -= 0.5;
  if (meta.voicingRegisterJump) score -= 0.5;
  if (meta.voicingTextureConflict) score -= 0.5;
  if (meta.voicingInstrumentViolation) score -= 1.0;
  if (meta.instrumentIdiomViolation) score -= 1.0;
  if (meta.melodicRealizationApplied === false) score -= 1.0;
  if (meta.phraseArchitectureApplied) score += 0.3;
  if (meta.harmonicDirectionPresent) score += 0.3;
  if (meta.guideToneSkeletonValid) score += 0.2;
  return Math.max(0, Math.min(10, score));
}

/**
 * Evaluate pipeline output and determine if regeneration is needed.
 */
export function evaluateForRevision(
  input: RevisionEvaluationInput,
  currentCycle: number
): RevisionEvaluationResult {
  const { metadata, chordEventsCount, melodicEventsCount, counterlineEventsCount } = input;
  const triggers: RevisionTrigger[] = [];

  if (metadata.guideToneContinuityBroken) {
    triggers.push('guideToneContinuityBroken');
  }
  if (metadata.textureUniform) {
    triggers.push('textureUniform');
  }
  if (metadata.rhythmGrammarApplied === false) {
    triggers.push('rhythmGrammarMissing');
  }
  if (metadata.counterlineTooDense) {
    triggers.push('counterlineTooDense');
  }
  if (
    metadata.voicingOptimizationValid === false ||
    metadata.voicingGuideToneMissing ||
    metadata.voicingRegisterJump ||
    metadata.voicingTextureConflict ||
    metadata.voicingInstrumentViolation
  ) {
    triggers.push('voicingUnstable');
  }
  if (metadata.instrumentIdiomViolation) {
    triggers.push('instrumentIdiomViolation');
  }

  const score = computeScore(metadata);
  const shouldRegenerate =
    triggers.length > 0 &&
    currentCycle < MAX_REVISION_CYCLES &&
    score < 7.5;

  return {
    shouldRegenerate,
    triggers,
    regenerateLayers: triggersToLayers(triggers),
    score,
    maxCyclesReached: currentCycle >= MAX_REVISION_CYCLES,
  };
}

/**
 * Select the highest-scoring output from a set of candidates.
 */
export function selectBestOutput<T>(
  candidates: T[],
  scoreFn: (candidate: T) => number
): { best: T; score: number } | null {
  if (candidates.length === 0) return null;
  let best = candidates[0];
  let bestScore = scoreFn(best);
  for (let i = 1; i < candidates.length; i++) {
    const s = scoreFn(candidates[i]);
    if (s > bestScore) {
      best = candidates[i];
      bestScore = s;
    }
  }
  return { best, score: bestScore };
}
