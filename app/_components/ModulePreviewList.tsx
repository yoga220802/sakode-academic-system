"use client";

import React, { useState } from "react";
import { LearningModuleViewModel } from "../_types/package";
import { useUIStyle } from "./UIStyleContext";
import { Icons } from "@/UI/shared/Icons";
import { getTextClass } from "@/UI/shared/color-utils";

interface ModulePreviewListProps {
  modules: LearningModuleViewModel[];
}

export function ModulePreviewList({ modules }: ModulePreviewListProps) {
  const { selectedColor } = useUIStyle();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
        Kurikulum & Modul ({modules.length} Modul)
      </div>
      
      <div className="space-y-2.5">
        {modules.map((mod, idx) => {
          const isExpanded = expandedIndex === idx;
          
          return (
            <div 
              key={idx}
              className={`transition-all duration-200 border rounded-xl overflow-hidden ${
                isExpanded 
                  ? "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800/80" 
                  : "bg-transparent border-zinc-200/40 dark:border-zinc-850/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleExpand(idx)}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-zinc-800 dark:text-zinc-200 line-clamp-1">
                    {idx + 1}. {mod.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Icons.Clock className="w-3 h-3 text-zinc-400" />
                      {mod.durationWeeks} Minggu
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-350 dark:bg-zinc-700" />
                    <span className="flex items-center gap-1">
                      <Icons.BookOpen className="w-3 h-3 text-zinc-400" />
                      {mod.sessionCount} Sesi Mentoring
                    </span>
                  </div>
                </div>
                
                <span className={`w-5 h-5 rounded-full flex items-center justify-center bg-zinc-150/50 dark:bg-zinc-800/60 border border-zinc-200/20 dark:border-zinc-700/20 text-zinc-500 dark:text-zinc-400 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-3.5 pt-0.5 border-t border-zinc-100/50 dark:border-zinc-850/40 bg-zinc-50/20 dark:bg-zinc-900/20">
                  <div className="text-[10.5px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wide mb-2 mt-1.5">
                    Materi Pembelajaran:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                    {mod.topics.map((topic, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-1.5 text-xs text-zinc-650 dark:text-zinc-400 font-medium">
                        <Icons.Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${getTextClass(selectedColor)}`} />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
