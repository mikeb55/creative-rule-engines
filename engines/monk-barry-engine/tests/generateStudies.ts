/**
 * Engine Test Harness — Generate 8-bar and 16-bar studies.
 * Targets: Barry guitar, Monk guitar, Barry piano, Monk piano.
 */
import { runPipeline } from '../pipeline';
import * as path from 'path';

const OUTPUT_DIR = path.resolve(__dirname, '../../../outputs');

const TARGETS: Array<{ engine: 'barry' | 'monk'; instrument: 'guitar' | 'piano'; bars: number }> = [
  { engine: 'barry', instrument: 'guitar', bars: 8 },
  { engine: 'barry', instrument: 'guitar', bars: 16 },
  { engine: 'monk', instrument: 'guitar', bars: 8 },
  { engine: 'monk', instrument: 'guitar', bars: 16 },
  { engine: 'barry', instrument: 'piano', bars: 8 },
  { engine: 'barry', instrument: 'piano', bars: 16 },
  { engine: 'monk', instrument: 'piano', bars: 8 },
  { engine: 'monk', instrument: 'piano', bars: 16 },
];

function main() {
  console.log('Monk/Barry Engine — Generate Studies');
  console.log('Output directory:', OUTPUT_DIR);
  console.log('');

  for (const t of TARGETS) {
    const result = runPipeline({
      engine: t.engine,
      instrument: t.instrument,
      bars: t.bars,
      outputDir: OUTPUT_DIR,
    });
    const status = result.valid ? 'OK' : 'VALIDATION FAILED';
    console.log(`${t.engine} ${t.instrument} ${t.bars}bar -> ${status}`);
  }

  console.log('');
  console.log('Done. Check outputs/ for MusicXML files.');
}

main();
