import type { BarryControls, MonkControls, GlobalControls, OutputTarget, QuartetDensityStrategy } from '../logic/types';

interface ControlPanelProps {
  barry: BarryControls;
  monk: MonkControls;
  global: GlobalControls;
  onBarryChange: (b: BarryControls) => void;
  onMonkChange: (m: MonkControls) => void;
  onGlobalChange: (g: GlobalControls) => void;
  engine: string;
  instrumentTarget?: OutputTarget;
}

const QUARTET_DENSITIES: { value: QuartetDensityStrategy; label: string }[] = [
  { value: 'sparse_chamber', label: 'Sparse chamber' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'polyphonic', label: 'Polyphonic' },
  { value: 'tense_frictional', label: 'Tense / frictional' },
];

function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.05,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="slider-row">
      <label>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
      <span className="slider-value">{value.toFixed(2)}</span>
    </div>
  );
}

export function ControlPanel({
  barry,
  monk,
  global,
  onBarryChange,
  onMonkChange,
  onGlobalChange,
  engine,
  instrumentTarget,
}: ControlPanelProps) {
  return (
    <div className="panel">
      <h3 className="panel-title">Controls</h3>

      {(engine === 'barry' || engine === 'barry_monk') && (
        <div className="control-group">
          <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem' }}>Barry Harris</h4>
          <Slider label="Bebop density" value={barry.bebopDensity} onChange={v => onBarryChange({ ...barry, bebopDensity: v })} />
          <Slider label="Guide-tone strength" value={barry.guideToneStrength} onChange={v => onBarryChange({ ...barry, guideToneStrength: v })} />
          <Slider label="Diminished passing" value={barry.diminishedPassingIntensity} onChange={v => onBarryChange({ ...barry, diminishedPassingIntensity: v })} />
          <Slider label="Cadence strength" value={barry.cadenceStrength} onChange={v => onBarryChange({ ...barry, cadenceStrength: v })} />
          <Slider label="Enclosure usage" value={barry.enclosureUsage} onChange={v => onBarryChange({ ...barry, enclosureUsage: v })} />
          <Slider label="Harmonic strictness" value={barry.harmonicStrictness} onChange={v => onBarryChange({ ...barry, harmonicStrictness: v })} />
        </div>
      )}

      {(engine === 'monk' || engine === 'barry_monk') && (
        <div className="control-group" style={{ marginTop: 16 }}>
          <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem' }}>Monk</h4>
          <Slider label="Angularity" value={monk.angularity} onChange={v => onMonkChange({ ...monk, angularity: v })} />
          <Slider label="Rhythmic lurch" value={monk.rhythmicLurch} onChange={v => onMonkChange({ ...monk, rhythmicLurch: v })} />
          <Slider label="Silence density" value={monk.silenceDensity} onChange={v => onMonkChange({ ...monk, silenceDensity: v })} />
          <Slider label="Shell ambiguity" value={monk.shellVoicingAmbiguity} onChange={v => onMonkChange({ ...monk, shellVoicingAmbiguity: v })} />
          <Slider label="Pedal friction" value={monk.pedalFriction} onChange={v => onMonkChange({ ...monk, pedalFriction: v })} />
          <Slider label="Asymmetry" value={monk.asymmetryPreservation} onChange={v => onMonkChange({ ...monk, asymmetryPreservation: v })} />
          <Slider label="Wrong-right intensity" value={monk.wrongRightIntensity} onChange={v => onMonkChange({ ...monk, wrongRightIntensity: v })} />
        </div>
      )}

      <div className="control-group" style={{ marginTop: 16 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem' }}>Global</h4>
        <div className="slider-row">
          <label style={{ minWidth: 140 }}>Tempo</label>
          <input
            type="number"
            value={global.tempo}
            onChange={e => onGlobalChange({ ...global, tempo: parseInt(e.target.value) || 120 })}
            min={60}
            max={240}
            style={{ width: 80 }}
          />
        </div>
        <div className="slider-row">
          <label style={{ minWidth: 140 }}>Key center</label>
          <select
            value={global.keyCenter}
            onChange={e => onGlobalChange({ ...global, keyCenter: e.target.value })}
            style={{ width: 100 }}
          >
            {['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'].map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
        <Slider label="Bars" value={global.bars} onChange={v => onGlobalChange({ ...global, bars: v })} min={4} max={128} step={2} />
        <Slider label="GCE threshold" value={global.gceThreshold} onChange={v => onGlobalChange({ ...global, gceThreshold: Math.max(9, v) })} min={9} max={10} step={0.1} />
        <Slider label="Target difficulty" value={global.targetDifficulty} onChange={v => onGlobalChange({ ...global, targetDifficulty: v })} />
        <Slider label="Playability strictness" value={global.playabilityStrictness} onChange={v => onGlobalChange({ ...global, playabilityStrictness: v })} />
        {instrumentTarget === 'string_quartet' && (
          <div className="slider-row" style={{ marginTop: 8 }}>
            <label style={{ minWidth: 140 }}>Quartet density</label>
            <select
              value={global.quartetDensity ?? 'conversational'}
              onChange={e => onGlobalChange({ ...global, quartetDensity: e.target.value as QuartetDensityStrategy })}
              style={{ width: 160 }}
            >
              {QUARTET_DENSITIES.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
