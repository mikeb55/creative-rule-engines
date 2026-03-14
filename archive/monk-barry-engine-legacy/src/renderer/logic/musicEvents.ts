/**
 * Music Events — Explicit chord-event model.
 * Stops flattening harmony into note streams; supports genuine simultaneity.
 */
import type { Note } from './types';

export type EventRole = 'melody' | 'shell' | 'triad' | 'voicing' | 'bass' | 'punctuation';

export interface MusicEvent {
  pitches: number[];
  duration: number;
  beatPosition: number;
  staff: number;
  voice: number;
  role: EventRole;
}

/** Convert events to texture format for Composition (voice/notes) */
export function eventsToTexture(events: MusicEvent[]): { voice: number; notes: Note[] }[] {
  const byVoice = new Map<number, Note[]>();
  for (const e of events) {
    if (!byVoice.has(e.voice)) byVoice.set(e.voice, []);
    const arr = byVoice.get(e.voice)!;
    if (e.pitches.length === 0) {
      arr.push({ pitch: 0, duration: e.duration, offset: e.beatPosition, rest: true });
    } else {
      for (let i = 0; i < e.pitches.length; i++) {
        arr.push({
          pitch: e.pitches[i],
          duration: e.duration,
          offset: e.beatPosition,
          rest: false,
        });
      }
    }
  }
  return [...byVoice.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([voice, notes]) => ({
      voice,
      notes: notes.sort((a, b) => {
        const oa = a.offset ?? 0;
        const ob = b.offset ?? 0;
        if (oa !== ob) return oa - ob;
        return (b.pitch ?? 0) - (a.pitch ?? 0);
      }),
    }));
}

/** Count chord events (simultaneity >= 2) from texture */
export function chordEventCount(texture: { voice: number; notes: Note[] }[]): number {
  const all = texture.flatMap(t => (t.notes ?? []).filter(n => !n.rest && n.pitch > 0));
  const byOffset = new Map<number, number>();
  for (const n of all) {
    const o = Math.round((n.offset ?? 0) * 4) / 4;
    byOffset.set(o, (byOffset.get(o) ?? 0) + 1);
  }
  return [...byOffset.values()].filter(c => c >= 2).reduce((s, c) => s + c, 0);
}

/** Average simultaneity (notes per beat when any note) */
export function averageSimultaneity(texture: { voice: number; notes: Note[] }[]): number {
  const all = texture.flatMap(t => (t.notes ?? []).filter(n => !n.rest && n.pitch > 0));
  if (all.length === 0) return 0;
  const byOffset = new Map<number, number[]>();
  for (const n of all) {
    const o = Math.round((n.offset ?? 0) * 4) / 4;
    if (!byOffset.has(o)) byOffset.set(o, []);
    byOffset.get(o)!.push(n.pitch);
  }
  const simuls = [...byOffset.values()].map(g => g.length);
  return simuls.reduce((a, b) => a + b, 0) / simuls.length;
}

/** Max simultaneity */
export function maxSimultaneity(texture: { voice: number; notes: Note[] }[]): number {
  const all = texture.flatMap(t => (t.notes ?? []).filter(n => !n.rest && n.pitch > 0));
  const byOffset = new Map<number, number>();
  for (const n of all) {
    const o = Math.round((n.offset ?? 0) * 4) / 4;
    byOffset.set(o, (byOffset.get(o) ?? 0) + 1);
  }
  return Math.max(0, ...byOffset.values());
}
