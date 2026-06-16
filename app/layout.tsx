import './globals.css';
import React from 'react';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'NeroLabs',
  description: 'Developer toolbox for cron and JSON utilities.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main
            style={{
              flex: 1,
              padding: '2.5rem 2rem',
              background: 'var(--bg-base)',
              minHeight: '100vh',
            }}
          >
            <div className="container">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}