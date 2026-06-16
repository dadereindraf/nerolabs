'use client'
import React, { useState } from 'react';
import { downloadFile } from '../../../lib/utils';

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

function TypeBadge({ value }: { value: JsonValue }) {
  if (Array.isArray(value)) {
    return <span className="ml-1 text-xs text-gray-400 font-mono">[{value.length}]</span>;
  }
  if (value !== null && typeof value === 'object') {
    return <span className="ml-1 text-xs text-gray-400 font-mono">{'{' + Object.keys(value).length + '}'}</span>;
  }
  return null;
}

function JsonNode({
  value,
  nodeKey,
  depth = 0,
}: {
  value: JsonValue;
  nodeKey?: string;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth < 2);

  const isExpandable = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);

  const entries = isExpandable
    ? isArray
      ? (value as JsonValue[]).map((v, i) => [String(i), v] as [string, JsonValue])
      : Object.entries(value as { [k: string]: JsonValue })
    : [];

  const renderValue = () => {
    if (value === null) return <span className="text-gray-400 font-mono">null</span>;
    if (typeof value === 'boolean') return <span className="text-blue-500 font-mono flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-blue-500" />{String(value)}</span>;
    if (typeof value === 'number') return <span className="text-blue-600 dark:text-blue-400 font-mono">{value}</span>;
    if (typeof value === 'string') return <span className="text-gray-700 dark:text-gray-200 font-mono">{`"${value}"`}</span>;
    return null;
  };

  return (
    <div className="relative">
      <div className="flex items-start group py-[2px] hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-1 cursor-default">
        {/* Expand toggle */}
        <div className="w-4 shrink-0 flex items-center justify-center mt-[2px]">
          {isExpandable ? (
            <button
              onClick={() => setOpen(o => !o)}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-[10px] leading-none"
            >
              {open ? '▼' : '▶'}
            </button>
          ) : null}
        </div>

        {/* Key */}
        {nodeKey !== undefined && (
          <span className="text-gray-500 dark:text-gray-400 font-mono mr-2 shrink-0">
            {nodeKey}
          </span>
        )}

        {/* Separator */}
        {nodeKey !== undefined && (
          <span className="text-gray-400 mr-2 shrink-0">:</span>
        )}

        {/* Value or collapsed preview */}
        {isExpandable ? (
          <span className="flex items-center">
            <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">
              {isArray ? 'array' : 'object'}
            </span>
            <TypeBadge value={value} />
            {!open && (
              <button
                onClick={() => setOpen(true)}
                className="ml-2 text-xs text-gray-400 hover:text-blue-500"
              >
                ···
              </button>
            )}
          </span>
        ) : (
          <span>{renderValue()}</span>
        )}
      </div>

      {/* Children */}
      {isExpandable && open && (
        <div className="ml-4 pl-3 border-l-2 border-gray-200 dark:border-gray-700">
          {entries.map(([k, v], i) => (
            <JsonNode
              key={k}
              nodeKey={k}
              value={v}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function JSONFormatter() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<JsonValue | null>(null);
  const [view, setView] = useState<'text' | 'tree'>('text');

  const handleFormat = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, 2));
      setParsed(obj);
      setError(null);
      setView('text');
    } catch (e: any) {
      setError(e.message || 'Invalid JSON');
      setParsed(null);
    }
  };

  const handleMinify = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj));
      setParsed(obj);
      setError(null);
      setView('text');
    } catch (e: any) {
      setError(e.message || 'Invalid JSON');
      setParsed(null);
    }
  };

  const handleValidate = () => {
    try {
      const obj = JSON.parse(input);
      setParsed(obj);
      setError('✓ Valid JSON');
    } catch (e: any) {
      setError(e.message || 'Invalid JSON');
      setParsed(null);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output || input);
      setError('Copied to clipboard');
    } catch {
      setError('Copy failed');
    }
  };

  const handleDownload = () => {
    downloadFile('nerolabs.json', output || input);
  };

  const isError = error && !error.startsWith('✓') && error !== 'Copied to clipboard';

  return (
    <div className="space-y-4">
      <textarea
        className="editor"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste or type JSON here"
      />

      <div className="flex gap-2 flex-wrap">
        <button onClick={handleFormat} className="px-3 py-2 bg-blue-600 text-white rounded">Format</button>
        <button onClick={handleMinify} className="px-3 py-2 bg-indigo-600 text-white rounded">Minify</button>
        <button onClick={handleValidate} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded">Validate</button>
        <button onClick={handleCopy} className="px-3 py-2 bg-green-600 text-white rounded">Copy</button>
        <button onClick={handleDownload} className="px-3 py-2 bg-yellow-500 text-white rounded">Download</button>
      </div>

      {error && (
        <div className={`text-sm ${isError ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
          {error}
        </div>
      )}

      {(output || parsed) && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium">Output</h4>
            <div className="flex rounded overflow-hidden border border-gray-300 dark:border-gray-600 text-sm">
              <button
                onClick={() => setView('text')}
                className={`px-3 py-1 ${view === 'text' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600 dark:text-gray-300'}`}
              >
                Text
              </button>
              <button
                onClick={() => setView('tree')}
                className={`px-3 py-1 ${view === 'tree' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600 dark:text-gray-300'}`}
              >
                Tree
              </button>
            </div>
          </div>

          {view === 'text' && (
            <textarea className="editor" value={output} readOnly />
          )}

          {view === 'tree' && parsed !== null && (
            <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-auto max-h-[500px] text-sm">
              <JsonNode value={parsed} depth={0} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}