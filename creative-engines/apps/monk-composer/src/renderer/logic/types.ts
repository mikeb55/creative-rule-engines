export type EngineChoice = 'barry' | 'monk' | 'barry_monk';

export type OutputTarget = 'guitar' | 'piano' | 'string_quartet' | 'big_band';

export type CompositionType = 'head' | 'solo' | 'head_solo' | 'miniature' | 'etude';

export interface BarryControls {
  bebopDensity: number;
  guideToneStrength: number;
  diminishedPassingIntensity: number;
  cadenceStrength: number;
  enclosureUsage: number;
  harmonicStrictness: number;
}

export interface MonkControls {
  angularity: number;
  rhythmicLurch: number;
  silenceDensity: number;
  shellVoicingAmbiguity: number;
  pedalFriction: number;
  asymmetryPreservation: number;
  wrongRightIntensity: number;
}

export type Meter = '4/4' | '3/4' | '5/4' | '7/4' | '6/8';
export type Form = 'Free' | 'Blues 12' | 'AABA' | 'ABAC' | 'Through-Composed';

export type QuartetDensityStrategy = 'sparse_chamber' | 'conversational' | 'polyphonic' | 'tense_frictional';

export interface GlobalControls {
  tempo: number;
  keyCenter: string;
  meter: Meter;
  form: Form;
  bars: number;
  gceThreshold: number;
  targetDifficulty: number;
  playabilityStrictness: number;
  quartetDensity?: QuartetDensityStrategy;
}

export interface Note {
  pitch: number;
  duration: number;
  offset?: number;
  rest?: boolean;
}

export interface Chord {
  symbol: string;
  duration: number;
  offset: number;
}

export interface Phrase {
  notes: Note[];
  chords?: Chord[];
  bars: number;
}

export interface Composition {
  phrases: Phrase[];
  harmony: Chord[];
  motif: Note[];
  texture: { voice: number; notes: Note[] }[];
  metadata: Record<string, unknown>;
  quartetDiagnostics?: QuartetDiagnostics;
}

export interface GCEScores {
  overall: number;
  motivicIntegrity: number;
  rhythmicPersonality: number;
  harmonicCoherence: number;
  asymmetry: number;
  targetIdiom: number;
  originality: number;
  afterglow: number;
}

export interface Warnings {
  genericBebop: boolean;
  unsupportedRandomness: boolean;
  unplayableGuitar: boolean;
  poorVoiceLeading: boolean;
  stringWriting: boolean;
  bigBandStockWriting: boolean;
  weakCadence: boolean;
  staticInnerVoice?: boolean;
  celloLoop?: boolean;
  violaFiller?: boolean;
  repeatedAccompanimentCell?: boolean;
  noTextureRotation?: boolean;
  noMotivicMigration?: boolean;
  upperLowerDisconnect?: boolean;
  nonBowable?: boolean;
  fakeKeyboardDoubling?: boolean;
  repeatedBarSyndrome?: boolean;
  repeated2BarLoopSyndrome?: boolean;
  staticAccompanimentSyndrome?: boolean;
  allVoicesSameFigure?: boolean;
  noTexturalReduction?: boolean;
  tooManyAllInstrumentsActive?: boolean;
  lackComplementaryRhythm?: boolean;
  violaInactivity?: boolean;
  celloInactivity?: boolean;
  lackCounterpointEvents?: boolean;
  constantEnsembleDensity?: boolean;
}

export interface QuartetDiagnostics {
  textureRotationCount: number;
  motifMigrationCount: number;
  repeatedCellWarnings: number;
  bowabilityWarnings: number;
  innerVoiceIndependenceScore: number;
  celloIndependenceScore: number;
  violaUsefulnessScore: number;
  repeatedBarWarnings?: number;
  repeated2BarLoopWarnings?: number;
  textureReductionCount?: number;
  allVoicesActiveOveruse?: boolean;
  complementaryRhythmScore?: number;
  violaVln2Ratio?: number;
  celloVln1Ratio?: number;
  counterpointEventCount?: number;
  motifTransformCountPer16?: number;
  densityViolations?: number;
  violaMotifBars?: number;
}

export interface Preset {
  name: string;
  engine: EngineChoice;
  target: OutputTarget;
  compositionType: CompositionType;
  barry: BarryControls;
  monk: MonkControls;
  global: GlobalControls;
  createdAt: string;
}
