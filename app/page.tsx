import React from 'react';
import Card from '../components/Card';

const tools = [
  {
    title: 'JSON Formatter',
    href: '/json-formatter',
    tag: 'Format & Validate',
    tagColor: 'blue' as const,
    desc: 'Format, validasi, minify, dan unduh JSON dengan tampilan tree yang interaktif.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: 'JSON Compare',
    href: '/json-compare',
    tag: 'Diff & Compare',
    tagColor: 'purple' as const,
    desc: 'Bandingkan dua JSON dan visualisasikan perbedaan dengan tampilan structured atau git-diff.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
      </svg>
    ),
  },
  {
    title: 'Cron Visualizer',
    href: '/cron-visualizer',
    tag: 'Schedule & Cron',
    tagColor: 'teal' as const,
    desc: 'Validasi cron expression dan tampilkan jadwal eksekusi berikutnya dalam format yang mudah dipahami.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <section>
      {/* Hero */}
      <header style={{ marginBottom: 40 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 600, color: 'var(--blue)',
          background: 'var(--blue-light)', border: '1px solid var(--blue-border)',
          borderRadius: 99, padding: '3px 10px', marginBottom: 14,
          letterSpacing: '0.6px', textTransform: 'uppercase',
        }}>
          Developer Tools
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-h)', letterSpacing: '-0.5px', marginBottom: 8 }}>
          NeroLabs
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 440, lineHeight: 1.65 }}>
          Toolbox ringan untuk developer — format JSON, bandingkan dokumen, dan visualisasikan cron expression langsung di browser.
        </p>
      </header>

      {/* Section label */}
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 14 }}>
        Semua tools
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: 40 }}>
        {tools.map((t) => (
          <Card key={t.href} title={t.title} href={t.href} icon={t.icon} tag={t.tag} tagColor={t.tagColor}>
            {t.desc}
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
        Ringkasan
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { val: '3', label: 'Tools tersedia' },
          { val: '100%', label: 'Berjalan di browser' },
          { val: '0ms', label: 'Tanpa server round-trip' },
        ].map((s) => (
          <div key={s.label} style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 10, padding: '16px 20px',
            boxShadow: '0 1px 3px var(--shadow)',
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-h)' }}>{s.val}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}