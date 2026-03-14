/**
 * Barry Harris Rhythmic Rules — Swing comping language.
 *
 * Patterns:
 * - Beat-2 / Beat-4 comp
 * - Anticipated chord (and-of-4)
 * - Sustained chord + guide-tone movement
 * - Syncopated off-beat comp
 * - Short melodic pickup resolving into chord
 *
 * Rules:
 * - avoid uniform quarter-note chord placement
 * - enforce swing density variation
 * - limit chord clusters to phrase cadences
 * - prefer anticipations before dominant resolution
 */
import type { RhythmGrammarOptions } from '../shared/rhythmGrammar';
import type { RhythmicEvent, RhythmicEventType } from '../shared/rhythmGrammar';

const BEAT_2_4: number[] = [1, 3];
const AND_OF_4 = 3.5;
const OFF_BEATS: number[] = [0.5, 1.5, 2.5, 3.5];

function isDominant(quality: string): boolean {
  return quality.includes('7') && !quality.includes('maj7') && !quality.includes('m7');
}

export function applyBarryRhythmRules(opts: RhythmGrammarOptions): RhythmicEvent[] {
  const { phraseStructure, harmonicTargets, bars } = opts;
  const events: RhythmicEvent[] = [];
  const tensionCurve = phraseStructure.tensionCurve;
  const cadenceMeasures = new Set(
    phraseStructure.cadencePoints.map(cp => Math.floor(cp / 4))
  );

  for (let m = 0; m < Math.min(bars, phraseStructure.phraseLength); m++) {
    const targetsInBar = harmonicTargets.filter(t => t.measure === m);
    const isCadenceBar = cadenceMeasures.has(m);
    const tension = tensionCurve[m] ?? 0.5;

    if (targetsInBar.length === 0) {
      events.push({ measure: m, beatPosition: 0, duration: 1, eventType: 'rest' });
      continue;
    }

    for (let i = 0; i < targetsInBar.length; i++) {
      const t = targetsInBar[i];
      const idx = harmonicTargets.indexOf(t);
      const isDominantChord = isDominant(t.chord.quality);

      const pattern = selectBarryPattern(m, i, targetsInBar.length, isCadenceBar, isDominantChord, tension);
      for (const { beat, dur, type } of pattern) {
        events.push({
          measure: m,
          beatPosition: beat,
          duration: dur,
          eventType: type as RhythmicEventType,
          harmonicTargetIndex: idx,
        });
      }
    }
  }

  return events;
}

type PatternSlot = { beat: number; dur: number; type: string };

function selectBarryPattern(
  measure: number,
  targetIndex: number,
  targetsInBar: number,
  isCadenceBar: boolean,
  isDominantChord: boolean,
  tension: number
): PatternSlot[] {
  const patterns: PatternSlot[][] = [
    [{ beat: 1, dur: 1, type: 'chord' }, { beat: 3, dur: 1, type: 'chord' }],
    [{ beat: 3.5, dur: 0.5, type: 'chord' }],
    [{ beat: 0, dur: 2, type: 'chord' }],
    [{ beat: 0.5, dur: 0.5, type: 'stab' }, { beat: 2.5, dur: 0.5, type: 'stab' }],
    [{ beat: 2.5, dur: 0.25, type: 'pickup' }, { beat: 3, dur: 1, type: 'chord' }],
    [{ beat: 1, dur: 1, type: 'chord' }],
    [{ beat: 3.5, dur: 0.5, type: 'chord' }, { beat: 0, dur: 1, type: 'line' }],
  ];

  if (isDominantChord && !isCadenceBar) {
    return [{ beat: AND_OF_4, dur: 0.5, type: 'chord' }];
  }
  if (isCadenceBar && tension > 0.7) {
    return patterns[0];
  }
  const idx = (measure + targetIndex) % patterns.length;
  return patterns[idx];
}
