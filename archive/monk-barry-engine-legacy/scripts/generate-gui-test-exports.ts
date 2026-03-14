/**
 * Generates gui-test-*.musicxml files using the same export path as the GUI.
 * These simulate GUI exports when the user chooses an output directory.
 * Run: npx tsx scripts/generate-gui-test-exports.ts
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

function generate(target: 'guitar' | 'piano' | 'big_band') {
  const global = { ...DEFAULT_GLOBAL, bars: 12, keyCenter: 'C' };
  const comp = generateDraft('barry_monk', target, DEFAULT_BARRY, DEFAULT_MONK, global);
  const xml = compositionToMusicXML(comp, `Monk Composer - ${target}`, {
    keyCenter: global.keyCenter,
    meter: global.meter,
    target,
  });
  const chordCount = (xml.match(/<chord\/>/g) ?? []).length;
  return { xml, chordCount };
}

const guitar = generate('guitar');
const piano = generate('piano');
const bigBand = generate('big_band');

writeFileSync(join(outputsDir, 'gui-test-guitar.musicxml'), guitar.xml, 'utf-8');
writeFileSync(join(outputsDir, 'gui-test-piano.musicxml'), piano.xml, 'utf-8');
writeFileSync(join(outputsDir, 'gui-test-bigband.musicxml'), bigBand.xml, 'utf-8');

console.log('GUI test exports (same path as GUI):');
console.log('  gui-test-guitar.musicxml  chord events:', guitar.chordCount);
console.log('  gui-test-piano.musicxml    chord events:', piano.chordCount);
console.log('  gui-test-bigband.musicxml  chord events:', bigBand.chordCount);

if (guitar.chordCount === 0 || piano.chordCount === 0 || bigBand.chordCount === 0) {
  console.error('FAIL: No chord events');
  process.exit(1);
}
console.log('PASS: All GUI test exports contain chord events');
