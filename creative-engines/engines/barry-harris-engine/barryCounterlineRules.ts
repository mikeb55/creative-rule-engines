/**
 * Barry Harris Counterline Rules — Guide-tone continuation, enclosure-derived answering.
 *
 * Behavior:
 * - use guide-tone continuation
 * - use enclosure-derived answering figures
 * - connect ii–V–I movement with short secondary lines
 * - favor contrary motion against the main line
 * - reinforce dominant-to-tonic pull
 *
 * Allowed materials:
 * - 3rd–7th fragments
 * - bebop enclosure fragments
 * - short passing diminished motion
 * - chord-tone answers
 *
 * Reject: counterline weakens tonal gravity, line becomes rhythmically busier than melody,
 * dominant resolution obscured.
 */
import type { CounterlineEngineOptions, CounterlineEvent, RelationshipToMainLine } from '../shared/counterlineEngine';

const CHORD_TONE_OFFSETS: Record<string, number[]> = {
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  '7': [0, 4, 7, 10],
  '6': [0, 4, 7, 9],
};

function chordTones(rootPc: number, quality: string): number[] {
  const offsets = CHORD_TONE_OFFSETS[quality] ?? CHORD_TONE_OFFSETS['7'];
  return offsets.map(o => (rootPc + o) % 12);
}

function guideTones(rootPc: number, quality: string): number[] {
  const offsets = quality.includes('m') ? [3, 7] : [4, 11];
  return offsets.map(o => (rootPc + o) % 12);
}

function pcToMidi(pc: number, octave: number): number {
  return octave * 12 + ((pc % 12) + 12) % 12;
}

export function applyBarryCounterlineRules(opts: CounterlineEngineOptions): CounterlineEvent[] {
  const { harmonicTargets, guideToneSkeleton, melodicEvents, phraseStructure, bars } = opts;
  const events: CounterlineEvent[] = [];
  const baseOctave = 3;

  if (melodicEvents.length < 2 || harmonicTargets.length === 0) return events;

  const cadenceBars = new Set(
    phraseStructure.cadencePoints.map(cp => Math.floor(cp / 4))
  );
  const tensionPeaks = phraseStructure.tensionCurve
    .map((t, i) => (t > 0.6 ? i : -1))
    .filter(i => i >= 0);

  const maxCounterlineEvents = Math.max(2, Math.floor(melodicEvents.length * 0.4));
  let count = 0;

  for (let i = 0; i < harmonicTargets.length && count < maxCounterlineEvents; i++) {
    const target = harmonicTargets[i];
    const rootPc = target.chord.root;
    const quality = target.chord.quality;
    const cts = chordTones(rootPc, quality);
    const gts = guideTones(rootPc, quality);

    const pair = guideToneSkeleton?.pairs.find(p => p.harmonicTargetIndex === i);
    const mainAtTarget = melodicEvents.filter(
      m => (m.harmonicTargetIndex ?? 0) === i
    );

    const enterAtCadence = cadenceBars.has(target.measure) && Math.random() < 0.6;
    const enterAtTension = tensionPeaks.includes(target.measure) && Math.random() < 0.5;
    if (!enterAtCadence && !enterAtTension && Math.random() > 0.35) continue;

    const useContrary = pair && mainAtTarget.length > 0 && Math.random() < 0.7;
    let pitch: number;
    let relationship: RelationshipToMainLine;
    let harmonicRole: CounterlineEvent['harmonicRole'];

    if (pair && useContrary) {
      const mainPitch = mainAtTarget[0]?.pitch ?? 60;
      const upper = pair.upperVoicePitch;
      const lower = pair.lowerVoicePitch;
      const useLower = mainPitch >= 60;
      pitch = useLower ? lower : upper;
      relationship = 'contrary';
      harmonicRole = 'guideTone';
    } else if (pair && Math.random() < 0.5) {
      const pc = gts[Math.floor(Math.random() * gts.length)];
      pitch = pcToMidi(pc, baseOctave);
      relationship = 'answer';
      harmonicRole = 'guideTone';
    } else {
      const pc = cts[Math.floor(Math.random() * cts.length)];
      pitch = pcToMidi(pc, baseOctave);
      relationship = 'oblique';
      harmonicRole = 'chordTone';
    }

    const beatOffset = 0.5 + Math.floor(Math.random() * 2) * 0.5;
    const beatPosition = Math.min(3.5, target.beatPosition + beatOffset);

    events.push({
      pitch,
      duration: 0.5,
      articulation: 'legato',
      relationshipToMainLine: relationship,
      harmonicRole,
      bar: target.measure,
      beatPosition,
      harmonicTargetIndex: i,
    });
    count++;
  }

  return events;
}
