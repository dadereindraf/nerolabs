import './globals.css';
import React from 'react';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'NeroLabs',
  description: 'Developer toolbox for cron and JSON utilities.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  /* Root app layout — includes sidebar and responsive container. */
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 container py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
