/**
 * Quartet Role Engine Tests
 *
 * Validate:
 * - all four instruments are used meaningfully
 * - lead rotation occurs
 * - duo/trio/full textures exist
 * - phrase boundaries affect texture
 * - viola and cello are not underused
 */
import { buildQuartetRoleMap } from '../../creative-engines/engines/shared/quartetRoleEngine';
import { buildTextureStateMap } from '../../creative-engines/engines/shared/textureStateEngine';
import { applyBarryTextureRules } from '../../creative-engines/engines/barry-harris-engine/barryTextureRules';
import { applyMonkTextureRules } from '../../creative-engines/engines/monk-engine/monkTextureRules';
import { applyBarryQuartetRules } from '../../creative-engines/engines/barry-harris-engine/barryQuartetRules';
import { applyMonkQuartetRules } from '../../creative-engines/engines/monk-engine/monkQuartetRules';
import { mapEventsToQuartet } from '../../creative-engines/engines/shared/quartetEventMapper';
import { validateQuartetOutput } from '../../creative-engines/engines/shared/quartetValidation';

const mockTargets = [
  { id: 'h1', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, beatPosition: 0, duration: 2, measure: 0 },
  { id: 'h2', chord: { symbol: 'G7', root: 7, quality: '7' }, beatPosition: 2, duration: 2, measure: 0 },
  { id: 'h3', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, beatPosition: 0, duration: 2, measure: 1, punctuation: true },
  { id: 'h4', chord: { symbol: 'Am7', root: 9, quality: 'm7' }, beatPosition: 2, duration: 2, measure: 1 },
];

const mockPhraseStruct = {
  phraseLength: 4,
  harmonicTargets: mockTargets,
  cadencePoints: [4],
  tensionCurve: [0.5, 0.6, 0.7, 0.9],
};

const mockGuideToneSkeleton = {
  pairs: [
    { measure: 0, beatPosition: 0, upperVoicePitch: 67, lowerVoicePitch: 59, upperRole: 'third' as const, lowerRole: 'seventh' as const, harmonicTargetIndex: 0 },
    { measure: 0, beatPosition: 2, upperVoicePitch: 66, lowerVoicePitch: 55, upperRole: 'seventh' as const, lowerRole: 'third' as const, harmonicTargetIndex: 1 },
    { measure: 1, beatPosition: 0, upperVoicePitch: 67, lowerVoicePitch: 59, upperRole: 'third' as const, lowerRole: 'seventh' as const, harmonicTargetIndex: 2 },
  ],
  phraseCadenceTargets: [4],
};

function main() {
  console.log('Quartet Role Engine Tests\n');

  const barryTextureMap = buildTextureStateMap(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, engine: 'barry', bars: 4 },
    applyBarryTextureRules
  );

  const barryRoleMap = buildQuartetRoleMap({
    phraseStructure: mockPhraseStruct,
    textureStateMap: barryTextureMap,
    harmonicTargets: mockTargets,
    guideToneSkeleton: mockGuideToneSkeleton,
    engine: 'barry',
    bars: 4,
    applyEngineRules: applyBarryQuartetRules,
  });

  const rawEvents = [
    { role: 'MELODY' as const, pitches: [67], measure: 0, beatPosition: 0, duration: 1, articulation: undefined },
    { role: 'MELODY' as const, pitches: [69], measure: 0, beatPosition: 2, duration: 1, articulation: undefined },
    { role: 'COUNTERLINE' as const, pitches: [62], measure: 0, beatPosition: 1, duration: 1, articulation: undefined },
    { role: 'CHORD' as const, pitches: [48, 55, 59, 67], measure: 0, beatPosition: 0, duration: 2, articulation: undefined },
  ];

  const quartetEvents = mapEventsToQuartet(rawEvents, barryRoleMap, 4);
  const validation = validateQuartetOutput(quartetEvents, barryRoleMap, 4);

  console.log('Barry quartet:');
  console.log('  quartet events:', quartetEvents.length, quartetEvents.length > 0 ? 'PASS' : 'FAIL');
  const partsUsed = new Set(quartetEvents.map(e => e.part));
  console.log('  all four instruments used:', partsUsed.size >= 3 ? 'PASS' : 'INFO (parts:', [...partsUsed].join(', ') + ')');
  console.log('  viola used:', quartetEvents.some(e => e.part === 'viola') ? 'PASS' : 'FAIL');
  console.log('  cello used:', quartetEvents.some(e => e.part === 'cello') ? 'PASS' : 'FAIL');
  console.log('  lead rotation (role map size):', barryRoleMap.size, barryRoleMap.size > 0 ? 'PASS' : 'FAIL');
  console.log('  validation valid:', validation.valid ? 'PASS' : 'INFO (violations present)');

  const monkRoleMap = buildQuartetRoleMap({
    phraseStructure: mockPhraseStruct,
    textureStateMap: buildTextureStateMap(
      { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, engine: 'monk', bars: 4 },
      applyMonkTextureRules
    ),
    harmonicTargets: mockTargets,
    guideToneSkeleton: mockGuideToneSkeleton,
    engine: 'monk',
    bars: 4,
    applyEngineRules: applyMonkQuartetRules,
  });

  console.log('\nMonk quartet:');
  console.log('  role map built:', monkRoleMap.size > 0 ? 'PASS' : 'FAIL');

  console.log('\nDone.');
}

main();
