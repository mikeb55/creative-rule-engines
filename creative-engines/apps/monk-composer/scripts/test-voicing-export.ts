/**
 * Test script: verify guitar and piano export contain chord events.
 * Run: npx tsx scripts/test-voicing-export.ts
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateDraft } from '../src/renderer/logic/generator';
import { compositionToMusicXML } from '../src/renderer/logic/musicxml';
import { DEFAULT_BARRY, DEFAULT_MONK, DEFAULT_GLOBAL } from '../src/renderer/logic/presets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputsDir = join(__dirname, '..', 'outputs');

function countSimultaneous(notes: { offset?: number; duration?: number }[]): number {
  const byKey = new Map<string, number>();
  const round = (x: number) => Math.round(x * 1000) / 1000;
  for (const n of notes) {
    const key = `${round(n.offset ?? 0)}_${round(n.duration ?? 0)}`;
    byKey.set(key, (byKey.get(key) ?? 0) + 1);
  }
  return Math.max(1, ...byKey.values());
}

function runTest(target: 'guitar' | 'piano' | 'big_band') {
  const global = { ...DEFAULT_GLOBAL, bars: 8, keyCenter: 'C' };
  const comp = generateDraft('barry_monk', target, DEFAULT_BARRY, DEFAULT_MONK, global);

  const textureNotes = comp.texture?.flatMap(t => t.notes) ?? [];
  const maxSimul = countSimultaneous(textureNotes);
  const chordCount = textureNotes.filter((n, i, arr) => {
    const round = (x: number) => Math.round(x * 1000) / 1000;
    const key = `${round(n.offset ?? 0)}_${round(n.duration ?? 0)}`;
    return arr.filter(m => `${round(m.offset ?? 0)}_${round(m.duration ?? 0)}` === key).length > 1;
  }).length;

  const xml = compositionToMusicXML(comp, `Monk Composer - ${target}`, {
    keyCenter: global.keyCenter,
    meter: global.meter,
    target,
  });

  const hasChordTag = xml.includes('<chord/>');
  const chordTagCount = (xml.match(/<chord\/>/g) ?? []).length;

  const outPath = join(outputsDir, `test-${target}.musicxml`);
  writeFileSync(outPath, xml, 'utf-8');

  return {
    target,
    totalNotes: textureNotes.length,
    maxSimultaneous: maxSimul,
    chordNoteCount: chordCount,
    hasChordTag,
    chordTagCount,
    outPath,
  };
}

console.log('=== Voicing Export Test ===\n');

const guitarResult = runTest('guitar');
const pianoResult = runTest('piano');
const bigBandResult = runTest('big_band');

console.log('Guitar:', JSON.stringify(guitarResult, null, 2));
console.log('\nPiano:', JSON.stringify(pianoResult, null, 2));
console.log('\nBig Band:', JSON.stringify(bigBandResult, null, 2));

const guitarOk = guitarResult.hasChordTag && guitarResult.chordTagCount > 0;
const pianoOk = pianoResult.hasChordTag && pianoResult.chordTagCount > 0;
const bigBandOk = bigBandResult.hasChordTag && bigBandResult.chordTagCount > 0;

if (!guitarOk || !pianoOk || !bigBandOk) {
  console.error('\nFAIL: No chord events in output');
  process.exit(1);
}
console.log('\nPASS: Guitar, piano, and big band all have chord events');
