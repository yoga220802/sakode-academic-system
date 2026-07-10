"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";

export default function ModulesPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  return (
    <div className="flex flex-col gap-6 text-left py-4">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white">
          Modul Belajar IT
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Akses materi bootcamp, rekaman kelas, source-code, dan tugas mandiri Anda.
        </p>
      </div>

      <UI.Card accentColor={selectedColor}>
        <div className="p-6 text-center text-xs text-zinc-500 font-semibold">
          Halaman modul pembelajaran sedang dipersiapkan dan akan diimplementasikan pada feature slice berikutnya.
        </div>
      </UI.Card>
    </div>
  );
}
