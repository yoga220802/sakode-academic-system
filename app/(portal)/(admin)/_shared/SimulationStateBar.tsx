"use client";

import { Icons } from "@/UI/shared/Icons";

type SimulationState = "default" | "loading" | "empty" | "error";

interface SimulationStateBarProps {
  state: SimulationState;
  onChange: (state: SimulationState) => void;
  onReset?: () => void;
}

const STATES: { value: SimulationState; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "loading", label: "Loading" },
  { value: "empty", label: "Kosong" },
  { value: "error", label: "API Error" },
];

export function SimulationStateBar({ state, onChange, onReset }: SimulationStateBarProps) {
  return (
    <div className="flex flex-wrap gap-2.5 items-center bg-zinc-100/80 dark:bg-zinc-900/40 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
      <span className="text-[10px] text-zinc-555 dark:text-zinc-300 font-bold uppercase tracking-wider pl-2 pr-1">
        Simulator State:
      </span>
      {STATES.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            state === s.value
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          {s.label}
        </button>
      ))}
      {onReset && (
        <button
          onClick={onReset}
          className="p-1.5 text-zinc-450 hover:text-sakode-orange hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 rounded-lg transition-colors ml-auto cursor-pointer flex items-center gap-1 text-[10px] font-bold"
        >
          <Icons.Check className="w-3.5 h-3.5" />
          Reset Data
        </button>
      )}
    </div>
  );
}
