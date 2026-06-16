'use client'
import React, { useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

type Mode = 'standard' | 'nifi';
type Freq = 'second' | 'minute' | 'hourly' | 'daily' | 'weekly' | 'monthly';

interface CronParts {
  second: string;
  minute: string;
  hour: string;
  day: string;
  month: string;
  weekday: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAY_NAMES_STD  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const WEEKDAY_NAMES_NIFI = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const PRESETS_STANDARD = [
  { label: 'Every minute',          value: '* * * * *' },
  { label: 'Every 5 minutes',       value: '*/5 * * * *' },
  { label: 'Every 15 minutes',      value: '*/15 * * * *' },
  { label: 'Every 30 minutes',      value: '*/30 * * * *' },
  { label: 'Every hour',            value: '0 * * * *' },
  { label: 'Daily midnight',        value: '0 0 * * *' },
  { label: 'Daily noon',            value: '0 12 * * *' },
  { label: 'Every Monday 9am',      value: '0 9 * * 1' },
  { label: 'Weekdays 9am',          value: '0 9 * * 1-5' },
  { label: 'Every Sunday midnight', value: '0 0 * * 0' },
  { label: 'Monthly 1st',           value: '0 0 1 * *' },
  { label: 'Yearly Jan 1st',        value: '0 0 1 1 *' },
];

const PRESETS_NIFI = [
  { label: 'Every second',          value: '* * * * * ?' },
  { label: 'Every 5 seconds',       value: '*/5 * * * * ?' },
  { label: 'Every 30 seconds',      value: '*/30 * * * * ?' },
  { label: 'Every minute',          value: '0 * * * * ?' },
  { label: 'Every 5 minutes',       value: '0 */5 * * * ?' },
  { label: 'Every 15 minutes',      value: '0 */15 * * * ?' },
  { label: 'Every 30 minutes',      value: '0 */30 * * * ?' },
  { label: 'Every hour',            value: '0 0 * * * ?' },
  { label: 'Daily midnight',        value: '0 0 0 * * ?' },
  { label: 'Daily noon',            value: '0 0 12 * * ?' },
  { label: 'Every Monday 9am',      value: '0 0 9 ? * 2' },
  { label: 'Weekdays 9am',          value: '0 0 9 ? * 2-6' },
  { label: 'Monthly 1st midnight',  value: '0 0 0 1 * ?' },
  { label: 'Yearly Jan 1st',        value: '0 0 0 1 1 ?' },
];

// ── Humanizer ────────────────────────────────────────────────────────────────

function humanize(parts: CronParts, mode: Mode): string {
  const { second, minute, hour, day, month, weekday } = parts;
  if (mode === 'nifi') {
    if (second === '*' && minute === '*' && hour === '*') return 'Runs every second';
    if (second.startsWith('*/') && minute === '*' && hour === '*') return `Runs every ${second.slice(2)} seconds`;
    if (second === '0' && minute.startsWith('*/') && hour === '*') return `Runs every ${minute.slice(2)} minutes`;
    if (second === '0' && minute === '*' && hour === '*') return 'Runs every minute';
    if (second === '0' && minute === '0' && hour.startsWith('*/')) return `Runs every ${hour.slice(2)} hours`;
    if (second === '0' && minute === '0' && hour === '*') return 'Runs every hour';
  } else {
    if (minute === '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') return 'Runs every minute';
    if (minute.startsWith('*/') && hour === '*') return `Runs every ${minute.slice(2)} minutes`;
    if (minute === '0' && hour.startsWith('*/')) return `Runs every ${hour.slice(2)} hours`;
    if (minute === '0' && hour === '*') return 'Runs every hour';
  }
  const s = mode === 'nifi' && second !== '0' && second !== '*' ? ` ${second}s` : '';
  const m = minute === '*' ? 'every minute' : `minute ${minute}`;
  const h = hour === '*' ? 'every hour' : `${String(parseInt(hour) % 12 || 12)}${parseInt(hour) >= 12 ? 'pm' : 'am'}`;
  const d = day === '*' || day === '?' ? '' : ` on day ${day}`;
  const mo = month === '*' ? '' : ` of ${MONTH_NAMES[(parseInt(month) || 1) - 1]}`;
  const wd = weekday === '*' || weekday === '?' ? '' : ` on ${weekday.split(',').map(w => {
    const n = parseInt(w);
    return mode === 'nifi' ? (WEEKDAY_NAMES_NIFI[n - 1] || w) : (WEEKDAY_NAMES_STD[n] || w);
  }).join(', ')}`;
  return `Runs at${s} ${m} ${h}${d}${mo}${wd}`.trim();
}

// ── Cron Maker ───────────────────────────────────────────────────────────────

function CronMaker({ mode, onChange }: { mode: Mode; onChange: (expr: string) => void }) {
  const isNifi = mode === 'nifi';
  const presets = isNifi ? PRESETS_NIFI : PRESETS_STANDARD;

  const defaultParts = (): CronParts => isNifi
    ? { second: '0', minute: '0', hour: '*', day: '*', month: '*', weekday: '?' }
    : { second: '', minute: '0', hour: '*', day: '*', month: '*', weekday: '*' };

  const [parts, setParts] = useState<CronParts>(defaultParts);
  const [tab, setTab] = useState<'simple' | 'advanced'>('simple');
  const [freq, setFreq] = useState<Freq>('hourly');
  const [simSecond, setSimSecond] = useState('0');
  const [simMinute, setSimMinute] = useState('0');
  const [simHour, setSimHour] = useState('9');
  const [simWeekday, setSimWeekday] = useState(isNifi ? '2' : '1');
  const [simDay, setSimDay] = useState('1');
  const [everyN, setEveryN] = useState('5');

  const toExpr = (p: CronParts) => isNifi
    ? `${p.second} ${p.minute} ${p.hour} ${p.day} ${p.month} ${p.weekday}`
    : `${p.minute} ${p.hour} ${p.day} ${p.month} ${p.weekday}`;

  const buildSimple = (
    f = freq, sc = simSecond, mn = simMinute,
    h = simHour, wd = simWeekday, d = simDay, n = everyN
  ) => {
    let p: CronParts = { second: '0', minute: '*', hour: '*', day: '*', month: '*', weekday: isNifi ? '?' : '*' };
    if (isNifi) {
      if (f === 'second')  p = { ...p, second: `*/${n}`, minute: '*', hour: '*' };
      if (f === 'minute')  p = { ...p, second: '0', minute: `*/${n}`, hour: '*' };
      if (f === 'hourly')  p = { ...p, second: sc, minute: mn, hour: '*' };
      if (f === 'daily')   p = { ...p, second: '0', minute: mn, hour: h, day: '*', weekday: '?' };
      if (f === 'weekly')  p = { ...p, second: '0', minute: mn, hour: h, day: '?', weekday: wd };
      if (f === 'monthly') p = { ...p, second: '0', minute: mn, hour: h, day: d, weekday: '?' };
    } else {
      if (f === 'minute')  p = { ...p, minute: `*/${n}` };
      if (f === 'hourly')  p = { ...p, minute: mn };
      if (f === 'daily')   p = { ...p, minute: mn, hour: h };
      if (f === 'weekly')  p = { ...p, minute: mn, hour: h, weekday: wd };
      if (f === 'monthly') p = { ...p, minute: mn, hour: h, day: d };
    }
    setParts(p);
    onChange(toExpr(p));
  };

  const updatePart = (key: keyof CronParts, val: string) => {
    const next = { ...parts, [key]: val || '*' };
    setParts(next);
    onChange(toExpr(next));
  };

  const freqOptions: Freq[] = isNifi
    ? ['second', 'minute', 'hourly', 'daily', 'weekly', 'monthly']
    : ['minute', 'hourly', 'daily', 'weekly', 'monthly'];

  const advancedFields = isNifi
    ? (['second', 'minute', 'hour', 'day', 'month', 'weekday'] as const)
    : (['minute', 'hour', 'day', 'month', 'weekday'] as const);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Cron Maker</h3>
        <div className="flex rounded overflow-hidden border border-gray-300 dark:border-gray-600 text-xs">
          {(['simple', 'advanced'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 capitalize ${tab === t ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div>
        <div className="text-xs text-gray-500 mb-2">Quick presets</div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map(p => (
            <button key={p.value} onClick={() => {
              const s = p.value.split(' ');
              const next: CronParts = isNifi
                ? { second: s[0], minute: s[1], hour: s[2], day: s[3], month: s[4], weekday: s[5] }
                : { second: '', minute: s[0], hour: s[1], day: s[2], month: s[3], weekday: s[4] };
              setParts(next);
              onChange(p.value);
            }}
              className="px-2 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simple mode */}
      {tab === 'simple' && (
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-2">Frequency</div>
            <div className="flex flex-wrap gap-1.5">
              {freqOptions.map(f => (
                <button key={f} onClick={() => { setFreq(f); buildSimple(f); }}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors capitalize
                    ${freq === f ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-sm">
            {(freq === 'second' || freq === 'minute') && (
              <>
                <span className="text-gray-500">Every</span>
                <input type="number" min={1} max={59} value={everyN}
                  onChange={e => { setEveryN(e.target.value); buildSimple(freq, simSecond, simMinute, simHour, simWeekday, simDay, e.target.value); }}
                  className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
                <span className="text-gray-500">{freq === 'second' ? 'seconds' : 'minutes'}</span>
              </>
            )}
            {isNifi && freq === 'hourly' && (
              <>
                <span className="text-gray-500">At second</span>
                <input type="number" min={0} max={59} value={simSecond}
                  onChange={e => { setSimSecond(e.target.value); buildSimple(freq, e.target.value); }}
                  className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
                <span className="text-gray-500">minute</span>
                <input type="number" min={0} max={59} value={simMinute}
                  onChange={e => { setSimMinute(e.target.value); buildSimple(freq, simSecond, e.target.value); }}
                  className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
              </>
            )}
            {!isNifi && freq === 'hourly' && (
              <>
                <span className="text-gray-500">At minute</span>
                <input type="number" min={0} max={59} value={simMinute}
                  onChange={e => { setSimMinute(e.target.value); buildSimple(freq, '', e.target.value); }}
                  className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
              </>
            )}
            {(freq === 'daily' || freq === 'weekly' || freq === 'monthly') && (
              <>
                <span className="text-gray-500">At</span>
                <select value={simHour} onChange={e => { setSimHour(e.target.value); buildSimple(freq, simSecond, simMinute, e.target.value); }}
                  className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={String(i)}>{String(i).padStart(2,'0')}:00</option>
                  ))}
                </select>
              </>
            )}
            {freq === 'weekly' && (
              <>
                <span className="text-gray-500">on</span>
                <select value={simWeekday} onChange={e => { setSimWeekday(e.target.value); buildSimple(freq, simSecond, simMinute, simHour, e.target.value); }}
                  className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                  {WEEKDAY_NAMES_STD.map((w, i) => (
                    <option key={i} value={isNifi ? String(i + 1) : String(i)}>{w}</option>
                  ))}
                </select>
              </>
            )}
            {freq === 'monthly' && (
              <>
                <span className="text-gray-500">on day</span>
                <input type="number" min={1} max={31} value={simDay}
                  onChange={e => { setSimDay(e.target.value); buildSimple(freq, simSecond, simMinute, simHour, simWeekday, e.target.value); }}
                  className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
              </>
            )}
          </div>
        </div>
      )}

      {/* Advanced mode */}
      {tab === 'advanced' && (
        <div className={`grid gap-2 ${isNifi ? 'grid-cols-6' : 'grid-cols-5'}`}>
          {advancedFields.map(k => (
            <div key={k}>
              <label className="text-xs text-gray-500 capitalize block mb-1">{k}</label>
              <input value={parts[k as keyof CronParts]} onChange={e => updatePart(k as keyof CronParts, e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono text-center" />
            </div>
          ))}
        </div>
      )}

      {/* NiFi tip */}
      {isNifi && (
        <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded px-3 py-2">
          💡 NiFi tip: Use <code className="font-mono">?</code> for either Day or Weekday (not both). Weekday uses 1=Sun, 2=Mon … 7=Sat.
        </div>
      )}

      {/* Generated expression */}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-200 dark:border-gray-700">
        <code className="flex-1 font-mono text-sm bg-white dark:bg-gray-900 px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400">
          {toExpr(parts)}
        </code>
        <button onClick={() => onChange(toExpr(parts))}
          className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shrink-0">
          Use this
        </button>
      </div>
      <p className="text-xs text-gray-400 italic">{humanize(parts, mode)}</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CronVisualizer() {
  const [mode, setMode] = useState<Mode>('standard');
  const [expr, setExpr] = useState('*/5 * * * *');
  const [error, setError] = useState<string | null>(null);
  const [times, setTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(10); // ✅ hanya sekali, tidak duplikat

  const handleModeSwitch = (m: Mode) => {
    setMode(m);
    setExpr(m === 'nifi' ? '0 */5 * * * ?' : '*/5 * * * *');
    setTimes([]);
    setError(null);
  };

  const handleParse = async () => {
    setError(null);
    setTimes([]);
    setLoading(true);
    try {
      const clean = expr.trim().replace(/\s+/g, ' ');
      const parts = clean.split(' ');
      const expected = mode === 'nifi' ? 6 : 5;
      if (parts.length !== expected) {
        setError(`Invalid ${mode === 'nifi' ? 'NiFi' : 'standard'} cron format. Must have ${expected} parts: ${mode === 'nifi' ? '* * * * * ?' : '* * * * *'}`);
        return;
      }

      const apiExpr = mode === 'nifi'
        ? `${parts[1]} ${parts[2]} ${parts[3]} ${parts[4]} *`
        : clean;

      const res = await fetch('/api/cron', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expr: apiExpr, count }), // ✅ kirim count
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid cron expression');
      setTimes(data.times || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const parts = expr.trim().split(' ');
  const partLabels = mode === 'nifi'
    ? ['Second', 'Minute', 'Hour', 'Day', 'Month', 'Weekday']
    : ['Minute', 'Hour', 'Day', 'Month', 'Weekday'];

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Mode:</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 text-sm">
          <button onClick={() => handleModeSwitch('standard')}
            className={`px-4 py-1.5 font-medium transition-colors ${mode === 'standard' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            Standard (5-part)
          </button>
          <button onClick={() => handleModeSwitch('nifi')}
            className={`px-4 py-1.5 font-medium transition-colors flex items-center gap-1.5 ${mode === 'nifi' ? 'bg-orange-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <span>Apache NiFi (6-part)</span>
          </button>
        </div>
        {mode === 'nifi' && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium">
            includes seconds
          </span>
        )}
      </div>

      {/* Cron Maker */}
      <CronMaker mode={mode} onChange={setExpr} />

      {/* Expression input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cron Expression</label>

        {/* Part breakdown */}
        <div className={`grid gap-2 ${mode === 'nifi' ? 'grid-cols-6' : 'grid-cols-5'}`}>
          {partLabels.map((label, i) => (
            <div key={label} className="space-y-1 text-center">
              <div className="text-xs text-gray-400">{label}</div>
              <div className="font-mono text-sm font-semibold bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-blue-600 dark:text-blue-400">
                {parts[i] ?? '*'}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Input + count selector + button */}
        <div className="flex gap-2 items-center">
          <input
            className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono text-sm"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder={mode === 'nifi' ? '0 */5 * * * ?' : '*/5 * * * *'}
          />
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="px-2 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
          >
            {[10, 25, 50, 100].map(n => (
              <option key={n} value={n}>{n} results</option>
            ))}
          </select>
          <button
            onClick={handleParse}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium shrink-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Checking...
              </span>
            ) : 'Validate & Show Next'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded px-3 py-2">
          <span>⚠</span> {error}
        </div>
      )}

      {/* Results */}
      {times.length > 0 && (
        <div className="space-y-3">
          {/* ✅ heading dinamis */}
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Next {times.length} executions
          </h4>
          <div className="grid gap-2">
            {times.map((t, i) => {
              const d = new Date(t);
              const date = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
              const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <span className="text-xs font-mono text-gray-400 w-5 text-right shrink-0">{i + 1}</span>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${mode === 'nifi' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{date}</span>
                  <span className={`ml-auto font-mono text-sm font-semibold ${mode === 'nifi' ? 'text-orange-500 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`}>{time}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}