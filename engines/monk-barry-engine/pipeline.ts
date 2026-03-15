/**
 * Pipeline — Orchestrate form → motif → harmony → phrase → guide-tone motion → rhythm grammar → melodic realization → voicing → events.
 */
import { generateForm } from './form/formEngine';
import { generateMotif } from './motif/motifEngine';
import { generateBarryHarrisHarmony } from './harmony/barryHarrisEngine';
import { generateMonkHarmony } from './harmony/monkHarmonyEngine';
import { buildPhraseArchitecture, validatePhraseStructure } from '../../creative-engines/engines/shared/phraseArchitecture';
import { applyBarryMotionGrammar, hasDirectionalMotion } from '../../creative-engines/engines/barry-harris-engine/barryMotionGrammar';
import { buildGuideToneSkeleton, validateGuideToneSkeleton, hasGuideToneContinuity, hasDominantResolution, hasExcessiveLeaps } from '../../creative-engines/engines/shared/guideToneMotion';
import { buildTextureStateMap, getStateAt, allowsHarmony, allowsMelody, allowsCounterline, hasTextureVariation, hasSilence, isTextureOvercrowded } from '../../creative-engines/engines/shared/textureStateEngine';
import { applyBarryTextureRules } from '../../creative-engines/engines/barry-harris-engine/barryTextureRules';
import { applyMonkTextureRules } from '../../creative-engines/engines/monk-engine/monkTextureRules';
import { applyBarryGuideToneRules } from '../../creative-engines/engines/barry-harris-engine/barryGuideToneRules';
import { applyMonkGuideToneRules } from '../../creative-engines/engines/monk-engine/monkGuideToneRules';
import { buildRhythmicEventGrid, hasRhythmicDiversity, hasSyncopation } from '../../creative-engines/engines/shared/rhythmGrammar';
import { buildMelodicEvents, hasGuideToneTargeting, hasRhythmicInterruption } from '../../creative-engines/engines/shared/melodicRealization';
import { buildCounterlineEvents } from '../../creative-engines/engines/shared/counterlineEngine';
import { applyBarryCounterlineRules } from '../../creative-engines/engines/barry-harris-engine/barryCounterlineRules';
import { applyMonkCounterlineRules } from '../../creative-engines/engines/monk-engine/monkCounterlineRules';
import { applyBarryRhythmRules } from '../../creative-engines/engines/barry-harris-engine/barryRhythmRules';
import { applyMonkRhythmRules } from '../../creative-engines/engines/monk-engine/monkRhythmRules';
import { applyBarryMelodicRules } from '../../creative-engines/engines/barry-harris-engine/barryMelodicRules';
import { applyMonkMelodicRules } from '../../creative-engines/engines/monk-engine/monkMelodicRules';
import { VOICING_FAMILIES } from './voicing/voicingFamilies';
import { mapVoicingToGuitar } from './idiom/guitarTranslator';
import { mapVoicingToPiano } from './idiom/pianoTranslator';
import { createChordEvent, createMelodyEvent, createCounterlineEvent } from '../shared/MusicEvent';
import { eventsToMusicXML } from './export/musicxmlExporter';
import { validateMusicEvents } from './validation/musicValidator';
import { optimizeVoicings } from '../../creative-engines/engines/shared/voicingOptimization';
import { evaluateForRevision, selectBestOutput } from '../../creative-engines/engines/shared/revisionLoopEnhancement';
import { buildQuartetRoleMap } from '../../creative-engines/engines/shared/quartetRoleEngine';
import { applyMonkQuartetRules } from '../../creative-engines/engines/monk-engine/monkQuartetRules';
import { applyBarryQuartetRules } from '../../creative-engines/engines/barry-harris-engine/barryQuartetRules';
import { mapEventsToQuartet } from '../../creative-engines/engines/shared/quartetEventMapper';
import { quartetEventsToMusicXML } from '../../creative-engines/engines/shared/quartetMusicXMLExporter';
import { validateQuartetOutput } from '../../creative-engines/engines/shared/quartetValidation';
import { mapEventsToBigBand } from './orchestration/bigBandSectionEngine';
import { applyBigBandVoicing } from './orchestration/bigBandVoicingEngine';
import { bigBandEventsToMusicXML } from './export/musicxmlExporter';
import { runHillPipeline, runHillPipelineWithRevision } from '../andrew-hill-engine/hillPipeline';
import * as fs from 'fs';
import * as path from 'path';

export type EngineChoice = 'barry' | 'monk' | 'hill';
export type InstrumentTarget = 'guitar' | 'piano' | 'string_quartet' | 'big_band';

export interface PipelineOptions {
  engine: EngineChoice;
  instrument: InstrumentTarget;
  bars: number;
  keyCenter?: string;
  outputDir?: string;
  /** Skip writing to file (used by revision loop) */
  skipWrite?: boolean;
  /** Use optimized filename (for revision loop output) */
  optimized?: boolean;
}

const KEY_CENTER_TO_PC: Record<string, number> = {
  C: 0, G: 7, D: 2, A: 9, E: 4, B: 11, 'F#': 6,
  F: 5, Bb: 10, Eb: 3, Ab: 8, Db: 1, Gb: 6,
};

export function runPipeline(options: PipelineOptions): { events: import('../shared/MusicEvent').MusicEvent[]; xml: string; valid: boolean } {
  const { engine, instrument, bars, keyCenter = 'C', outputDir = 'outputs' } = options;
  const keyPc = KEY_CENTER_TO_PC[keyCenter] ?? 0;

  const form = generateForm({ bars });
  const motif = generateMotif({ keyCenter: keyPc });
  let harmony = engine === 'barry'
    ? generateBarryHarrisHarmony({ keyCenter: keyPc, bars })
    : generateMonkHarmony({ keyCenter: keyPc, bars });

  if (engine === 'barry') {
    harmony = applyBarryMotionGrammar({ keyCenter: keyPc, targets: harmony });
    if (!hasDirectionalMotion(harmony)) {
      harmony = applyBarryMotionGrammar({ keyCenter: keyPc, targets: harmony, motionFamily: 'tonic_ii_V' });
    }
  }

  const phraseStruct = buildPhraseArchitecture({
    harmonicTargets: harmony,
    phraseLengths: [4, 6, 8],
    requireCadencePressure: true,
  });
  const refinedHarmony = phraseStruct && validatePhraseStructure(phraseStruct)
    ? phraseStruct.harmonicTargets
    : harmony;

  const effectivePhraseStruct = phraseStruct ?? {
    phraseLength: bars,
    harmonicTargets: refinedHarmony,
    cadencePoints: refinedHarmony.filter(h => h.punctuation).map(h => h.measure * 4 + h.beatPosition),
    tensionCurve: Array.from({ length: bars }, (_, i) => 0.3 + 0.4 * Math.sin((i / Math.max(1, bars - 1)) * Math.PI)),
  };

  const applyGuideTone = engine === 'barry' ? applyBarryGuideToneRules : applyMonkGuideToneRules;
  const guideToneSkeleton = buildGuideToneSkeleton(
    { phraseStructure: effectivePhraseStruct, harmonicTargets: refinedHarmony, engine, keyCenter: keyPc },
    applyGuideTone
  );

  const applyTexture = engine === 'barry' ? applyBarryTextureRules : applyMonkTextureRules;
  const textureStateMap = buildTextureStateMap(
    {
      phraseStructure: effectivePhraseStruct,
      harmonicTargets: refinedHarmony,
      guideToneSkeleton,
      engine,
      bars,
    },
    applyTexture
  );

  const applyRhythm = engine === 'barry' ? applyBarryRhythmRules : applyMonkRhythmRules;
  const rhythmicGrid = buildRhythmicEventGrid(
    { phraseStructure: effectivePhraseStruct, harmonicTargets: refinedHarmony, engine, bars },
    applyRhythm
  );

  const applyMelodic = engine === 'barry' ? applyBarryMelodicRules : applyMonkMelodicRules;
  const melodicEvents = buildMelodicEvents(
    { phraseStructure: effectivePhraseStruct, harmonicTargets: refinedHarmony, rhythmicGrid, engine, keyCenter: keyPc, bars, guideToneSkeleton },
    applyMelodic
  );

  const applyCounterline = engine === 'barry' ? applyBarryCounterlineRules : applyMonkCounterlineRules;
  const counterlineEvents = buildCounterlineEvents(
    {
      phraseStructure: effectivePhraseStruct,
      harmonicTargets: refinedHarmony,
      guideToneSkeleton,
      melodicEvents,
      engine,
      keyCenter: keyPc,
      bars,
    },
    applyCounterline
  );

  const family = VOICING_FAMILIES.find(f => f.allowableChordTypes.some(q => refinedHarmony[0]?.chord.quality.includes(q))) ?? VOICING_FAMILIES[0];
  const events: import('../shared/MusicEvent').MusicEvent[] = [];
  const chordEventInputs: { id: string; pitches: number[]; measure: number; beatPosition: number; duration: number; harmonicTargetIndex: number }[] = [];
  let evId = 0;

  const chordEventsFromRhythm = rhythmicGrid.events.filter(re => re.eventType !== 'rest');
  const rhythmHasChords = chordEventsFromRhythm.length > 0;

  const effectiveInstrument = instrument === 'string_quartet' || instrument === 'big_band' ? 'piano' : instrument;

  for (const re of (rhythmHasChords ? rhythmicGrid.events : refinedHarmony.map((h, i) => ({
    measure: h.measure,
    beatPosition: h.beatPosition,
    duration: h.duration,
    eventType: 'chord' as const,
    harmonicTargetIndex: i,
  })))) {
    if (re.eventType === 'rest') continue;
    const state = getStateAt(textureStateMap, re.measure, Math.floor(re.beatPosition));
    if (!allowsHarmony(state)) continue;
    const h = refinedHarmony[re.harmonicTargetIndex ?? 0];
    if (!h) continue;
    const rootPc = h.chord.root;
    const baseOctave = 4;
    let pList: number[];
    if (effectiveInstrument === 'guitar') {
      const g = mapVoicingToGuitar(family, rootPc, baseOctave);
      pList = g ?? [60 + rootPc];
    } else {
      const p = mapVoicingToPiano(family, rootPc, baseOctave);
      pList = p ? [...p.leftHand, ...p.rightHand] : [60 + rootPc];
    }
    if (pList.length > 0) {
      const cid = `ev_${evId++}`;
      chordEventInputs.push({
        id: cid,
        pitches: pList,
        measure: re.measure,
        beatPosition: re.beatPosition,
        duration: re.duration,
        harmonicTargetIndex: re.harmonicTargetIndex ?? 0,
      });
      events.push(createChordEvent(cid, pList, re.measure, re.beatPosition, re.duration));
    }
  }

  if (melodicEvents.length > 0) {
    for (const me of melodicEvents) {
      const state = getStateAt(textureStateMap, me.measure, Math.floor(me.beatPosition));
      if (!allowsMelody(state)) continue;
      events.push(createMelodyEvent(`ev_${evId++}`, me.pitch, me.measure, me.beatPosition, me.duration, { articulation: me.articulation }));
    }
  }
  for (const ce of counterlineEvents) {
    const state = getStateAt(textureStateMap, ce.bar, Math.floor(ce.beatPosition));
    if (!allowsCounterline(state)) continue;
    events.push(createCounterlineEvent(`ev_${evId++}`, ce.pitch, ce.bar, ce.beatPosition, ce.duration, { articulation: ce.articulation }));
  }
  if (melodicEvents.length === 0) {
    for (let i = 0; i < motif.pitches.length && i < bars * 4; i++) {
      const m = Math.floor(i / 4);
      const b = (i % 4) * 0.5;
      const state = getStateAt(textureStateMap, m, Math.floor(b));
      if (!allowsMelody(state)) continue;
      events.push(createMelodyEvent(`ev_${evId++}`, motif.pitches[i % motif.pitches.length], m, b, 0.5));
    }
  }

  events.sort((a, b) => a.measure * 4 + a.beatPosition - (b.measure * 4 + b.beatPosition));

  const cadencePoints = effectivePhraseStruct.cadencePoints ?? [];

  if (instrument === 'string_quartet') {
    const applyQuartetRules = engine === 'barry' ? applyBarryQuartetRules : applyMonkQuartetRules;
    const quartetRoleMap = buildQuartetRoleMap({
      phraseStructure: effectivePhraseStruct,
      textureStateMap,
      harmonicTargets: refinedHarmony,
      guideToneSkeleton,
      engine,
      bars,
      applyEngineRules: applyQuartetRules,
    });
    const rawEvents = events
      .filter(e => e.role !== 'REST')
      .map(e => ({
        role: e.role as 'MELODY' | 'CHORD' | 'COUNTERLINE',
        pitches: e.pitches,
        measure: e.measure,
        beatPosition: e.beatPosition,
        duration: e.duration,
        articulation: e.articulation,
      }));
    const quartetEvents = mapEventsToQuartet(rawEvents, quartetRoleMap, bars);
    const quartetXml = quartetEventsToMusicXML(quartetEvents, {
      title: `${engine === 'barry' ? 'Barry' : 'Monk'} String Quartet Study`,
      keyCenter,
    });
    const quartetFilename = `${engine}-string-quartet-study.musicxml`;
    if (!options.skipWrite) {
      try {
        fs.mkdirSync(outputDir, { recursive: true });
        fs.writeFileSync(path.join(outputDir, quartetFilename), quartetXml, 'utf-8');
      } catch (_) {}
    }
    const phraseValid = phraseStruct !== null && validatePhraseStructure(phraseStruct);
    const barryMotionValid = engine !== 'barry' || hasDirectionalMotion(harmony);
    const quartetValidation = validateQuartetOutput(quartetEvents, quartetRoleMap, bars);
    return {
      events,
      xml: quartetXml,
      valid: phraseValid && barryMotionValid,
      filename: quartetFilename,
      metadata: {
        ensembleType: 'string_quartet' as const,
        phraseArchitectureApplied: phraseValid,
        harmonicDirectionPresent: barryMotionValid,
        quartetRoleEngineApplied: true,
        quartetLeadStatic: quartetValidation.leadStatic,
        violaUnderused: quartetValidation.violaUnderused,
        celloOnlyBass: quartetValidation.celloOnlyBass,
        quartetTextureFlat: quartetValidation.textureFlat,
        quartetBlockWriting: quartetValidation.blockWriting,
      },
    };
  }

  if (instrument === 'big_band') {
    const bigBandEvents = mapEventsToBigBand(events, bars);
    const voicedEvents = applyBigBandVoicing(bigBandEvents);
    const bigBandXml = bigBandEventsToMusicXML(voicedEvents, {
      title: `${engine === 'barry' ? 'Barry' : 'Monk'} Big Band Sketch`,
      keyCenter,
    });
    const bigBandFilename = `${engine}-big-band-sketch.musicxml`;
    if (!options.skipWrite) {
      try {
        fs.mkdirSync(outputDir, { recursive: true });
        fs.writeFileSync(path.join(outputDir, bigBandFilename), bigBandXml, 'utf-8');
      } catch (_) {}
    }
    const phraseValid = phraseStruct !== null && validatePhraseStructure(phraseStruct);
    const barryMotionValid = engine !== 'barry' || hasDirectionalMotion(harmony);
    return {
      events,
      xml: bigBandXml,
      valid: phraseValid && barryMotionValid,
      filename: bigBandFilename,
      metadata: {
        phraseArchitectureApplied: phraseValid,
        harmonicDirectionPresent: barryMotionValid,
        ensembleType: 'big_band' as const,
      },
    };
  }

  // Voicing optimization (before export)
  const voicingResult = optimizeVoicings({
    harmonicTargets: refinedHarmony,
    guideToneSkeleton,
    textureStateMap,
    instrument,
    chordEvents: chordEventInputs,
    cadencePoints,
    engine,
  });
  const optimizedById = new Map(voicingResult.events.map(e => [e.id, e]));
  for (const ev of events) {
    if (ev.role === 'CHORD') {
      const opt = optimizedById.get(ev.id);
      if (opt && opt.pitches.length > 0) {
        ev.pitches = opt.pitches;
      }
    }
  }

  const phraseValid = phraseStruct !== null && validatePhraseStructure(phraseStruct);
  const barryMotionValid = engine !== 'barry' || hasDirectionalMotion(harmony);
  const guideToneValid = validateGuideToneSkeleton(guideToneSkeleton, refinedHarmony);
  const rhythmValid = hasRhythmicDiversity(rhythmicGrid) && hasSyncopation(rhythmicGrid);
  const melodicValid = engine === 'barry'
    ? hasGuideToneTargeting(melodicEvents)
    : hasRhythmicInterruption(melodicEvents, rhythmicGrid);
  const validation = validateMusicEvents(events);

  const voicingGuideToneMissing = voicingResult.violations.some(v => v.includes('guide tone'));
  const voicingRegisterJump = voicingResult.violations.some(v => v.includes('register'));
  const voicingTextureConflict = voicingResult.violations.some(v => v.includes('density') || v.includes('texture'));
  const voicingInstrumentViolation = voicingResult.violations.some(v => v.includes('fretboard') || v.includes('instrument'));

  const layerValid = phraseValid && barryMotionValid;
  const xml = eventsToMusicXML(events, {
    title: `${engine === 'barry' ? 'Barry' : 'Monk'} ${instrument} Study`,
    keyCenter,
    target: instrument,
  });

  const filename = `${engine}-${instrument}-${options.optimized ? 'optimized' : 'texture'}.musicxml`;
  const outPath = path.join(outputDir, filename);
  if (!options.skipWrite) {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(outPath, xml, 'utf-8');
    } catch (_) {}
  }

  return {
    events,
    xml,
    valid: validation.valid && layerValid,
    filename,
    metadata: {
      ensembleType: instrument as 'guitar' | 'piano',
      phraseArchitectureApplied: phraseValid,
      harmonicDirectionPresent: barryMotionValid,
      motionGrammarUsed: engine === 'barry' ? barryMotionValid : undefined,
      guideToneSkeletonValid: guideToneValid,
      guideToneContinuityBroken: !hasGuideToneContinuity(guideToneSkeleton),
      dominantResolutionMissing: !hasDominantResolution(guideToneSkeleton, refinedHarmony),
      excessiveVoiceLeadingLeap: hasExcessiveLeaps(guideToneSkeleton),
      rhythmGrammarApplied: rhythmValid,
      melodicRealizationApplied: melodicValid,
      rhythmicDensityUniform: !rhythmValid,
      melodyIgnoresHarmony: !melodicValid,
      counterlineApplied: counterlineEvents.length > 0,
      textureStateApplied: true,
      textureUniform: !hasTextureVariation(textureStateMap),
      textureOvercrowded: isTextureOvercrowded(textureStateMap),
      textureMissingContrast: !hasSilence(textureStateMap) && !hasTextureVariation(textureStateMap),
      voicingOptimizationValid: voicingResult.valid,
      voicingGuideToneMissing,
      voicingRegisterJump,
      voicingTextureConflict,
      voicingInstrumentViolation,
    },
  };
}

/**
 * Run pipeline with revision loop: up to 5 cycles, select highest-scoring output.
 * String quartet skips revision loop (no guitar/piano voicing optimization).
 */
export function runPipelineWithRevision(options: PipelineOptions): ReturnType<typeof runPipeline> {
  if (options.engine === 'hill') {
    return runHillPipelineWithRevision({
      instrument: options.instrument,
      bars: options.bars,
      keyCenter: options.keyCenter,
      outputDir: options.outputDir,
      skipWrite: options.skipWrite,
      optimized: options.optimized,
    }) as ReturnType<typeof runPipeline>;
  }
  if (options.instrument === 'string_quartet' || options.instrument === 'big_band') {
    return runPipeline(options);
  }
  const MAX_CYCLES = 5;
  const candidates: ReturnType<typeof runPipeline>[] = [];

  for (let cycle = 0; cycle < MAX_CYCLES; cycle++) {
    const result = runPipeline({ ...options, skipWrite: true, optimized: true });
    candidates.push(result);

    const evalResult = evaluateForRevision(
      {
        metadata: result.metadata ?? {},
        eventsCount: result.events.length,
        chordEventsCount: result.events.filter(e => e.role === 'CHORD').length,
        melodicEventsCount: result.events.filter(e => e.role === 'MELODY').length,
        counterlineEventsCount: result.events.filter(e => e.role === 'COUNTERLINE').length,
        instrument: options.instrument,
        engine: options.engine,
      },
      cycle
    );

    if (!evalResult.shouldRegenerate || evalResult.maxCyclesReached) {
      break;
    }
  }

  const { outputDir = 'outputs', engine, instrument } = options;
  const best = selectBestOutput(candidates, r => {
    const m = r.metadata ?? {};
    let s = 7;
    if (m.guideToneContinuityBroken) s -= 1.5;
    if (m.textureUniform) s -= 1;
    if (m.rhythmGrammarApplied === false) s -= 1.5;
    if (m.counterlineTooDense) s -= 1;
    if (m.voicingOptimizationValid === false) s -= 1.5;
    if (m.voicingGuideToneMissing) s -= 0.5;
    if (m.voicingRegisterJump) s -= 0.5;
    if (m.voicingTextureConflict) s -= 0.5;
    if (m.voicingInstrumentViolation) s -= 1;
    if (m.phraseArchitectureApplied) s += 0.3;
    if (m.harmonicDirectionPresent) s += 0.3;
    if (m.guideToneSkeletonValid) s += 0.2;
    return Math.max(0, Math.min(10, s));
  });

  const chosen = best?.best ?? candidates[0];
  try {
    fs.mkdirSync(outputDir, { recursive: true });
    const outFilename = chosen.filename ?? `${engine}-${instrument}-optimized.musicxml`;
    fs.writeFileSync(path.join(outputDir, outFilename), chosen.xml, 'utf-8');
  } catch (_) {}
  return chosen;
}
