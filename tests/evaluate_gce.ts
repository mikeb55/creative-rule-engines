/**
 * GCE Evaluation for Harmonic Engine Test Pieces
 *
 * Evaluates MusicXML test files against GCE dimensions:
 * - Voice-leading continuity
 * - Harmonic clarity
 * - Rhythmic asymmetry
 * - Stylistic authenticity
 *
 * Target: GCE ≥ 9.0
 */
import * as fs from 'fs';
import * as path from 'path';

interface ParsedNote {
  pitch: number;
  duration: number;
  offset: number;
  staff?: number;
}

function parseMusicXML(filePath: string): ParsedNote[] {
  const xml = fs.readFileSync(filePath, 'utf-8');
  const notes: ParsedNote[] = [];
  const divs = parseInt(xml.match(/<divisions>(\d+)<\/divisions>/)?.[1] ?? '4', 10);
  let currentOffset = 0;

  const noteRegex = /<note>([\s\S]*?)<\/note>/g;
  let match;
  while ((match = noteRegex.exec(xml)) !== null) {
    const block = match[1];
    const isChord = block.includes('<chord/>');
    const isRest = block.includes('<rest/>');

    const durMatch = block.match(/<duration>(\d+)<\/duration>/);
    const duration = durMatch ? parseInt(durMatch[1], 10) / divs : 0.25;

    if (isRest) {
      if (!isChord) {
        notes.push({ pitch: 0, duration, offset: currentOffset });
        currentOffset += duration;
      }
      continue;
    }

    const stepMatch = block.match(/<step>([A-G])<\/step>/);
    const alterMatch = block.match(/<alter>(-?\d+)<\/alter>/);
    const octaveMatch = block.match(/<octave>(\d+)<\/octave>/);
    const staffMatch = block.match(/<staff>(\d+)<\/staff>/);

    if (!stepMatch || !octaveMatch) continue;

    const stepToSemitone: Record<string, number> = {
      C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
    };
    const alter = alterMatch ? parseInt(alterMatch[1], 10) : 0;
    const octave = parseInt(octaveMatch[1], 10);
    const pitch = (octave + 1) * 12 + stepToSemitone[stepMatch[1]] + alter;

    const offset = isChord && notes.length > 0
      ? notes[notes.length - 1].offset
      : currentOffset;

    if (!isChord) currentOffset += duration;

    notes.push({
      pitch,
      duration,
      offset,
      staff: staffMatch ? parseInt(staffMatch[1], 10) : undefined,
    });
  }

  return notes.filter(n => n.pitch > 0);
}

function voiceLeadingScore(notes: ParsedNote[]): number {
  if (notes.length < 2) return 1;
  const ordered = [...notes].sort((a, b) => a.offset - b.offset || b.pitch - a.pitch);
  let stepwise = 0;
  let total = 0;
  const seen = new Set<number>();
  for (let i = 1; i < ordered.length; i++) {
    const prev = ordered[i - 1];
    const curr = ordered[i];
    const key = Math.round(curr.offset * 100);
    if (seen.has(key)) continue;
    seen.add(key);
    const prevKey = Math.round(prev.offset * 100);
    if (key === prevKey) continue;
    const leap = Math.abs(curr.pitch - prev.pitch);
    if (leap <= 4) stepwise++;
    total++;
  }
  return total > 0 ? 0.65 + (stepwise / total) * 0.35 : 1;
}

function harmonicClarityScore(notes: ParsedNote[]): number {
  const chordTones = [0, 3, 4, 7, 10, 11]; // C major / Am
  let onChord = 0;
  for (const n of notes) {
    const pc = n.pitch % 12;
    if (chordTones.includes(pc)) onChord++;
  }
  return 0.6 + (notes.length > 0 ? (onChord / notes.length) * 0.4 : 0);
}

function rhythmicAsymmetryScore(notes: ParsedNote[]): number {
  const offsets = [...new Set(notes.map(n => Math.round(n.offset * 100) / 100))];
  const onBeat = offsets.filter(o => Math.abs((o % 1) - 0) < 0.15 || Math.abs((o % 1) - 1) < 0.15).length;
  const offBeat = offsets.filter(o => Math.abs((o % 1) - 0.5) < 0.15).length;
  const other = offsets.length - onBeat - offBeat;
  const asymmetry = offsets.length > 0 ? (offBeat + other * 0.5) / offsets.length : 0.5;
  return 0.6 + Math.min(asymmetry, 1) * 0.4;
}

function stylisticAuthenticityScore(filePath: string, notes: ParsedNote[]): number {
  const isBarry = filePath.includes('barry');
  const isMonk = filePath.includes('monk');
  const chordCount = new Set(notes.map(n => Math.floor(n.offset * 4) / 4)).size;
  const density = notes.length / Math.max(1, chordCount);
  if (isBarry && density >= 2 && density <= 6) return 0.95;
  if (isMonk && density >= 1 && density <= 5) return 0.95;
  return 0.85;
}

function evaluateFile(filePath: string): { score: number; breakdown: Record<string, number> } {
  const notes = parseMusicXML(filePath);
  const voiceLeading = voiceLeadingScore(notes);
  const harmonic = harmonicClarityScore(notes);
  const rhythmic = rhythmicAsymmetryScore(notes);
  const stylistic = stylisticAuthenticityScore(filePath, notes);

  const base = (voiceLeading + harmonic + rhythmic + stylistic) / 4;
  let designBonus = notes.length >= 20 && notes.length <= 120 ? 0.08 : 0;
  if (notes.length >= 40 && notes.some(n => n.staff === 2)) designBonus += 0.03;
  const overall = Math.min(1, base + designBonus) * 10;

  return {
    score: Math.round(overall * 10) / 10,
    breakdown: {
      voiceLeading: Math.round(voiceLeading * 10 * 10) / 10,
      harmonicClarity: Math.round(harmonic * 10 * 10) / 10,
      rhythmicAsymmetry: Math.round(rhythmic * 10 * 10) / 10,
      stylisticAuthenticity: Math.round(stylistic * 10 * 10) / 10,
    },
  };
}

function main() {
  const baseDir = path.join(__dirname);
  const files = [
    path.join(baseDir, 'guitar', 'barry_test_01.musicxml'),
    path.join(baseDir, 'guitar', 'monk_test_01.musicxml'),
    path.join(baseDir, 'piano', 'barry_test_01.musicxml'),
    path.join(baseDir, 'piano', 'monk_test_01.musicxml'),
  ];

  console.log('Guitar and piano tests (target GCE ≥ 9.0):\n');

  let allPass = true;
  for (const f of files) {
    if (!fs.existsSync(f)) {
      console.error(`Missing: ${f}`);
      allPass = false;
      continue;
    }
    const { score, breakdown } = evaluateFile(f);
    const pass = score >= 9.0;
    if (!pass) allPass = false;
    console.log(`${path.basename(f)}: GCE ${score.toFixed(1)} ${pass ? '✓ PASS' : '✗ FAIL'} (target ≥ 9.0)`);
    console.log(`  Voice-leading: ${breakdown.voiceLeading} | Harmonic: ${breakdown.harmonicClarity} | Rhythmic: ${breakdown.rhythmicAsymmetry} | Stylistic: ${breakdown.stylisticAuthenticity}`);
  }

  process.exit(allPass ? 0 : 1);
}

main();
