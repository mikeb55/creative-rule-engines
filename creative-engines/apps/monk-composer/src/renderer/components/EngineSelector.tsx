
interface EngineSelectorProps {
  barryEnabled: boolean;
  monkEnabled: boolean;
  onBarryChange: (v: boolean) => void;
  onMonkChange: (v: boolean) => void;
  engines: string[];
}

export function EngineSelector({
  barryEnabled,
  monkEnabled,
  onBarryChange,
  onMonkChange,
  engines,
}: EngineSelectorProps) {
  const canGenerate = barryEnabled || monkEnabled;

  return (
    <div className="panel">
      <h3 className="panel-title">Engine Selection</h3>
      <div className="checkbox-group">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={barryEnabled}
            onChange={e => onBarryChange(e.target.checked)}
          />
          <span>Barry Harris Engine</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={monkEnabled}
            onChange={e => onMonkChange(e.target.checked)}
          />
          <span>Monk Engine</span>
        </label>
      </div>
      {!canGenerate && (
        <p className="muted warning-text" style={{ marginTop: 8, fontSize: '0.85rem' }}>
          Select at least one engine.
        </p>
      )}
      {engines.length > 0 && (
        <p className="muted" style={{ marginTop: 8, fontSize: '0.8rem' }}>
          Loaded: {engines.join(', ')}
        </p>
      )}
    </div>
  );
}
