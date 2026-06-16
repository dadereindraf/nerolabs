
import React from 'react';
import JSONFormatter from './components/JSONFormatter';

export default function JSONFormatterPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-2">JSON Formatter</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Format, minify, validate, copy and download JSON.
      </p>
      <JSONFormatter />
    </section>
  );
}