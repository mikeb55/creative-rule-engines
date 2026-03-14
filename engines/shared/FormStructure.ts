/**
 * FormStructure — Large-scale form output.
 * Phrase lengths, sections, cadence points, density curves.
 */
export interface FormSection {
  id: string;
  label: string;
  startMeasure: number;
  endMeasure: number;
  phraseLengths: number[];
  cadenceMeasure?: number;
}

export interface FormStructure {
  totalBars: number;
  sections: FormSection[];
  /** Density curve: 0–1 per measure or phrase */
  densityCurve?: number[];
}
