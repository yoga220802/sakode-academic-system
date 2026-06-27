import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UI_STYLES } from "../_utils/styles-data";
import { Icons } from "../_components/Icons";

const getColorDotClass = (slug: string) => {
  switch (slug) {
    case "claymorphism": return "bg-sakode-pink";
    case "neobrutalism": return "bg-sakode-yellow";
    case "glassmorphism": return "bg-sakode-cyan";
    case "liquid-glass": return "bg-sakode-orange";
    case "bento-grid": return "bg-sakode-green";
    case "sakode-modern": return "bg-sakode-pink";
    case "minimalism":
    default:
      return "bg-sakode-charcoal";
  }
};

interface StyleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ style: string }>;
}

export default async function StyleLayout({ children, params }: StyleLayoutProps) {
  const resolvedParams = await params;
  const currentStyle = resolvedParams.style;
  const styleInfo = UI_STYLES.find((s) => s.slug === currentStyle);

  if (!styleInfo) {
    notFound();
  }

  const isGlassStyle = currentStyle === "glassmorphism" || currentStyle === "liquid-glass";

  return (
    <div className={`space-y-8 animate-fade-in relative ${isGlassStyle ? "p-6 md:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/40 bg-slate-50/40 dark:bg-zinc-950/40 overflow-hidden" : ""}`}>
      {/* Background Blobs for Glass styles */}
      {isGlassStyle && (
        <>
          {/* Blobs */}
          <div className="absolute top-[-10%] left-[20%] w-72 h-72 rounded-full bg-sakode-pink/15 dark:bg-sakode-pink/20 blur-3xl pointer-events-none z-0" />
          <div className="absolute bottom-[-10%] right-[10%] w-80 h-80 rounded-full bg-sakode-orange/15 dark:bg-sakode-orange/15 blur-3xl pointer-events-none z-0" />
          <div className="absolute top-[40%] left-[-10%] w-64 h-64 rounded-full bg-sakode-cyan/15 dark:bg-sakode-cyan/15 blur-3xl pointer-events-none z-0" />
          <div className="absolute bottom-[20%] left-[30%] w-72 h-72 rounded-full bg-sakode-yellow/10 dark:bg-sakode-yellow/10 blur-3xl pointer-events-none z-0" />
          
          {/* Tech Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
        </>
      )}

      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 gap-4 relative z-10">
        <div className="space-y-2">
          {/* Back button */}
          <Link
            href="/ui"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-955 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
          >
            <Icons.ArrowLeft className="w-4 h-4" />
            Kembali ke Semua Gaya
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Gaya: {styleInfo.name}
            </h1>
            <span
              className={`inline-block w-3 h-3 rounded-full ${getColorDotClass(styleInfo.slug)}`}
            />
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            {styleInfo.longDescription}
          </p>
        </div>

        {/* Feature Tags & Sandbox Docs Button */}
        <div className="flex flex-col items-end gap-2.5 md:self-end shrink-0">
          <div className="flex flex-wrap gap-2">
            {styleInfo.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full font-semibold bg-zinc-100/80 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 backdrop-blur-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            href="/ui/docs"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/45 text-indigo-700 dark:text-indigo-350 border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all shadow-xs backdrop-blur-xs"
          >
            <span>Sandbox Docs</span>
          </Link>
        </div>
      </div>

      {/* Renders the style-specific showcase */}
      <div className="w-full relative z-10">{children}</div>
    </div>
  );
}
