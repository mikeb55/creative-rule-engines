/**
 * Rhythm Grammar Tests
 */
import { buildRhythmicEventGrid, hasRhythmicDiversity, hasSyncopation } from '../../creative-engines/engines/shared/rhythmGrammar';
import { applyBarryRhythmRules } from '../../creative-engines/engines/barry-harris-engine/barryRhythmRules';
import { applyMonkRhythmRules } from '../../creative-engines/engines/monk-engine/monkRhythmRules';

const mockPhraseStruct = {
  phraseLength: 8,
  harmonicTargets: [
    { id: 'h1', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, beatPosition: 0, duration: 2, measure: 0 },
    { id: 'h2', chord: { symbol: 'Dm7', root: 2, quality: 'm7' }, beatPosition: 2, duration: 2, measure: 0 },
    { id: 'h3', chord: { symbol: 'G7', root: 7, quality: '7' }, beatPosition: 0, duration: 2, measure: 1 },
    { id: 'h4', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, beatPosition: 2, duration: 2, measure: 1, punctuation: true },
    { id: 'h5', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, beatPosition: 0, duration: 2, measure: 2 },
    { id: 'h6', chord: { symbol: 'G7', root: 7, quality: '7' }, beatPosition: 2, duration: 2, measure: 2 },
  ],
  cadencePoints: [6],
  tensionCurve: [0.5, 0.6, 0.7, 0.8, 0.7, 0.6, 0.5, 0.4],
};

function main() {
  console.log('Rhythm Grammar Tests\n');

  const barryGrid = buildRhythmicEventGrid(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockPhraseStruct.harmonicTargets, engine: 'barry', bars: 8 },
    applyBarryRhythmRules
  );
  const barryDiverse = hasRhythmicDiversity(barryGrid);
  const barrySyncopated = hasSyncopation(barryGrid);
  console.log('Barry rhythm grid:', barryGrid.events.length, 'events');
  console.log('  hasRhythmicDiversity:', barryDiverse ? 'PASS' : 'FAIL');
  console.log('  hasSyncopation:', barrySyncopated ? 'PASS' : 'FAIL');

  const monkGrid = buildRhythmicEventGrid(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockPhraseStruct.harmonicTargets, engine: 'monk', bars: 8 },
    applyMonkRhythmRules
  );
  const monkDiverse = hasRhythmicDiversity(monkGrid);
  const monkSyncopated = hasSyncopation(monkGrid);
  console.log('Monk rhythm grid:', monkGrid.events.length, 'events');
  console.log('  hasRhythmicDiversity:', monkDiverse ? 'PASS' : 'FAIL');
  console.log('  hasSyncopation:', monkSyncopated ? 'PASS' : 'FAIL');

  const eventTypes = new Set(barryGrid.events.map(e => e.eventType));
  console.log('  Barry event types:', [...eventTypes].join(', '));

  console.log('\nDone.');
}

main();
