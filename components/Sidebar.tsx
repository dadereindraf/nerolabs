'use client';
import React from 'react';
import Link from 'next/link';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

// Simple sidebar with theme toggle
export default function Sidebar() {
  // Toggle class on documentElement for dark/light mode
  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    document.documentElement.classList.toggle('dark');
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 hidden md:block">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">NeroLabs</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Developer toolbox</p>
      </div>
      <nav className="space-y-2">
        <Link href="/" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Home</Link>
        <Link href="/json-formatter" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">JSON Formatter</Link>
        <Link href="/json-compare" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">JSON Compare</Link>
        <Link href="/cron-visualizer" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Cron Visualizer</Link>
      </nav>

      <div className="mt-6">
        <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 dark:bg-gray-700">
          <SunIcon className="w-5 h-5" />
          <span className="text-sm">Toggle Theme</span>
        </button>
      </div>
    </aside>
  );
}
