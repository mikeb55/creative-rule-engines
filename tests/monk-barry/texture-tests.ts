/**
 * Texture State Engine Tests
 *
 * Verify:
 * - texture states vary across phrases
 * - silence occurs occasionally
 * - melody + harmony + counterline not constant
 */
import { buildTextureStateMap, hasTextureVariation, hasSilence, isTextureOvercrowded } from '../../creative-engines/engines/shared/textureStateEngine';
import { applyBarryTextureRules } from '../../creative-engines/engines/barry-harris-engine/barryTextureRules';
import { applyMonkTextureRules } from '../../creative-engines/engines/monk-engine/monkTextureRules';

const mockTargets = [
  { id: 'h1', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, beatPosition: 0, duration: 2, measure: 0 },
  { id: 'h2', chord: { symbol: 'G7', root: 7, quality: '7' }, beatPosition: 2, duration: 2, measure: 0 },
  { id: 'h3', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, beatPosition: 0, duration: 2, measure: 1, punctuation: true },
  { id: 'h4', chord: { symbol: 'Am7', root: 9, quality: 'm7' }, beatPosition: 2, duration: 2, measure: 1 },
  { id: 'h5', chord: { symbol: 'D7', root: 2, quality: '7' }, beatPosition: 0, duration: 2, measure: 2 },
  { id: 'h6', chord: { symbol: 'Gmaj7', root: 7, quality: 'maj7' }, beatPosition: 2, duration: 2, measure: 2, punctuation: true },
];

const mockPhraseStruct = {
  phraseLength: 8,
  harmonicTargets: mockTargets,
  cadencePoints: [4, 12],
  tensionCurve: [0.5, 0.6, 0.7, 0.8, 0.7, 0.6, 0.5, 0.9],
};

function main() {
  console.log('Texture State Engine Tests\n');

  const barryMap = buildTextureStateMap(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, engine: 'barry', bars: 8 },
    applyBarryTextureRules
  );

  console.log('Barry Harris:');
  console.log('  texture states vary:', hasTextureVariation(barryMap) ? 'PASS' : 'FAIL');
  console.log('  silence occurs:', hasSilence(barryMap) ? 'PASS' : 'INFO (Barry may not use silence)');
  console.log('  not overcrowded:', !isTextureOvercrowded(barryMap) ? 'PASS' : 'FAIL');
  const barryStates = [...barryMap.values()];
  const barryUnique = new Set(barryStates);
  console.log('  unique states:', barryUnique.size, [...barryUnique]);

  const monkMap = buildTextureStateMap(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, engine: 'monk', bars: 8 },
    applyMonkTextureRules
  );

  console.log('\nMonk:');
  console.log('  texture states vary:', hasTextureVariation(monkMap) ? 'PASS' : 'FAIL');
  console.log('  silence occurs:', hasSilence(monkMap) ? 'PASS' : 'FAIL');
  console.log('  not overcrowded:', !isTextureOvercrowded(monkMap) ? 'PASS' : 'FAIL');
  const monkStates = [...monkMap.values()];
  const monkUnique = new Set(monkStates);
  console.log('  unique states:', monkUnique.size, [...monkUnique]);

  console.log('\nDone.');
}

main();
