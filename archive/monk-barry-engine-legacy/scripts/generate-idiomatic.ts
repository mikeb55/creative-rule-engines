/**
 * Generate idiomatic outputs for guitar, piano, big band.
 * Order: guitar Barry, guitar Monk, piano Barry, piano Monk, big band Barry, big band Monk.
 * Self-test and revise until GCE >= 9.0 and idiom tests pass.
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateDraft } from '../src/renderer/logic/generator';
import { compositionToMusicXML } from '../src/renderer/logic/musicxml';
import { evaluateGCE } from '../src/renderer/logic/gceEvaluator';
import { runRevisionLoop } from '../src/renderer/logic/revisionLoop';
import { runSelfTest } from '../src/renderer/logic/selfTest';
import { validateExportedMusicXML } from '../src/renderer/logic/exportValidators';
import { DEFAULT_BARRY, DEFAULT_MONK, DEFAULT_GLOBAL } from '../src/renderer/logic/presets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputsDir = join(__dirname, '..', 'outputs');

const global = { ...DEFAULT_GLOBAL, bars: 16, gceThreshold: 9.0 };

interface GenResult {
  target: string;
  engine: 'barry' | 'monk';
  path: string;
  gce: number;
  passed: boolean;
}

const results: GenResult[] = [];

function generateOne(
  target: 'guitar' | 'piano' | 'big_band',
  engine: 'barry' | 'monk',
  filename: string
): GenResult {
  let bestComp = generateDraft(engine, target, DEFAULT_BARRY, DEFAULT_MONK, global);
  let bestRev = runRevisionLoop(bestComp, target, 9.0, {
    target,
    barry: DEFAULT_BARRY,
    monk: DEFAULT_MONK,
    global,
    engine,
  });
  const attempts = engine === 'barry' ? 8 : 4;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const comp = generateDraft(engine, target, DEFAULT_BARRY, DEFAULT_MONK, global);
    const rev = runRevisionLoop(comp, target, 9.0, {
      target,
      barry: DEFAULT_BARRY,
      monk: DEFAULT_MONK,
      global,
      engine,
    });
    if (rev.scores.overall > bestRev.scores.overall) {
      bestRev = rev;
    }
  }
  const comp = bestRev.composition;
  const xml = compositionToMusicXML(comp, filename.replace('.musicxml', ''), {
    keyCenter: global.keyCenter,
    meter: global.meter,
    target,
  });
  const outPath = join(outputsDir, filename);
  writeFileSync(outPath, xml, 'utf-8');

  const exportVal = validateExportedMusicXML(xml, {
    target,
    expectedPartCount: target === 'big_band' ? 6 : target === 'piano' ? 1 : 1,
  });
  const report = runSelfTest(comp, target, bestRev.revisionCount, exportVal.pass);
  const passed = report.gce >= 9.0 && report.targetIdiomPass && report.exportVerified && !report.latestFailingTest;

  return {
    target,
    engine,
    path: outPath,
    gce: report.gce,
    passed,
  };
}

console.log('=== Stage 1: Guitar ===');
results.push(generateOne('guitar', 'barry', 'barry-guitar-idiomatic.musicxml'));
results.push(generateOne('guitar', 'monk', 'monk-guitar-idiomatic.musicxml'));

const guitarPassed = results.some(r => r.target === 'guitar' && r.passed);
console.log('Guitar Barry:', results[0].gce.toFixed(1), results[0].passed ? 'PASS' : 'FAIL');
console.log('Guitar Monk:', results[1].gce.toFixed(1), results[1].passed ? 'PASS' : 'FAIL');

console.log('\n=== Stage 2: Piano ===');
results.push(generateOne('piano', 'barry', 'barry-piano-idiomatic.musicxml'));
results.push(generateOne('piano', 'monk', 'monk-piano-idiomatic.musicxml'));

console.log('Piano Barry:', results[2].gce.toFixed(1), results[2].passed ? 'PASS' : 'FAIL');
console.log('Piano Monk:', results[3].gce.toFixed(1), results[3].passed ? 'PASS' : 'FAIL');

const pianoPassed = results.slice(2, 4).some(r => r.passed);

if (guitarPassed && pianoPassed) {
  console.log('\n=== Stage 3: Big Band ===');
  results.push(generateOne('big_band', 'barry', 'barry-bigband-idiomatic.musicxml'));
  results.push(generateOne('big_band', 'monk', 'monk-bigband-idiomatic.musicxml'));
  console.log('Big Band Barry:', results[4].gce.toFixed(1), results[4].passed ? 'PASS' : 'FAIL');
  console.log('Big Band Monk:', results[5].gce.toFixed(1), results[5].passed ? 'PASS' : 'FAIL');
} else {
  console.log('\nSkipping big band (guitar or piano did not pass)');
}

console.log('\n=== Final Report ===');
for (const r of results) {
  console.log(`${r.engine}-${r.target}: GCE ${r.gce.toFixed(1)} ${r.passed ? 'PASS' : 'FAIL'} -> ${r.path}`);
}
