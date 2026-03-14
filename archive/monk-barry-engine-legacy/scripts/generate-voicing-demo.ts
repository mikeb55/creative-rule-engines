/**
 * Generates verified guitar and piano exports with chord events.
 * Writes to outputs/ and copies to Documents/Monk Composer Exports.
 * Run: npm run generate-voicing-demo
 */
import { writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateDraft } from '../src/renderer/logic/generator';
import { compositionToMusicXML } from '../src/renderer/logic/musicxml';
import { DEFAULT_BARRY, DEFAULT_MONK, DEFAULT_GLOBAL } from '../src/renderer/logic/presets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputsDir = join(__dirname, '..', 'outputs');
const exportsDir = join(process.env.USERPROFILE || '', 'Documents', 'Monk Composer Exports');

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

if (!existsSync(outputsDir)) mkdirSync(outputsDir, { recursive: true });
if (!existsSync(exportsDir)) mkdirSync(exportsDir, { recursive: true });

const guitar = generate('guitar');
const piano = generate('piano');
const bigBand = generate('big_band');

const guitarPath = join(outputsDir, 'monk-guitar-chords.musicxml');
const pianoPath = join(outputsDir, 'monk-piano-chords.musicxml');
const bigBandPath = join(outputsDir, 'monk-bigband-chords.musicxml');

writeFileSync(guitarPath, guitar.xml, 'utf-8');
writeFileSync(pianoPath, piano.xml, 'utf-8');
writeFileSync(bigBandPath, bigBand.xml, 'utf-8');

copyFileSync(guitarPath, join(exportsDir, 'monk-guitar-chords.musicxml'));
copyFileSync(pianoPath, join(exportsDir, 'monk-piano-chords.musicxml'));
copyFileSync(bigBandPath, join(exportsDir, 'monk-bigband-chords.musicxml'));

console.log('Generated:', guitarPath);
console.log('Generated:', pianoPath);
console.log('Generated:', bigBandPath);
console.log('Copied to:', exportsDir);
console.log('Guitar chord events:', guitar.chordCount);
console.log('Piano chord events:', piano.chordCount);
console.log('Big Band chord events:', bigBand.chordCount);

if (guitar.chordCount === 0 || piano.chordCount === 0 || bigBand.chordCount === 0) {
  console.error('FAIL: No chord events');
  process.exit(1);
}
console.log('PASS: All three targets contain chord events');
