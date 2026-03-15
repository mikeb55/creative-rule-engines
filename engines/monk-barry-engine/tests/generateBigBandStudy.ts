/**
 * Generate Big Band study.
 */
import { runPipeline } from '../pipeline';
import * as path from 'path';
import * as fs from 'fs';

const OUTPUT_DIR = path.resolve(__dirname, '../../../outputs');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const result = runPipeline({
  engine: 'barry',
  instrument: 'big_band',
  bars: 8,
  outputDir: OUTPUT_DIR,
});
console.log('Big Band:', result.valid ? 'OK' : 'FAIL', result.filename);
