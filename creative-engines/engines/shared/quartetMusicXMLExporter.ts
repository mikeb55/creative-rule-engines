/**
 * Quartet MusicXML Exporter — Export quartet part events to MusicXML 3.0.
 */
import type { QuartetPartEvent } from './quartetEventMapper';

const PITCH_STEPS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const KEY_FIFTHS: Record<string, number> = {
  C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, 'F#': 6,
  F: -1, Bb: -2, Eb: -3, Ab: -4, Db: -5, Gb: -6,
};

const PART_NAMES: Record<string, string> = {
  violin1: 'Violin 1',
  violin2: 'Violin 2',
  viola: 'Viola',
  cello: 'Cello',
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

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export interface QuartetExportOptions {
  title: string;
  keyCenter?: string;
  meter?: string;
}

export function quartetEventsToMusicXML(
  events: QuartetPartEvent[],
  options: QuartetExportOptions
): string {
  const { title, keyCenter = 'C', meter = '4/4' } = options;
  const divs = 4;
  const fifths = KEY_FIFTHS[keyCenter] ?? 0;
  const [beats, beatType] = meter.split('/').map(Number);

  const parts: Array<'violin1' | 'violin2' | 'viola' | 'cello'> = ['violin1', 'violin2', 'viola', 'cello'];
  const maxMeasure = events.length > 0 ? Math.max(...events.map(e => e.measure)) : 0;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.0">
  <work><work-title>${escapeXml(title)}</work-title></work>
  <part-list>
`;
  for (let i = 0; i < parts.length; i++) {
    xml += `    <score-part id="P${i + 1}">
      <part-name>${escapeXml(PART_NAMES[parts[i]])}</part-name>
    </score-part>
`;
  }
  xml += `  </part-list>
`;

  for (let pIdx = 0; pIdx < parts.length; pIdx++) {
    const part = parts[pIdx];
    const partEvents = events.filter(e => e.part === part);
    xml += `  <part id="P${pIdx + 1}">
`;

    for (let m = 0; m <= maxMeasure; m++) {
      xml += `    <measure number="${m + 1}">`;
      if (m === 0) {
        xml += `
      <attributes>
        <divisions>${divs}</divisions>
        <key><fifths>${fifths}</fifths></key>
        <time><beats>${beats}</beats><beat-type>${beatType}</beat-type></time>
      </attributes>`;
      }

      const evts = partEvents
        .filter(e => e.measure === m)
        .sort((a, b) => a.beatPosition - b.beatPosition);

      if (evts.length === 0) {
        const dur = divs * 4;
        xml += `\n      <note><rest/><duration>${dur}</duration><type>whole</type></note>`;
      } else {
        for (const e of evts) {
          if (e.role === 'rest' || e.pitch === 0) {
            const dur = Math.max(1, Math.round(e.duration * divs));
            xml += `\n      <note><rest/><duration>${dur}</duration><type>${durationToType(e.duration)}</type></note>`;
          } else {
            const { step, octave, alter } = midiToStepOctave(e.pitch);
            const alterXml = alter ? `<alter>${alter}</alter>` : '';
            const dur = Math.max(1, Math.round(e.duration * divs));
            xml += `\n      <note><pitch><step>${step}</step>${alterXml}<octave>${octave}</octave></pitch><duration>${dur}</duration><type>${durationToType(e.duration)}</type></note>`;
          }
        }
      }

      xml += `\n    </measure>\n`;
    }

    xml += `  </part>\n`;
  }

  xml += `</score-partwise>`;
  return xml;
}
