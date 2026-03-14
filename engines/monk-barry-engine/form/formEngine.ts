/**
 * Form Engine — Phrase length, sections, cadence points, density curves.
 * Output: FormStructure
 */
import type { FormStructure, FormSection } from '../../shared/FormStructure';

export interface FormOptions {
  bars: number;
  phraseLengths?: number[];
  cadenceEvery?: number;
}

export function generateForm(options: FormOptions): FormStructure {
  const { bars, phraseLengths = [4, 4], cadenceEvery = 8 } = options;
  const sections: FormSection[] = [];
  const densityCurve: number[] = [];

  let measure = 0;
  let sectionId = 0;
  while (measure < bars) {
    const phraseLen = phraseLengths[sectionId % phraseLengths.length];
    const endMeasure = Math.min(measure + phraseLen, bars);
    const cadenceMeasure = cadenceEvery > 0 && (measure + phraseLen) % cadenceEvery === 0
      ? endMeasure - 1
      : undefined;

    sections.push({
      id: `section_${sectionId}`,
      label: `Phrase ${sectionId + 1}`,
      startMeasure: measure,
      endMeasure: endMeasure,
      phraseLengths: [phraseLen],
      cadenceMeasure,
    });

    for (let m = measure; m < endMeasure; m++) {
      const t = (m - measure) / (endMeasure - measure || 1);
      densityCurve[m] = 0.3 + 0.5 * Math.sin(t * Math.PI);
    }

    measure = endMeasure;
    sectionId++;
  }

  return {
    totalBars: bars,
    sections,
    densityCurve,
  };
}
