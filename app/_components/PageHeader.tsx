"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200/35 dark:border-zinc-800/35 pb-4 mb-6 text-left w-full">
      <div>
        <UI.Heading className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight mb-1">
          {title}
        </UI.Heading>
        {description && (
          <p className="text-xs text-zinc-450 dark:text-zinc-500 font-bold mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}
