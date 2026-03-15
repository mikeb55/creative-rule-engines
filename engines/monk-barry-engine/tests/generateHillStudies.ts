/**
 * Generate Andrew Hill studies — guitar, piano, string quartet.
 * Uses voicing optimization and revision loop for guitar/piano.
 */
import { runPipeline, runPipelineWithRevision } from '../pipeline';
import * as path from 'path';
import * as fs from 'fs';

const OUTPUT_DIR = path.resolve(__dirname, '../../../outputs');

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log('Andrew Hill Engine — Generate Studies');
  console.log('Output directory:', OUTPUT_DIR);
  console.log('');

  const bars = 8;

  for (const instrument of ['guitar', 'piano', 'string_quartet'] as const) {
    const useRevision = instrument !== 'string_quartet';
    const result = useRevision
      ? runPipelineWithRevision({ engine: 'hill', instrument, bars, outputDir: OUTPUT_DIR })
      : runPipeline({ engine: 'hill', instrument, bars, outputDir: OUTPUT_DIR });
    const status = result.valid ? 'OK' : 'VALIDATION FAILED';
    const filename = result.filename ?? `hill-${instrument}-study.musicxml`;
    console.log(`hill ${instrument} -> ${filename} (${status})`);
  }

  console.log('');
  console.log('Done. Check outputs/ for MusicXML files.');
}

main();
