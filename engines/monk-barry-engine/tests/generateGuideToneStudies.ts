/**
 * Generate guide-tone study MusicXML files
 */
import { runPipeline } from '../pipeline';
import * as path from 'path';
import * as fs from 'fs';

const OUTPUT_DIR = path.resolve(__dirname, '../../../outputs');

const TARGETS: Array<{ engine: 'barry' | 'monk'; instrument: 'guitar' | 'piano' }> = [
  { engine: 'barry', instrument: 'guitar' },
  { engine: 'barry', instrument: 'piano' },
  { engine: 'monk', instrument: 'guitar' },
  { engine: 'monk', instrument: 'piano' },
];

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const t of TARGETS) {
    const r = runPipeline({
      engine: t.engine,
      instrument: t.instrument,
      bars: 8,
      outputDir: OUTPUT_DIR,
    });
    const name = `${t.engine}-${t.instrument}-guidetone.musicxml`;
    const outPath = path.join(OUTPUT_DIR, name);
    if (r.xml) {
      fs.writeFileSync(outPath, r.xml, 'utf-8');
      console.log(`${name} -> ${r.valid ? 'OK' : 'generated'}`);
    } else {
      console.log(`${name} -> FAIL`);
    }
  }
}

main();
