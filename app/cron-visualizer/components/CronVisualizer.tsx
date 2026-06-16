'use client'
import React, { useState } from 'react';

export default function CronVisualizer() {
  const [expr, setExpr] = useState('*/5 * * * *');
  const [error, setError] = useState<string | null>(null);
  const [times, setTimes] = useState<string[]>([]);
  const [human, setHuman] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    setError(null);
    setTimes([]);
    setHuman('');
    setLoading(true);

    try {
      const clean = expr.trim().replace(/\s+/g, ' ');
      const parts = clean.split(' ');

      // 🔒 basic validation
      if (parts.length !== 5) {
        setError('Invalid cron format. Must have 5 parts: * * * * *');
        return;
      }

      const res = await fetch('/api/cron', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expr: clean }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid cron expression');
      }

      setTimes(data.times || []);
      setHuman(data.human || '');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setTimes([]);
      setHuman('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* INPUT */}
      <div>
        <label className="text-sm font-medium">Cron Expression</label>
        <input
          className="w-full mt-2 p-2 rounded border bg-white dark:bg-gray-800"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="*/5 * * * *"
        />
      </div>

      {/* BUTTON */}
      <div>
        <button
          onClick={handleParse}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Validate & Show Next'}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* HUMAN DESCRIPTION */}
      {human && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {human}
        </div>
      )}

      {/* RESULTS */}
      {times.length > 0 && (
        <div>
          <h4 className="font-semibold">Next 10 executions</h4>
          <ul className="mt-2 list-disc list-inside text-sm">
            {times.map((t, i) => (
              <li key={i}>{new Date(t).toLocaleString()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}