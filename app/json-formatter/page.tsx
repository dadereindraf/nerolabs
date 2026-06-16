import React from 'react';
import JSONFormatter from './components/JSONFormatter';

export default function JSONFormatterPage() {
  return (
    <section>
      <header style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
          Tool
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
          JSON Formatter
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Format, minify, validasi, salin, dan unduh JSON.
        </p>
      </header>
      <JSONFormatter />
    </section>
  );
}