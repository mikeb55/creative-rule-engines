import { useState, useEffect } from 'react';

const INVALID_CHARS = /[<>:"/\\|?*]/g;

function sanitizeFilename(name: string): string {
  return name.replace(INVALID_CHARS, '_').trim() || 'monk_composition';
}

interface ExportPanelProps {
  filename: string;
  exportPath: string;
  onFilenameChange: (v: string) => void;
  onExportPathChange: (v: string) => void;
  onExport: (filename: string, exportPath: string) => Promise<{ success: boolean; path: string }>;
  exportedPath: string | null;
  canExport: boolean;
}

export function ExportPanel({
  filename,
  exportPath,
  onFilenameChange,
  onExportPathChange,
  onExport,
  exportedPath,
  canExport,
}: ExportPanelProps) {
  const [filenameError, setFilenameError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!exportPath && window.electronAPI?.getDefaultExportPath) {
      window.electronAPI.getDefaultExportPath()
        .then(p => p && onExportPathChange(p))
        .catch(() => {});
    }
  }, [exportPath, onExportPathChange]);

  const handleUseDefault = async () => {
    if (window.electronAPI?.getDefaultExportPath) {
      try {
        const p = await window.electronAPI.getDefaultExportPath();
        if (p) onExportPathChange(p);
      } catch {
        setFilenameError('Could not get default folder.');
      }
    }
  };

  const handleBrowse = async () => {
    if (!window.electronAPI?.showOpenDirectoryDialog) {
      setFilenameError('File dialogs not available. Use default folder.');
      return;
    }
    try {
      const result = await window.electronAPI.showOpenDirectoryDialog();
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
    let pathToUse = exportPath;
    if (!pathToUse && window.electronAPI?.getDefaultExportPath) {
      try {
        pathToUse = await window.electronAPI.getDefaultExportPath();
        if (pathToUse) onExportPathChange(pathToUse);
      } catch {
        setFilenameError('Please select an export folder.');
        return;
      }
    }
    if (!pathToUse) {
      setFilenameError('Please select an export folder or click Use Default.');
      return;
    }
    setIsExporting(true);
    try {
      const result = await onExport(sanitized, pathToUse);
      if (result.success && window.electronAPI?.openPath) {
        const sep = result.path.includes('\\') ? '\\' : '/';
        const dir = result.path.substring(0, result.path.lastIndexOf(sep));
        await window.electronAPI.openPath(dir);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="panel">
      <h3 className="panel-title">Export</h3>
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
            placeholder="Documents/Monk Composer Exports"
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
      {exportedPath && (
        <div className="export-confirmation">
          <p className="confirmation-title">MusicXML exported to:</p>
          <p className="confirmation-path">{exportedPath}</p>
        </div>
      )}
    </div>
  );
}
