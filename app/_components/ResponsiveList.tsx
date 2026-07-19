"use client";

import React from "react";

interface ResponsiveListProps<T> {
  items: T[];
  renderRow: (item: T, idx: number) => React.ReactNode;
  renderCard: (item: T, idx: number) => React.ReactNode;
  headers: string[];
}

export function ResponsiveList<T>({ items, renderRow, renderCard, headers }: ResponsiveListProps<T>) {
  return (
    <div className="w-full">
      {/* Desktop view: Table layout */}
      <div className="hidden md:block overflow-x-auto border border-zinc-200/35 dark:border-zinc-800/35 rounded-2xl bg-zinc-100/5 dark:bg-zinc-900/5">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/35 dark:border-zinc-800/35 font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-950/20">
              {headers.map((h, idx) => (
                <th key={idx} className="p-4 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/35 dark:divide-zinc-800/35">
            {items.map((item, idx) => renderRow(item, idx))}
          </tbody>
        </table>
      </div>

      {/* Mobile view: Stacked card grid layout */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {items.map((item, idx) => renderCard(item, idx))}
      </div>
    </div>
  );
}
