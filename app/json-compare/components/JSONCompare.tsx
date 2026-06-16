'use client'
import React, { useState } from 'react';
import { diffObjects } from '../../../lib/utils';

type Diff = {
  path: string;
  type: 'added' | 'removed' | 'modified';
  before?: any;
  after?: any;
};

// ── Structured View helpers ──────────────────────────────────────────────────

function PathDisplay({ path }: { path: string }) {
  const parts = path.split('.');
  return (
    <span className="font-mono text-sm">
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <span className="text-gray-400 mx-1">›</span>}
          <span className="font-semibold text-gray-800 dark:text-gray-100">{p}</span>
        </span>
      ))}
    </span>
  );
}

function DiffItem({ d }: { d: Diff }) {
  const [open, setOpen] = useState(false);
  const colorMap = { added: 'text-green-500', removed: 'text-red-500', modified: 'text-yellow-500' };
  const bgMap = {
    added: 'border-l-4 border-green-500 bg-green-50 dark:bg-green-900/10',
    removed: 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10',
    modified: 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
  };
  const labelMap = { added: '+ added', removed: '− removed', modified: '~ modified' };

  return (
    <div className={`px-3 py-2 rounded-r ${bgMap[d.type]}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <PathDisplay path={d.path} />
          <span className={`text-xs font-medium ${colorMap[d.type]}`}>{labelMap[d.type]}</span>
        </div>
        {d.type === 'modified' && (
          <button onClick={() => setOpen(o => !o)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0">
            {open ? 'hide ▲' : 'show ▼'}
          </button>
        )}
      </div>
      {d.type === 'modified' && !open && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
          <span className="text-red-400">{JSON.stringify(d.before)}</span>
          <span className="mx-2 text-gray-400">→</span>
          <span className="text-green-400">{JSON.stringify(d.after)}</span>
        </div>
      )}
      {d.type === 'modified' && open && (
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-red-100 dark:bg-red-900/20 rounded p-2">
            <div className="text-red-400 mb-1 font-semibold">Before</div>
            <pre className="whitespace-pre-wrap break-all text-red-600 dark:text-red-300">{JSON.stringify(d.before, null, 2)}</pre>
          </div>
          <div className="bg-green-100 dark:bg-green-900/20 rounded p-2">
            <div className="text-green-500 mb-1 font-semibold">After</div>
            <pre className="whitespace-pre-wrap break-all text-green-600 dark:text-green-300">{JSON.stringify(d.after, null, 2)}</pre>
          </div>
        </div>
      )}
      {d.type === 'added' && (
        <div className="mt-1 text-xs font-mono text-green-500">{JSON.stringify(d.after)}</div>
      )}
      {d.type === 'removed' && (
        <div className="mt-1 text-xs font-mono text-red-400 line-through">{JSON.stringify(d.before)}</div>
      )}
    </div>
  );
}

function DiffSection({ title, items, color }: { title: string; items: Diff[]; color: string }) {
  const [open, setOpen] = useState(true);
  if (items.length === 0) return null;
  return (
    <div>
      <button onClick={() => setOpen(o => !o)} className={`flex items-center gap-2 text-sm font-semibold ${color} mb-2 hover:opacity-80`}>
        <span>{open ? '▼' : '▶'}</span>
        <span>{title}</span>
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-mono">{items.length}</span>
      </button>
      {open && <div className="space-y-2 mb-4">{items.map((d, i) => <DiffItem key={i} d={d} />)}</div>}
    </div>
  );
}

// ── Git-style Diff View ──────────────────────────────────────────────────────

type LineDiff = { type: 'same' | 'added' | 'removed'; text: string };

function computeLineDiff(left: string, right: string): LineDiff[] {
  const L = left.split('\n');
  const R = right.split('\n');

  // Simple LCS-based line diff
  const m = L.length, n = R.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = L[i] === R[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  const result: LineDiff[] = [];
  let i = 0, j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && L[i] === R[j]) {
      result.push({ type: 'same', text: L[i] });
      i++; j++;
    } else if (j < n && (i >= m || dp[i + 1]?.[j] <= dp[i]?.[j + 1])) {
      result.push({ type: 'added', text: R[j] });
      j++;
    } else {
      result.push({ type: 'removed', text: L[i] });
      i++;
    }
  }
  return result;
}

function GitDiffView({ left, right }: { left: string; right: string }) {
  let leftFmt = left, rightFmt = right;
  try { leftFmt = JSON.stringify(JSON.parse(left), null, 2); } catch {/* ignore error */}
  try { rightFmt = JSON.stringify(JSON.parse(right), null, 2); } catch {/* ignore error */}

  const lines = computeLineDiff(leftFmt, rightFmt);

  let leftLine = 0, rightLine = 0;

  return (
    <div className="rounded border border-gray-200 dark:border-gray-700 overflow-auto max-h-[520px] text-xs font-mono bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="grid grid-cols-[40px_1fr] bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 py-1 text-gray-500 text-xs sticky top-0">
        <span>#</span>
        <span>diff</span>
      </div>

      {lines.map((line, i) => {
        if (line.type === 'removed') leftLine++;
        else if (line.type === 'added') rightLine++;
        else { leftLine++; rightLine++; }

        const lineNum = line.type === 'removed' ? leftLine
          : line.type === 'added' ? rightLine
          : leftLine;

        const bg = line.type === 'added'
          ? 'bg-green-50 dark:bg-green-900/20'
          : line.type === 'removed'
          ? 'bg-red-50 dark:bg-red-900/20'
          : '';

        const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' ';
        const textColor = line.type === 'added'
          ? 'text-green-700 dark:text-green-300'
          : line.type === 'removed'
          ? 'text-red-600 dark:text-red-300'
          : 'text-gray-700 dark:text-gray-300';

        const prefixColor = line.type === 'added'
          ? 'text-green-500'
          : line.type === 'removed'
          ? 'text-red-500'
          : 'text-gray-400';

        return (
          <div key={i} className={`grid grid-cols-[28px_16px_1fr] items-start ${bg}`}>
            <span className="text-gray-400 text-right pr-2 py-0.5 select-none border-r border-gray-200 dark:border-gray-700">
              {lineNum}
            </span>
            <span className={`text-center py-0.5 select-none font-bold ${prefixColor}`}>{prefix}</span>
            <span className={`py-0.5 px-2 whitespace-pre ${textColor}`}>{line.text}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function JSONCompare() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diffs, setDiffs] = useState<Diff[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [compared, setCompared] = useState(false);
  const [view, setView] = useState<'structured' | 'diff'>('structured');

  const handleCompare = () => {
    try {
      const a = JSON.parse(left || '{}');
      const b = JSON.parse(right || '{}');
      setDiffs(diffObjects(a, b));
      setError(null);
      setCompared(true);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON');
      setCompared(false);
    }
  };

  const added = diffs.filter(d => d.type === 'added');
  const removed = diffs.filter(d => d.type === 'removed');
  const modified = diffs.filter(d => d.type === 'modified');

  return (
    <div className="space-y-4">
      {/* Editors */}
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

      <button onClick={handleCompare} className="px-4 py-2 bg-blue-600 text-white rounded">
        Compare
      </button>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {compared && (
        <div>
          {/* Summary badges */}
          {diffs.length > 0 ? (
            <div className="flex gap-3 mb-4 flex-wrap items-center">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">+ {added.length} added</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">− {removed.length} removed</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">~ {modified.length} modified</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
              <span>✓</span><span>Both JSON documents are identical.</span>
            </div>
          )}

          {/* View toggle */}
          {diffs.length > 0 && (
            <div className="flex rounded overflow-hidden border border-gray-300 dark:border-gray-600 text-sm w-fit mb-4">
              <button
                onClick={() => setView('structured')}
                className={`px-4 py-1.5 ${view === 'structured' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Structured
              </button>
              <button
                onClick={() => setView('diff')}
                className={`px-4 py-1.5 ${view === 'diff' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Git Diff
              </button>
            </div>
          )}

          {/* Structured view */}
          {view === 'structured' && diffs.length > 0 && (
            <div className="space-y-1">
              <DiffSection title="Modified" items={modified} color="text-yellow-500" />
              <DiffSection title="Added" items={added} color="text-green-500" />
              <DiffSection title="Removed" items={removed} color="text-red-500" />
            </div>
          )}

          {/* Git diff view */}
          {view === 'diff' && (
            <GitDiffView left={left} right={right} />
          )}
        </div>
      )}
    </div>
  );
}