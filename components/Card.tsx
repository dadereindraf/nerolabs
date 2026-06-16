'use client';
import React from 'react';
import Link from 'next/link';

interface CardProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  tag?: string;
  tagColor?: 'blue' | 'purple' | 'teal';
  children: React.ReactNode;
}

const tagStyles: Record<string, React.CSSProperties> = {
  blue:   { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' },
  purple: { background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' },
  teal:   { background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' },
};

const iconBgStyles: Record<string, React.CSSProperties> = {
  blue:   { background: '#eff6ff', color: '#3b82f6' },
  purple: { background: '#f5f3ff', color: '#7c3aed' },
  teal:   { background: '#f0fdfa', color: '#0d9488' },
};

export default function Card({ title, href, icon, tag, tagColor = 'blue', children }: CardProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.07)',
          borderRadius: 12,
          padding: '20px',
          cursor: 'pointer',
          transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'rgba(0,0,0,0.14)';
          el.style.transform = 'translateY(-2px)';
          el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'rgba(0,0,0,0.07)';
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)';
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            ...iconBgStyles[tagColor],
          }}>
            {icon}
          </div>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
          </svg>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>{title}</h3>
        <p style={{ fontSize: 12.5, color: '#6b7280', lineHeight: 1.65, flex: 1 }}>{children}</p>

        {tag && (
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 500,
            padding: '3px 9px', borderRadius: 5, marginTop: 16,
            ...tagStyles[tagColor],
          }}>
            {tag}
          </span>
        )}
      </div>
    </Link>
  );
}