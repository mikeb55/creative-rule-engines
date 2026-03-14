/**
 * Generates monk_quartet_demo.musicxml
 * Run: npx tsx scripts/generate-quartet-demo.ts
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateDraft } from '../src/renderer/logic/generator';
import { compositionToMusicXML } from '../src/renderer/logic/musicxml';
import { DEFAULT_BARRY, DEFAULT_MONK, DEFAULT_GLOBAL } from '../src/renderer/logic/presets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'outputs', 'monk_quartet_demo.musicxml');

const global = {
  ...DEFAULT_GLOBAL,
  bars: 24,
  quartetDensity: 'conversational' as const,
};
const comp = generateDraft('barry_monk', 'string_quartet', DEFAULT_BARRY, DEFAULT_MONK, global);
const xml = compositionToMusicXML(comp, 'Monk Composer - String Quartet Demo', {
  keyCenter: global.keyCenter,
  meter: global.meter,
  target: 'string_quartet',
});
writeFileSync(outputPath, xml, 'utf-8');
console.log('Generated:', outputPath);
