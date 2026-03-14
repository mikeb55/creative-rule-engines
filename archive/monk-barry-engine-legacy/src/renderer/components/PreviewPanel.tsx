import type { Composition, GlobalControls } from '../logic/types';

interface PreviewPanelProps {
  composition: Composition | null;
  engineStack: string;
  exportedPath: string | null;
  exportTargetPath?: string;
  revisionCount: number;
  summary: string;
  global?: GlobalControls;
}

export function PreviewPanel({
  composition,
  engineStack,
  exportedPath,
  exportTargetPath,
  revisionCount,
  summary,
  global,
}: PreviewPanelProps) {
  return (
    <div className="panel">
      <h3 className="panel-title">Output Preview</h3>
      {summary && (
        <p style={{ margin: '0 0 12px', fontSize: '0.9rem' }}>{summary}</p>
      )}
      {global && (
        <div className="control-group">
          <div className="muted" style={{ marginBottom: 4 }}>Form</div>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>{global.form}</p>
        </div>
      )}
      {global && (
        <div className="control-group">
          <div className="muted" style={{ marginBottom: 4 }}>Bars</div>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>{global.bars}</p>
        </div>
      )}
      {global && (
        <div className="control-group">
          <div className="muted" style={{ marginBottom: 4 }}>Key</div>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>{global.keyCenter}</p>
        </div>
      )}
      {global && (
        <div className="control-group">
          <div className="muted" style={{ marginBottom: 4 }}>Tempo</div>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>{global.tempo} BPM</p>
        </div>
      )}
      <div className="control-group">
        <div className="muted" style={{ marginBottom: 4 }}>Phrase map</div>
        <p style={{ margin: 0, fontSize: '0.85rem' }}>
          {composition
            ? `${composition.phrases?.length || 0} phrase(s), ${composition.motif?.length || 0} notes`
            : '—'}
        </p>
      </div>
      <div className="control-group">
        <div className="muted" style={{ marginBottom: 4 }}>Engine stack</div>
        <p style={{ margin: 0, fontSize: '0.85rem' }}>{engineStack || '—'}</p>
      </div>
      <div className="control-group">
        <div className="muted" style={{ marginBottom: 4 }}>Output File</div>
        <p style={{ margin: 0, fontSize: '0.85rem', wordBreak: 'break-all' }}>
          {exportTargetPath || exportedPath || 'Not yet exported'}
        </p>
      </div>
      <div className="control-group">
        <div className="muted" style={{ marginBottom: 4 }}>Revision count</div>
        <p style={{ margin: 0, fontSize: '0.85rem' }}>{revisionCount}</p>
      </div>
    </div>
  );
}
