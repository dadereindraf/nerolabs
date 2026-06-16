'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/json-formatter',
    label: 'JSON Formatter',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    href: '/json-compare',
    label: 'JSON Compare',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
      </svg>
    ),
  },
  {
    href: '/cron-visualizer',
    label: 'Cron Visualizer',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  // Baca preferensi tersimpan saat pertama load
  useEffect(() => {
    const saved = localStorage.getItem('nl-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nl-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nl-theme', 'light');
    }
  };

  return (
    <aside style={{
      width: 210,
      flexShrink: 0,
      background: '#18212f',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      position: 'sticky',
      top: 0,
      height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9', letterSpacing: 0.2 }}>NeroLabs</div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Developer toolbox</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 7,
              fontSize: 13, fontWeight: active ? 500 : 400,
              color: active ? '#f1f5f9' : '#64748b',
              background: active ? 'rgba(255,255,255,0.09)' : 'transparent',
              textDecoration: 'none', transition: 'all 0.15s',
            }}>
              <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Toggle theme */}
      <div style={{ padding: '14px 10px 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8 }}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '8px 12px', borderRadius: 7,
            fontSize: 12, fontWeight: 500,
            color: '#94a3b8',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          {isDark ? (
            /* Sun icon */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            /* Moon icon */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </aside>
  );
}