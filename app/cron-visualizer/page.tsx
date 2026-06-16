import React from 'react';
import CronVisualizer from './components/CronVisualizer';

export default function CronPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-2">Cron Visualizer</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Validate cron expressions and show next execution times.
      </p>
      <CronVisualizer />
    </section>
  );
}