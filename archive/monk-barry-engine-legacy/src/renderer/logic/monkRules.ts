import type { Note } from './types';

const ANGULAR_INTERVALS = [6, 7, 10, 12, 14];

export function applyAngularity(notes: Note[], intensity: number): Note[] {
  if (intensity < 0.2) return notes;
  const result = [...notes];
  for (let i = 1; i < result.length; i += 3) {
    if (Math.random() < intensity) {
      const interval = ANGULAR_INTERVALS[Math.floor(Math.random() * ANGULAR_INTERVALS.length)];
      const dir = Math.random() > 0.5 ? 1 : -1;
      result[i] = { ...result[i], pitch: result[i - 1].pitch + interval * dir };
    }
  }
  return result;
}

export function addRepeatedNoteRhetoric(notes: Note[], intensity: number): Note[] {
  if (intensity < 0.2) return notes;
  const result: Note[] = [];
  for (let i = 0; i < notes.length; i++) {
    result.push(notes[i]);
    if (Math.random() < intensity * 0.5 && i > 0) {
      result.push({ ...notes[i - 1], duration: 0.25, offset: (notes[i].offset ?? 0) + 0.25 });
    }
  }
  return result;
}

export function applyPhraseDisplacement(notes: Note[], lurch: number): Note[] {
  if (lurch < 0.2) return notes;
  const result = notes.map((n, i) => ({
    ...n,
    offset: (n.offset ?? i * 0.5) + (Math.random() - 0.5) * lurch * 0.3,
  }));
  result.sort((a, b) => (a.offset ?? 0) - (b.offset ?? 0));
  return result;
}

export function addStrategicSilence(notes: Note[], density: number): Note[] {
  if (density < 0.2) return notes;
  const result: Note[] = [];
  let offset = 0;
  for (let i = 0; i < notes.length; i++) {
    const n = notes[i];
    const nOffset = n.offset ?? offset;
    if (Math.random() < density * 0.3 && result.length > 2) {
      result.push({ pitch: 0, duration: 0.5, rest: true, offset: nOffset });
    }
    result.push({ ...n, offset: nOffset });
    offset = nOffset + (n.duration ?? 0.5);
  }
  return result;
}

export function applyShellVoicingAmbiguity(notes: Note[], ambiguity: number): Note[] {
  if (ambiguity < 0.3) return notes;
  return notes.filter((_, i) => i % 3 !== 1 || Math.random() > ambiguity).map(n => ({ ...n }));
}

export function addWrongRightRecurrence(notes: Note[], intensity: number): Note[] {
  if (intensity < 0.2) return notes;
  const result = notes.map(n => ({ ...n }));
  const idx = Math.floor(result.length * 0.6);
  if (idx < result.length - 1 && idx > 0 && Math.random() < intensity) {
    const originalPitch = result[idx].pitch;
    result[idx] = { ...result[idx], pitch: originalPitch + (Math.random() > 0.5 ? 1 : -1) };
    result[idx + 1] = { ...result[idx + 1], pitch: originalPitch };
  }
  return result;
}

export function evaluateAsymmetry(notes: Note[]): number {
  const lengths: number[] = [];
  let run = 0;
  for (let i = 0; i < notes.length; i++) {
    run++;
    if (notes[i].rest || (i < notes.length - 1 && Math.abs(notes[i + 1].offset! - (notes[i].offset ?? 0)) > 0.6)) {
      lengths.push(run);
      run = 0;
    }
  }
  if (run) lengths.push(run);
  const unique = new Set(lengths).size;
  return Math.min(1, 0.3 + unique * 0.15);
}

export function wrongRightValidator(notes: Note[]): boolean {
  const pitched = notes.filter(n => !n.rest && n.pitch > 0);
  if (pitched.length < 4) return true;
  let tensionResolved = 0;
  for (let i = 1; i < pitched.length - 1; i++) {
    const prev = pitched[i - 1].pitch;
    const curr = pitched[i].pitch;
    const next = pitched[i + 1].pitch;
    if (Math.abs(curr - prev) >= 6 && Math.abs(next - curr) <= 2) tensionResolved++;
  }
  return tensionResolved >= 1;
}
