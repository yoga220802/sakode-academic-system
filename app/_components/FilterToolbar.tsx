"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter?: string;
  onStatusChange?: (status: string) => void;
  statusOptions?: FilterOption[];
  placeholder?: string;
  actions?: React.ReactNode;
}

export function FilterToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions = [],
  placeholder = "Cari data...",
  actions
}: FilterToolbarProps) {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-zinc-100/40 dark:bg-zinc-900/20 border border-zinc-200/35 dark:border-zinc-800/35 rounded-2xl p-4 mb-6 w-full text-left">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-400">
            <Icons.Search className="w-4 h-4" />
          </div>
          <UI.Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10! py-2! text-xs!"
            accentColor={selectedColor}
          />
        </div>

        {/* Status Dropdown Filter */}
        {onStatusChange && statusFilter !== undefined && statusOptions.length > 0 && (
          <div className="w-full sm:w-48">
            <UI.Select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="py-2! text-xs! cursor-pointer"
              accentColor={selectedColor}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </UI.Select>
          </div>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 justify-end">{actions}</div>
      )}
    </div>
  );
}
