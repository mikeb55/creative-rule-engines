/**
 * Quartet Anchor Voice — At any phrase segment, one instrument functions as anchor.
 * Anchor determines phrase identity; non-anchor voices support, answer, or contrast.
 */
export type QuartetInstrument = 'violin1' | 'violin2' | 'viola' | 'cello';

export interface AnchorAssignment {
  bar: number;
  beat: number;
  anchor: QuartetInstrument;
  phraseSegmentId: number;
}

export interface AnchorVoiceOptions {
  bars: number;
  cadencePoints: number[];
  phraseLength: number;
}

/**
 * Compute anchor assignments. Anchor changes at phrase boundaries or structural transitions.
 */
export function computeAnchorAssignments(options: AnchorVoiceOptions): AnchorAssignment[] {
  const { bars, cadencePoints, phraseLength } = options;
  const assignments: AnchorAssignment[] = [];
  const instruments: QuartetInstrument[] = ['violin1', 'violin2', 'viola', 'cello'];

  let segmentId = 0;
  let anchorIndex = 0;

  for (let bar = 0; bar < bars; bar++) {
    for (let beat = 0; beat < 4; beat += 2) {
      const pos = bar * 4 + beat;
      const isBoundary = cadencePoints.some(cp => Math.abs(cp - pos) < 1.5);
      const segmentBoundary = bar > 0 && bar % phraseLength === 0;

      if (isBoundary || segmentBoundary) {
        segmentId++;
        anchorIndex = (anchorIndex + 1) % instruments.length;
      }

      assignments.push({
        bar,
        beat,
        anchor: instruments[anchorIndex],
        phraseSegmentId: segmentId,
      });
    }
  }

  return assignments;
}

/**
 * Get anchor for a bar/beat.
 */
export function getAnchorAt(
  assignments: AnchorAssignment[],
  bar: number,
  beat: number
): QuartetInstrument | undefined {
  const b = Math.floor(beat);
  return assignments.find(a => a.bar === bar && a.beat === b)?.anchor;
}
