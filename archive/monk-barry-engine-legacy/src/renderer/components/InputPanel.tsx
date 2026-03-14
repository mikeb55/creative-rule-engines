import type { OutputTarget, Meter, Form } from '../logic/types';

interface InputPanelProps {
  keySignature: string;
  tempo: number;
  meter: Meter;
  bars: number;
  form: Form;
  instrumentTarget: OutputTarget;
  onKeySignatureChange: (v: string) => void;
  onTempoChange: (v: number) => void;
  onMeterChange: (v: Meter) => void;
  onBarsChange: (v: number) => void;
  onFormChange: (v: Form) => void;
  onInstrumentTargetChange: (v: OutputTarget) => void;
}

const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const METERS: Meter[] = ['4/4', '3/4', '5/4', '7/4', '6/8'];
const FORMS: Form[] = ['Free', 'Blues 12', 'AABA', 'ABAC', 'Through-Composed'];
const INSTRUMENTS: { value: OutputTarget; label: string }[] = [
  { value: 'guitar', label: 'Guitar' },
  { value: 'piano', label: 'Piano Reduction' },
  { value: 'string_quartet', label: 'String Quartet' },
  { value: 'big_band', label: 'Big Band Sketch' },
];

export function InputPanel({
  keySignature,
  tempo,
  meter,
  bars,
  form,
  instrumentTarget,
  onKeySignatureChange,
  onTempoChange,
  onMeterChange,
  onBarsChange,
  onFormChange,
  onInstrumentTargetChange,
}: InputPanelProps) {
  return (
    <div className="panel">
      <h3 className="panel-title">Parameters</h3>
      <div className="input-grid">
        <div className="input-field">
          <label>Key Signature</label>
          <select value={keySignature} onChange={e => onKeySignatureChange(e.target.value)}>
            {KEYS.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
        <div className="input-field">
          <label>Tempo (BPM)</label>
          <input
            type="number"
            min={40}
            max={320}
            value={tempo}
            onChange={e => onTempoChange(Math.min(320, Math.max(40, parseInt(e.target.value) || 120)))}
          />
        </div>
        <div className="input-field">
          <label>Meter</label>
          <select value={meter} onChange={e => onMeterChange(e.target.value as Meter)}>
            {METERS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="input-field">
          <label>Number of Bars</label>
          <input
            type="number"
            min={4}
            max={128}
            value={bars}
            onChange={e => onBarsChange(Math.min(128, Math.max(4, parseInt(e.target.value) || 32)))}
          />
        </div>
        <div className="input-field">
          <label>Form</label>
          <select value={form} onChange={e => onFormChange(e.target.value as Form)}>
            {FORMS.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div className="input-field">
          <label>Instrument Target</label>
          <select value={instrumentTarget} onChange={e => onInstrumentTargetChange(e.target.value as OutputTarget)}>
            {INSTRUMENTS.map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
