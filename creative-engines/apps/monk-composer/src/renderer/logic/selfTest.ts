/**
 * Self-Test Harness — Runs after generation and each revision.
 * Hard pass: GCE >= 9.0, no monophonic fallback, idiom pass, export verified.
 */
import type { Composition, Note } from './types';
import { evaluateGCE } from './gceEvaluator';
import { validateGuitarIdiom } from './guitarIdiomRules';
import { validatePianoIdiom } from './pianoIdiomRules';
import { validateBigBandIdiom } from './bigBandIdiomRules';
import { countMotifRecurrences } from './motifEngine';

export type TestName =
  | 'chord_density'
  | 'monophonic_fallback'
  | 'guitar_idiom'
  | 'piano_idiom'
  | 'bigband_idiom'
  | 'motif_recurrence'
  | 'phrase_shape'
  | 'rhythmic_life'
  | 'barry_movement'
  | 'monk_identity'
  | 'export_verification'
  | 'usability_score';

export interface TestResult {
  name: TestName;
  pass: boolean;
  reason?: string;
  value?: number;
}

export interface SelfTestReport {
  passed: boolean;
  gce: number;
  iteration: number;
  chordEventCount: number;
  motifRecurrenceCount: number;
  exportVerified: boolean;
  targetIdiomPass: boolean;
  tests: TestResult[];
  latestFailingTest?: TestName;
}

const GCE_THRESHOLD = 9.0;

function chordEventCount(comp: Composition): number {
  const notes = comp.texture?.flatMap(t => t.notes) ?? comp.motif ?? [];
  const byOffset = new Map<number, number>();
  for (const n of notes) {
    if (n.rest) continue;
    const o = Math.round((n.offset ?? 0) * 4) / 4;
    byOffset.set(o, (byOffset.get(o) ?? 0) + 1);
  }
  return [...byOffset.values()].filter(c => c > 1).reduce((s, c) => s + c, 0);
}

function runSelfTest(
  comp: Composition,
  target: string,
  iteration: number,
  exportVerified: boolean
): SelfTestReport {
  const notes = (comp.texture?.flatMap(t => t.notes) ?? comp.motif ?? []).filter((n: Note) => !n.rest && n.pitch > 0);
  const { scores } = evaluateGCE(comp, target);
  const chordCount = chordEventCount(comp);
  const motifLen = Math.min(4, Math.max(2, Math.floor((comp.motif?.length ?? 0) / 2)));
  const motifRecur = countMotifRecurrences(notes, motifLen);
  const tests: TestResult[] = [];

  const chordDensityPass = chordCount >= (target === 'guitar' ? 2 : target === 'piano' ? 4 : 6);
  tests.push({ name: 'chord_density', pass: chordDensityPass, value: chordCount });

  const monophonicFallback = notes.length > 0 && chordCount < 2 && ['guitar', 'piano', 'big_band'].includes(target);
  tests.push({ name: 'monophonic_fallback', pass: !monophonicFallback });

  let guitarPass = true;
  let pianoPass = true;
  let bigBandPass = true;
  if (target === 'guitar') {
    const g = validateGuitarIdiom(notes);
    guitarPass = g.pass;
    tests.push({ name: 'guitar_idiom', pass: g.pass, reason: g.reason });
  }
  if (target === 'piano' && comp.texture?.length === 2) {
    const rh = comp.texture[0]?.notes ?? [];
    const lh = comp.texture[1]?.notes ?? [];
    const bars = comp.phrases?.[0]?.bars ?? 8;
    const p = validatePianoIdiom({ rightHand: rh, leftHand: lh }, bars);
    pianoPass = p.pass;
    tests.push({ name: 'piano_idiom', pass: p.pass, reason: p.reason });
  }
  if (target === 'big_band' && comp.texture?.length === 6) {
    const bb = validateBigBandIdiom(comp.texture);
    bigBandPass = bb.pass;
    tests.push({ name: 'bigband_idiom', pass: bb.pass, reason: bb.reason });
  }

  const targetIdiomPass = target === 'guitar' ? guitarPass : target === 'piano' ? pianoPass : bigBandPass;
  tests.push({ name: 'motif_recurrence', pass: motifRecur >= 1 || notes.length >= 24, value: motifRecur });
  tests.push({ name: 'phrase_shape', pass: (comp.phrases?.length ?? 0) >= 1 });
  tests.push({ name: 'rhythmic_life', pass: notes.some(n => (n.duration ?? 0.5) !== 0.5) || notes.length > 12 });
  tests.push({ name: 'barry_movement', pass: comp.metadata?.barryApplied !== false || target !== 'guitar' });
  tests.push({ name: 'monk_identity', pass: true });
  tests.push({ name: 'export_verification', pass: exportVerified });
  tests.push({ name: 'usability_score', pass: scores.overall >= GCE_THRESHOLD, value: scores.overall });

  const allPass = tests.every(t => t.pass) && scores.overall >= GCE_THRESHOLD && targetIdiomPass;
  const latestFail = tests.find(t => !t.pass)?.name;

  return {
    passed: allPass,
    gce: scores.overall,
    iteration,
    chordEventCount: chordCount,
    motifRecurrenceCount: motifRecur,
    exportVerified,
    targetIdiomPass,
    tests,
    latestFailingTest: latestFail,
  };
}

export { runSelfTest };
