// Lightweight utilities used across the app.

export function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Simple deep-diff producing added/removed/modified keys for objects.
export type DiffResult = { path: string; type: 'added' | 'removed' | 'modified'; before?: any; after?: any }[];

export function diffObjects(a: any, b: any, path = ''): DiffResult {
  const diffs: DiffResult = [];
  if (a === b) return diffs;
  if (typeof a !== 'object' || a === null) {
    if (a !== b) diffs.push({ path, type: 'modified', before: a, after: b });
    return diffs;
  }
  // keys present in a but not b -> removed
  for (const key of Object.keys(a)) {
    const p = path ? `${path}.${key}` : key;
    if (!(key in b)) {
      diffs.push({ path: p, type: 'removed', before: a[key] });
    } else {
      diffs.push(...diffObjects(a[key], b[key], p));
    }
  }
  // keys present in b but not a -> added
  for (const key of Object.keys(b)) {
    if (!(key in a)) {
      const p = path ? `${path}.${key}` : key;
      diffs.push({ path: p, type: 'added', after: b[key] });
    }
  }
  return diffs;
}
