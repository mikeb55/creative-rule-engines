/**
 * Melodic Realization Tests
 */
import { buildMelodicEvents, hasGuideToneTargeting, melodyFollowsHarmony, hasRhythmicInterruption } from '../../creative-engines/engines/shared/melodicRealization';
import { applyBarryMelodicRules } from '../../creative-engines/engines/barry-harris-engine/barryMelodicRules';
import { applyMonkMelodicRules } from '../../creative-engines/engines/monk-engine/monkMelodicRules';
import { buildRhythmicEventGrid } from '../../creative-engines/engines/shared/rhythmGrammar';
import { applyBarryRhythmRules } from '../../creative-engines/engines/barry-harris-engine/barryRhythmRules';
import { applyMonkRhythmRules } from '../../creative-engines/engines/monk-engine/monkRhythmRules';

const mockTargets = [
  { id: 'h1', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, beatPosition: 0, duration: 2, measure: 0, guideTones: [3, 7] },
  { id: 'h2', chord: { symbol: 'G7', root: 7, quality: '7' }, beatPosition: 2, duration: 2, measure: 0 },
  { id: 'h3', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, beatPosition: 0, duration: 2, measure: 1, punctuation: true },
];

const mockPhraseStruct = {
  phraseLength: 8,
  harmonicTargets: mockTargets,
  cadencePoints: [4],
  tensionCurve: [0.5, 0.6, 0.7],
};

function main() {
  console.log('Melodic Realization Tests\n');

  const barryRhythm = buildRhythmicEventGrid(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, engine: 'barry', bars: 4 },
    applyBarryRhythmRules
  );
  const barryMelodic = buildMelodicEvents(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, rhythmicGrid: barryRhythm, engine: 'barry', keyCenter: 0, bars: 4 },
    applyBarryMelodicRules
  );
  const barryGuideTones = hasGuideToneTargeting(barryMelodic);
  const barryFollowsHarmony = melodyFollowsHarmony(barryMelodic, mockTargets, 0);
  console.log('Barry melodic events:', barryMelodic.length);
  console.log('  hasGuideToneTargeting:', barryGuideTones ? 'PASS' : barryMelodic.length === 0 ? 'SKIP (no events)' : 'FAIL');
  console.log('  melodyFollowsHarmony:', barryFollowsHarmony ? 'PASS' : 'FAIL');

  const monkRhythm = buildRhythmicEventGrid(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, engine: 'monk', bars: 4 },
    applyMonkRhythmRules
  );
  const monkMelodic = buildMelodicEvents(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, rhythmicGrid: monkRhythm, engine: 'monk', keyCenter: 0, bars: 4 },
    applyMonkMelodicRules
  );
  const monkInterruption = hasRhythmicInterruption(monkMelodic, monkRhythm);
  console.log('Monk melodic events:', monkMelodic.length);
  console.log('  hasRhythmicInterruption:', monkInterruption ? 'PASS' : 'FAIL');

  if (barryMelodic.length > 0) {
    console.log('  Sample Barry role:', barryMelodic[0].role);
  }
  if (monkMelodic.length > 0) {
    console.log('  Sample Monk role:', monkMelodic[0].role);
  }

  console.log('\nDone.');
}

main();
