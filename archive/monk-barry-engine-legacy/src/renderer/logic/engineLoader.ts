export interface EngineSpec {
  id: string;
  name: string;
  description: string;
}

export async function loadEngineSpec(name: string): Promise<string> {
  if (typeof window !== 'undefined' && window.electronAPI) {
    return window.electronAPI.readEngine(name);
  }
  return '';
}

export async function listEngines(): Promise<string[]> {
  if (typeof window !== 'undefined' && window.electronAPI) {
    return window.electronAPI.listEngines();
  }
  return ['barry_harris_engine', 'monk_engine'];
}
