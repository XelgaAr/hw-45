/** Browser storage is optional: private mode or quota must not break the UI. */
export function readJson(storage, key, fallback, validate = () => true) {
  try {
    const raw = storage?.getItem(key);
    if (raw === null || raw === undefined) return structuredClone(fallback);
    const parsed = JSON.parse(raw);
    return validate(parsed) ? parsed : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

export function writeJson(storage, key, value) {
  try {
    if (!storage) return false;
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function browserStorage() {
  try { return window.localStorage; } catch { return null; }
}

export function storageKey(app, base) {
  return `${app}:v1:${base}`;
}
