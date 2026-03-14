/**
 * Generate optimized studies — barry-guitar-optimized, barry-piano-optimized, monk-guitar-optimized, monk-piano-optimized.
 * Uses voicing optimization and revision loop.
 */
import { runPipelineWithRevision } from '../pipeline';
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
  console.log('Monk/Barry Engine — Generate Optimized Studies');
  console.log('Output directory:', OUTPUT_DIR);
  console.log('');

  for (const t of TARGETS) {
    const result = runPipelineWithRevision({
      engine: t.engine,
      instrument: t.instrument,
      bars: 8,
      outputDir: OUTPUT_DIR,
    });
    const status = result.valid ? 'OK' : 'VALIDATION FAILED';
    const filename = result.filename ?? `${t.engine}-${t.instrument}-optimized.musicxml`;
    console.log(`${t.engine} ${t.instrument} -> ${filename} (${status})`);
  }

  console.log('');
  console.log('Done. Check outputs/ for MusicXML files.');
}

main();
