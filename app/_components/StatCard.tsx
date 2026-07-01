"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trendUp?: boolean;
  accentColor?: string;
}

export function StatCard({ label, value, change, trendUp = true, accentColor }: StatCardProps) {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  return (
    <UI.Card accentColor={(accentColor || selectedColor) as UIStyles.PaletteColorKey}>
      <div className="p-4 flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100 mt-1 leading-none">
          {value}
        </span>
        {change && (
          <span className={`text-[9.5px] font-bold mt-2 ${trendUp ? "text-emerald-500" : "text-zinc-450 dark:text-zinc-500"}`}>
            {change}
          </span>
        )}
      </div>
    </UI.Card>
  );
}
