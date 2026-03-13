/**
 * Texture Architecture - Plans ensemble density before voice generation.
 * Sections of 2-4 measures, each assigned a texture type.
 * Ensures variety: DUO, TRIO, SOLO_PLUS_PUNCTUATION per 16 bars; FULL ≤ 40%.
 * Viola: rest per 8 bars; motif per 12 bars. Cello: rest/sustain per 10 bars; counterline sometimes.
 */
export type TextureType = 'FULL' | 'TRIO' | 'DUO' | 'SOLO_PLUS_PUNCTUATION' | 'PEDAL_TEXTURE';

export type InstrumentRole = 'active' | 'rest' | 'sustain' | 'punctuation';

export interface TextureSection {
  startBar: number;
  endBar: number;
  textureType: TextureType;
  activeInstruments: Set<number>;
  violaRole: InstrumentRole;
  celloRole: InstrumentRole;
  violaMotifSection: boolean;
  celloCounterline: boolean;
}

const INSTRUMENTS = [0, 1, 2, 3];

function shuffle<T>(arr: T[], seed: number): T[] {
  const s = [...arr];
  for (let i = 0; i < s.length; i++) {
    const j = (i + seed) % s.length;
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

function pickN(n: number, exclude?: number, seed?: number): Set<number> {
  const pool = exclude != null ? INSTRUMENTS.filter(i => i !== exclude) : [...INSTRUMENTS];
  return new Set(shuffle(pool, seed ?? 0).slice(0, n));
}

export function buildTexturePlan(totalBars: number, seed: number): TextureSection[] {
  const sections: TextureSection[] = [];
  const SECTION_LENGTHS = [2, 3, 2, 4, 3, 2, 3, 4];

  let bar = 0;
  let sectionIdx = 0;
  const violaRestSections: number[] = [];
  const violaMotifSections: number[] = [];
  const celloRestSections: number[] = [];
  const fullCount = { count: 0 };
  const duoCount = { count: 0 };
  const trioCount = { count: 0 };
  const soloCount = { count: 0 };

  while (bar < totalBars) {
    const len = SECTION_LENGTHS[sectionIdx % SECTION_LENGTHS.length];
    const sectionBars = Math.min(len, totalBars - bar);
    const endBar = bar + sectionBars - 1;

    const blocksOf16 = Math.floor(bar / 16);
    const inBlock = bar % 16;
    const fullAllowed = fullCount.count < Math.ceil((blocksOf16 + 1) * 16 * 0.4);
    const needDuo = duoCount.count < blocksOf16 + 1;
    const needTrio = trioCount.count < blocksOf16 + 1;
    const needSolo = soloCount.count < blocksOf16 + 1;
    const violaNeedsRest = Math.floor(bar / 8) >= violaRestSections.filter(s => s <= bar).length;
    const violaNeedsMotif = Math.floor(bar / 12) >= violaMotifSections.filter(s => s <= bar).length;
    const celloNeedsRest = Math.floor(bar / 10) >= celloRestSections.filter(s => s <= bar).length;
    const isCadence = endBar >= totalBars - 2 || bar === 0;
    const isClimax = bar >= Math.floor(totalBars * 0.7) && bar <= Math.floor(totalBars * 0.8);

    let textureType: TextureType;
    if (isCadence || isClimax) {
      textureType = 'FULL';
      fullCount.count++;
    } else if (needDuo && !isCadence) {
      textureType = 'DUO';
      duoCount.count++;
    } else if (needSolo && !isCadence) {
      textureType = 'SOLO_PLUS_PUNCTUATION';
      soloCount.count++;
    } else if (needTrio && !isCadence) {
      textureType = 'TRIO';
      trioCount.count++;
    } else if (fullAllowed) {
      textureType = 'FULL';
      fullCount.count++;
    } else {
      textureType = (sectionIdx % 2 === 0) ? 'TRIO' : 'PEDAL_TEXTURE';
      if (textureType === 'TRIO') trioCount.count++;
    }

    let activeInstruments: Set<number>;
    let violaRole: InstrumentRole = 'active';
    let celloRole: InstrumentRole = 'active';
    let violaMotifSection = false;
    let celloCounterline = false;

    if (textureType === 'FULL') {
      activeInstruments = new Set([0, 1, 2, 3]);
    } else if (textureType === 'TRIO') {
      const omit = violaNeedsRest ? 2 : celloNeedsRest ? 3 : (seed + bar) % 4;
      activeInstruments = new Set(INSTRUMENTS.filter(i => i !== omit));
      if (omit === 2) violaRole = 'rest';
      if (omit === 3) celloRole = 'rest';
      if (violaNeedsRest && omit === 2) violaRestSections.push(bar);
      if (celloNeedsRest && omit === 3) celloRestSections.push(bar);
    } else if (textureType === 'DUO') {
      if (violaNeedsRest) {
        activeInstruments = new Set(pickN(2, 2, seed + bar));
        violaRole = 'rest';
        violaRestSections.push(bar);
      } else if (celloNeedsRest) {
        activeInstruments = new Set(pickN(2, 3, seed + bar));
        celloRole = 'rest';
        celloRestSections.push(bar);
      } else {
        activeInstruments = new Set(pickN(2, undefined, seed + bar));
      }
      if (!activeInstruments.has(2)) violaRole = 'rest';
      if (!activeInstruments.has(3)) celloRole = 'rest';
    } else if (textureType === 'SOLO_PLUS_PUNCTUATION') {
      const lead = (seed + bar) % 4;
      activeInstruments = new Set([lead]);
      if (lead === 0) violaRole = 'rest';
      if (lead === 1) violaRole = 'rest';
      if (lead === 2) violaRole = 'active';
      if (lead === 3) celloRole = 'active';
      if (lead !== 2) violaRole = 'punctuation';
      if (lead !== 3) celloRole = 'punctuation';
      if (lead === 2 && violaNeedsMotif) {
        violaMotifSection = true;
        violaMotifSections.push(bar);
      }
    } else {
      const sustain = (seed + bar) % 4;
      activeInstruments = new Set(INSTRUMENTS.filter(i => i !== sustain));
      if (sustain === 2) violaRole = 'sustain';
      if (sustain === 3) celloRole = 'sustain';
      if (sustain === 2 && violaNeedsRest) violaRestSections.push(bar);
      if (sustain === 3 && celloNeedsRest) celloRestSections.push(bar);
    }

    if (violaNeedsMotif && activeInstruments.has(2) && !violaMotifSection) {
      violaMotifSection = true;
      violaMotifSections.push(bar);
    }
    if (celloRole === 'active' && activeInstruments.has(3) && (seed + bar) % 5 === 0) {
      celloCounterline = true;
    }

    sections.push({
      startBar: bar,
      endBar,
      textureType,
      activeInstruments,
      violaRole,
      celloRole,
      violaMotifSection,
      celloCounterline,
    });

    bar += sectionBars;
    sectionIdx++;
  }

  return sections;
}

export function getTextureForBar(sections: TextureSection[], bar: number): TextureSection | null {
  for (const s of sections) {
    if (bar >= s.startBar && bar <= s.endBar) return s;
  }
  return null;
}
