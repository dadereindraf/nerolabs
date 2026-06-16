'use client'
import React, { useState } from 'react';
import { diffObjects } from '../../../lib/utils';

export default function JSONCompare() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diffs, setDiffs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = () => {
    try {
      const a = JSON.parse(left || '{}');
      const b = JSON.parse(right || '{}');
      const d = diffObjects(a, b);
      setDiffs(d);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Left JSON</label>
          <textarea className="editor mt-2" value={left} onChange={(e) => setLeft(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Right JSON</label>
          <textarea className="editor mt-2" value={right} onChange={(e) => setRight(e.target.value)} />
        </div>
      </div>

      <div>
        <button onClick={handleCompare} className="px-4 py-2 bg-blue-600 text-white rounded">Compare</button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div>
        <h4 className="font-semibold">Differences</h4>
        <div className="mt-2 bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          {diffs.length === 0 ? (
            <div className="text-sm text-gray-500">No differences found.</div>
          ) : (
            <ul className="space-y-2">
              {diffs.map((d, i) => (
                <li key={i} className="text-sm">
                  <strong>{d.path}</strong>: <span className={d.type === 'added' ? 'text-green-600' : d.type === 'removed' ? 'text-red-600' : 'text-yellow-600'}>{d.type}</span>
                  {d.type === 'modified' && (
                    <div className="text-xs text-gray-500">from: {JSON.stringify(d.before)} to: {JSON.stringify(d.after)}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
