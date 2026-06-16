import React from 'react';
import Card from '../components/Card';
import { CubeIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <section>
      <header className="mb-8">
        <h1 className="text-4xl font-bold">NeroLabs</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Developer toolbox for cron and JSON utilities.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="JSON Formatter" href="/json-formatter" icon={<CubeIcon className="w-6 h-6" />}>
          Format, validate and download JSON.
        </Card>
        <Card title="JSON Compare" href="/json-compare" icon={<CubeIcon className="w-6 h-6" />}>
          Compare two JSON inputs and highlight differences.
        </Card>
        <Card title="Cron Visualizer" href="/cron-visualizer" icon={<CubeIcon className="w-6 h-6" />}>
          Validate cron expressions and show human-readable schedule.
        </Card>
      </div>
    </section>
  );
}
