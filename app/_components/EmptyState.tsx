"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, icon = "Clipboard", actionLabel, onAction }: EmptyStateProps) {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  const IconComponent = Icons[icon as keyof typeof Icons] || Icons.Clipboard;

  return (
    <UI.Card accentColor={selectedColor} className="max-w-md mx-auto my-8">
      <div className="p-8 flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-400 dark:text-zinc-500 shadow-3xs">
          <IconComponent className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-black text-zinc-850 dark:text-zinc-100 mb-1.5">
            {title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
            {description}
          </p>
        </div>
        {actionLabel && onAction && (
          <UI.Button variant="primary" accentColor={selectedColor} onClick={onAction} className="text-xs px-4 py-2 cursor-pointer mt-2">
            {actionLabel}
          </UI.Button>
        )}
      </div>
    </UI.Card>
  );
}
