"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";

export default function PrincipalReportsPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  return (
    <div className="flex flex-col gap-6 text-left py-4">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white">
          Laporan & Roster Ekskul
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Laporan statistik kehadiran, tugas, dan rekap partisipasi siswa bimbingan ekskul sekolah Anda secara read-only.
        </p>
      </div>

      <UI.Card accentColor={selectedColor}>
        <div className="p-6 text-center text-xs text-zinc-500 font-semibold">
          Halaman laporan ekskul kepala sekolah sedang dipersiapkan dan akan diimplementasikan pada feature slice berikutnya.
        </div>
      </UI.Card>
    </div>
  );
}
