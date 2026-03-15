/**
 * MusicXML Exporter — MusicXML 3.0 compatibility.
 * Supports guitar, piano, string_quartet, big_band.
 */
import type { MusicEvent } from '../../shared/MusicEvent';
import type { BigBandPartEvent } from '../orchestration/bigBandSectionEngine';

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
  target?: 'guitar' | 'piano' | 'string_quartet' | 'big_band';
}

/** String quartet staff order */
const QUARTET_PARTS = ['Violin I', 'Violin II', 'Viola', 'Cello'] as const;

/** Big band staff groups: SAXES, TRUMPETS, TROMBONES */
const BIG_BAND_PARTS = [
  'Alto 1', 'Alto 2', 'Tenor 1', 'Tenor 2', 'Baritone',
  'Trumpet 1', 'Trumpet 2', 'Trumpet 3', 'Trumpet 4',
  'Trombone 1', 'Trombone 2', 'Trombone 3', 'Bass Trom',
] as const;

const BIG_BAND_PART_IDS = [
  'alto1', 'alto2', 'tenor1', 'tenor2', 'baritone',
  'trumpet1', 'trumpet2', 'trumpet3', 'trumpet4',
  'trombone1', 'trombone2', 'trombone3', 'bassTrombone',
] as const;

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

/** Export big band part events to MusicXML with full section layout. */
export function bigBandEventsToMusicXML(
  events: BigBandPartEvent[],
  options: { title: string; keyCenter?: string; meter?: string }
): string {
  const { title, keyCenter = 'C', meter = '4/4' } = options;
  const divs = 4;
  const fifths = KEY_FIFTHS[keyCenter] ?? 0;
  const [beats, beatType] = meter.split('/').map(Number);
  const maxMeasure = events.length > 0 ? Math.max(...events.map(e => e.measure)) : 0;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.0">
  <work><work-title>${escapeXml(title)}</work-title></work>
  <part-list>
`;
  for (let i = 0; i < BIG_BAND_PARTS.length; i++) {
    xml += `    <score-part id="P${i + 1}">
      <part-name>${escapeXml(BIG_BAND_PARTS[i])}</part-name>
    </score-part>
`;
  }
  xml += `  </part-list>
`;

  for (let pIdx = 0; pIdx < BIG_BAND_PART_IDS.length; pIdx++) {
    const partId = BIG_BAND_PART_IDS[pIdx];
    const partEvents = events.filter(e => e.part === partId);
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
          const { step, octave, alter } = midiToStepOctave(e.pitch);
          const alterXml = alter ? `<alter>${alter}</alter>` : '';
          const dur = Math.max(1, Math.round(e.duration * divs));
          xml += `\n      <note><pitch><step>${step}</step>${alterXml}<octave>${octave}</octave></pitch><duration>${dur}</duration><type>${durationToType(e.duration)}</type></note>`;
        }
      }

      xml += `\n    </measure>`;
    }
    xml += `\n  </part>
`;
  }

  xml += `</score-partwise>`;
  return xml;
}
