import { useState, useEffect } from 'react';

const INVALID_CHARS = /[<>:"/\\|?*]/g;

function sanitizeFilename(name: string): string {
  return name.replace(INVALID_CHARS, '_').trim() || 'monk_composition';
}

export interface DiagnosticsPayload {
  title?: string;
  filename?: string;
  timestamp: string;
  target: string;
  engineSelections: { barry: boolean; monk: boolean };
  scores: unknown;
  warnings: unknown;
  quartetDiagnostics?: unknown;
  revisionCount?: number;
}

interface ExportPanelProps {
  filename: string;
  exportPath: string;
  onFilenameChange: (v: string) => void;
  onExportPathChange: (v: string) => void;
  onExport: (filename: string, exportPath: string) => Promise<{ success: boolean; path: string }>;
  exportedPath: string | null;
  canExport: boolean;
  electronAPIAvailable?: boolean | null;
  getDiagnosticsPayload?: () => DiagnosticsPayload | null;
}

export function ExportPanel({
  filename,
  exportPath,
  onFilenameChange,
  onExportPathChange,
  onExport,
  exportedPath,
  canExport,
  electronAPIAvailable = null,
  getDiagnosticsPayload,
}: ExportPanelProps) {
  const [filenameError, setFilenameError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingDiagnostics, setIsExportingDiagnostics] = useState(false);

  useEffect(() => {
    const api = typeof window !== 'undefined' ? (window as unknown as { electronAPI?: { getDefaultExportPath?: () => Promise<string> } }).electronAPI : undefined;
    if (!exportPath && api?.getDefaultExportPath) {
      api.getDefaultExportPath()
        .then(p => p && onExportPathChange(p))
        .catch(() => {});
    }
  }, [exportPath, onExportPathChange]);

  const electronAPI = typeof window !== 'undefined' ? (window as unknown as {
    electronAPI?: {
      getDefaultExportPath?: () => Promise<string>;
      showOpenDirectoryDialog?: () => Promise<{ canceled: boolean; path: string }>;
      exportMusicXMLWithDialog?: (a: string, b: string) => Promise<{ success: boolean; path: string }>;
      exportDiagnosticsJSON?: (path: string, base: string, content: string) => Promise<{ success: boolean; path: string; error?: string }>;
      exportDiagnosticsJSONWithDialog?: (base: string, content: string) => Promise<{ success: boolean; path: string; error?: string }>;
      openPath?: (p: string) => Promise<string>;
    };
  }).electronAPI : undefined;

  const handleUseDefault = async () => {
    if (electronAPI?.getDefaultExportPath) {
      try {
        const p = await electronAPI.getDefaultExportPath();
        if (p) onExportPathChange(p);
      } catch {
        setFilenameError('Could not get default folder. Run as desktop app.');
      }
    } else {
      setFilenameError('Run Monk Composer as desktop app for export.');
    }
  };

  const handleBrowse = async () => {
    if (!electronAPI?.showOpenDirectoryDialog) {
      setFilenameError('Run Monk Composer as desktop app for Browse.');
      return;
    }
    try {
      const result = await electronAPI.showOpenDirectoryDialog();
      if (!result.canceled && result.path) {
        onExportPathChange(result.path);
        setFilenameError(null);
      }
    } catch {
      setFilenameError('Could not open folder dialog.');
    }
  };

  const handleExport = async () => {
    const sanitized = sanitizeFilename(filename);
    if (!sanitized) {
      setFilenameError('Please enter a file name before exporting.');
      return;
    }
    setFilenameError(null);

    const useSaveDialog = !!electronAPI?.exportMusicXMLWithDialog;
    let pathToUse = exportPath;
    if (!useSaveDialog) {
      if (!pathToUse && electronAPI?.getDefaultExportPath) {
        try {
          pathToUse = await electronAPI.getDefaultExportPath();
          if (pathToUse) onExportPathChange(pathToUse);
        } catch {
          setFilenameError('Please select an export folder.');
          return;
        }
      }
      if (!pathToUse) {
        setFilenameError('Please click Use Default or Browse to select an export folder.');
        return;
      }
    }

    setIsExporting(true);
    setFilenameError(null);
    try {
      const result = await onExport(sanitized, pathToUse || '');
      if (result.success && result.path && electronAPI?.openPath) {
        const sep = result.path.includes('\\') ? '\\' : '/';
        const dir = result.path.substring(0, result.path.lastIndexOf(sep));
        await electronAPI.openPath(dir);
      } else if (!result.success) {
        setFilenameError((result as { error?: string }).error || 'Export failed. Try a different folder or filename.');
      }
    } catch (err) {
      setFilenameError(err instanceof Error ? err.message : 'Export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDiagnostics = async () => {
    const payload = getDiagnosticsPayload?.();
    if (!payload) {
      setFilenameError('No composition to export diagnostics.');
      return;
    }
    const content = JSON.stringify(payload, null, 2);
    const baseName = sanitizeFilename(filename);
    setFilenameError(null);
    setIsExportingDiagnostics(true);
    try {
      const useDialog = !!electronAPI?.exportDiagnosticsJSONWithDialog;
      let result: { success: boolean; path: string; error?: string };
      if (useDialog) {
        result = await electronAPI!.exportDiagnosticsJSONWithDialog!(baseName, content);
      } else if (exportPath && electronAPI?.exportDiagnosticsJSON) {
        result = await electronAPI.exportDiagnosticsJSON(exportPath, baseName, content);
      } else {
        setFilenameError('Run Monk Composer as desktop app for Export Diagnostics.');
        return;
      }
      if (result.success && result.path && electronAPI?.openPath) {
        const sep = result.path.includes('\\') ? '\\' : '/';
        const dir = result.path.substring(0, result.path.lastIndexOf(sep));
        await electronAPI.openPath(dir);
      } else if (!result.success) {
        setFilenameError(result.error || 'Export diagnostics failed.');
      }
    } catch (err) {
      setFilenameError(err instanceof Error ? err.message : 'Export diagnostics failed.');
    } finally {
      setIsExportingDiagnostics(false);
    }
  };

  return (
    <div className="panel">
      <h3 className="panel-title">Export</h3>
      {electronAPIAvailable === false && (
        <p className="export-warning">
          Export and Browse require the desktop app. Run via <code>npm run electron:dev</code> or the Monk Composer shortcut, not in a browser.
        </p>
      )}
      <div className="control-group">
        <label className="input-label">File Name</label>
        <div className="filename-input-row">
          <input
            type="text"
            value={filename}
            onChange={e => {
              onFilenameChange(e.target.value);
              setFilenameError(null);
            }}
            placeholder="monk_composition"
            className="filename-input"
          />
          <span className="extension-suffix">.musicxml</span>
        </div>
      </div>
      <div className="control-group">
        <label className="input-label">Export Folder</label>
        <div className="browse-row">
          <input
            type="text"
            value={exportPath}
            readOnly
            className="path-input"
            title={exportPath}
            placeholder={electronAPI?.exportMusicXMLWithDialog ? 'Choose location when you click Export' : 'Documents/Monk Composer Exports'}
          />
          <button type="button" onClick={handleUseDefault} className="secondary">
            Use Default
          </button>
          <button type="button" onClick={handleBrowse} className="secondary">
            Browse
          </button>
        </div>
      </div>
      {filenameError && (
        <p className="export-warning">{filenameError}</p>
      )}
      <button
        onClick={handleExport}
        disabled={!canExport || isExporting}
      >
        {isExporting ? 'Exporting…' : 'Export MusicXML'}
      </button>
      <button
        type="button"
        onClick={handleExportDiagnostics}
        disabled={!canExport || isExportingDiagnostics || !getDiagnosticsPayload}
        className="secondary"
        style={{ marginTop: 8 }}
      >
        {isExportingDiagnostics ? 'Exporting…' : 'Export Diagnostics JSON'}
      </button>
      {exportedPath && (
        <div className="export-confirmation">
          <p className="confirmation-title">MusicXML exported to:</p>
          <p className="confirmation-path">{exportedPath}</p>
        </div>
      )}
    </div>
  );
}
