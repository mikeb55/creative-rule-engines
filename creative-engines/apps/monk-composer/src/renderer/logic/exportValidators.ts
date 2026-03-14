/**
 * Export Validators — Post-export verification.
 * Reject if chord tags wrong, simultaneity lost, staff count wrong, etc.
 */
export interface ExportValidationResult {
  pass: boolean;
  errors: string[];
}

export function validateExportedMusicXML(
  xml: string,
  options: {
    target?: string;
    expectedPartCount?: number;
    expectedPartNames?: string[];
  } = {}
): ExportValidationResult {
  const errors: string[] = [];

  if (!xml.includes('score-partwise') || !xml.includes('</score-partwise>')) {
    errors.push('Invalid MusicXML structure');
    return { pass: false, errors };
  }

  const partCount = (xml.match(/<part id="P\d+">/g) ?? []).length;
  const expectedParts = options.expectedPartCount ?? (options.target === 'big_band' ? 6 : options.target === 'string_quartet' ? 4 : 1);
  if (partCount !== expectedParts) {
    errors.push(`Expected ${expectedParts} parts, found ${partCount}`);
  }

  if (options.expectedPartNames?.length) {
    for (const name of options.expectedPartNames) {
      if (!xml.includes(`<part-name>${name}</part-name>`)) {
        errors.push(`Missing part: ${name}`);
      }
    }
  }

  const chordTags = (xml.match(/<chord\/>/g) ?? []).length;
  const noteTags = (xml.match(/<note>/g) ?? []).length;
  if (noteTags > 0 && chordTags === 0 && ['guitar', 'piano', 'big_band'].includes(options.target ?? '')) {
    errors.push('Chordal target has no chord tags (possible flattening)');
  }

  return {
    pass: errors.length === 0,
    errors,
  };
}
