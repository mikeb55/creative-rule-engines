/**
 * Monk Counterline Rules — Short interruptions, repeated-note answers, angular fragments.
 *
 * Behavior:
 * - short interruptions
 * - repeated-note answers
 * - angular dyad-derived fragments
 * - oblique or punctuated responses
 * - displaced entries
 *
 * Allowed materials:
 * - shell-adjacent fragments
 * - repeated notes
 * - minor-second pressure notes
 * - abrupt rhythmic restarts
 *
 * Reject: counterline becomes smooth bebop continuity, line overfills texture,
 * interruption logic disappears.
 */
import type { CounterlineEngineOptions, CounterlineEvent, RelationshipToMainLine } from '../shared/counterlineEngine';

const CHORD_OFFSETS: Record<string, number[]> = {
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  '7': [0, 4, 7, 10],
};

function chordTones(rootPc: number, quality: string): number[] {
  const off = CHORD_OFFSETS[quality] ?? [0, 4, 7, 10];
  return off.map(o => (rootPc + o) % 12);
}

function pcToMidi(pc: number, octave: number): number {
  return octave * 12 + ((pc % 12) + 12) % 12;
}

export function applyMonkCounterlineRules(opts: CounterlineEngineOptions): CounterlineEvent[] {
  const { harmonicTargets, melodicEvents, phraseStructure, bars } = opts;
  const events: CounterlineEvent[] = [];
  const baseOctave = 3;

  if (melodicEvents.length < 2 || harmonicTargets.length === 0) return events;

  const maxCounterlineEvents = Math.max(2, Math.floor(melodicEvents.length * 0.35));
  let count = 0;
  let lastPitch: number | null = null;

  for (let i = 0; i < harmonicTargets.length && count < maxCounterlineEvents; i++) {
    const target = harmonicTargets[i];
    const rootPc = target.chord.root;
    const quality = target.chord.quality;
    const cts = chordTones(rootPc, quality);

    const useInterruption = phraseStructure.tensionCurve[target.measure] > 0.5 && Math.random() < 0.5;
    const useDisplaced = Math.random() < 0.4;
    if (!useInterruption && !useDisplaced && Math.random() > 0.45) continue;

    const useRepeated = lastPitch !== null && Math.random() < 0.35;
    const useMinorSecond = Math.random() < 0.25;

    let pitch: number;
    let relationship: RelationshipToMainLine;

    if (useRepeated && lastPitch !== null) {
      pitch = lastPitch;
      relationship = 'echo';
    } else if (useMinorSecond && lastPitch !== null) {
      pitch = lastPitch + (Math.random() < 0.5 ? 1 : -1);
      pitch = Math.max(36, Math.min(84, pitch));
      relationship = 'innerMotion';
    } else {
      const pc = cts[Math.floor(Math.random() * cts.length)];
      pitch = pcToMidi(pc, baseOctave);
      relationship = useDisplaced ? 'oblique' : 'answer';
    }

    lastPitch = pitch;

    const beatPosition = useDisplaced
      ? (target.beatPosition + 1.5) % 4
      : target.beatPosition + 0.5;

    events.push({
      pitch,
      duration: 0.25,
      articulation: 'staccato',
      relationshipToMainLine: relationship,
      harmonicRole: 'chordTone',
      bar: target.measure,
      beatPosition: Math.min(3.5, beatPosition),
      harmonicTargetIndex: i,
    });
    count++;
  }

  return events;
}
