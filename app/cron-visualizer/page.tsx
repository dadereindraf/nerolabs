import React from 'react';
import CronVisualizer from './components/CronVisualizer';

export default function CronPage() {
  return (
    <section>
      <header style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
          Tool
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
          Cron Visualizer
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Validasi cron expression dan tampilkan waktu eksekusi berikutnya.
        </p>
      </header>
      <CronVisualizer />
    </section>
  );
}