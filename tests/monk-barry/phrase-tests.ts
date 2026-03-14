/**
 * Phrase Architecture Tests
 * Verify: phrase lengths respected, cadence points exist
 */
import { buildPhraseArchitecture, validatePhraseStructure } from '../../creative-engines/engines/shared/phraseArchitecture';
import type { HarmonicTarget } from '../../engines/shared/HarmonicTarget';

function makeTarget(id: string, measure: number, root: number, quality: string, punctuation = false): HarmonicTarget {
  return {
    id,
    chord: { symbol: `${root}${quality}`, root, quality },
    beatPosition: 0,
    duration: 2,
    measure,
    punctuation,
  };
}

const sampleTargets: HarmonicTarget[] = [
  makeTarget('t1', 0, 0, 'maj7'),
  makeTarget('t2', 1, 2, 'm7'),
  makeTarget('t3', 2, 7, '7'),
  makeTarget('t4', 3, 0, 'maj7', true),
  makeTarget('t5', 4, 0, 'maj7'),
  makeTarget('t6', 5, 2, 'm7'),
  makeTarget('t7', 6, 7, '7'),
  makeTarget('t8', 7, 0, 'maj7', true),
];

console.log('Phrase Architecture Tests\n');

const ps4 = buildPhraseArchitecture({
  harmonicTargets: sampleTargets,
  phraseLengths: [4],
  requireCadencePressure: true,
});
console.log('4-bar phrase:', ps4 ? 'PASS' : 'FAIL');
if (ps4) {
  console.log('  phraseLength:', ps4.phraseLength, ps4.phraseLength === 4 ? 'PASS' : 'FAIL');
  console.log('  cadencePoints:', ps4.cadencePoints.length, ps4.cadencePoints.length > 0 ? 'PASS' : 'FAIL');
  console.log('  validatePhraseStructure:', validatePhraseStructure(ps4) ? 'PASS' : 'FAIL');
}

const psNoCadence = buildPhraseArchitecture({
  harmonicTargets: sampleTargets.filter(t => !t.punctuation),
  phraseLengths: [4],
  requireCadencePressure: true,
});
console.log('\nPhrase with cadence pressure injected:', psNoCadence?.cadencePoints.length ? 'PASS' : 'FAIL');

const emptyResult = buildPhraseArchitecture({ harmonicTargets: [] });
console.log('\nEmpty targets rejected:', emptyResult === null ? 'PASS' : 'FAIL');

console.log('\nDone.');
