/**
 * Generates barry-working-strings.musicxml
 * Run: npx tsx scripts/generate-barry-working-strings.ts
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateDraft } from '../src/renderer/logic/generator';
import { compositionToMusicXML } from '../src/renderer/logic/musicxml';
import { evaluateGCE } from '../src/renderer/logic/gceEvaluator';
import { runRevisionLoop } from '../src/renderer/logic/revisionLoop';
import { DEFAULT_BARRY, DEFAULT_MONK, DEFAULT_GLOBAL } from '../src/renderer/logic/presets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'outputs', 'barry-working-strings.musicxml');

const global = {
  ...DEFAULT_GLOBAL,
  bars: 24,
  quartetDensity: 'conversational' as const,
  gceThreshold: 8,
};
let comp = generateDraft('barry', 'string_quartet', DEFAULT_BARRY, DEFAULT_MONK, global);
const initialScores = evaluateGCE(comp, 'string_quartet');
comp = runRevisionLoop(comp, 'string_quartet', 8, {
  target: 'string_quartet',
  threshold: 8,
  barry: DEFAULT_BARRY,
  monk: DEFAULT_MONK,
  global,
}).composition;

const xml = compositionToMusicXML(comp, 'Barry Working Strings', {
  keyCenter: global.keyCenter,
  meter: global.meter,
  target: 'string_quartet',
});
writeFileSync(outputPath, xml, 'utf-8');

const diag = comp.quartetDiagnostics;
const vn1 = comp.texture?.[0]?.notes?.filter(n => !n.rest) ?? [];
const vn2 = comp.texture?.[1]?.notes?.filter(n => !n.rest) ?? [];
const viola = comp.texture?.[2]?.notes?.filter(n => !n.rest) ?? [];
const cello = comp.texture?.[3]?.notes?.filter(n => !n.rest) ?? [];
const finalScores = evaluateGCE(comp, 'string_quartet');

console.log('Generated:', outputPath);
console.log('Activity ratios: Vln1=' + vn1.length + ', Vln2=' + vn2.length + ', Viola=' + viola.length + ', Cello=' + cello.length);
console.log('Viola/Vln2 ratio:', (diag?.violaVln2Ratio ?? 0).toFixed(2));
console.log('Cello/Vln1 ratio:', (diag?.celloVln1Ratio ?? 0).toFixed(2));
console.log('Motif migrations:', diag?.motifMigrationCount ?? 0);
console.log('Counterpoint events:', diag?.counterpointEventCount ?? 0);
console.log('GCE (initial):', initialScores.scores.overall);
console.log('GCE (final):', finalScores.scores.overall);
