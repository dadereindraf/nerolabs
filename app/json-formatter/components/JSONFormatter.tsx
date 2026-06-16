'use client'
import React, { useState } from 'react';
import { downloadFile } from '../../../lib/utils';

// JSON Formatter component (client) — handles input, formatting, minifying, copying and download.
export default function JSONFormatter() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    try {
      const obj = JSON.parse(input);
      const formatted = JSON.stringify(obj, null, 2);
      setOutput(formatted);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON');
    }
  };

  const handleMinify = () => {
    try {
      const obj = JSON.parse(input);
      const min = JSON.stringify(obj);
      setOutput(min);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON');
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(input);
      setError('Valid JSON');
    } catch (e: any) {
      setError(e.message || 'Invalid JSON');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output || input);
      setError('Copied to clipboard');
    } catch (e: any) {
      setError('Copy failed');
    }
  };

  const handleDownload = () => {
    const content = output || input;
    downloadFile('nerolabs.json', content);
  };

  return (
    <div className="space-y-4">
      <textarea className="editor" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste or type JSON here" />

      <div className="flex gap-2">
        <button onClick={handleFormat} className="px-3 py-2 bg-blue-600 text-white rounded">Format</button>
        <button onClick={handleMinify} className="px-3 py-2 bg-indigo-600 text-white rounded">Minify</button>
        <button onClick={handleValidate} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded">Validate</button>
        <button onClick={handleCopy} className="px-3 py-2 bg-green-600 text-white rounded">Copy</button>
        <button onClick={handleDownload} className="px-3 py-2 bg-yellow-500 text-white rounded">Download</button>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div>
        <h4 className="font-medium mb-2">Output</h4>
        <textarea className="editor" value={output} readOnly />
      </div>
    </div>
  );
}
