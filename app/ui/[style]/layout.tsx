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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 gap-4">
        <div className="space-y-2">
          {/* Back button */}
          <Link
            href="/ui"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
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
                className="text-xs px-2.5 py-1 rounded-full font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            href="/ui/docs"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/45 text-indigo-700 dark:text-indigo-350 border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all shadow-xs"
          >
            <span>Sandbox Docs</span>
          </Link>
        </div>
      </div>

      {/* Renders the style-specific showcase */}
      <div className="w-full">{children}</div>
    </div>
  );
}
