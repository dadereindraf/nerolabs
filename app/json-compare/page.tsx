import React from 'react';
import JSONCompare from './components/JSONCompare';

export default function JSONComparePage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-2">JSON Compare</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Compare two JSON documents and show added, removed and modified fields.
      </p>
      <JSONCompare />
    </section>
  );
}