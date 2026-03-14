/**
 * MusicXML Exporter — MusicXML 3.0 compatibility.
 * Correct staves for piano, chord simultaneity, instrument names preserved.
 */
import type { MusicEvent } from '../../shared/MusicEvent';

const PITCH_STEPS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const KEY_FIFTHS: Record<string, number> = {
  C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, 'F#': 6,
  F: -1, Bb: -2, Eb: -3, Ab: -4, Db: -5, Gb: -6,
};

function midiToStepOctave(pitch: number): { step: string; octave: number; alter: number } {
  const pc = ((pitch % 12) + 12) % 12;
  const octave = Math.floor(pitch / 12) - 1;
  const stepIdx = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6][pc];
  const step = PITCH_STEPS[stepIdx];
  const alter = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0][pc];
  return { step, octave, alter };
}

function durationToType(duration: number): string {
  if (duration >= 4) return 'whole';
  if (duration >= 2) return 'half';
  if (duration >= 1) return 'quarter';
  if (duration >= 0.5) return 'eighth';
  return '16th';
}

export interface ExportOptions {
  title: string;
  keyCenter?: string;
  meter?: string;
  target?: 'guitar' | 'piano';
}

export function eventsToMusicXML(
  events: MusicEvent[],
  options: ExportOptions
): string {
  const { title, keyCenter = 'C', meter = '4/4', target = 'piano' } = options;
  const divs = 4;
  const fifths = KEY_FIFTHS[keyCenter] ?? 0;
  const [beats, beatType] = meter.split('/').map(Number);

  const header = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.0">
  <work><work-title>${escapeXml(title)}</work-title></work>
  <part-list>
    <score-part id="P1">
      <part-name>${target === 'piano' ? 'Piano' : 'Guitar'}</part-name>
    </score-part>
  </part-list>
  <part id="P1">`;

  const measureMap = new Map<number, MusicEvent[]>();
  for (const e of events) {
    const m = e.measure;
    if (!measureMap.has(m)) measureMap.set(m, []);
    measureMap.get(m)!.push(e);
  }

  const maxMeasure = Math.max(0, ...measureMap.keys());
  let xml = header;

  for (let m = 0; m <= maxMeasure; m++) {
    xml += `\n    <measure number="${m + 1}">`;
    if (m === 0) {
      const stavesTag = target === 'piano' ? '\n        <staves>2</staves>' : '';
      xml += `
      <attributes>
        <divisions>${divs}</divisions>
        <key><fifths>${fifths}</fifths></key>
        <time><beats>${beats}</beats><beat-type>${beatType}</beat-type></time>${stavesTag}
      </attributes>`;
    }

    const evts = [...(measureMap.get(m) ?? [])].sort((a, b) => a.beatPosition - b.beatPosition);
    for (const e of evts) {
      if (e.role === 'REST') {
        const dur = Math.max(1, Math.round(e.duration * divs));
        xml += `\n      <note><rest/><duration>${dur}</duration><type>${durationToType(e.duration)}</type></note>`;
      } else {
        const staffNum =
          target === 'piano'
            ? (e.role === 'MELODY' ? 1 : e.role === 'COUNTERLINE' ? 2 : null)
            : null;
        const staffTag = staffNum != null ? `<staff>${staffNum}</staff>` : '';
        const voiceTag =
          target === 'guitar'
            ? (e.role === 'MELODY' ? '<voice>1</voice>' : e.role === 'COUNTERLINE' ? '<voice>2</voice>' : '')
            : '';
        const pianoSplit = target === 'piano' && e.role === 'CHORD' && e.pitches.length > 1;
        const lh = pianoSplit ? e.pitches.filter(p => p < 60) : [];
        const rh = pianoSplit ? e.pitches.filter(p => p >= 60) : [];
        const groups =
          pianoSplit && lh.length > 0 && rh.length > 0 ? [lh, rh] : [e.pitches];
        for (const group of groups) {
          if (group.length === 0) continue;
          const chordStaffNum =
            pianoSplit && group === rh ? 1 : pianoSplit && group === lh ? 2 : staffNum;
          const chordStaffTag = chordStaffNum != null ? `<staff>${chordStaffNum}</staff>` : staffTag;
          for (let i = 0; i < group.length; i++) {
            const { step, octave, alter } = midiToStepOctave(group[i]);
            const alterXml = alter ? `<alter>${alter}</alter>` : '';
            const chordTag = i > 0 ? '<chord/>' : '';
            const dur = Math.max(1, Math.round(e.duration * divs));
            xml += `\n      <note>${chordTag}${chordStaffTag}${voiceTag}<pitch><step>${step}</step>${alterXml}<octave>${octave}</octave></pitch><duration>${dur}</duration><type>${durationToType(e.duration)}</type></note>`;
          }
        }
      }
    }

    xml += `\n    </measure>`;
  }

  xml += `\n  </part>\n</score-partwise>`;
  return xml;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
