import type { Composition, Note } from './types';

const PITCH_STEPS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const KEY_FIFTHS: Record<string, number> = {
  C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, 'F#': 6,
  F: -1, Bb: -2, Eb: -3, Ab: -4, Db: -5, Gb: -6,
};

function parseMeter(meter: string): { beats: number; beatType: number } {
  const [beats, beatType] = meter.split('/').map(Number);
  return { beats: beats || 4, beatType: beatType || 4 };
}

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

function noteToXml(n: Note, divs: number, indent = '    ', isChord = false): string {
  const dur = Math.max(1, Math.round(n.duration * divs));
  if (n.rest) {
    return `${indent}<note><rest/><duration>${dur}</duration><type>${durationToType(n.duration)}</type></note>`;
  }
  const { step, octave, alter } = midiToStepOctave(n.pitch);
  const alterXml = alter ? `<alter>${alter}</alter>` : '';
  const chordTag = isChord ? '<chord/>' : '';
  return `${indent}<note>${chordTag}<pitch><step>${step}</step>${alterXml}<octave>${octave}</octave></pitch><duration>${dur}</duration><type>${durationToType(n.duration)}</type></note>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function compositionToMusicXML(
  comp: Composition,
  title: string,
  options?: { keyCenter?: string; meter?: string; target?: string }
): string {
  const rawNotes = (comp.texture?.flatMap(t => t.notes) ?? comp.motif ?? []).filter(n => !n.rest);
  const divs = 4;
  const keyCenter = options?.keyCenter ?? 'C';
  const meter = options?.meter ?? '4/4';
  const target = options?.target ?? 'guitar';
  const fifths = KEY_FIFTHS[keyCenter] ?? 0;
  const { beats, beatType } = parseMeter(meter);
  const beatsPerMeasure = beats;

  // Ensure every note has offset (sequential if missing)
  let runOffset = 0;
  const notes: (Note & { offset: number })[] = rawNotes.map(n => {
    const off = n.offset ?? runOffset;
    runOffset = off + (n.duration ?? 0.25);
    return { ...n, offset: off };
  });

  // Group notes by measure
  const measureMap = new Map<number, (Note & { offset: number })[]>();
  for (const n of notes) {
    const m = Math.floor(n.offset / beatsPerMeasure);
    if (!measureMap.has(m)) measureMap.set(m, []);
    measureMap.get(m)!.push(n);
  }
  const measureIndices = [...measureMap.keys()].sort((a, b) => a - b);
  const maxMeasure = measureIndices.length > 0 ? Math.max(...measureIndices) : 0;

  if (target === 'string_quartet') {
    // Use texture voices P1-P4 when we have 4 parts from targetTranslator
    const partNoteArrays = comp.texture?.length === 4
      ? comp.texture.map(t => {
          let run = 0;
          return (t.notes ?? []).map(n => {
            const off = n.offset ?? run;
            run = off + (n.duration ?? 0.25);
            return { ...n, offset: off } as Note & { offset: number };
          });
        })
      : null;
    const beatsPerMeasure = beats;
    const allNotesForMax = partNoteArrays ?? [notes];
    let maxMeasureSQ = 0;
    for (const arr of allNotesForMax) {
      for (const n of arr) {
        const m = Math.floor(n.offset / beatsPerMeasure);
        if (m > maxMeasureSQ) maxMeasureSQ = m;
      }
    }
    return buildStringQuartetXml(
      partNoteArrays ?? [notes],
      maxMeasureSQ,
      title, divs, fifths, beats, beatType, beatsPerMeasure
    );
  }

  return buildSinglePartXml(
    notes, measureMap, measureIndices, maxMeasure,
    title, divs, fifths, beats, beatType, beatsPerMeasure
  );
}

/** Group notes into chords (same offset+duration) and single notes; groups ordered by offset */
function groupNotesForChords(notes: (Note & { offset: number })[]): (Note & { offset: number })[][] {
  const byKey = new Map<string, (Note & { offset: number })[]>();
  const round = (x: number) => Math.round(x * 1000) / 1000;
  for (const n of notes) {
    const key = `${round(n.offset)}_${round(n.duration ?? 0)}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(n);
  }
  const groups = [...byKey.entries()].sort((a, b) => {
    const oa = parseFloat(a[0].split('_')[0]);
    const ob = parseFloat(b[0].split('_')[0]);
    return oa - ob;
  }).map(([, g]) => g);
  return groups.map(group =>
    group.sort((a, b) => (b.pitch ?? 0) - (a.pitch ?? 0))
  );
}

function buildSinglePartXml(
  _notes: (Note & { offset: number })[],
  measureMap: Map<number, (Note & { offset: number })[]>,
  _measureIndices: number[],
  maxMeasure: number,
  title: string,
  divs: number,
  fifths: number,
  beats: number,
  beatType: number,
  beatsPerMeasure: number
): string {
  const partList = '<part-list><score-part id="P1"><part-name>Part 1</part-name></score-part></part-list>';
  const measures: string[] = [];
  for (let m = 0; m <= maxMeasure; m++) {
    const msrNotes = (measureMap.get(m) ?? []).sort((a, b) => a.offset - b.offset);
    const attrs = m === 0
      ? `<attributes><divisions>${divs}</divisions><key><fifths>${fifths}</fifths></key><time><beats>${beats}</beats><beat-type>${beatType}</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>`
      : '';
    const groups = groupNotesForChords(msrNotes);
    const notesXml = groups.flatMap(g =>
      g.map((n, i) => noteToXml(n, divs, '      ', i > 0))
    ).join('\n');
    const restXml = msrNotes.length === 0
      ? noteToXml({ pitch: 60, duration: beatsPerMeasure, rest: true }, divs)
      : '';
    measures.push(`    <measure number="${m + 1}">\n${attrs ? '      ' + attrs + '\n' : ''}${notesXml || restXml}\n    </measure>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work><work-title>${escapeXml(title)}</work-title></work>
  ${partList}
  <part id="P1">
${measures.join('\n')}
  </part>
</score-partwise>
`;
}

function buildStringQuartetXml(
  partNoteArrays: (Note & { offset: number })[][],
  maxMeasure: number,
  title: string,
  divs: number,
  fifths: number,
  beats: number,
  beatType: number,
  beatsPerMeasure: number
): string {
  const parts: { id: string; name: string; clef: string }[] = [
    { id: 'P1', name: 'Violin 1', clef: '<clef><sign>G</sign><line>2</line></clef>' },
    { id: 'P2', name: 'Violin 2', clef: '<clef><sign>G</sign><line>2</line></clef>' },
    { id: 'P3', name: 'Viola', clef: '<clef><sign>C</sign><line>3</line></clef>' },
    { id: 'P4', name: 'Cello', clef: '<clef><sign>F</sign><line>4</line></clef>' },
  ];

  // Group each part's notes by measure (parts ordered P1..P4)
  const partMeasureMap: Record<string, Map<number, (Note & { offset: number })[]>> = {};
  const partIds = ['P1', 'P2', 'P3', 'P4'];
  for (let i = 0; i < 4; i++) {
    const pnotes = partNoteArrays[i] ?? [];
    const m = new Map<number, (Note & { offset: number })[]>();
    for (const n of pnotes) {
      const mi = Math.floor(n.offset / beatsPerMeasure);
      if (!m.has(mi)) m.set(mi, []);
      m.get(mi)!.push(n);
    }
    partMeasureMap[partIds[i]] = m;
  }

  const partList = parts.map(p => `<score-part id="${p.id}"><part-name>${escapeXml(p.name)}</part-name></score-part>`).join('');
  const partXmls: string[] = [];

  for (const { id, clef } of parts) {
    const mMap = partMeasureMap[id] ?? new Map();
    const measures: string[] = [];
    for (let m = 0; m <= maxMeasure; m++) {
      const msrNotes = (mMap.get(m) ?? []).sort((a, b) => a.offset - b.offset);
      const attrs = m === 0
        ? `<attributes><divisions>${divs}</divisions><key><fifths>${fifths}</fifths></key><time><beats>${beats}</beats><beat-type>${beatType}</beat-type></time>${clef}</attributes>`
        : '';
      const notesXml = msrNotes.map(n => noteToXml(n, divs)).join('\n');
      const restXml = msrNotes.length === 0
        ? noteToXml({ pitch: 60, duration: beatsPerMeasure, rest: true }, divs)
        : '';
      measures.push(`    <measure number="${m + 1}">\n${attrs ? '      ' + attrs + '\n' : ''}${notesXml || restXml}\n    </measure>`);
    }
    partXmls.push(`  <part id="${id}">\n${measures.join('\n')}\n  </part>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work><work-title>${escapeXml(title)}</work-title></work>
  <part-list>${partList}</part-list>
${partXmls.join('\n')}
</score-partwise>
`;
}

export function validateMusicXML(xml: string): boolean {
  return xml.includes('score-partwise') && xml.includes('</score-partwise>');
}
