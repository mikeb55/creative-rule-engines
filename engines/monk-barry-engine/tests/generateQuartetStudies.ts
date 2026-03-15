/**
 * Generate string quartet studies — barry-string-quartet-study, monk-string-quartet-study.
 */
import { runPipeline } from '../pipeline';
import * as path from 'path';
import * as fs from 'fs';

const OUTPUT_DIR = path.resolve(__dirname, '../../../outputs');

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log('Monk/Barry Engine — Generate String Quartet Studies');
  console.log('Output directory:', OUTPUT_DIR);
  console.log('');

  const bars = 6;

  for (const engine of ['barry', 'monk', 'hill'] as const) {
    const result = runPipeline({
      engine,
      instrument: 'string_quartet',
      bars,
      outputDir: OUTPUT_DIR,
    });
    const status = result.valid ? 'OK' : 'VALIDATION FAILED';
    const filename = result.filename ?? `${engine}-string-quartet-study.musicxml`;
    console.log(`${engine} string quartet -> ${filename} (${status})`);
  }

  console.log('');
  console.log('Done. Check outputs/ for MusicXML files.');
}

main();
