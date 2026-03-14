import { useState, useEffect, useCallback } from 'react';
import { EngineSelector } from './components/EngineSelector';
import { InputPanel } from './components/InputPanel';
import { ControlPanel } from './components/ControlPanel';
import { GeneratePanel } from './components/GeneratePanel';
import { ExportPanel } from './components/ExportPanel';
import { AuditPanel } from './components/AuditPanel';
import { PreviewPanel } from './components/PreviewPanel';
import type {
  EngineChoice,
  OutputTarget,
  CompositionType,
  Composition,
  BarryControls,
  MonkControls,
  GlobalControls,
  GCEScores,
  Warnings,
  Preset,
} from './logic/types';
import { generateDraft } from './logic/generator';
import { evaluateGCE } from './logic/gceEvaluator';
import { runRevisionLoop } from './logic/revisionLoop';
import { compositionToMusicXML, validateMusicXML } from './logic/musicxml';
import { DEFAULT_BARRY, DEFAULT_MONK, DEFAULT_GLOBAL, migratePresetGlobal } from './logic/presets';

function deriveEngine(barry: boolean, monk: boolean): EngineChoice {
  if (barry && monk) return 'barry_monk';
  if (monk) return 'monk';
  return 'barry';
}

export function App() {
  const [barryEnabled, setBarryEnabled] = useState(true);
  const [monkEnabled, setMonkEnabled] = useState(true);
  const [target, setTarget] = useState<OutputTarget>('guitar');
  const [compositionType, setCompositionType] = useState<CompositionType>('head');
  const [barry, setBarry] = useState<BarryControls>(DEFAULT_BARRY);
  const [monk, setMonk] = useState<MonkControls>(DEFAULT_MONK);
  const [global, setGlobal] = useState<GlobalControls>(DEFAULT_GLOBAL);
  const [composition, setComposition] = useState<Composition | null>(null);
  const [scores, setScores] = useState<GCEScores | null>(null);
  const [warnings, setWarnings] = useState<Warnings | null>(null);
  const [revisionCount, setRevisionCount] = useState(0);
  const [exportedPath, setExportedPath] = useState<string | null>(null);
  const [exportFilename, setExportFilename] = useState('monk_composition');
  const [exportPath, setExportPath] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [engines, setEngines] = useState<string[]>([]);
  const [electronAPIAvailable, setElectronAPIAvailable] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const engine = deriveEngine(barryEnabled, monkEnabled);

  const setStatus = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 5000);
  }, []);

  useEffect(() => {
    if (!composition || (!barryEnabled && !monkEnabled)) return;
    const comp = generateDraft(engine, target, barry, monk, global);
    setComposition(comp);
    const { scores: s, warnings: w } = evaluateGCE(comp, target);
    setScores(s);
    setWarnings(w);
  }, [target]); // Regenerate when instrument target changes so composition matches selection

  useEffect(() => {
    const api = (typeof window !== 'undefined' && window.electronAPI) ? window.electronAPI : null;
    if (!api) {
      setElectronAPIAvailable(false);
      setEngines(['barry_harris_engine', 'monk_engine']);
      return;
    }
    const init = () => {
      setElectronAPIAvailable(true);
      api.listEngines?.().then(setEngines).catch(() => setEngines(['barry_harris_engine', 'monk_engine']));
      api.getDefaultExportPath?.().then(p => p && setExportPath(p)).catch(() => {});
    };
    const pingPromise = (api as { ping?: () => Promise<boolean> }).ping?.();
    if (pingPromise) {
      pingPromise.then(init).catch(() => setElectronAPIAvailable(false));
    } else {
      init();
    }
  }, []);

  const DEV = (typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) ?? false;

  const handleGenerateDraft = useCallback(() => {
    if (DEV) console.debug('[Monk Composer] Generate Draft clicked');
    if (!barryEnabled && !monkEnabled) return;
    setIsGenerating(true);
    setStatusMessage(null);
    setTimeout(() => {
      try {
        const comp = generateDraft(engine, target, barry, monk, global);
        setComposition(comp);
        const { scores: s, warnings: w } = evaluateGCE(comp, target);
        setScores(s);
        setWarnings(w);
        setRevisionCount(0);
        setStatus(`Draft generated. GCE: ${s.overall.toFixed(1)}`, 'success');
        if (DEV) {
          console.debug('[Monk Composer] Generate Draft →', { scores: s, warnings: w });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Generate failed';
        setStatus(`Error: ${msg}`, 'error');
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  }, [engine, target, barry, monk, global, barryEnabled, monkEnabled, setStatus, DEV]);

  const handleRaiseGCE = useCallback(() => {
    if (DEV) console.debug('[Monk Composer] Raise GCE clicked');
    if (!composition) {
      setStatus('No composition available. Generate a draft first.', 'error');
      if (DEV) console.debug('[Monk Composer] Raise GCE: no composition');
      return;
    }
    setIsGenerating(true);
    setStatusMessage(null);
    setTimeout(() => {
      try {
        if (DEV) console.debug('[Monk Composer] Raise GCE: running revision loop');
        const result = runRevisionLoop(composition, target, global.gceThreshold, {
          target, barry, monk, global, engine,
        });
        setComposition(result.composition);
        setScores(result.scores);
        const w = evaluateGCE(result.composition, target).warnings;
        setWarnings(w);
        setRevisionCount(result.revisionCount);
        setStatus(`Revision loop complete. ${result.revisionCount} revision(s). GCE: ${result.scores.overall.toFixed(1)}`, 'success');
        if (DEV) {
          console.debug('[Monk Composer] Raise GCE →', { scores: result.scores, revisionCount: result.revisionCount });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Revision failed';
        setStatus(`Error: ${msg}`, 'error');
        if (DEV) console.debug('[Monk Composer] Raise GCE error:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  }, [composition, target, global.gceThreshold, barry, monk, global, engine, DEV, setStatus]);

  const handleRegenerateWeakest = useCallback(() => {
    if (DEV) console.debug('[Monk Composer] Regenerate Weakest clicked');
    if (!composition) {
      setStatus('No composition available. Generate a draft first.', 'error');
      return;
    }
    handleRaiseGCE();
  }, [handleRaiseGCE, composition, setStatus, DEV]);

  const handleExport = useCallback(async (filename: string, exportPath: string) => {
    if (!composition) return { success: false, path: '' };
    const defaultName = filename.trim() || 'monk_composition';
    const sanitized = defaultName.replace(/[<>:"/\\|?*]/g, '_').trim() || 'monk_composition';
    const workTitle = sanitized;
    const threshold = global.gceThreshold;
    let compToExport = composition;
    const chordalTargets = ['guitar', 'piano', 'big_band'];
    if (chordalTargets.includes(target)) {
      compToExport = generateDraft(engine, target, barry, monk, global);
      setComposition(compToExport);
      const { scores: s, warnings: w } = evaluateGCE(compToExport, target);
      setScores(s);
      setWarnings(w);
      setRevisionCount(0);
    } else if (target === 'string_quartet' && (scores == null || scores.overall < threshold)) {
      const revResult = runRevisionLoop(composition, target, threshold, {
        target, barry, monk, global, engine,
      });
      compToExport = revResult.composition;
      setComposition(compToExport);
      setScores(revResult.scores);
      setWarnings(evaluateGCE(compToExport, target).warnings);
      setRevisionCount(revResult.revisionCount);
    }
    const xml = compositionToMusicXML(compToExport, workTitle, {
      keyCenter: global.keyCenter,
      meter: global.meter,
      target,
    });
    if (!validateMusicXML(xml)) return { success: false, path: '' };
    const chordCount = (xml.match(/<chord\/>/g) ?? []).length;
    const eventCount = (xml.match(/<note>/g) ?? []).length;
    if (DEV) {
      console.debug('[Monk Composer] Export GUI:', { target, eventCount, chordCount, path: exportPath || '(dialog)' });
    }
    if (exportPath && exportPath.trim() && window.electronAPI?.exportMusicXML) {
      const result = await window.electronAPI.exportMusicXML(exportPath, sanitized, xml);
      if (result.success) setExportedPath(result.path);
      if (DEV) console.debug('[Monk Composer] Export path-based:', result.path);
      return result;
    }
    if (window.electronAPI?.exportMusicXMLWithDialog) {
      const result = await window.electronAPI.exportMusicXMLWithDialog(sanitized, xml);
      if (result.success) setExportedPath(result.path);
      if (DEV) console.debug('[Monk Composer] Export dialog:', result.path);
      return result;
    }
    return { success: false, path: '' };
  }, [composition, scores, target, global.keyCenter, global.meter, global.gceThreshold, barry, monk, global, engine, DEV]);

  const handleSavePreset = useCallback(async () => {
    if (DEV) console.debug('[Monk Composer] Save Preset clicked');
    const api = window.electronAPI as { savePresetWithDialog?: (a: string, b: string) => Promise<{ success: boolean; path?: string; error?: string }> } | undefined;
    if (!api?.savePresetWithDialog) {
      setStatus('Save Preset requires the desktop app.', 'error');
      if (DEV) console.debug('[Monk Composer] Save Preset: no electronAPI');
      return;
    }
    const preset: Preset = {
      name: 'preset',
      engine,
      target,
      compositionType,
      barry,
      monk,
      global,
      createdAt: new Date().toISOString(),
    };
    const content = JSON.stringify(preset, null, 2);
    const defaultName = `preset_${target}_${new Date().toISOString().slice(0, 10)}`;
    try {
      const result = await api.savePresetWithDialog(defaultName, content);
      if (result.success) {
        setStatus('Preset saved.', 'success');
        if (DEV) console.debug('[Monk Composer] Save Preset success:', result.path);
      } else if (result.error) {
        setStatus(`Error: ${result.error}`, 'error');
      } else {
        setStatus('Save cancelled.', 'info');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setStatus(`Error: ${msg}`, 'error');
      if (DEV) console.debug('[Monk Composer] Save Preset error:', err);
    }
  }, [engine, target, compositionType, barry, monk, global, setStatus, DEV]);

  const handleLoadPreset = useCallback(async () => {
    if (DEV) console.debug('[Monk Composer] Load Preset clicked');
    const api = window.electronAPI as { loadPresetFromFile?: () => Promise<{ success: boolean; content?: string; error?: string }> } | undefined;
    if (!api?.loadPresetFromFile) {
      setStatus('Load Preset requires the desktop app.', 'error');
      if (DEV) console.debug('[Monk Composer] Load Preset: no electronAPI');
      return;
    }
    try {
      const result = await api.loadPresetFromFile();
      if (!result.success) {
        if (result.error) setStatus(`Error: ${result.error}`, 'error');
        else setStatus('Load cancelled.', 'info');
        return;
      }
      if (!result.content) {
        setStatus('Error: Empty file.', 'error');
        return;
      }
      const preset: Preset = JSON.parse(result.content);
      setBarryEnabled(preset.engine === 'barry' || preset.engine === 'barry_monk');
      setMonkEnabled(preset.engine === 'monk' || preset.engine === 'barry_monk');
      setTarget(preset.target);
      setCompositionType(preset.compositionType);
      setBarry(preset.barry ?? DEFAULT_BARRY);
      setMonk(preset.monk ?? DEFAULT_MONK);
      setGlobal(migratePresetGlobal((preset.global ?? {}) as unknown as Record<string, unknown>));
      setStatus('Preset loaded.', 'success');
      if (DEV) console.debug('[Monk Composer] Load Preset success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid preset file';
      setStatus(`Error: ${msg}`, 'error');
      if (DEV) console.debug('[Monk Composer] Load Preset error:', err);
    }
  }, [setStatus, DEV]);

  const engineStack =
    engine === 'barry'
      ? 'Barry Harris'
      : engine === 'monk'
      ? 'Monk'
      : 'Barry Harris + Monk';

  const summary = composition
    ? `Generated ${composition.phrases?.length || 0} phrase(s) using ${engineStack} for ${target}.`
    : '';

  const canExport = composition != null;

  const getDiagnosticsPayload = useCallback(() => {
    if (!composition) return null;
    const baseName = exportFilename.replace(/[<>:"/\\|?*]/g, '_').trim() || 'monk_composition';
    return {
      title: `Monk Composer - ${target}`,
      filename: baseName,
      timestamp: new Date().toISOString(),
      target,
      engineSelections: { barry: barryEnabled, monk: monkEnabled },
      scores,
      warnings,
      quartetDiagnostics: composition?.quartetDiagnostics ?? undefined,
      revisionCount,
    };
  }, [composition, exportFilename, target, barryEnabled, monkEnabled, scores, warnings, revisionCount]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Monk Composer</h1>
        <p>Creative Rule Engines — Barry Harris + Monk composition</p>
        <p className="version-label">v0.4.4 — buttons fixed, status feedback</p>
      </header>

      <div className="grid-2">
        <div>
          <EngineSelector
            barryEnabled={barryEnabled}
            monkEnabled={monkEnabled}
            onBarryChange={setBarryEnabled}
            onMonkChange={setMonkEnabled}
            engines={engines}
          />
          <InputPanel
            keySignature={global.keyCenter}
            tempo={global.tempo}
            meter={global.meter}
            bars={global.bars}
            form={global.form}
            instrumentTarget={target}
            onKeySignatureChange={v => setGlobal(g => ({ ...g, keyCenter: v }))}
            onTempoChange={v => setGlobal(g => ({ ...g, tempo: v }))}
            onMeterChange={v => setGlobal(g => ({ ...g, meter: v }))}
            onBarsChange={v => setGlobal(g => ({ ...g, bars: v }))}
            onFormChange={v => setGlobal(g => ({ ...g, form: v }))}
            onInstrumentTargetChange={setTarget}
          />
        </div>
        <div>
          <AuditPanel
            scores={scores}
            warnings={warnings}
            revisionCount={revisionCount}
            composition={composition}
            instrumentTarget={target}
          />
        </div>
      </div>

      <ControlPanel
        barry={barry}
        monk={monk}
        global={global}
        onBarryChange={setBarry}
        onMonkChange={setMonk}
        onGlobalChange={setGlobal}
        engine={engine}
        instrumentTarget={target}
      />

      <GeneratePanel
        onGenerateDraft={handleGenerateDraft}
        onRaiseGCE={handleRaiseGCE}
        onRegenerateWeakest={handleRegenerateWeakest}
        onSavePreset={handleSavePreset}
        onLoadPreset={handleLoadPreset}
        isGenerating={isGenerating}
        canGenerate={barryEnabled || monkEnabled}
        hasComposition={!!composition}
        electronAPIAvailable={electronAPIAvailable}
      />

      {statusMessage && (
        <div className={`status-message status-${statusMessage.type}`} role="status">
          {statusMessage.text}
        </div>
      )}

      <ExportPanel
        filename={exportFilename}
        exportPath={exportPath}
        onFilenameChange={setExportFilename}
        onExportPathChange={setExportPath}
        onExport={handleExport}
        exportedPath={exportedPath}
        canExport={canExport}
        electronAPIAvailable={electronAPIAvailable}
        getDiagnosticsPayload={getDiagnosticsPayload}
      />

      <PreviewPanel
        composition={composition}
        engineStack={engineStack}
        exportedPath={exportedPath}
        exportTargetPath={exportPath && exportFilename ? `${exportPath}/${(exportFilename.replace(/[<>:"/\\|?*]/g, '_').trim() || 'monk_composition')}.musicxml` : ''}
        revisionCount={revisionCount}
        summary={summary}
        global={global}
      />
    </div>
  );
}
