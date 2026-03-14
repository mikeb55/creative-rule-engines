/**
 * Guide-Tone Motion Tests
 */
import { buildGuideToneSkeleton, validateGuideToneSkeleton, hasGuideToneContinuity, hasDominantResolution, hasExcessiveLeaps } from '../../creative-engines/engines/shared/guideToneMotion';
import { applyBarryGuideToneRules } from '../../creative-engines/engines/barry-harris-engine/barryGuideToneRules';
import { applyMonkGuideToneRules } from '../../creative-engines/engines/monk-engine/monkGuideToneRules';

const mockPhraseStruct = {
  phraseLength: 8,
  harmonicTargets: [] as { id: string; chord: { symbol: string; root: number; quality: string }; measure: number; beatPosition: number; punctuation?: boolean }[],
  cadencePoints: [4, 8],
  tensionCurve: [0.5, 0.6, 0.7, 0.8, 0.7, 0.6, 0.5, 0.4],
};

const iiVI: typeof mockPhraseStruct.harmonicTargets = [
  { id: 'h1', chord: { symbol: 'Dm7', root: 2, quality: 'm7' }, measure: 0, beatPosition: 0 },
  { id: 'h2', chord: { symbol: 'G7', root: 7, quality: '7' }, measure: 0, beatPosition: 2 },
  { id: 'h3', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, measure: 1, beatPosition: 0, punctuation: true },
  { id: 'h4', chord: { symbol: 'Dm7', root: 2, quality: 'm7' }, measure: 2, beatPosition: 0 },
  { id: 'h5', chord: { symbol: 'G7', root: 7, quality: '7' }, measure: 2, beatPosition: 2 },
  { id: 'h6', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, measure: 3, beatPosition: 0, punctuation: true },
];

function main() {
  console.log('Guide-Tone Motion Tests\n');

  const phraseWithTargets = { ...mockPhraseStruct, harmonicTargets: iiVI };

  const barrySkeleton = buildGuideToneSkeleton(
    { phraseStructure: phraseWithTargets, harmonicTargets: iiVI, engine: 'barry', keyCenter: 0 },
    applyBarryGuideToneRules
  );
  console.log('Barry guide-tone pairs:', barrySkeleton.pairs.length);
  console.log('  pairs per harmonic event:', barrySkeleton.pairs.length >= iiVI.length ? 'PASS' : 'FAIL');
  console.log('  ii-V-I motion (has dom+tonic):', hasDominantResolution(barrySkeleton, iiVI) ? 'PASS' : 'FAIL');
  console.log('  continuity:', hasGuideToneContinuity(barrySkeleton) ? 'PASS' : 'FAIL');
  console.log('  no excessive leaps:', !hasExcessiveLeaps(barrySkeleton) ? 'PASS' : 'FAIL');
  console.log('  validateGuideToneSkeleton:', validateGuideToneSkeleton(barrySkeleton, iiVI) ? 'PASS' : 'FAIL');

  const monkSkeleton = buildGuideToneSkeleton(
    { phraseStructure: phraseWithTargets, harmonicTargets: iiVI, engine: 'monk', keyCenter: 0 },
    applyMonkGuideToneRules
  );
  console.log('Monk guide-tone pairs:', monkSkeleton.pairs.length);
  console.log('  phrase cadence targets:', monkSkeleton.phraseCadenceTargets.length >= 1 ? 'PASS' : 'FAIL');

  if (barrySkeleton.pairs.length > 0) {
    const p = barrySkeleton.pairs[0];
    console.log('  sample pair upperRole:', p.upperRole, 'lowerRole:', p.lowerRole);
  }

  console.log('\nDone.');
}

main();
