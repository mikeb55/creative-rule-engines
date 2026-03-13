import type { Composition, GCEScores, Warnings, Note } from './types';
import { evaluateStepwiseMotion } from './barryRules';
import { evaluateAsymmetry, wrongRightValidator } from './monkRules';

function cellSignature(n: Note, divs = 4): string {
  const dur = Math.round((n.duration ?? 0.25) * divs);
  return `${n.pitch}-${dur}`;
}

function countRepeatedCells(notes: Note[], _barLength = 4, minRepeat = 3): number {
  if (notes.length < 6) return 0;
  let count = 0;
  const cellLen = Math.min(4, Math.floor(notes.length / 3));
  for (let i = 0; i <= notes.length - cellLen * minRepeat; i++) {
    const cells = notes.slice(i, i + cellLen * minRepeat);
    const sigs = cells.map(n => cellSignature(n));
    const oneBar = sigs.slice(0, Math.min(4, cellLen)).join(',');
    let repeats = 0;
    for (let j = 0; j <= sigs.length - cellLen; j += cellLen) {
      const chunk = sigs.slice(j, j + cellLen).join(',');
      if (chunk === oneBar) repeats++;
    }
    if (repeats >= minRepeat) count++;
  }
  return Math.min(5, count);
}

function detectCelloLoop(notes: Note[]): boolean {
  if (notes.length < 8) return false;
  const sigs = notes.slice(0, 8).map(n => cellSignature(n));
  const pattern = sigs.slice(0, 2).join(',');
  let matches = 0;
  for (let i = 0; i <= sigs.length - 2; i += 2) {
    if (sigs.slice(i, i + 2).join(',') === pattern) matches++;
  }
  return matches >= 4;
}

function detectViolaFiller(notes: Note[]): boolean {
  if (notes.length < 12) return false;
  const durs = notes.map(n => n.duration ?? 0.25);
  const sameDur = durs.filter(d => Math.abs(d - durs[0]) < 0.1).length;
  return sameDur >= notes.length * 0.8;
}

function detectStaticInnerVoice(viola: Note[], cello: Note[]): boolean {
  return detectViolaFiller(viola) || detectCelloLoop(cello);
}

function bowabilityScore(notes: Note[]): number {
  if (notes.length < 3) return 1;
  let penal = 0;
  for (let i = 1; i < notes.length; i++) {
    const leap = Math.abs((notes[i].pitch ?? 0) - (notes[i - 1].pitch ?? 0));
    if (leap > 10) penal += 0.2;
    if ((notes[i].duration ?? 0.5) < 0.2) penal += 0.1;
  }
  return Math.max(0, 1 - penal);
}

export function evaluateGCE(comp: Composition, target: string): { scores: GCEScores; warnings: Warnings } {
  const notes = (comp.texture?.flatMap(t => t.notes) || comp.motif || []).filter(n => !n.rest && n.pitch > 0);
  const phraseNotes = comp.phrases?.flatMap(p => p.notes || []) || notes;
  const stepwise = notes.length > 1 ? evaluateStepwiseMotion(notes) : 1;
  const asymmetry = phraseNotes.length > 0 ? evaluateAsymmetry(phraseNotes) : 0.5;
  const wrongRight = wrongRightValidator(notes);

  let motivicIntegrity = 0.7 + stepwise * 0.2 + (comp.phrases.length > 1 ? 0.1 : 0);
  let rhythmicPersonality = 0.6 + asymmetry * 0.3 + (comp.phrases?.some(p => p.notes?.some(n => n.rest)) ? 0.1 : 0);
  let harmonicCoherence = 0.75 + (comp.harmony.length > 2 ? 0.15 : 0) + (wrongRight ? 0.1 : 0);
  const asymmetryScore = 0.5 + asymmetry * 0.5;
  let targetIdiom = target === 'guitar' ? 0.85 : target === 'piano' ? 0.88 : target === 'string_quartet' ? 0.82 : 0.8;
  let originality = 0.7 + asymmetry * 0.2 + (comp.metadata?.monkApplied ? 0.1 : 0);
  let afterglow = (motivicIntegrity + rhythmicPersonality) / 2;

  const warnings: Warnings = {
    genericBebop: stepwise > 0.9 && asymmetry < 0.3,
    unsupportedRandomness: false,
    unplayableGuitar: target === 'guitar' && notes.some(n => Math.abs(n.pitch - 60) > 24),
    poorVoiceLeading: stepwise < 0.4,
    stringWriting: target === 'string_quartet' && notes.some(n => n.duration < 0.2),
    bigBandStockWriting: target === 'big_band' && asymmetry < 0.2,
    weakCadence: false,
    staticInnerVoice: false,
    celloLoop: false,
    violaFiller: false,
    repeatedAccompanimentCell: false,
    noTextureRotation: false,
    noMotivicMigration: false,
    upperLowerDisconnect: false,
    nonBowable: false,
    fakeKeyboardDoubling: false,
    repeatedBarSyndrome: false,
    repeated2BarLoopSyndrome: false,
    staticAccompanimentSyndrome: false,
    allVoicesSameFigure: false,
    noTexturalReduction: false,
    tooManyAllInstrumentsActive: false,
    lackComplementaryRhythm: false,
  };

  const cadenceStrength = comp.harmony?.length
    ? (comp.harmony.some((c, i) => i > 0 && c.symbol.includes('C') && comp.harmony[i - 1]?.symbol.includes('G')) ? 0.9 : 0.5)
    : 0.5;
  warnings.weakCadence = cadenceStrength < 0.6;

  if (target === 'string_quartet' && comp.texture?.length === 4) {
    const [vn1, vn2, viola, cello] = comp.texture.map(t => t.notes?.filter(n => !n.rest) ?? []);
    const diag = comp.quartetDiagnostics;
    const bars = comp.phrases?.[0]?.bars ?? 16;

    const staticInner = detectStaticInnerVoice(viola ?? [], cello ?? []);
    const celloLoop = detectCelloLoop(cello ?? []);
    const violaFiller = detectViolaFiller(viola ?? []);
    const repeatedCells = countRepeatedCells(viola ?? []) + countRepeatedCells(cello ?? []);
    const noTextureRotation = (diag?.textureRotationCount ?? 0) < Math.floor(bars / 6);
    const noMotivicMigration = (diag?.motifMigrationCount ?? 0) < 1;
    const upperActive = (vn1?.length ?? 0) + (vn2?.length ?? 0);
    const lowerActive = (viola?.length ?? 0) + (cello?.length ?? 0);
    const upperLowerDisconnect = lowerActive > 0 && upperActive / Math.max(1, lowerActive) > 5;
    const bowScore = Math.min(bowabilityScore(vn1 ?? []), bowabilityScore(vn2 ?? []), bowabilityScore(viola ?? []), bowabilityScore(cello ?? []));
    const nonBowable = bowScore < 0.6;
    const fakeDoubling = (vn1?.length ?? 0) > 0 && (vn2?.length ?? 0) > 0 && Math.abs((vn1?.[0]?.pitch ?? 0) - (vn2?.[0]?.pitch ?? 0)) === 8;

    const repeatedBarSyndrome = (diag?.repeatedBarWarnings ?? 0) >= 1;
    const repeated2BarLoopSyndrome = (diag?.repeated2BarLoopWarnings ?? 0) >= 2;
    const noTexturalReduction = (diag?.textureReductionCount ?? 0) < Math.floor(bars / 6);
    const tooManyAllInstrumentsActive = diag?.allVoicesActiveOveruse ?? false;
    const lackComplementaryRhythm = (diag?.complementaryRhythmScore ?? 0.8) < 0.6;
    const violaUsefulnessLow = (diag?.violaUsefulnessScore ?? 0.8) < 0.7;
    const celloIndependenceLow = (diag?.celloIndependenceScore ?? 0.75) < 0.65;

    warnings.staticInnerVoice = staticInner;
    warnings.celloLoop = celloLoop;
    warnings.violaFiller = violaFiller;
    warnings.repeatedAccompanimentCell = repeatedCells >= 3;
    warnings.noTextureRotation = noTextureRotation;
    warnings.noMotivicMigration = noMotivicMigration;
    warnings.upperLowerDisconnect = upperLowerDisconnect;
    warnings.nonBowable = nonBowable;
    warnings.fakeKeyboardDoubling = fakeDoubling;
    warnings.repeatedBarSyndrome = repeatedBarSyndrome;
    warnings.repeated2BarLoopSyndrome = repeated2BarLoopSyndrome;
    warnings.noTexturalReduction = noTexturalReduction;
    warnings.tooManyAllInstrumentsActive = tooManyAllInstrumentsActive;
    warnings.lackComplementaryRhythm = lackComplementaryRhythm;

    const penalty =
      (staticInner ? 1.5 : 0) +
      (celloLoop ? 1.2 : 0) +
      (violaFiller ? 1.0 : 0) +
      (repeatedCells >= 3 ? 1.0 : repeatedCells * 0.3) +
      (noTextureRotation ? 0.8 : 0) +
      (noMotivicMigration ? 0.7 : 0) +
      (upperLowerDisconnect ? 0.6 : 0) +
      (nonBowable ? 0.5 : 0) +
      (fakeDoubling ? 0.3 : 0) +
      (repeatedBarSyndrome ? 1.0 : 0) +
      (repeated2BarLoopSyndrome ? 1.2 : 0) +
      (noTexturalReduction ? 0.7 : 0) +
      (tooManyAllInstrumentsActive ? 0.8 : 0) +
      (lackComplementaryRhythm ? 0.6 : 0) +
      (violaUsefulnessLow ? 0.5 : 0) +
      (celloIndependenceLow ? 0.5 : 0);

    targetIdiom = Math.max(2, targetIdiom * 10 - penalty) / 10;
    motivicIntegrity = Math.max(0.3, motivicIntegrity - (noMotivicMigration ? 0.15 : 0) - (repeatedBarSyndrome ? 0.1 : 0));
    rhythmicPersonality = Math.max(0.3, rhythmicPersonality - (repeatedCells >= 3 ? 0.1 : 0) - (repeated2BarLoopSyndrome ? 0.15 : 0));
    harmonicCoherence = Math.max(0.3, harmonicCoherence - (staticInner ? 0.1 : 0));
    originality = Math.max(0.3, originality - (celloLoop || violaFiller ? 0.15 : 0) - (tooManyAllInstrumentsActive ? 0.1 : 0));
    afterglow = (motivicIntegrity + rhythmicPersonality) / 2;
  }

  const overall =
    (motivicIntegrity + rhythmicPersonality + harmonicCoherence + asymmetryScore + targetIdiom + originality + afterglow) / 7 * 10;

  return {
    scores: {
      overall: Math.min(10, Math.round(overall * 10) / 10),
      motivicIntegrity: Math.min(10, motivicIntegrity * 10),
      rhythmicPersonality: Math.min(10, rhythmicPersonality * 10),
      harmonicCoherence: Math.min(10, harmonicCoherence * 10),
      asymmetry: Math.min(10, asymmetryScore * 10),
      targetIdiom: Math.min(10, targetIdiom * 10),
      originality: Math.min(10, originality * 10),
      afterglow: Math.min(10, afterglow * 10),
    },
    warnings,
  };
}
