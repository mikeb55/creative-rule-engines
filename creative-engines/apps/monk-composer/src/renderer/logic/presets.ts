import type { Preset, GlobalControls } from './types';

export const DEFAULT_BARRY = {
  bebopDensity: 0.7,
  guideToneStrength: 0.8,
  diminishedPassingIntensity: 0.4,
  cadenceStrength: 0.9,
  enclosureUsage: 0.6,
  harmonicStrictness: 0.8,
};

export const DEFAULT_MONK = {
  angularity: 0.7,
  rhythmicLurch: 0.6,
  silenceDensity: 0.4,
  shellVoicingAmbiguity: 0.5,
  pedalFriction: 0.3,
  asymmetryPreservation: 0.8,
  wrongRightIntensity: 0.5,
};

export const DEFAULT_GLOBAL = {
  tempo: 120,
  keyCenter: 'C',
  meter: '4/4' as const,
  form: 'AABA' as const,
  bars: 32,
  gceThreshold: 9.0,
  targetDifficulty: 0.6,
  playabilityStrictness: 0.8,
  quartetDensity: 'conversational' as const,
};

export function createDefaultPreset(name: string, engine: string): Preset {
  return {
    name,
    engine: engine as Preset['engine'],
    target: 'guitar',
    compositionType: 'head',
    barry: DEFAULT_BARRY,
    monk: DEFAULT_MONK,
    global: { ...DEFAULT_GLOBAL },
    createdAt: new Date().toISOString(),
  };
}

export function migratePresetGlobal(g: Record<string, unknown>): GlobalControls {
  const def = DEFAULT_GLOBAL;
  return {
    tempo: (g.tempo as number) ?? def.tempo,
    keyCenter: (g.keyCenter as string) ?? def.keyCenter,
    meter: (g.meter as GlobalControls['meter']) ?? def.meter,
    form: (g.form as GlobalControls['form']) ?? def.form,
    bars: (g.bars as number) ?? (g.duration as number) ?? def.bars,
    gceThreshold: (g.gceThreshold as number) ?? def.gceThreshold,
    targetDifficulty: (g.targetDifficulty as number) ?? def.targetDifficulty,
    playabilityStrictness: (g.playabilityStrictness as number) ?? def.playabilityStrictness,
    quartetDensity: (g.quartetDensity as GlobalControls['quartetDensity']) ?? def.quartetDensity,
  };
}
