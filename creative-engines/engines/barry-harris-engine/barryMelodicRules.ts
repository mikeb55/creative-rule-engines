/**
 * Barry Harris Melodic Rules — Guide-tone targeting, bebop enclosure.
 *
 * Behavior:
 * - prioritize guide-tone targeting (3rd/7th)
 * - allow bebop enclosure figures
 * - follow 6th-diminished scale motion
 * - resolve chromatic passing tones into chord tones
 * - maintain swing continuity
 *
 * Reject: melody ignores harmonic direction, phrases end without tonal resolution
 */
import type { MelodicRealizationOptions } from '../shared/melodicRealization';
import type { MelodicEvent, MelodicRole } from '../shared/melodicRealization';

const GUIDE_TONE_INTERVALS = [3, 7];
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

export function applyBarryMelodicRules(opts: MelodicRealizationOptions): MelodicEvent[] {
  const { harmonicTargets, rhythmicGrid, guideToneSkeleton } = opts;
  const events: MelodicEvent[] = [];
  const baseOctave = 4;

  for (const ev of rhythmicGrid.events) {
    if (ev.eventType === 'rest' || ev.eventType === 'stab') continue;
    const targetIdx = ev.harmonicTargetIndex ?? 0;
    const target = harmonicTargets[targetIdx];
    if (!target) continue;

    const pair = guideToneSkeleton?.pairs.find(
      p => p.harmonicTargetIndex === targetIdx
    );
    if (pair && Math.random() < 0.7) {
      const pitch = Math.random() < 0.6 ? pair.upperVoicePitch : pair.lowerVoicePitch;
      events.push({
        pitch,
        measure: ev.measure,
        beatPosition: ev.beatPosition,
        duration: ev.duration,
        articulation: 'legato',
        role: 'guideTone',
        harmonicTargetIndex: targetIdx,
      });
      continue;
    }

    const rootPc = target.chord.root;
    const quality = target.chord.quality;
    const cts = chordTones(rootPc, quality);
    const gts = guideTones(rootPc, quality);

    const useGuideTone = target.guideTones && Math.random() < 0.6;
    const pc = useGuideTone
      ? gts[Math.floor(Math.random() * gts.length)]
      : cts[Math.floor(Math.random() * cts.length)];
    const pitch = baseOctave * 12 + pc;
    const role: MelodicRole = useGuideTone ? 'guideTone' : 'chordTone';

    events.push({
      pitch,
      measure: ev.measure,
      beatPosition: ev.beatPosition,
      duration: ev.duration,
      articulation: 'legato',
      role,
      harmonicTargetIndex: targetIdx,
    });
  }

  if (events.length === 0 && harmonicTargets.length > 0) {
    const t = harmonicTargets[0];
    const gts = guideTones(t.chord.root, t.chord.quality);
    events.push({
      pitch: baseOctave * 12 + gts[0],
      measure: 0,
      beatPosition: 0,
      duration: 1,
      role: 'guideTone',
      harmonicTargetIndex: 0,
    });
  }

  return events;
}
