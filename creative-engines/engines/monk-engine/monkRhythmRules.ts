/**
 * Monk Rhythmic Rules — Sparse punctuation, displaced attacks.
 *
 * Patterns:
 * - sparse stabs
 * - displaced attacks
 * - silence as structural element
 * - abrupt rhythmic interruptions
 * - clustered accents before cadence
 *
 * Rules:
 * - allow asymmetry
 * - allow rests between chord hits
 * - encourage sudden rhythmic restarts
 * - forbid constant comping density
 */
import type { RhythmGrammarOptions } from '../shared/rhythmGrammar';
import type { RhythmicEvent } from '../shared/rhythmGrammar';

const DISPLACED_BEATS: number[] = [0.5, 1.5, 2.5, 3.5, 1, 2, 3];
const SPARSE_STABS: number[] = [0.5, 2, 3.5];

export function applyMonkRhythmRules(opts: RhythmGrammarOptions): RhythmicEvent[] {
  const { phraseStructure, harmonicTargets, bars } = opts;
  const events: RhythmicEvent[] = [];
  const cadenceMeasures = new Set(
    phraseStructure.cadencePoints.map(cp => Math.floor(cp / 4))
  );

  for (let m = 0; m < Math.min(bars, phraseStructure.phraseLength); m++) {
    const targetsInBar = harmonicTargets.filter(t => t.measure === m);
    const isCadenceBar = cadenceMeasures.has(m);
    const isRestBar = (m + 1) % 4 === 0 && targetsInBar.length === 0;

    if (targetsInBar.length === 0) {
      events.push({ measure: m, beatPosition: 0, duration: 4, eventType: 'rest' });
      continue;
    }

    for (let i = 0; i < targetsInBar.length; i++) {
      const t = targetsInBar[i];
      const idx = harmonicTargets.indexOf(t);

      const pattern = selectMonkPattern(m, i, targetsInBar.length, isCadenceBar);
      for (const { beat, dur, type } of pattern) {
        events.push({
          measure: m,
          beatPosition: beat,
          duration: dur,
          eventType: type as RhythmicEvent['eventType'],
          harmonicTargetIndex: idx,
        });
      }
    }
  }

  return events;
}

type PatternSlot = { beat: number; dur: number; type: string };

function selectMonkPattern(
  measure: number,
  targetIndex: number,
  targetsInBar: number,
  isCadenceBar: boolean
): PatternSlot[] {
  if (isCadenceBar && targetsInBar >= 2) {
    return [
      { beat: 2.5, dur: 0.25, type: 'stab' },
      { beat: 3, dur: 0.5, type: 'chord' },
    ];
  }
  if (measure % 3 === 0) {
    return [{ beat: DISPLACED_BEATS[measure % DISPLACED_BEATS.length], dur: 0.5, type: 'stab' }];
  }

  const patterns: PatternSlot[][] = [
    [{ beat: 0.5, dur: 0.25, type: 'stab' }],
    [{ beat: 2, dur: 0.5, type: 'stab' }],
    [{ beat: 3.5, dur: 0.25, type: 'stab' }],
    [{ beat: 1.5, dur: 0.5, type: 'chord' }],
    [{ beat: 0, dur: 1, type: 'chord' }],
    [],
  ];

  const idx = (measure + targetIndex) % patterns.length;
  const chosen = patterns[idx];
  if (chosen.length === 0) {
    return [{ beat: SPARSE_STABS[measure % 3], dur: 0.25, type: 'stab' }];
  }
  return chosen;
}
