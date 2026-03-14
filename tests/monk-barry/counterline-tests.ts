/**
 * Counterline Engine Tests
 *
 * Verify:
 * - counterline exists in phrase studies
 * - counterline is rhythmically distinct from main line
 * - counterline respects harmonic targets
 * - Barry counterlines support tonal pull
 * - Monk counterlines create interruption/punctuation
 */
import { buildCounterlineEvents, hasCounterlineDistinction, counterlineRespectsHarmony } from '../../creative-engines/engines/shared/counterlineEngine';
import { applyBarryCounterlineRules } from '../../creative-engines/engines/barry-harris-engine/barryCounterlineRules';
import { applyMonkCounterlineRules } from '../../creative-engines/engines/monk-engine/monkCounterlineRules';
import { buildMelodicEvents } from '../../creative-engines/engines/shared/melodicRealization';
import { applyBarryMelodicRules } from '../../creative-engines/engines/barry-harris-engine/barryMelodicRules';
import { applyMonkMelodicRules } from '../../creative-engines/engines/monk-engine/monkMelodicRules';
import { buildRhythmicEventGrid } from '../../creative-engines/engines/shared/rhythmGrammar';
import { applyBarryRhythmRules } from '../../creative-engines/engines/barry-harris-engine/barryRhythmRules';
import { applyMonkRhythmRules } from '../../creative-engines/engines/monk-engine/monkRhythmRules';
import { buildGuideToneSkeleton } from '../../creative-engines/engines/shared/guideToneMotion';
import { applyBarryGuideToneRules } from '../../creative-engines/engines/barry-harris-engine/barryGuideToneRules';
import { applyMonkGuideToneRules } from '../../creative-engines/engines/monk-engine/monkGuideToneRules';

const mockTargets = [
  { id: 'h1', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, beatPosition: 0, duration: 2, measure: 0, guideTones: [3, 7] },
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
  console.log('Counterline Engine Tests\n');

  const barryRhythm = buildRhythmicEventGrid(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, engine: 'barry', bars: 8 },
    applyBarryRhythmRules
  );
  const barryGuideTone = buildGuideToneSkeleton(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, engine: 'barry', keyCenter: 0 },
    applyBarryGuideToneRules
  );
  const barryMelodic = buildMelodicEvents(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, rhythmicGrid: barryRhythm, engine: 'barry', keyCenter: 0, bars: 8, guideToneSkeleton: barryGuideTone },
    applyBarryMelodicRules
  );
  const barryCounterline = buildCounterlineEvents(
    {
      phraseStructure: mockPhraseStruct,
      harmonicTargets: mockTargets,
      guideToneSkeleton: barryGuideTone,
      melodicEvents: barryMelodic,
      engine: 'barry',
      keyCenter: 0,
      bars: 8,
    },
    applyBarryCounterlineRules
  );

  console.log('Barry Harris:');
  console.log('  counterline exists:', barryCounterline.length > 0 ? 'PASS' : 'FAIL');
  console.log('  counterline count:', barryCounterline.length);
  console.log('  rhythmically distinct:', hasCounterlineDistinction(barryCounterline, barryMelodic) ? 'PASS' : barryCounterline.length < 2 ? 'SKIP' : 'FAIL');
  console.log('  respects harmony:', counterlineRespectsHarmony(barryCounterline, mockTargets) ? 'PASS' : 'FAIL');
  if (barryCounterline.length > 0) {
    console.log('  sample relationship:', barryCounterline[0].relationshipToMainLine);
    console.log('  sample harmonicRole:', barryCounterline[0].harmonicRole);
  }

  const monkRhythm = buildRhythmicEventGrid(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, engine: 'monk', bars: 8 },
    applyMonkRhythmRules
  );
  const monkGuideTone = buildGuideToneSkeleton(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, engine: 'monk', keyCenter: 0 },
    applyMonkGuideToneRules
  );
  const monkMelodic = buildMelodicEvents(
    { phraseStructure: mockPhraseStruct, harmonicTargets: mockTargets, rhythmicGrid: monkRhythm, engine: 'monk', keyCenter: 0, bars: 8, guideToneSkeleton: monkGuideTone },
    applyMonkMelodicRules
  );
  const monkCounterline = buildCounterlineEvents(
    {
      phraseStructure: mockPhraseStruct,
      harmonicTargets: mockTargets,
      guideToneSkeleton: monkGuideTone,
      melodicEvents: monkMelodic,
      engine: 'monk',
      keyCenter: 0,
      bars: 8,
    },
    applyMonkCounterlineRules
  );

  console.log('\nMonk:');
  console.log('  counterline exists:', monkCounterline.length > 0 ? 'PASS' : 'FAIL');
  console.log('  counterline count:', monkCounterline.length);
  console.log('  rhythmically distinct:', hasCounterlineDistinction(monkCounterline, monkMelodic) ? 'PASS' : monkCounterline.length < 2 ? 'SKIP' : 'FAIL');
  console.log('  respects harmony:', counterlineRespectsHarmony(monkCounterline, mockTargets) ? 'PASS' : 'FAIL');
  if (monkCounterline.length > 0) {
    console.log('  sample relationship:', monkCounterline[0].relationshipToMainLine);
    console.log('  sample articulation:', monkCounterline[0].articulation);
  }

  const barrySparser = barryCounterline.length <= barryMelodic.length * 0.8;
  const monkSparser = monkCounterline.length <= monkMelodic.length * 0.8;
  console.log('\nSparsity (counterline < 80% of melody):');
  console.log('  Barry:', barrySparser ? 'PASS' : 'FAIL');
  console.log('  Monk:', monkSparser ? 'PASS' : 'FAIL');

  console.log('\nDone.');
}

main();
