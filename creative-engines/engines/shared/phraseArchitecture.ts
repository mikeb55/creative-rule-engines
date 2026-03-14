/**
 * Phrase Architecture Engine — Groups harmonic events into phrases.
 * Sits between harmony generation and melodic realization.
 *
 * Responsibilities:
 * - group harmonic events into phrases
 * - define phrase lengths (4, 6, 8 bars)
 * - control tension arc across phrase
 * - control interruption points
 * - insert cadential pressure
 */
import type { HarmonicTarget } from '../../../engines/shared/HarmonicTarget';

export interface PhraseStructure {
  phraseLength: number;
  harmonicTargets: HarmonicTarget[];
  cadencePoints: number[];
  tensionCurve: number[];
}

export interface PhraseArchitectureOptions {
  harmonicTargets: HarmonicTarget[];
  phraseLengths?: number[];
  requireCadencePressure?: boolean;
  requireTensionArc?: boolean;
}

function hasCadencePressure(targets: HarmonicTarget[]): boolean {
  return targets.some(t => t.punctuation);
}

function hasPhraseBoundary(targets: HarmonicTarget[]): boolean {
  if (targets.length < 2) return true;
  const measures = [...new Set(targets.map(t => t.measure))];
  return measures.length > 1;
}

function hasUniformDensity(targets: HarmonicTarget[]): boolean {
  if (targets.length < 6) return false;
  const measures = targets.map(t => t.measure);
  const countPerMeasure = new Map<number, number>();
  for (const m of measures) countPerMeasure.set(m, (countPerMeasure.get(m) ?? 0) + 1);
  const counts = [...countPerMeasure.values()];
  const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
  if (avg < 2.5) return false;
  const variance = counts.reduce((a, c) => a + Math.pow(c - avg, 2), 0) / counts.length;
  return variance < 0.01;
}

export function buildPhraseArchitecture(
  options: PhraseArchitectureOptions
): PhraseStructure | null {
  const {
    harmonicTargets,
    phraseLengths = [4, 6, 8],
    requireCadencePressure = true,
    requireTensionArc = true,
  } = options;

  if (harmonicTargets.length === 0) return null;

  const phraseLength = phraseLengths[Math.floor(Math.random() * phraseLengths.length)];
  const maxMeasure = Math.max(...harmonicTargets.map(t => t.measure));
  const targetsInPhrase = harmonicTargets.filter(
    t => t.measure < Math.min(phraseLength, maxMeasure + 1)
  );

  if (requireCadencePressure && !hasCadencePressure(targetsInPhrase)) {
    const withCadence = [...targetsInPhrase];
    const lastIdx = withCadence.length - 1;
    if (lastIdx >= 0) {
      withCadence[lastIdx] = { ...withCadence[lastIdx], punctuation: true };
    }
    return buildFromTargets(withCadence, phraseLength);
  }

  if (!hasPhraseBoundary(targetsInPhrase)) return null;
  if (hasUniformDensity(targetsInPhrase)) return null;

  return buildFromTargets(targetsInPhrase, phraseLength);
}

function buildFromTargets(
  targets: HarmonicTarget[],
  phraseLength: number
): PhraseStructure {
  const cadencePoints = targets
    .filter(t => t.punctuation)
    .map(t => t.measure * 4 + t.beatPosition);

  if (cadencePoints.length === 0 && targets.length > 0) {
    const last = targets[targets.length - 1];
    cadencePoints.push(last.measure * 4 + last.beatPosition);
  }

  const tensionCurve: number[] = [];
  for (let m = 0; m < phraseLength; m++) {
    const inMeasure = targets.filter(t => t.measure === m).length;
    const t = m / Math.max(1, phraseLength - 1);
    tensionCurve.push(Math.min(1, 0.3 + inMeasure * 0.2 + 0.4 * Math.sin(t * Math.PI)));
  }

  return {
    phraseLength,
    harmonicTargets: targets,
    cadencePoints,
    tensionCurve,
  };
}

export function validatePhraseStructure(ps: PhraseStructure): boolean {
  if (ps.cadencePoints.length === 0) return false;
  if (ps.harmonicTargets.length === 0) return false;
  if (ps.tensionCurve.every(v => Math.abs(v - ps.tensionCurve[0]) < 0.01)) return false;
  return true;
}
