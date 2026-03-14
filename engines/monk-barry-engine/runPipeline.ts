/**
 * CLI entry for pipeline — called by desktop app or scripts.
 */
import { runPipeline } from './pipeline';
import * as path from 'path';
import * as fs from 'fs';

const args = process.argv.slice(2);
const engine = (args[0] ?? 'barry') as 'barry' | 'monk';
const instrument = (args[1] ?? 'piano') as 'guitar' | 'piano';
const bars = parseInt(args[2] ?? '8', 10);
const outputDir = args[3] ?? path.join(process.cwd(), 'outputs');

const result = runPipeline({ engine, instrument, bars, outputDir });
const outFile = path.join(outputDir, `${engine}_${instrument}_${bars}bar.musicxml`);
console.log(JSON.stringify({ success: result.valid, path: outFile }));
