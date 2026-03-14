/**
 * Generate barry-guitar-idiomatic and monk-guitar-idiomatic.
 * Validates: voicing families, fret span, comp rhythm, voice-leading.
 * Run: npx tsx scripts/generate-idiomatic-guitar.ts
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateDraft } from '../src/renderer/logic/generator';
import { compositionToMusicXML } from '../src/renderer/logic/musicxml';
import { validateExportedMusicXML } from '../src/renderer/logic/exportValidators';
import { validateGuitarIdiomHard } from '../src/renderer/logic/idiomValidators';
import { DEFAULT_BARRY, DEFAULT_MONK, DEFAULT_GLOBAL } from '../src/renderer/logic/presets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputsDir = join(__dirname, '..', 'outputs');

function runGeneration(engine: 'barry' | 'monk', global: typeof DEFAULT_GLOBAL) {
  const comp = generateDraft(engine, 'guitar', DEFAULT_BARRY, DEFAULT_MONK, global);
  const xml = compositionToMusicXML(comp, `${engine}-guitar-idiomatic`, {
    keyCenter: global.keyCenter,
    meter: global.meter,
    target: 'guitar',
    musicXmlVersion: '3.0',
  });
  const exportResult = validateExportedMusicXML(xml, {
    target: 'guitar',
    expectedPartCount: 1,
    expectedPartNames: ['Guitar'],
  });
  const guitarValid = comp.texture ? validateGuitarIdiomHard(comp.texture) : null;

  const outPath = join(outputsDir, `${engine}-guitar-idiomatic.musicxml`);
  mkdirSync(outputsDir, { recursive: true });
  writeFileSync(outPath, xml, 'utf-8');

  return { comp, xml, exportResult, guitarValid, outPath };
}

const global = { ...DEFAULT_GLOBAL, bars: 8, keyCenter: 'C' };

function runWithRetry(engine: 'barry' | 'monk', maxRetries = 8) {
  for (let i = 0; i < maxRetries; i++) {
    const r = runGeneration(engine, global);
    if (r.guitarValid?.pass && r.exportResult.pass) return r;
  }
  return runGeneration(engine, global);
}

console.log('=== Barry/Monk Guitar Idiomatic Outputs ===\n');

const barry = runWithRetry('barry');
console.log('1. barry-guitar-idiomatic:', {
  families: barry.comp.guitarDiagnostics?.usedFamilyIds?.join(', '),
  compPattern: barry.comp.guitarDiagnostics?.compPattern,
  chordEventPct: barry.guitarValid?.chordEventPct?.toFixed(1) + '%',
  gripValidity: barry.guitarValid?.gripValidity,
  fretSpan: barry.guitarValid?.maxFretSpan,
  voiceLeadingDist: barry.guitarValid?.voiceLeadingDistance?.toFixed(1),
  exportPass: barry.exportResult.pass,
  idiomPass: barry.guitarValid?.pass ?? false,
});

const monk = runWithRetry('monk');
console.log('2. monk-guitar-idiomatic:', {
  families: monk.comp.guitarDiagnostics?.usedFamilyIds?.join(', '),
  compPattern: monk.comp.guitarDiagnostics?.compPattern,
  chordEventPct: monk.guitarValid?.chordEventPct?.toFixed(1) + '%',
  gripValidity: monk.guitarValid?.gripValidity,
  fretSpan: monk.guitarValid?.maxFretSpan,
  voiceLeadingDist: monk.guitarValid?.voiceLeadingDistance?.toFixed(1),
  exportPass: monk.exportResult.pass,
  idiomPass: monk.guitarValid?.pass ?? false,
});

const pass = (barry.guitarValid?.pass ?? false) && (monk.guitarValid?.pass ?? false) &&
  barry.exportResult.pass && monk.exportResult.pass;

if (!pass) {
  console.error('\nFAIL: Guitar did not pass validation.');
  process.exit(1);
}

console.log('\nPASS: Both idiomatic outputs generated.');
console.log('Outputs:', outputsDir);
