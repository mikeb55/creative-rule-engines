import { useState } from 'react';
import type { GCEScores, Warnings, Composition, OutputTarget } from '../logic/types';
import { runSelfTest } from '../logic/selfTest';
import { validateGuitarIdiomHard, validatePianoIdiomHard } from '../logic/idiomValidators';
import { validateBigBandIdiom } from '../logic/bigBandIdiomRules';
import { averageSimultaneity, maxSimultaneity } from '../logic/musicEvents';

interface AuditPanelProps {
  scores: GCEScores | null;
  warnings: Warnings | null;
  revisionCount: number;
  composition?: Composition | null;
  instrumentTarget?: OutputTarget;
}

function DebugValue({ label, value }: { label: string; value: unknown }) {
  const str = value === undefined ? '—' : JSON.stringify(value);
  return (
    <div style={{ marginBottom: 4, fontSize: '0.7rem' }}>
      <span className="muted" style={{ marginRight: 6 }}>{label}:</span>
      <code style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>{str}</code>
    </div>
  );
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
  const [debugOpen, setDebugOpen] = useState(false);
  const isQuartet = instrumentTarget === 'string_quartet';
  const diag = composition?.quartetDiagnostics;
  const chordalTargets: OutputTarget[] = ['guitar', 'piano', 'big_band'];
  const isChordal = instrumentTarget && chordalTargets.includes(instrumentTarget);
  const selfTestReport = composition && isChordal && scores
    ? runSelfTest(composition, instrumentTarget, revisionCount, false)
    : null;

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
          {selfTestReport && (
            <div style={{ marginTop: 12, padding: 10, background: 'rgba(0,0,0,0.15)', borderRadius: 4, fontSize: '0.8rem' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem' }}>Idiom Status</h4>
              <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Target type</span><span>{instrumentTarget ?? '—'}</span></div>
              {composition?.texture && (
                <>
                  <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Part count</span><span>{composition.texture.length}</span></div>
                  <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Staff count</span><span>{instrumentTarget === 'piano' ? 2 : instrumentTarget === 'big_band' ? 7 : 1}</span></div>
                  <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Voice count</span><span>{composition.texture.length}</span></div>
                  <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Chord-event %</span><span>{(() => {
                    const all = composition.texture.flatMap(t => (t.notes ?? []).filter((n: { rest?: boolean }) => !n.rest));
                    const byOffset = new Map<number, number>();
                    for (const n of all) {
                      const o = Math.round(((n as { offset?: number }).offset ?? 0) * 4) / 4;
                      byOffset.set(o, (byOffset.get(o) ?? 0) + 1);
                    }
                    const chord = [...byOffset.values()].filter(c => c >= 2).length;
                    const total = byOffset.size;
                    return total > 0 ? ((chord / total) * 100).toFixed(1) + '%' : '—';
                  })()}</span></div>
                  <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Avg simultaneity</span><span>{averageSimultaneity(composition.texture).toFixed(2)}</span></div>
                  <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Max simultaneity</span><span>{maxSimultaneity(composition.texture)}</span></div>
                  {instrumentTarget === 'piano' && composition.texture.length === 2 && (
                    <>
                      <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">LH activity ratio</span><span>{(() => {
                        const lh = (composition.texture[1]?.notes ?? []).filter((n: { rest?: boolean }) => !n.rest);
                        const rh = (composition.texture[0]?.notes ?? []).filter((n: { rest?: boolean }) => !n.rest);
                        const lhBeats = new Set(lh.map((n: { offset?: number }) => Math.round((n.offset ?? 0) * 4) / 4)).size;
                        const rhBeats = new Set(rh.map((n: { offset?: number }) => Math.round((n.offset ?? 0) * 4) / 4)).size;
                        const total = lhBeats + rhBeats;
                        return total > 0 ? (lhBeats / total).toFixed(2) : '—';
                      })()}</span></div>
                      <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">RH activity ratio</span><span>{(() => {
                        const lh = (composition.texture[1]?.notes ?? []).filter((n: { rest?: boolean }) => !n.rest);
                        const rh = (composition.texture[0]?.notes ?? []).filter((n: { rest?: boolean }) => !n.rest);
                        const lhBeats = new Set(lh.map((n: { offset?: number }) => Math.round((n.offset ?? 0) * 4) / 4)).size;
                        const rhBeats = new Set(rh.map((n: { offset?: number }) => Math.round((n.offset ?? 0) * 4) / 4)).size;
                        const total = lhBeats + rhBeats;
                        return total > 0 ? (rhBeats / total).toFixed(2) : '—';
                      })()}</span></div>
                    </>
                  )}
                  {instrumentTarget === 'guitar' && (() => {
                    const g = validateGuitarIdiomHard(composition.texture);
                    return (
                      <>
                        <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Guitar grip validity</span><span>{g.gripValidity != null ? (g.gripValidity * 100).toFixed(0) + '%' : '—'}</span></div>
                        <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Fret span (avg/max)</span><span>{g.avgFretSpan != null && g.maxFretSpan != null ? `${g.avgFretSpan.toFixed(1)} / ${g.maxFretSpan}` : '—'}</span></div>
                        <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Validation</span><span className={g.pass ? 'success-text' : ''}>{g.pass ? 'PASS' : (g.reason ?? '—')}</span></div>
                      </>
                    );
                  })()}
                  {instrumentTarget === 'big_band' && composition.texture.length === 6 && (() => {
                    const byOffset = new Map<number, number>();
                    for (const p of composition.texture) {
                      for (const n of p.notes ?? []) {
                        if (n.rest) continue;
                        const o = Math.round((n.offset ?? 0) * 4) / 4;
                        byOffset.set(o, (byOffset.get(o) ?? 0) + 1);
                      }
                    }
                    const sim = Math.max(0, ...byOffset.values());
                    const bb = validateBigBandIdiom(composition.texture);
                    const melodyNotes = (composition.texture[1]?.notes ?? []).filter((n: { rest?: boolean }) => !n.rest).length;
                    const counterNotes = (composition.texture[2]?.notes ?? []).filter((n: { rest?: boolean }) => !n.rest).length;
                    const padNotes = (composition.texture[3]?.notes ?? []).filter((n: { rest?: boolean }) => !n.rest).length;
                    const bassNotes = (composition.texture[5]?.notes ?? []).filter((n: { rest?: boolean }) => !n.rest).length;
                    const bassBeats = new Set((composition.texture[5]?.notes ?? []).filter((n: { rest?: boolean }) => !n.rest).map((n: { offset?: number }) => Math.round((n.offset ?? 0) * 4) / 4)).size;
                    const totalBeats = (composition.phrases?.[0]?.bars ?? 8) * 4;
                    const bassRatio = totalBeats > 0 ? (bassBeats / totalBeats).toFixed(2) : '—';
                    return (
                      <>
                        <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Simultaneous voices</span><span>{sim}</span></div>
                        <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Melody carrier (Alto)</span><span>{melodyNotes} notes</span></div>
                        <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Counterline presence</span><span>{counterNotes >= 4 ? 'Yes' : 'No'}</span></div>
                        <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Pad layer presence</span><span>{padNotes >= 2 ? 'Yes' : 'No'}</span></div>
                        <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Bass activity ratio</span><span>{bassRatio}</span></div>
                        <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Capped</span><span>{scores && scores.overall < 9 ? 'Yes' : 'No'}</span></div>
                      </>
                    );
                  })()}
                </>
              )}
              <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Motif recurrence</span><span>{selfTestReport.motifRecurrenceCount}</span></div>
              <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">GCE score</span><span>{selfTestReport.gce}</span></div>
              <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Target idiom</span><span className={selfTestReport.targetIdiomPass ? 'success-text' : ''}>{selfTestReport.targetIdiomPass ? 'PASS' : 'FAIL'}</span></div>
              <div className="flex-between" style={{ marginBottom: 4 }}><span className="muted">Export verified</span><span>{selfTestReport.exportVerified ? 'Yes' : '—'}</span></div>
              {selfTestReport.latestFailingTest && <div className="muted" style={{ marginTop: 4 }}>Failing: {selfTestReport.latestFailingTest}</div>}
            </div>
          )}
        </>
      ) : (
        <p className="muted">Generate a draft to see scores.</p>
      )}
      {isQuartet && diag && (
        <div style={{ marginTop: 16 }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem' }}>Quartet metrics</h4>
          <div className="muted" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
            <div><strong>Active duration</strong> Vn1/Vn2/Vla/Vc: {diag.activeDurationByInstrument?.map(d => d?.toFixed(1) ?? '-').join(' / ')}</div>
            <div><strong>Attack density</strong> (per bar): {diag.attackDensityByInstrument?.map(d => d?.toFixed(2) ?? '-').join(' / ')}</div>
            <div><strong>Rest ratio</strong>: {diag.restRatioByInstrument?.map(r => `${(r ?? 0) * 100}%`).join(' / ')}</div>
            <div><strong>Role entropy</strong>: {diag.roleEntropyByInstrument?.map(e => (e ?? 0).toFixed(2)).join(' / ')}</div>
            <div><strong>Motif participation</strong> (bars): {diag.motifParticipationByInstrument?.join(' / ')}</div>
            <div><strong>Simultaneous-motion</strong>: {((diag.simultaneousMotionRatio ?? 0) * 100).toFixed(1)}%</div>
            <div><strong>Texture reduction</strong>: {diag.textureReductionCount ?? 0} · <strong>Exposed duo/trio</strong>: {diag.exposedDuoTrioBars ?? 0} bars</div>
          </div>
          <div style={{ fontSize: '0.8rem', marginTop: 6 }}>
            Texture rotations: {diag.textureRotationCount} · Motif migrations: {diag.motifMigrationCount}
            {(diag.repeatedBarWarnings ?? diag.repeatedCellWarnings ?? 0) > 0 && ` · Repeated bar: ${diag.repeatedBarWarnings ?? diag.repeatedCellWarnings}`}
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
          {warnings.lowViolaAttackDensity && <div className="warning-item">Low viola attack density</div>}
          {warnings.lowViolaMotifParticipation && <div className="warning-item">Low viola motif participation</div>}
          {warnings.lowViolaRoleEntropy && <div className="warning-item">Low viola role entropy</div>}
          {warnings.celloAlwaysOn && <div className="warning-item">Cello always-on texture</div>}
          {warnings.celloZeroRest && <div className="warning-item">Cello zero-rest syndrome</div>}
          {warnings.excessiveSimultaneousMotion && <div className="warning-item">Excessive simultaneous motion</div>}
          {warnings.insufficientTexturalReduction && <div className="warning-item">Insufficient textural reduction</div>}
          {warnings.fewExposedDuoTrio && <div className="warning-item">Few exposed duo/trio textures</div>}
          {warnings.highSustainedFiller && <div className="warning-item">High sustained filler without function</div>}
          {warnings.violaZeroRest && <div className="warning-item">Viola zero-rest (no rests in inner voice)</div>}
          {warnings.continuous4VoiceMotion && <div className="warning-item">Continuous 4-voice motion</div>}
          {warnings.nonBowable && <div className="warning-item">Non-bowable line</div>}
          {warnings.fakeKeyboardDoubling && <div className="warning-item">Fake keyboard doubling</div>}
          {!Object.values(warnings).some(Boolean) && (
            <p className="muted" style={{ fontSize: '0.85rem' }}>No warnings</p>
          )}
        </div>
      )}
      <div style={{ marginTop: 16, borderTop: '1px solid var(--panel-border, #333)' }}>
        <button
          type="button"
          onClick={() => setDebugOpen(o => !o)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted, #888)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            padding: '8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {debugOpen ? '▼' : '▶'} Debug Diagnostics
        </button>
        {debugOpen && (
          <div
            style={{
              marginTop: 8,
              padding: 10,
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 4,
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              maxHeight: 320,
              overflow: 'auto',
            }}
          >
            {scores && (
              <>
                <strong style={{ display: 'block', marginBottom: 6 }}>GCEScores</strong>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(scores, null, 2)}
                </pre>
              </>
            )}
            {warnings && (
              <>
                <strong style={{ display: 'block', margin: '10px 0 6px' }}>Warnings</strong>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(warnings, null, 2)}
                </pre>
              </>
            )}
            {isQuartet && diag && (
              <>
                <strong style={{ display: 'block', margin: '10px 0 6px' }}>Quartet diagnostics</strong>
                <DebugValue label="violaVln2Ratio" value={diag.violaVln2Ratio} />
                <DebugValue label="celloVln1Ratio" value={diag.celloVln1Ratio} />
                <DebugValue label="activeDurationByInstrument" value={diag.activeDurationByInstrument} />
                <DebugValue label="attackDensityByInstrument" value={diag.attackDensityByInstrument} />
                <DebugValue label="restRatioByInstrument" value={diag.restRatioByInstrument} />
                <DebugValue label="roleEntropyByInstrument" value={diag.roleEntropyByInstrument} />
                <DebugValue label="motifParticipationByInstrument" value={diag.motifParticipationByInstrument} />
                <DebugValue label="simultaneousMotionRatio" value={diag.simultaneousMotionRatio} />
                <DebugValue label="exposedDuoTrioBars" value={diag.exposedDuoTrioBars} />
                <DebugValue label="textureRotationCount" value={diag.textureRotationCount} />
                <DebugValue label="motifMigrationCount" value={diag.motifMigrationCount} />
                <DebugValue label="repeatedBarWarnings" value={diag.repeatedBarWarnings} />
                <DebugValue label="densityViolations" value={diag.densityViolations} />
                <DebugValue label="counterpointEventCount" value={diag.counterpointEventCount} />
                <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(diag, null, 2)}
                </pre>
              </>
            )}
            {(!scores && !warnings && (!isQuartet || !diag)) && (
              <p className="muted">Generate a draft to see diagnostic data.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
