
interface GeneratePanelProps {
  onGenerateDraft: () => void;
  onRaiseGCE: () => void;
  onRegenerateWeakest: () => void;
  onSavePreset: () => void;
  onLoadPreset: () => void;
  isGenerating: boolean;
  canGenerate?: boolean;
}

export function GeneratePanel({
  onGenerateDraft,
  onRaiseGCE,
  onRegenerateWeakest,
  onSavePreset,
  onLoadPreset,
  isGenerating,
  canGenerate = true,
}: GeneratePanelProps) {
  return (
    <div className="panel">
      <h3 className="panel-title">Generate</h3>
      <div className="btn-group">
        <button onClick={onGenerateDraft} disabled={isGenerating || !canGenerate}>
          Generate Draft
        </button>
        <button onClick={onRaiseGCE} disabled={isGenerating} className="secondary">
          Raise to GCE ≥ 9.0
        </button>
        <button onClick={onRegenerateWeakest} disabled={isGenerating} className="secondary">
          Regenerate Weakest Section
        </button>
        <button onClick={onSavePreset} className="secondary">
          Save Preset
        </button>
        <button onClick={onLoadPreset} className="secondary">
          Load Preset
        </button>
      </div>
    </div>
  );
}
