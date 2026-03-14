/**
 * Parse Beatrice MusicXML to extract big band template structure.
 * Run: npx tsx scripts/parse-beatrice-template.ts [path-to-beatrice.musicxml]
 *
 * Output: Template JSON for bigBandTemplate.ts (part order, names, abbreviations).
 */
import { readFileSync } from 'fs';
import { join } from 'path';

const defaultPath = join(
  process.env.USERPROFILE || process.env.HOME || '',
  'Documents',
  'Big Band Arranging course 2026',
  'session 6',
  'Beatrice w Bora Assistance',
  'V22 Beatrice - Bora Version - 13 March 2026.musicxml'
);

const path = process.argv[2] || defaultPath;

function extractPartList(xml: string): { id: string; name: string; abbreviation: string }[] {
  const parts: { id: string; name: string; abbreviation: string }[] = [];
  const partRegex = /<score-part id="(P\d+)">\s*[\s\S]*?<part-name>([^<]+)<\/part-name>[\s\S]*?(?:<part-abbreviation>([^<]*)<\/part-abbreviation>)?/g;
  let m;
  while ((m = partRegex.exec(xml)) !== null) {
    parts.push({
      id: m[1],
      name: m[2].trim(),
      abbreviation: (m[3] || m[2].split(/\s+/)[0] + '.').trim(),
    });
  }
  return parts;
}

try {
  const xml = readFileSync(path, 'utf-8');
  const parts = extractPartList(xml);
  console.log(JSON.stringify(parts, null, 2));
  console.error(`\nExtracted ${parts.length} parts from ${path}`);
} catch (err) {
  console.error('Error:', err instanceof Error ? err.message : err);
  process.exit(1);
}
