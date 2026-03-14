/**
 * Generate and validate barry-guitar, monk-guitar, barry-piano, monk-piano.
 * Order: guitar first, then piano. Only proceed if guitar passes.
 * Run: npx tsx scripts/generate-fixed-outputs.ts
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateDraft } from '../src/renderer/logic/generator';
import { compositionToMusicXML } from '../src/renderer/logic/musicxml';
import { validateExportedMusicXML } from '../src/renderer/logic/exportValidators';
import { runSelfTest } from '../src/renderer/logic/selfTest';
import { validateGuitarIdiomHard, validatePianoIdiomHard } from '../src/renderer/logic/idiomValidators';
import { averageSimultaneity, maxSimultaneity } from '../src/renderer/logic/musicEvents';
import { DEFAULT_BARRY, DEFAULT_MONK, DEFAULT_GLOBAL } from '../src/renderer/logic/presets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputsDir = join(__dirname, '..', 'outputs');

function chordEventPct(texture: { voice: number; notes: { offset?: number; pitch?: number; rest?: boolean }[] }[]): number {
  const all = texture.flatMap(t => (t.notes ?? []).filter(n => !n.rest && (n.pitch ?? 0) > 0));
  const byOffset = new Map<number, number>();
  for (const n of all) {
    const o = Math.round((n.offset ?? 0) * 4) / 4;
    byOffset.set(o, (byOffset.get(o) ?? 0) + 1);
  }
  const chordCount = [...byOffset.values()].filter(c => c >= 2).length;
  const total = byOffset.size;
  return total > 0 ? (chordCount / total) * 100 : 0;
}

function runGeneration(
  engine: 'barry' | 'monk',
  target: 'guitar' | 'piano',
  global: typeof DEFAULT_GLOBAL
) {
  const comp = generateDraft(engine, target, DEFAULT_BARRY, DEFAULT_MONK, global);
  const xml = compositionToMusicXML(comp, `${engine}-${target}-fixed`, {
    keyCenter: global.keyCenter,
    meter: global.meter,
    target,
    musicXmlVersion: '3.0',
  });
  const exportResult = validateExportedMusicXML(xml, {
    target,
    expectedPartCount: target === 'piano' ? 1 : 1,
    expectedPartNames: target === 'piano' ? ['Piano'] : ['Guitar'],
  });
  const selfTest = runSelfTest(comp, target, 0, exportResult.pass);

  const chordPct = chordEventPct(comp.texture ?? []);
  const avgSim = comp.texture ? averageSimultaneity(comp.texture) : 0;
  const maxSim = comp.texture ? maxSimultaneity(comp.texture) : 0;

  let lhRatio = 0;
  let rhRatio = 0;
  if (target === 'piano' && comp.texture?.length === 2) {
    const rh = (comp.texture[0]?.notes ?? []).filter(n => !n.rest);
    const lh = (comp.texture[1]?.notes ?? []).filter(n => !n.rest);
    const rhBeats = new Set(rh.map(n => Math.round((n.offset ?? 0) * 4) / 4)).size;
    const lhBeats = new Set(lh.map(n => Math.round((n.offset ?? 0) * 4) / 4)).size;
    const total = rhBeats + lhBeats;
    rhRatio = total > 0 ? rhBeats / total : 0;
    lhRatio = total > 0 ? lhBeats / total : 0;
  }

  const guitarValid = target === 'guitar' && comp.texture ? validateGuitarIdiomHard(comp.texture) : null;
  const pianoValid = target === 'piano' && comp.texture?.length === 2 ? validatePianoIdiomHard(comp.texture) : null;

  const outPath = join(outputsDir, `${engine}-${target}-fixed.musicxml`);
  mkdirSync(outputsDir, { recursive: true });
  writeFileSync(outPath, xml, 'utf-8');

  return {
    comp,
    xml,
    exportResult,
    selfTest,
    chordPct,
    avgSim,
    maxSim,
    lhRatio,
    rhRatio,
    guitarValid,
    pianoValid,
    outPath,
  };
}

const global = { ...DEFAULT_GLOBAL, bars: 8, keyCenter: 'C' };

function runWithRetry(engine: 'barry' | 'monk', target: 'guitar' | 'piano', maxRetries = 8) {
  for (let i = 0; i < maxRetries; i++) {
    const r = runGeneration(engine, target, global);
    const valid = target === 'guitar' ? r.guitarValid?.pass : r.pianoValid?.pass;
    if (valid && r.exportResult.pass) return r;
  }
  return runGeneration(engine, target, global);
}

console.log('=== Barry/Monk Guitar & Piano Fixed Outputs ===\n');

const barryGuitar = runWithRetry('barry', 'guitar');
console.log('1. barry-guitar-fixed:', {
  chordEventPct: barryGuitar.chordPct.toFixed(1) + '%',
  gripValidity: barryGuitar.guitarValid?.gripValidity,
  exportPass: barryGuitar.exportResult.pass,
  idiomPass: barryGuitar.guitarValid?.pass ?? false,
  idiomReason: barryGuitar.guitarValid?.reason,
  gce: barryGuitar.selfTest.gce,
  selfTestPass: barryGuitar.selfTest.passed,
});

const monkGuitar = runWithRetry('monk', 'guitar');
console.log('2. monk-guitar-fixed:', {
  chordEventPct: monkGuitar.chordPct.toFixed(1) + '%',
  gripValidity: monkGuitar.guitarValid?.gripValidity,
  exportPass: monkGuitar.exportResult.pass,
  idiomPass: monkGuitar.guitarValid?.pass ?? false,
  idiomReason: monkGuitar.guitarValid?.reason,
  gce: monkGuitar.selfTest.gce,
  selfTestPass: monkGuitar.selfTest.passed,
});

const guitarPass = (barryGuitar.guitarValid?.pass ?? false) && (monkGuitar.guitarValid?.pass ?? false) &&
  barryGuitar.exportResult.pass && monkGuitar.exportResult.pass;

if (!guitarPass) {
  console.error('\nFAIL: Guitar did not pass. Not proceeding to piano.');
  process.exit(1);
}

console.log('\nGuitar passed. Proceeding to piano.\n');

const barryPiano = runWithRetry('barry', 'piano');
console.log('3. barry-piano-fixed:', {
  chordEventPct: barryPiano.chordPct.toFixed(1) + '%',
  avgSimultaneity: barryPiano.avgSim.toFixed(2),
  maxSimultaneity: barryPiano.maxSim,
  lhRatio: barryPiano.lhRatio.toFixed(2),
  rhRatio: barryPiano.rhRatio.toFixed(2),
  exportPass: barryPiano.exportResult.pass,
  idiomPass: barryPiano.pianoValid?.pass ?? false,
  gce: barryPiano.selfTest.gce,
  selfTestPass: barryPiano.selfTest.passed,
});

const monkPiano = runWithRetry('monk', 'piano');
console.log('4. monk-piano-fixed:', {
  chordEventPct: monkPiano.chordPct.toFixed(1) + '%',
  avgSimultaneity: monkPiano.avgSim.toFixed(2),
  maxSimultaneity: monkPiano.maxSim,
  lhRatio: monkPiano.lhRatio.toFixed(2),
  rhRatio: monkPiano.rhRatio.toFixed(2),
  exportPass: monkPiano.exportResult.pass,
  idiomPass: monkPiano.pianoValid?.pass ?? false,
  gce: monkPiano.selfTest.gce,
  selfTestPass: monkPiano.selfTest.passed,
});

const pianoPass = (barryPiano.pianoValid?.pass ?? false) && (monkPiano.pianoValid?.pass ?? false) &&
  barryPiano.exportResult.pass && monkPiano.exportResult.pass;

if (!pianoPass) {
  console.error('\nFAIL: Piano did not pass.');
  process.exit(1);
}

console.log('\nPASS: Guitar and piano both passed.');
console.log('Outputs:', outputsDir);
