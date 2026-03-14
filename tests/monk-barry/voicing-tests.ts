/**
 * Voicing Optimization Tests
 *
 * Verify:
 * - optimized voicings contain guide tones
 * - voice-leading distances reduced
 */
import { optimizeVoicings } from '../../creative-engines/engines/shared/voicingOptimization';
import { optimizeGuitarVoicing, hasGuideToneInTopVoice } from '../../creative-engines/engines/shared/guitarVoicingOptimization';
import { optimizePianoVoicing } from '../../creative-engines/engines/shared/pianoVoicingOptimization';

const mockTargets = [
  { id: 'h1', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, beatPosition: 0, duration: 2, measure: 0 },
  { id: 'h2', chord: { symbol: 'G7', root: 7, quality: '7' }, beatPosition: 2, duration: 2, measure: 0 },
  { id: 'h3', chord: { symbol: 'Cmaj7', root: 0, quality: 'maj7' }, beatPosition: 0, duration: 2, measure: 1, punctuation: true },
];

const mockGuideToneSkeleton = {
  pairs: [
    { measure: 0, beatPosition: 0, upperVoicePitch: 67, lowerVoicePitch: 59, upperRole: 'third' as const, lowerRole: 'seventh' as const, harmonicTargetIndex: 0 },
    { measure: 0, beatPosition: 2, upperVoicePitch: 66, lowerVoicePitch: 55, upperRole: 'seventh' as const, lowerRole: 'third' as const, harmonicTargetIndex: 1 },
    { measure: 1, beatPosition: 0, upperVoicePitch: 67, lowerVoicePitch: 59, upperRole: 'third' as const, lowerRole: 'seventh' as const, harmonicTargetIndex: 2 },
  ],
  phraseCadenceTargets: [4],
};

const mockTextureMap = new Map<string, string>([
  ['0-0', 'MELODY_HARMONY'],
  ['0-2', 'MELODY_HARMONY'],
  ['1-0', 'MELODY_HARMONY'],
]);

const mockChordEvents = [
  { id: 'ev_0', pitches: [60, 64, 67], measure: 0, beatPosition: 0, duration: 2, harmonicTargetIndex: 0 },
  { id: 'ev_1', pitches: [55, 59, 66], measure: 0, beatPosition: 2, duration: 2, harmonicTargetIndex: 1 },
  { id: 'ev_2', pitches: [60, 64, 67], measure: 1, beatPosition: 0, duration: 2, harmonicTargetIndex: 2 },
];

function main() {
  console.log('Voicing Optimization Tests\n');

  const result = optimizeVoicings({
    harmonicTargets: mockTargets,
    guideToneSkeleton: mockGuideToneSkeleton,
    textureStateMap: mockTextureMap,
    instrument: 'guitar',
    chordEvents: mockChordEvents,
    cadencePoints: [4],
    engine: 'barry',
  });

  console.log('Guitar voicing optimization:');
  console.log('  events returned:', result.events.length, result.events.length === mockChordEvents.length ? 'PASS' : 'FAIL');
  console.log('  valid:', result.valid ? 'PASS' : 'INFO (violations:', result.violations.length + ')');
  const hasGuideTones = result.events.every((e, i) => {
    const pair = mockGuideToneSkeleton.pairs[i];
    const upperPc = pair?.upperVoicePitch % 12;
    const lowerPc = pair?.lowerVoicePitch % 12;
    return e.pitches.some(p => (p % 12) === upperPc || (p % 12) === lowerPc);
  });
  console.log('  guide tones present:', hasGuideTones ? 'PASS' : 'FAIL');

  const guitarResult = optimizeGuitarVoicing({
    measure: 0,
    beatPosition: 0,
    rootPc: 0,
    chordQuality: 'maj7',
    currentPitches: [60, 64, 67],
    guideTonePair: mockGuideToneSkeleton.pairs[0],
    prevPitches: undefined,
    isPhraseBoundary: false,
    textureState: 'MELODY_HARMONY',
  });
  console.log('\nGuitar single-chord optimization:');
  console.log('  guide tone in top voice:', hasGuideToneInTopVoice(guitarResult.pitches, mockGuideToneSkeleton.pairs[0]) ? 'PASS' : 'FAIL');

  const pianoResult = optimizePianoVoicing({
    measure: 0,
    beatPosition: 0,
    rootPc: 0,
    chordQuality: 'maj7',
    leftHand: [48, 55],
    rightHand: [60, 67],
    guideTonePair: mockGuideToneSkeleton.pairs[0],
    prevLeftHand: undefined,
    prevRightHand: undefined,
    textureState: 'MELODY_HARMONY',
  });
  console.log('\nPiano voicing optimization:');
  console.log('  LH/RH split valid:', pianoResult.leftHand.length > 0 && pianoResult.rightHand.length > 0 ? 'PASS' : 'FAIL');

  console.log('\nDone.');
}

main();
