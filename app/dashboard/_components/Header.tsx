"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { UserSession } from "@/app/_types/auth";

interface HeaderProps {
  session: UserSession;
}

export function Header({ session }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { selectedStyle } = useUIStyle();

  // Determine container styling based on style
  const getHeaderContainerClass = () => {
    switch (selectedStyle) {
      case "claymorphism":
        return "bg-slate-50 dark:bg-zinc-900 border-b border-slate-200/20 dark:border-zinc-800/20 shadow-[0_5px_15px_rgba(0,0,0,0.02)] px-6 py-4 rounded-b-3xl mb-6";
      case "neobrutalism":
        return "bg-white dark:bg-zinc-900 border-b-3 border-zinc-900 dark:border-white px-6 py-4 font-mono mb-6";
      case "glassmorphism":
      case "liquid-glass":
        return "bg-white/10 dark:bg-zinc-950/20 border-b border-white/10 backdrop-blur-md px-6 py-4 mb-6";
      case "bento-grid":
        return "bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800/80 px-6 py-4 shadow-3xs mb-6";
      case "minimalism":
        return "bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-250/20 px-6 py-4 mb-6";
      case "sakode-modern":
      default:
        return "bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200/50 dark:border-zinc-850/50 px-6 py-4 shadow-3xs mb-6";
    }
  };

  return (
    <header className={`flex items-center justify-between z-25 relative ${getHeaderContainerClass()}`}>
      {/* Greetings */}
      <div>
        <h1 className="text-sm font-black text-zinc-800 dark:text-zinc-150 leading-none">
          Halo, {session.name.split(" ")[0]}!
        </h1>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-1.5">
          Selamat datang kembali di sistem akademik Sakode.
        </p>
      </div>

      {/* Top Bar Actions & User Profile */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-3xs cursor-pointer transition-all active:scale-95"
          aria-label="Toggle Light/Dark Theme"
        >
          {resolvedTheme === "dark" ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200/40 dark:border-zinc-850/50">
          <div className="w-6 h-6 rounded-full bg-sakode-blue flex items-center justify-center text-[10px] font-black text-white uppercase shadow-3xs select-none">
            {session.name.substring(0, 2)}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-extrabold text-zinc-700 dark:text-zinc-200 leading-none">
              {session.name}
            </span>
            <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5 leading-none">
              {session.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
