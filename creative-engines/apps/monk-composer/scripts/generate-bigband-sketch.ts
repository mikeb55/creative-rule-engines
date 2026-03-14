/**
 * Generate barry-bigband-sketch.musicxml and monk-bigband-sketch.musicxml.
 * Validates: 6 parts, piano 2 staves, bass present, counterline present,
 * ensemble simultaneity > 2, no single-line collapse.
 * Run: npx tsx scripts/generate-bigband-sketch.ts
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateDraft } from '../src/renderer/logic/generator';
import { compositionToMusicXML } from '../src/renderer/logic/musicxml';
import { validateExportedMusicXML } from '../src/renderer/logic/exportValidators';
import { validateBigBandIdiom } from '../src/renderer/logic/bigBandIdiomRules';
import { DEFAULT_BARRY, DEFAULT_MONK, DEFAULT_GLOBAL } from '../src/renderer/logic/presets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputsDir = join(__dirname, '..', 'outputs');

function ensembleSimultaneity(texture: { voice: number; notes: { offset?: number; rest?: boolean }[] }[]): number {
  const byOffset = new Map<number, number>();
  for (const p of texture) {
    for (const n of p.notes ?? []) {
      if (n.rest) continue;
      const o = Math.round((n.offset ?? 0) * 4) / 4;
      byOffset.set(o, (byOffset.get(o) ?? 0) + 1);
    }
  }
  return Math.max(0, ...byOffset.values());
}

function runGeneration(engine: 'barry' | 'monk') {
  const global = { ...DEFAULT_GLOBAL, bars: 8, keyCenter: 'C' };
  const comp = generateDraft(engine, 'big_band', DEFAULT_BARRY, DEFAULT_MONK, global);
  const xml = compositionToMusicXML(comp, `${engine}-bigband-sketch`, {
    keyCenter: global.keyCenter,
    meter: global.meter,
    target: 'big_band',
    musicXmlVersion: '3.0',
  });
  const exportResult = validateExportedMusicXML(xml, {
    target: 'big_band',
    expectedPartCount: 6,
    expectedPartNames: ['Trumpet', 'Alto Sax', 'Tenor Sax', 'Trombone', 'Piano', 'Bass'],
  });
  const idiomResult = comp.texture?.length === 6 ? validateBigBandIdiom(comp.texture) : { pass: false, reason: 'Not 6 parts' };
  const simultaneity = comp.texture ? ensembleSimultaneity(comp.texture) : 0;
  const partCount = (xml.match(/<part id="P\d+">/g) ?? []).length;
  const pianoHasStaves = xml.includes('<staves>2</staves>');
  const bassPresent = (comp.texture?.[5]?.notes?.filter(n => !n.rest).length ?? 0) > 0;
  const counterlinePresent = (comp.texture?.[2]?.notes?.filter(n => !n.rest).length ?? 0) >= 4;
  const activeParts = comp.texture?.filter(p => (p.notes?.filter(n => !n.rest).length ?? 0) > 0).length ?? 0;

  const outPath = join(outputsDir, `${engine}-bigband-sketch.musicxml`);
  mkdirSync(outputsDir, { recursive: true });
  writeFileSync(outPath, xml, 'utf-8');

  return {
    comp,
    xml,
    exportResult,
    idiomResult,
    partCount,
    pianoHasStaves,
    bassPresent,
    counterlinePresent,
    simultaneity,
    activeParts,
    outPath,
  };
}

function runWithRetry(engine: 'barry' | 'monk', maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    const r = runGeneration(engine);
    const ok =
      r.partCount === 6 &&
      r.pianoHasStaves &&
      r.bassPresent &&
      r.counterlinePresent &&
      r.simultaneity > 2 &&
      r.activeParts >= 2 &&
      r.idiomResult.pass &&
      r.exportResult.pass;
    if (ok) return r;
  }
  return runGeneration(engine);
}

console.log('=== Big Band Sketch Generation ===\n');

const barry = runWithRetry('barry');
console.log('barry-bigband-sketch:', {
  partCount: barry.partCount,
  pianoHasStaves: barry.pianoHasStaves,
  bassPresent: barry.bassPresent,
  counterlinePresent: barry.counterlinePresent,
  simultaneity: barry.simultaneity,
  activeParts: barry.activeParts,
  idiomPass: barry.idiomResult.pass,
  exportPass: barry.exportResult.pass,
});

const monk = runWithRetry('monk');
console.log('monk-bigband-sketch:', {
  partCount: monk.partCount,
  pianoHasStaves: monk.pianoHasStaves,
  bassPresent: monk.bassPresent,
  counterlinePresent: monk.counterlinePresent,
  simultaneity: monk.simultaneity,
  activeParts: monk.activeParts,
  idiomPass: monk.idiomResult.pass,
  exportPass: monk.exportResult.pass,
});

const barryOk =
  barry.partCount === 6 &&
  barry.pianoHasStaves &&
  barry.bassPresent &&
  barry.counterlinePresent &&
  barry.simultaneity > 2 &&
  barry.activeParts >= 2 &&
  barry.idiomResult.pass &&
  barry.exportResult.pass;

const monkOk =
  monk.partCount === 6 &&
  monk.pianoHasStaves &&
  monk.bassPresent &&
  monk.counterlinePresent &&
  monk.simultaneity > 2 &&
  monk.activeParts >= 2 &&
  monk.idiomResult.pass &&
  monk.exportResult.pass;

if (!barryOk || !monkOk) {
  console.error('\nFAIL: Big band validation failed');
  process.exit(1);
}
console.log('\nPASS: Both barry and monk big band sketches OK');
console.log('Outputs:', outputsDir);
