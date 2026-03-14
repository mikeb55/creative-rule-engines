import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    api: {
      generate: (e: string, i: string, b: number) => Promise<{
        success: boolean; valid?: boolean; path?: string; xml?: string; filename?: string; error?: string;
      }>;
      exportMusicXML: (f: string, c: string) => Promise<{ success: boolean; path?: string }>;
      openOutputFolder: () => Promise<string>;
      getExportsPath: () => Promise<string>;
      getVersion: () => Promise<string>;
    };
  }
}

export default function App() {
  const [engine, setEngine] = useState<'barry' | 'monk'>('barry');
  const [instrument, setInstrument] = useState<'guitar' | 'piano'>('guitar');
  const [bars, setBars] = useState(8);
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [lastResult, setLastResult] = useState<{
    xml: string; filename: string; path: string; valid: boolean;
  } | null>(null);
  const [exportsPath, setExportsPath] = useState('');
  const [version, setVersion] = useState('');

  useEffect(() => {
    window.api.getExportsPath().then(setExportsPath);
    window.api.getVersion().then(setVersion);
  }, []);

  async function handleGenerate() {
    setStatus('generating');
    setLastResult(null);
    try {
      const r = await window.api.generate(engine, instrument, bars);
      if (r.valid && r.xml && r.filename && r.path) {
        setLastResult({ xml: r.xml, filename: r.filename, path: r.path, valid: true });
        setStatus('ready');
      } else {
        setLastResult(null);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  async function handleExport() {
    if (!lastResult?.xml) return;
    const res = await window.api.exportMusicXML(lastResult.filename, lastResult.xml);
    if (res.success && res.path) {
      setLastResult(prev => prev ? { ...prev, path: res.path! } : null);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Segoe UI, system-ui', fontSize: 14 }}>
      <h1 style={{ margin: '0 0 4px 0', fontSize: 18 }}>Monk Barry Composer {version}</h1>
      <div style={{ color: '#666', marginBottom: 16 }}>{exportsPath}</div>

      <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Engine</label>
          <select
            value={engine}
            onChange={e => setEngine(e.target.value as 'barry' | 'monk')}
            style={{ padding: 6, minWidth: 160 }}
          >
            <option value="barry">Barry Harris</option>
            <option value="monk">Monk</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Instrument</label>
          <select
            value={instrument}
            onChange={e => setInstrument(e.target.value as 'guitar' | 'piano')}
            style={{ padding: 6, minWidth: 160 }}
          >
            <option value="guitar">Guitar</option>
            <option value="piano">Piano</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Length</label>
          <select
            value={bars}
            onChange={e => setBars(Number(e.target.value))}
            style={{ padding: 6, minWidth: 160 }}
          >
            <option value={8}>8 bars</option>
            <option value={16}>16 bars</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          onClick={handleGenerate}
          disabled={status === 'generating'}
          style={{ padding: '8px 16px', cursor: status === 'generating' ? 'wait' : 'pointer' }}
        >
          {status === 'generating' ? 'Generating…' : 'Generate'}
        </button>
        <button
          onClick={handleExport}
          disabled={!lastResult?.xml}
          style={{ padding: '8px 16px', cursor: lastResult?.xml ? 'pointer' : 'not-allowed' }}
        >
          Export MusicXML
        </button>
        <button onClick={() => window.api.openOutputFolder()} style={{ padding: '8px 16px' }}>
          Open Output Folder
        </button>
      </div>

      <div
        style={{
          padding: 12,
          background: '#f5f5f5',
          borderRadius: 4,
          fontFamily: 'Consolas, monospace',
          fontSize: 12,
        }}
      >
        <div><strong>Engine:</strong> {engine === 'barry' ? 'Barry Harris' : 'Monk'}</div>
        <div><strong>Instrument:</strong> {instrument}</div>
        <div><strong>Generation:</strong> {status === 'generating' ? '…' : status === 'ready' ? 'OK' : status === 'error' ? 'FAILED' : '—'}</div>
        <div><strong>Validation:</strong> {lastResult?.valid ? 'PASS' : lastResult ? 'FAIL' : '—'}</div>
        <div><strong>Output:</strong> {lastResult?.filename ?? '—'}</div>
      </div>
    </div>
  );
}
