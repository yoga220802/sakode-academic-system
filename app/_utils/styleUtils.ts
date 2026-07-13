const STYLE_CLASSES: Record<string, Record<string, string>> = {
  neobrutalism: {
    "card-item": "bg-white dark:bg-zinc-900 border-3 border-zinc-900 dark:border-white p-4 font-mono shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff]",
    "panel-card": "bg-white dark:bg-zinc-900 border-3 border-zinc-900 dark:border-white p-5 font-mono shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff]",
    "tab-button": "border-2 border-zinc-900 dark:border-white rounded-none py-1.5 px-4 font-black",
    divider: "h-0.5 bg-zinc-900 dark:bg-white my-4",
    "table-header": "border-b-2 border-zinc-900 dark:border-zinc-700 bg-zinc-100 font-black text-zinc-900 uppercase p-3 text-xs",
    "progress-track": "w-full h-3.5 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-white rounded-none overflow-hidden relative",
    "progress-fill": "h-full border-r border-zinc-900 dark:border-white rounded-none",
    "stat-box": "bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white p-3 rounded-none",
  },
  claymorphism: {
    "card-item": "bg-white/85 dark:bg-zinc-900/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),_1px_2px_4px_rgba(0,0,0,0.04)] border border-zinc-200/50 dark:border-zinc-800/40 p-4 rounded-2xl",
    "panel-card": "bg-slate-50 dark:bg-zinc-900 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.05),_inset_4px_4px_8px_rgba(255,255,255,0.4),_3px_5px_15px_rgba(0,0,0,0.05)] border border-slate-200/40 dark:border-zinc-850 p-5 rounded-3xl",
    "tab-button": "rounded-xl py-1.5 px-4 font-bold shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.02)]",
    divider: "h-px bg-zinc-200/60 dark:bg-zinc-800/40 my-4",
    "table-header": "bg-slate-100 dark:bg-zinc-950 font-extrabold text-zinc-755 p-3 rounded-t-xl text-xs",
    "progress-track": "w-full h-2.5 bg-zinc-200/50 dark:bg-zinc-950/60 border border-zinc-200/20 rounded-full overflow-hidden relative",
    "progress-fill": "h-full rounded-full",
    "stat-box": "bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/30 dark:border-zinc-800/20 p-3 rounded-2xl",
  },
  glassmorphism: {
    "card-item": "bg-white/10 dark:bg-zinc-900/20 backdrop-blur-xs border border-white/20 dark:border-zinc-900/30 p-4 rounded-xl",
    "panel-card": "bg-white/15 dark:bg-zinc-900/35 border border-white/20 dark:border-zinc-800/50 backdrop-blur-md p-5 rounded-2xl shadow-xl",
    "tab-button": "rounded-lg py-1.5 px-4 font-bold backdrop-blur-3xs border border-white/10",
    divider: "h-px bg-white/10 dark:bg-zinc-800/50 my-4",
    "table-header": "bg-white/5 border-b border-white/10 font-bold p-3 text-xs",
    "progress-track": "w-full h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden relative",
    "progress-fill": "h-full rounded-full",
    "stat-box": "bg-white/5 dark:bg-zinc-900/15 border border-white/10 dark:border-zinc-800/25 p-3 rounded-xl backdrop-blur-3xs",
  },
  "liquid-glass": {
    "card-item": "bg-white/10 dark:bg-zinc-900/20 backdrop-blur-xs border border-white/20 dark:border-zinc-900/30 p-4 rounded-xl",
    "panel-card": "bg-white/15 dark:bg-zinc-900/35 border border-white/20 dark:border-zinc-800/50 backdrop-blur-md p-5 rounded-2xl shadow-xl",
    "tab-button": "rounded-lg py-1.5 px-4 font-bold backdrop-blur-3xs border border-white/10",
    divider: "h-px bg-white/10 dark:bg-zinc-800/50 my-4",
    "table-header": "bg-white/5 border-b border-white/10 font-bold p-3 text-xs",
    "progress-track": "w-full h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden relative",
    "progress-fill": "h-full rounded-full",
    "stat-box": "bg-white/5 dark:bg-zinc-900/15 border border-white/10 dark:border-zinc-800/25 p-3 rounded-xl backdrop-blur-3xs",
  },
  minimalism: {
    "card-item": "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-none",
    "panel-card": "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-none",
    "tab-button": "rounded-none py-1.5 px-4 font-medium border border-zinc-200/80 dark:border-zinc-800",
    divider: "h-px bg-zinc-200 dark:bg-zinc-800 my-4",
    "table-header": "border-b border-zinc-250 font-extrabold p-3 text-xs",
    "progress-track": "w-full h-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-none overflow-hidden relative",
    "progress-fill": "h-full rounded-none",
    "stat-box": "bg-transparent border border-zinc-200 dark:border-zinc-800 p-3 rounded-none",
  },
};

const FALLBACK: Record<string, string> = {
  "card-item": "bg-white dark:bg-zinc-900/60 border border-zinc-200/65 dark:border-zinc-800/80 p-4 rounded-2xl shadow-sm",
  "panel-card": "bg-white dark:bg-zinc-900/60 border border-zinc-200/65 dark:border-zinc-800/80 p-5 rounded-3xl shadow-sm",
  "tab-button": "rounded-xl py-1.5 px-4 font-bold border border-zinc-200/60 dark:border-zinc-800",
  divider: "h-px bg-zinc-200 dark:bg-zinc-800 my-4",
  "table-header": "bg-zinc-50 dark:bg-zinc-950 font-extrabold text-zinc-600 dark:text-zinc-400 p-3 text-xs",
  "progress-track": "w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden relative",
  "progress-fill": "h-full rounded-full",
  "stat-box": "bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-2xl",
};

export function getSubElementClass(style: string, type: string): string {
  return STYLE_CLASSES[style]?.[type] ?? FALLBACK[type] ?? "";
}
