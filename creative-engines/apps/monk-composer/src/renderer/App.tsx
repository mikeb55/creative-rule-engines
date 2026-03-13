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

  const engine = deriveEngine(barryEnabled, monkEnabled);

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

  const handleGenerateDraft = useCallback(() => {
    if (!barryEnabled && !monkEnabled) return;
    setIsGenerating(true);
    setTimeout(() => {
      const comp = generateDraft(engine, target, barry, monk, global);
      setComposition(comp);
      const { scores: s, warnings: w } = evaluateGCE(comp, target);
      setScores(s);
      setWarnings(w);
      setRevisionCount(0);
      setIsGenerating(false);
    }, 100);
  }, [engine, target, barry, monk, global, barryEnabled, monkEnabled]);

  const handleRaiseGCE = useCallback(() => {
    if (!composition) return;
    setIsGenerating(true);
    setTimeout(() => {
      const result = runRevisionLoop(composition, target, global.gceThreshold, {
        target, barry, monk, global, engine,
      });
      setComposition(result.composition);
      setScores(result.scores);
      setWarnings(evaluateGCE(result.composition, target).warnings);
      setRevisionCount(result.revisionCount);
      setIsGenerating(false);
    }, 100);
  }, [composition, target, global.gceThreshold, barry, monk, global, engine]);

  const handleRegenerateWeakest = useCallback(() => {
    handleRaiseGCE();
  }, [handleRaiseGCE]);

  const handleExport = useCallback(async (filename: string, path: string) => {
    if (!composition) return { success: false, path: '' };
    const threshold = global.gceThreshold;
    let compToExport = composition;
    if (target === 'string_quartet' && (scores == null || scores.overall < threshold)) {
      const revResult = runRevisionLoop(composition, target, threshold, {
        target, barry, monk, global, engine,
      });
      compToExport = revResult.composition;
      setComposition(compToExport);
      setScores(revResult.scores);
      setWarnings(evaluateGCE(compToExport, target).warnings);
      setRevisionCount(revResult.revisionCount);
    }
    const xml = compositionToMusicXML(compToExport, `Monk Composer - ${target}`, {
      keyCenter: global.keyCenter,
      meter: global.meter,
      target,
    });
    if (!validateMusicXML(xml)) return { success: false, path: '' };
    const defaultName = filename.trim() || 'monk_composition';
    const sanitized = defaultName.replace(/[<>:"/\\|?*]/g, '_').trim() || 'monk_composition';
    if (window.electronAPI?.exportMusicXMLWithDialog) {
      const result = await window.electronAPI.exportMusicXMLWithDialog(sanitized, xml);
      if (result.success) setExportedPath(result.path);
      return result;
    }
    if (window.electronAPI?.exportMusicXML && path) {
      const result = await window.electronAPI.exportMusicXML(path, sanitized, xml);
      if (result.success) setExportedPath(result.path);
      return result;
    }
    return { success: false, path: '' };
  }, [composition, scores, target, global.keyCenter, global.meter, global.gceThreshold, barry, monk, global, engine]);

  const handleSavePreset = useCallback(async () => {
    const name = prompt('Preset name:');
    if (!name || !window.electronAPI) return;
    const preset: Preset = {
      name,
      engine,
      target,
      compositionType,
      barry,
      monk,
      global,
      createdAt: new Date().toISOString(),
    };
    await window.electronAPI.savePreset(name, JSON.stringify(preset, null, 2));
  }, [engine, target, compositionType, barry, monk, global]);

  const handleLoadPreset = useCallback(async () => {
    if (!window.electronAPI) return;
    const list = await window.electronAPI.listPresets();
    const name = prompt(`Preset name (available: ${list.join(', ') || 'none'}):`);
    if (!name) return;
    const json = await window.electronAPI.loadPreset(name);
    if (!json) return;
    try {
      const preset: Preset = JSON.parse(json);
      setBarryEnabled(preset.engine === 'barry' || preset.engine === 'barry_monk');
      setMonkEnabled(preset.engine === 'monk' || preset.engine === 'barry_monk');
      setTarget(preset.target);
      setCompositionType(preset.compositionType);
      setBarry(preset.barry ?? DEFAULT_BARRY);
      setMonk(preset.monk ?? DEFAULT_MONK);
      setGlobal(migratePresetGlobal((preset.global ?? {}) as unknown as Record<string, unknown>));
    } catch {
      alert('Invalid preset');
    }
  }, []);

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Monk Composer</h1>
        <p>Creative Rule Engines — Barry Harris + Monk composition</p>
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
      />

      <ExportPanel
        filename={exportFilename}
        exportPath={exportPath}
        onFilenameChange={setExportFilename}
        onExportPathChange={setExportPath}
        onExport={handleExport}
        exportedPath={exportedPath}
        canExport={canExport}
        electronAPIAvailable={electronAPIAvailable}
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
