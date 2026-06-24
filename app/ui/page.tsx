import React from "react";
import Link from "next/link";
import { UI_STYLES } from "./_utils/styles-data";

export const metadata = {
  title: "UI Design Showcase - Sakode Academy",
  description: "Eksplorasi ragam gaya visual UI (Claymorphism, Neobrutalism, Glassmorphism, Liquid Glass, Bento Grid, dan Minimalism) untuk komponen Sistem Akademik Sakode.",
};

export default function UIExamplesIndexPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative text-center max-w-3xl mx-auto space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-sakode-pink/10 via-sakode-orange/10 to-sakode-yellow/10 text-sakode-orange border border-sakode-orange/20">
          Design System & Aesthetics Playbook
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-linear-to-r from-sakode-pink via-sakode-orange to-sakode-yellow bg-clip-text text-transparent">
          Tema & Gaya Desain UI
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
          Eksplorasi enam pendekatan gaya visual antarmuka modern yang akan menjadi fondasi komponen sistem akademik Sakode Academy. Pilih tema di bawah untuk melihat implementasi komponen lengkap secara live.
        </p>
        <div className="pt-2">
          <Link
            href="/ui/docs"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md gap-1.5"
          >
            <span>Buka Sandbox Docs Komponen</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Styles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {UI_STYLES.map((style) => (
          <div
            key={style.slug}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Visual Header Preview representing the style */}
            <div className="relative w-full h-40 rounded-xl overflow-hidden mb-6 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800/30">
              {/* Dynamic visual preview based on style type */}
              {style.slug === "claymorphism" && (
                <div className="w-full h-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center">
                  <div className="px-5 py-2.5 rounded-2xl bg-indigo-100 text-indigo-700 text-sm font-bold shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.8),4px_4px_12px_rgba(0,0,0,0.12)]">
                    Claymorphism Button
                  </div>
                </div>
              )}

              {style.slug === "neobrutalism" && (
                <div className="w-full h-full bg-emerald-50 dark:bg-zinc-900 flex items-center justify-center">
                  <div className="px-5 py-2.5 bg-sakode-yellow text-zinc-900 border-3 border-zinc-900 font-bold uppercase tracking-wider text-xs shadow-[5px_5px_0px_0px_rgba(24,24,27,1)]">
                    Neobrutalist Badge
                  </div>
                </div>
              )}

              {style.slug === "glassmorphism" && (
                <div className="w-full h-full bg-linear-to-tr from-purple-600 to-blue-500 relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 bg-sakode-yellow rounded-full -top-2 -left-2" />
                  <div className="w-32 h-20 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg flex items-center justify-center text-xs font-semibold text-white/90">
                    Frosted Glass
                  </div>
                </div>
              )}

              {style.slug === "liquid-glass" && (
                <div className="w-full h-full bg-slate-950 relative flex items-center justify-center overflow-hidden">
                  {/* Dynamic background circles */}
                  <div className="absolute w-16 h-16 bg-sakode-pink rounded-full blur-xl opacity-60 animate-pulse -top-2 left-6" />
                  <div className="absolute w-16 h-16 bg-sakode-orange rounded-full blur-xl opacity-60 animate-pulse bottom-2 right-6" />
                  <div className="w-32 h-20 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg shadow-xl flex items-center justify-center text-xs font-semibold text-white/90 z-10">
                    Liquid Refraction
                  </div>
                </div>
              )}

              {style.slug === "bento-grid" && (
                <div className="w-full h-full p-4 grid grid-cols-3 grid-rows-2 gap-2 bg-slate-50 dark:bg-zinc-900">
                  <div className="col-span-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-[10px] text-zinc-500">Box A</div>
                  <div className="row-span-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-[10px] text-zinc-500">Box B</div>
                  <div className="bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-[10px] text-zinc-500">Box C</div>
                  <div className="bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-[10px] text-zinc-500">Box D</div>
                </div>
              )}

              {style.slug === "minimalism" && (
                <div className="w-full h-full bg-white dark:bg-zinc-950 flex flex-col justify-center p-6 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-400">Minimalism</span>
                  <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
                  <span className="text-xs text-zinc-800 dark:text-zinc-300 font-light">Clean typography & hairlines.</span>
                </div>
              )}

              {style.slug === "sakode-modern" && (
                <div className="w-full h-full bg-[#030307] relative flex flex-col justify-center p-6 overflow-hidden">
                  {/* Grid layout */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />
                  {/* Glow */}
                  <div className="absolute w-24 h-24 bg-sakode-blue/10 rounded-full blur-xl top-[-20%] left-[-20%]" />
                  <div className="absolute w-24 h-24 bg-sakode-pink/10 rounded-full blur-xl bottom-[-20%] right-[-20%]" />
                  <span className="text-[9px] font-extrabold uppercase text-sakode-blue tracking-wider mb-1 z-10">Sleek SaaS</span>
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md text-[10px] text-white/90 z-10 w-fit">
                    Branded Modern Portal
                  </div>
                </div>
              )}
            </div>

            {/* Description Text */}
            <div className="space-y-3 flex-1 mb-6">
              <h2 className="text-xl font-bold group-hover:text-sakode-orange transition-colors">
                {style.name}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                {style.description}
              </p>
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {style.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Link Action */}
            <Link
              href={`/ui/${style.slug}`}
              className="inline-flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors gap-1.5"
            >
              Lihat Live Demo
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
