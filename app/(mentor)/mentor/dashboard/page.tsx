"use client";

import React from "react";
import { useAuth } from "@/app/_components/AuthContext";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";

export default function MentorDashboardPage() {
  const { session, logout } = useAuth();
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white">
            Dasbor Mentor
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Selamat datang kembali, Kak {session?.name || "Mentor"}.
          </p>
        </div>
        <UI.Button
          onClick={logout}
          variant="secondary"
          accentColor="red"
          className="text-xs! py-1.5! px-3.5! font-bold! cursor-pointer"
        >
          Keluar
        </UI.Button>
      </div>

      <UI.Card accentColor={selectedColor}>
        <div className="p-6 flex flex-col gap-4 text-center">
          <Icons.UserCheck className="w-12 h-12 text-sakode-blue mx-auto animate-pulse" />
          <h3 className="text-base font-bold text-zinc-800 dark:text-white">
            Workspace Pendampingan Mentor
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Halaman penugasan kelas, bimbingan satu-lawan-satu (1-on-1), dan plotting jadwal mengajar Anda sedang dipersiapkan dan akan dikembangkan pada feature slice berikutnya.
          </p>
        </div>
      </UI.Card>
    </div>
  );
}
