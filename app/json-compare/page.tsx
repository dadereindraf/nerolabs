import React from 'react';
import JSONCompare from './components/JSONCompare';

export default function JSONComparePage() {
  return (
    <section>
      <header style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
          Tool
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
          JSON Compare
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Bandingkan dua dokumen JSON dan tampilkan field yang ditambah, dihapus, atau diubah.
        </p>
      </header>
      <JSONCompare />
    </section>
  );
}