/**
 * Quartet Validation — Validate quartet output for GCE.
 */
import type { QuartetPartEvent } from './quartetEventMapper';
import type { QuartetRoleMap } from './quartetRoleEngine';

export interface QuartetValidationResult {
  valid: boolean;
  leadStatic: boolean;
  violaUnderused: boolean;
  celloOnlyBass: boolean;
  textureFlat: boolean;
  blockWriting: boolean;
}

export function validateQuartetOutput(
  events: QuartetPartEvent[],
  roleMap: QuartetRoleMap,
  bars: number
): QuartetValidationResult {
  const violaEvents = events.filter(e => e.part === 'viola' && e.role !== 'rest' && e.pitch > 0);
  const celloEvents = events.filter(e => e.part === 'cello' && e.role !== 'rest' && e.pitch > 0);
  const vln1Melody = events.filter(e => e.part === 'violin1' && e.role === 'melody');
  const allMelody = events.filter(e => e.role === 'melody');

  const violaCount = violaEvents.length;
  const celloCount = celloEvents.length;
  const celloBassOnly = celloEvents.length > 0 && celloEvents.every(e => e.role === 'bass');
  const vln1AlwaysLead = allMelody.length >= 4 && vln1Melody.length === allMelody.length;

  const textureCounts = new Map<number, number>();
  for (let m = 0; m < bars; m++) {
    const active = new Set(events.filter(e => e.measure === m && e.pitch > 0).map(e => e.part));
    textureCounts.set(m, active.size);
  }
  const textureValues = [...textureCounts.values()];
  const uniqueTextures = new Set(textureValues);
  const textureFlat = uniqueTextures.size <= 1 && textureValues.length >= 4;
  const blockWriting = textureValues.length >= 4 && textureValues.every(v => v === 4);

  const violaUnderused = violaCount < 1 && bars >= 8;
  const celloOnlyBass = celloBassOnly && celloCount >= 6;
  const leadStatic = vln1AlwaysLead;

  const valid =
    !leadStatic &&
    !violaUnderused &&
    !celloOnlyBass &&
    !textureFlat &&
    !blockWriting;

  return {
    valid,
    leadStatic,
    violaUnderused,
    celloOnlyBass,
    textureFlat,
    blockWriting,
  };
}
