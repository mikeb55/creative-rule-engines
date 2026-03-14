/**
 * Monk Melodic Rules — Angular leaps, motivic fragments.
 *
 * Behavior:
 * - angular interval leaps
 * - repeated note cells
 * - short motivic fragments
 * - abrupt phrase restarts
 * - strong rhythmic punctuation
 *
 * Reject: line becomes smooth bebop scale motion, phrase symmetry predictable
 */
import type { MelodicRealizationOptions } from '../shared/melodicRealization';
import type { MelodicEvent, MelodicRole } from '../shared/melodicRealization';

const ANGULAR_LEAPS = [4, 5, 7, 8, 10, 12];
const FRAGMENT_LENGTHS = [0.25, 0.5, 0.5];

function chordTones(rootPc: number, quality: string): number[] {
  const offsets: Record<string, number[]> = {
    maj7: [0, 4, 7, 11],
    m7: [0, 3, 7, 10],
    '7': [0, 4, 7, 10],
  };
  const off = offsets[quality] ?? [0, 4, 7, 10];
  return off.map(o => (rootPc + o) % 12);
}

export function applyMonkMelodicRules(opts: MelodicRealizationOptions): MelodicEvent[] {
  const { harmonicTargets, rhythmicGrid, guideToneSkeleton } = opts;
  const events: MelodicEvent[] = [];
  const baseOctave = 4;
  let lastPitch = baseOctave * 12 + (harmonicTargets[0]?.chord.root ?? 0);

  for (const ev of rhythmicGrid.events) {
    if (ev.eventType === 'rest') continue;
    const targetIdx = ev.harmonicTargetIndex ?? 0;
    const target = harmonicTargets[targetIdx];
    if (!target) continue;

    const pair = guideToneSkeleton?.pairs.find(p => p.harmonicTargetIndex === targetIdx);
    if (pair && Math.random() < 0.4) {
      const pitch = Math.random() < 0.5 ? pair.upperVoicePitch : pair.lowerVoicePitch;
      events.push({
        pitch,
        measure: ev.measure,
        beatPosition: ev.beatPosition,
        duration: ev.duration,
        articulation: 'staccato',
        role: 'chordTone',
        harmonicTargetIndex: targetIdx,
      });
      lastPitch = pitch;
      continue;
    }

    const cts = chordTones(target.chord.root, target.chord.quality);
    const useLeap = Math.random() < 0.5;
    const pc = cts[Math.floor(Math.random() * cts.length)];
    let pitch = baseOctave * 12 + pc;

    if (useLeap && events.length > 0) {
      const leap = ANGULAR_LEAPS[Math.floor(Math.random() * ANGULAR_LEAPS.length)];
      const sign = Math.random() < 0.5 ? 1 : -1;
      pitch = lastPitch + sign * leap;
      pitch = Math.max(36, Math.min(84, pitch));
    }
    lastPitch = pitch;

    const role: MelodicRole = useLeap ? 'chordTone' : 'chordTone';
    const dur = FRAGMENT_LENGTHS[events.length % 3] ?? 0.5;

    events.push({
      pitch,
      measure: ev.measure,
      beatPosition: ev.beatPosition,
      duration: dur,
      articulation: 'staccato',
      role,
      harmonicTargetIndex: targetIdx,
    });
  }

  if (events.length === 0 && harmonicTargets.length > 0) {
    const t = harmonicTargets[0];
    const cts = chordTones(t.chord.root, t.chord.quality);
    events.push({
      pitch: baseOctave * 12 + cts[0],
      measure: 0,
      beatPosition: 0,
      duration: 0.5,
      articulation: 'staccato',
      role: 'chordTone',
      harmonicTargetIndex: 0,
    });
  }

  return events;
}
