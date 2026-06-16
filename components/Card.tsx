import React from 'react';
import Link from 'next/link';

type Props = {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

export default function Card({ title, href, icon, children }: Props) {
  return (
    <Link href={href} className="block p-6 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow">
      <div className="flex items-center gap-4">
        <div className="text-blue-600">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{children}</p>
        </div>
      </div>
    </Link>
  );
}
