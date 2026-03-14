/**
 * Barry Harris Motion Grammar Tests
 * Verify: Barry motion families used, random chord chains rejected
 */
import { applyBarryMotionGrammar, hasDirectionalMotion, rejectRandomChordChains } from '../../creative-engines/engines/barry-harris-engine/barryMotionGrammar';
import type { HarmonicTarget } from '../../engines/shared/HarmonicTarget';

function makeTarget(id: string, measure: number, root: number, quality: string): HarmonicTarget {
  return {
    id,
    chord: { symbol: `${root}${quality}`, root, quality },
    beatPosition: 0,
    duration: 2,
    measure,
  };
}

const iiVITargets: HarmonicTarget[] = [
  makeTarget('1', 0, 2, 'm7'),
  makeTarget('2', 1, 7, '7'),
  makeTarget('3', 2, 0, 'maj7'),
];

console.log('Barry Motion Grammar Tests\n');

const refined = applyBarryMotionGrammar({
  keyCenter: 0,
  targets: iiVITargets,
  motionFamily: 'tonic_ii_V',
});
console.log('applyBarryMotionGrammar returns targets:', refined.length > 0 ? 'PASS' : 'FAIL');

const directional = hasDirectionalMotion(iiVITargets);
console.log('hasDirectionalMotion (ii-V-I):', directional ? 'PASS' : 'FAIL');

const randomChain: HarmonicTarget[] = [
  makeTarget('a', 0, 0, 'maj7'),
  makeTarget('b', 1, 0, 'maj7'),
  makeTarget('c', 2, 0, 'maj7'),
];
const rejectsRandom = rejectRandomChordChains(randomChain);
console.log('rejectRandomChordChains (static roots):', rejectsRandom ? 'PASS' : 'FAIL');

const motionTargets = applyBarryMotionGrammar({
  keyCenter: 0,
  targets: iiVITargets,
  motionFamily: 'dominant_tonic',
});
console.log('dominant_tonic family applied:', motionTargets.length === 3 ? 'PASS' : 'FAIL');

console.log('\nDone.');
