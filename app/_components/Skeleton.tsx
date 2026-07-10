"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";

export function Skeleton({ className = "" }: { className?: string }) {
  const { selectedStyle } = useUIStyle();
  
  const getSkeletonClass = () => {
    const base = "animate-pulse transition-all duration-300";
    switch (selectedStyle) {
      case "neobrutalism":
        return `${base} bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-white rounded-none`;
      case "claymorphism":
        return `${base} bg-slate-200/60 dark:bg-zinc-800/60 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08)] rounded-xl`;
      case "glassmorphism":
      case "liquid-glass":
        return `${base} bg-white/10 dark:bg-white/5 border border-white/5 backdrop-blur-xs rounded-xl`;
      case "bento-grid":
      case "minimalism":
      case "sakode-modern":
      default:
        return `${base} bg-zinc-200 dark:bg-zinc-800/40 rounded-xl`;
    }
  };

  return <div className={`${getSkeletonClass()} ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="border border-zinc-200/35 dark:border-zinc-800/35 rounded-2xl p-6 flex flex-col gap-4 bg-zinc-100/10 dark:bg-zinc-900/10">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <div className="flex flex-col gap-2 mt-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center p-4 border border-zinc-200/35 dark:border-zinc-800/35 rounded-xl gap-4 bg-zinc-100/10 dark:bg-zinc-900/10">
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-3.5 w-1/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}
