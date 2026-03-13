import type { GCEScores, Warnings, Composition, OutputTarget } from '../logic/types';

interface AuditPanelProps {
  scores: GCEScores | null;
  warnings: Warnings | null;
  revisionCount: number;
  composition?: Composition | null;
  instrumentTarget?: OutputTarget;
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  const cls = value >= 9 ? '' : value >= 7 ? 'low' : 'critical';
  return (
    <div style={{ marginBottom: 8 }}>
      <div className="flex-between">
        <span className="muted">{label}</span>
        <span className={value >= 9 ? 'success-text' : ''}>{value.toFixed(1)}</span>
      </div>
      <div className="score-bar">
        <div
          className={`score-bar-fill ${cls}`}
          style={{ width: `${Math.min(100, value * 10)}%` }}
        />
      </div>
    </div>
  );
}

export function AuditPanel({ scores, warnings, revisionCount, composition, instrumentTarget }: AuditPanelProps) {
  const isQuartet = instrumentTarget === 'string_quartet';
  const diag = composition?.quartetDiagnostics;

  return (
    <div className="panel">
      <h3 className="panel-title">Audit</h3>
      {scores ? (
        <>
          <ScoreRow label="Overall GCE" value={scores.overall} />
          <ScoreRow label="Motivic integrity" value={scores.motivicIntegrity} />
          <ScoreRow label="Rhythmic personality" value={scores.rhythmicPersonality} />
          <ScoreRow label="Harmonic coherence" value={scores.harmonicCoherence} />
          <ScoreRow label="Asymmetry" value={scores.asymmetry} />
          <ScoreRow label="Target idiom" value={scores.targetIdiom} />
          <ScoreRow label="Originality" value={scores.originality} />
          <ScoreRow label="Afterglow" value={scores.afterglow} />
          <p className="muted" style={{ marginTop: 12 }}>
            Revisions: {revisionCount}
          </p>
        </>
      ) : (
        <p className="muted">Generate a draft to see scores.</p>
      )}
      {isQuartet && diag && (
        <div style={{ marginTop: 16 }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem' }}>Quartet diagnostics</h4>
          <div className="muted" style={{ fontSize: '0.8rem' }}>
            Texture rotations: {diag.textureRotationCount} · Motif migrations: {diag.motifMigrationCount}
            {(diag.repeatedBarWarnings ?? diag.repeatedCellWarnings ?? 0) > 0 && ` · Repeated bar: ${diag.repeatedBarWarnings ?? diag.repeatedCellWarnings}`}
            {(diag.repeated2BarLoopWarnings ?? 0) > 0 && ` · 2-bar loop: ${diag.repeated2BarLoopWarnings}`}
            {diag.textureReductionCount !== undefined && ` · Texture reduction: ${diag.textureReductionCount}`}
            {diag.bowabilityWarnings > 0 && ` · Bowability: ${diag.bowabilityWarnings}`}
          </div>
          <div style={{ fontSize: '0.8rem', marginTop: 4 }}>
            Viola usefulness: {Math.round((diag.violaUsefulnessScore ?? 0) * 100)}% · 
            Cello independence: {Math.round((diag.celloIndependenceScore ?? 0) * 100)}% · 
            Complementary rhythm: {Math.round((diag.complementaryRhythmScore ?? diag.innerVoiceIndependenceScore ?? 0) * 100)}%
          </div>
          {diag.allVoicesActiveOveruse && <div className="warning-item" style={{ marginTop: 4 }}>All-voices-active overuse</div>}
        </div>
      )}
      {warnings && (
        <div style={{ marginTop: 16 }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem' }}>Warnings</h4>
          {warnings.genericBebop && <div className="warning-item">Generic bebop detected</div>}
          {warnings.unplayableGuitar && <div className="warning-item">Unplayable guitar passage</div>}
          {warnings.poorVoiceLeading && <div className="warning-item">Poor voice leading</div>}
          {warnings.stringWriting && <div className="warning-item">String writing concern</div>}
          {warnings.bigBandStockWriting && <div className="warning-item">Big band stock writing</div>}
          {warnings.weakCadence && <div className="warning-item">Weak cadence</div>}
          {warnings.staticInnerVoice && <div className="warning-item">Static inner voice</div>}
          {warnings.celloLoop && <div className="warning-item">Cello loop syndrome</div>}
          {warnings.violaFiller && <div className="warning-item">Viola filler syndrome</div>}
          {warnings.repeatedAccompanimentCell && <div className="warning-item">Repeated accompaniment cell</div>}
          {warnings.repeatedBarSyndrome && <div className="warning-item">Repeated bar syndrome</div>}
          {warnings.repeated2BarLoopSyndrome && <div className="warning-item">Repeated 2-bar loop syndrome</div>}
          {warnings.noTexturalReduction && <div className="warning-item">No textural reduction</div>}
          {warnings.tooManyAllInstrumentsActive && <div className="warning-item">Too many all-instruments-active passages</div>}
          {warnings.lackComplementaryRhythm && <div className="warning-item">Lack of complementary rhythm</div>}
          {warnings.noTextureRotation && <div className="warning-item">No texture rotation</div>}
          {warnings.noMotivicMigration && <div className="warning-item">No motivic migration</div>}
          {warnings.upperLowerDisconnect && <div className="warning-item">Upper/lower layer disconnect</div>}
          {warnings.nonBowable && <div className="warning-item">Non-bowable line</div>}
          {warnings.fakeKeyboardDoubling && <div className="warning-item">Fake keyboard doubling</div>}
          {!Object.values(warnings).some(Boolean) && (
            <p className="muted" style={{ fontSize: '0.85rem' }}>No warnings</p>
          )}
        </div>
      )}
    </div>
  );
}
