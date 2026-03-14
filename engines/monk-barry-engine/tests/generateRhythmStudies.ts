/**
 * Generate rhythm-named test studies
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
    const rhythmName = `${t.engine}-${t.instrument}-rhythm.musicxml`;
    const rhythmPath = path.join(OUTPUT_DIR, rhythmName);
    if (r.xml) {
      fs.writeFileSync(rhythmPath, r.xml, 'utf-8');
      console.log(`${rhythmName} -> ${r.valid ? 'OK' : 'generated (validation issues)'}`);
    } else {
      console.log(`${rhythmName} -> FAIL`);
    }
  }
}

main();
