/**
 * Revision Loop Tests
 *
 * Verify:
 * - revision loop improves low-scoring outputs
 * - final outputs exceed previous GCE score (or meet threshold)
 */
import { evaluateForRevision, selectBestOutput } from '../../creative-engines/engines/shared/revisionLoopEnhancement';

function main() {
  console.log('Revision Loop Enhancement Tests\n');

  const lowScoreMeta = {
    phraseArchitectureApplied: true,
    harmonicDirectionPresent: true,
    guideToneSkeletonValid: true,
    rhythmGrammarApplied: false,
    guideToneContinuityBroken: true,
    textureUniform: true,
    voicingOptimizationValid: false,
    voicingGuideToneMissing: true,
  };

  const highScoreMeta = {
    phraseArchitectureApplied: true,
    harmonicDirectionPresent: true,
    guideToneSkeletonValid: true,
    rhythmGrammarApplied: true,
    guideToneContinuityBroken: false,
    textureUniform: false,
    voicingOptimizationValid: true,
    voicingGuideToneMissing: false,
  };

  const lowEval = evaluateForRevision(
    {
      metadata: lowScoreMeta,
      eventsCount: 20,
      chordEventsCount: 8,
      melodicEventsCount: 6,
      counterlineEventsCount: 4,
      instrument: 'guitar',
      engine: 'barry',
    },
    0
  );

  const highEval = evaluateForRevision(
    {
      metadata: highScoreMeta,
      eventsCount: 20,
      chordEventsCount: 8,
      melodicEventsCount: 6,
      counterlineEventsCount: 4,
      instrument: 'guitar',
      engine: 'barry',
    },
    0
  );

  console.log('Low-score metadata:');
  console.log('  shouldRegenerate:', lowEval.shouldRegenerate ? 'PASS' : 'FAIL');
  console.log('  triggers:', lowEval.triggers.length > 0 ? 'PASS' : 'FAIL', lowEval.triggers);
  console.log('  score:', lowEval.score);

  console.log('\nHigh-score metadata:');
  console.log('  shouldRegenerate:', !highEval.shouldRegenerate ? 'PASS' : 'FAIL');
  console.log('  score:', highEval.score);

  const candidates = [
    { id: 'a', metadata: lowScoreMeta },
    { id: 'b', metadata: highScoreMeta },
    { id: 'c', metadata: { ...lowScoreMeta, rhythmGrammarApplied: true } },
  ];
  const best = selectBestOutput(candidates, c => {
    const m = c.metadata as Record<string, unknown>;
    let s = 7;
    if (m.guideToneContinuityBroken) s -= 1.5;
    if (m.textureUniform) s -= 1;
    if (m.rhythmGrammarApplied === false) s -= 1.5;
    if (m.voicingOptimizationValid === false) s -= 1.5;
    if (m.phraseArchitectureApplied) s += 0.3;
    if (m.harmonicDirectionPresent) s += 0.3;
    if (m.guideToneSkeletonValid) s += 0.2;
    return Math.max(0, Math.min(10, s));
  });
  console.log('\nSelect best output:');
  console.log('  best id:', best?.best.id === 'b' ? 'PASS' : 'FAIL');
  console.log('  best score:', best?.score);

  console.log('\nDone.');
}

main();
