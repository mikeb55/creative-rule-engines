
interface GeneratePanelProps {
  onGenerateDraft: () => void;
  onRaiseGCE: () => void;
  onRegenerateWeakest: () => void;
  onSavePreset: () => void;
  onLoadPreset: () => void;
  isGenerating: boolean;
  canGenerate?: boolean;
  hasComposition?: boolean;
  electronAPIAvailable?: boolean | null;
}

export function GeneratePanel({
  onGenerateDraft,
  onRaiseGCE,
  onRegenerateWeakest,
  onSavePreset,
  onLoadPreset,
  isGenerating,
  canGenerate = true,
  hasComposition = false,
  electronAPIAvailable = null,
}: GeneratePanelProps) {
  const canRaiseGCE = hasComposition && !isGenerating;
  const canPreset = electronAPIAvailable === true && !isGenerating;
  return (
    <div className="panel">
      <h3 className="panel-title">Generate</h3>
      <div className="btn-group">
        <button onClick={onGenerateDraft} disabled={isGenerating || !canGenerate}>
          Generate Draft
        </button>
        <button
          onClick={onRaiseGCE}
          disabled={!canRaiseGCE}
          className="secondary"
          title={!hasComposition ? 'Generate a draft first' : undefined}
        >
          Raise to GCE ≥ 9.0
        </button>
        <button
          onClick={onRegenerateWeakest}
          disabled={!canRaiseGCE}
          className="secondary"
          title={!hasComposition ? 'Generate a draft first' : undefined}
        >
          Regenerate Weakest Section
        </button>
        <button
          onClick={onSavePreset}
          disabled={!canPreset}
          className="secondary"
          title={electronAPIAvailable === false ? 'Run as desktop app' : undefined}
        >
          Save Preset
        </button>
        <button
          onClick={onLoadPreset}
          disabled={!canPreset}
          className="secondary"
          title={electronAPIAvailable === false ? 'Run as desktop app' : undefined}
        >
          Load Preset
        </button>
      </div>
    </div>
  );
}
