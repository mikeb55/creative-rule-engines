/**
 * Generates lets-see.musicxml
 * Run: npx tsx scripts/generate-lets-see.ts
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateDraft } from '../src/renderer/logic/generator';
import { compositionToMusicXML } from '../src/renderer/logic/musicxml';
import { evaluateGCE } from '../src/renderer/logic/gceEvaluator';
import { runRevisionLoop } from '../src/renderer/logic/revisionLoop';
import { computeQuartetMetrics } from '../src/renderer/logic/quartetMetrics';
import { DEFAULT_BARRY, DEFAULT_MONK, DEFAULT_GLOBAL } from '../src/renderer/logic/presets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'outputs', 'lets-see.musicxml');

const global = {
  ...DEFAULT_GLOBAL,
  bars: 24,
  quartetDensity: 'conversational' as const,
  gceThreshold: 8,
};
let comp = generateDraft('barry_monk', 'string_quartet', DEFAULT_BARRY, DEFAULT_MONK, global);
comp = runRevisionLoop(comp, 'string_quartet', 8, {
  target: 'string_quartet',
  threshold: 8,
  barry: DEFAULT_BARRY,
  monk: DEFAULT_MONK,
  global,
}).composition;

const xml = compositionToMusicXML(comp, 'Lets See', {
  keyCenter: global.keyCenter,
  meter: global.meter,
  target: 'string_quartet',
});
writeFileSync(outputPath, xml, 'utf-8');

const vn1 = comp.texture?.[0]?.notes ?? [];
const vn2 = comp.texture?.[1]?.notes ?? [];
const viola = comp.texture?.[2]?.notes ?? [];
const cello = comp.texture?.[3]?.notes ?? [];
const bars = comp.phrases?.[0]?.bars ?? 24;
const metrics = computeQuartetMetrics(vn1, vn2, viola, cello, bars, comp.quartetDiagnostics);
const scores = evaluateGCE(comp, 'string_quartet');

console.log('Generated:', outputPath);
console.log('Active duration:', metrics.vn1.activeDuration.toFixed(1), metrics.vn2.activeDuration.toFixed(1), metrics.viola.activeDuration.toFixed(1), metrics.cello.activeDuration.toFixed(1));
console.log('Attack density:', metrics.vn1.attackDensity.toFixed(2), metrics.vn2.attackDensity.toFixed(2), metrics.viola.attackDensity.toFixed(2), metrics.cello.attackDensity.toFixed(2));
console.log('Rest ratio:', (metrics.vn1.restRatio * 100).toFixed(1) + '%', (metrics.vn2.restRatio * 100).toFixed(1) + '%', (metrics.viola.restRatio * 100).toFixed(1) + '%', (metrics.cello.restRatio * 100).toFixed(1) + '%');
console.log('Motif participation:', metrics.vn1.motifParticipation, metrics.vn2.motifParticipation, metrics.viola.motifParticipation, metrics.cello.motifParticipation);
console.log('Simultaneous-motion ratio:', (metrics.simultaneousMotionRatio * 100).toFixed(1) + '%');
console.log('GCE:', scores.scores.overall);
