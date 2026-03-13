/**
 * Quartet metrics - replaces raw note-count judgments with richer metrics:
 * - Active duration, attack density, rest ratio
 * - Role entropy, motif participation, texture occupancy
 * - Simultaneous-motion density
 */
import type { Note } from './types';

const BEATS_PER_BAR = 4;

export interface InstrumentMetrics {
  activeDuration: number;
  attackCount: number;
  attackDensity: number;
  restDuration: number;
  restRatio: number;
  roleCount: number;
  roleEntropy: number;
  motifParticipation: number;
}

export interface QuartetMetrics {
  vn1: InstrumentMetrics;
  vn2: InstrumentMetrics;
  viola: InstrumentMetrics;
  cello: InstrumentMetrics;
  simultaneousMotionBars: number;
  simultaneousMotionRatio: number;
  textureReductionCount: number;
  exposedDuoTrioBars: number;
}

function getTotalSpan(notes: Note[]): number {
  if (notes.length === 0) return 0;
  let end = 0;
  for (const n of notes) {
    const o = n.offset ?? 0;
    const d = n.duration ?? 0.25;
    end = Math.max(end, o + d);
  }
  return end;
}

function computeInstrumentMetrics(
  notes: Note[],
  totalBars: number,
  totalSpan: number
): InstrumentMetrics {
  const sounding = notes.filter(n => !n.rest);
  const rests = notes.filter(n => n.rest);
  const activeDuration = sounding.reduce((s, n) => s + (n.duration ?? 0.25), 0);
  const restDuration = rests.reduce((s, n) => s + (n.duration ?? 0.25), 0);
  const span = Math.max(totalSpan, totalBars * BEATS_PER_BAR);
  const restRatio = span > 0 ? restDuration / span : 0;
  const attackCount = sounding.length;
  const attackDensity = totalBars > 0 ? attackCount / totalBars : 0;
  return {
    activeDuration,
    attackCount,
    attackDensity,
    restDuration,
    restRatio,
    roleCount: 0,
    roleEntropy: 0,
    motifParticipation: 0,
  };
}


export function computeQuartetMetrics(
  vn1: Note[],
  vn2: Note[],
  viola: Note[],
  cello: Note[],
  bars: number,
  diagnostics?: {
    violaRoleByBar?: string[];
    celloRoleByBar?: string[];
    violaMotifBars?: number;
    celloMotifBars?: number;
    textureReductionCount?: number;
    exposedDuoTrioBars?: number;
  }
): QuartetMetrics {
  const span = Math.max(
    getTotalSpan(vn1),
    getTotalSpan(vn2),
    getTotalSpan(viola),
    getTotalSpan(cello),
    bars * BEATS_PER_BAR
  );
  const totalBars = Math.ceil(span / BEATS_PER_BAR);

  const m1 = computeInstrumentMetrics(vn1, totalBars, span);
  const m2 = computeInstrumentMetrics(vn2, totalBars, span);
  const mViola = computeInstrumentMetrics(viola, totalBars, span);
  const mCello = computeInstrumentMetrics(cello, totalBars, span);

  const roleByBar = diagnostics?.violaRoleByBar ?? [];
  const violaRoles = new Set(roleByBar.filter(Boolean));
  mViola.roleCount = violaRoles.size;
  mViola.roleEntropy = violaRoles.size <= 1 ? 0 : Math.min(1, violaRoles.size / 6);
  mViola.motifParticipation = diagnostics?.violaMotifBars ?? 0;

  const celloRoleByBar = diagnostics?.celloRoleByBar ?? [];
  const celloRoles = new Set(celloRoleByBar.filter(Boolean));
  mCello.roleCount = celloRoles.size;
  mCello.roleEntropy = celloRoles.size <= 1 ? 0 : Math.min(1, celloRoles.size / 6);
  mCello.motifParticipation = diagnostics?.celloMotifBars ?? 0;

  const voices = [
    vn1.filter(n => !n.rest),
    vn2.filter(n => !n.rest),
    viola.filter(n => !n.rest),
    cello.filter(n => !n.rest),
  ];

  let simultaneousMotionBars = 0;
  for (let b = 0; b < totalBars; b++) {
    const barStart = b * BEATS_PER_BAR;
    let allMoving = true;
    for (const v of voices) {
      const inBar = v.filter(n => {
        const o = n.offset ?? 0;
        const d = n.duration ?? 0.25;
        return o < barStart + BEATS_PER_BAR && o + d > barStart;
      });
      if (inBar.length < 2) allMoving = false;
    }
    if (allMoving) simultaneousMotionBars++;
  }

  let exposedBars = 0;
  for (let b = 0; b < totalBars; b++) {
    const barStart = b * BEATS_PER_BAR;
    let active = 0;
    for (const v of voices) {
      const hasSound = v.some(n => {
        const o = n.offset ?? 0;
        const d = n.duration ?? 0.25;
        return o < barStart + BEATS_PER_BAR && o + d > barStart;
      });
      if (hasSound) active++;
    }
    if (active === 2 || active === 3) exposedBars++;
  }

  return {
    vn1: m1,
    vn2: m2,
    viola: mViola,
    cello: mCello,
    simultaneousMotionBars,
    simultaneousMotionRatio: totalBars > 0 ? simultaneousMotionBars / totalBars : 0,
    textureReductionCount: diagnostics?.textureReductionCount ?? 0,
    exposedDuoTrioBars: exposedBars,
  };
}
