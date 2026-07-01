"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";

export function AdminWidget() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  const systemLogs = [
    { time: "16:42:10 WIB", actor: "Yogi Mentor Lead", action: "Plotting Siswa Doni Pratama", status: "success" },
    { time: "16:30:15 WIB", actor: "Budi Siswa Baru", action: "Registrasi Akun Baru", status: "success" },
    { time: "15:10:02 WIB", actor: "Super Admin Sakode", action: "Pembuatan Modul React v16", status: "success" }
  ];

  const quickActions = [
    { title: "Tambah Siswa Baru", icon: "UserPlus", desc: "Daftarkan data siswa secara manual" },
    { title: "Buat Kelas IT Baru", icon: "BookPlus", desc: "Buat jadwal kurikulum bootcamp baru" },
    { title: "Konfigurasi Sistem", icon: "Settings", desc: "Pengaturan email & integrasi server" }
  ];

  const metrics = [
    { label: "Siswa Aktif", value: "348 Siswa", change: "+12 minggu ini", trendUp: true },
    { label: "Plotting Pending", value: "8 Siswa", change: "Butuh alokasi segera", trendUp: false },
    { label: "Sesi Hari Ini", value: "14 Sesi", change: "10 selesai, 4 berjalan", trendUp: true },
    { label: "Referral Aktif", value: "24 Code", change: "+4 baru dibuat", trendUp: true }
  ];

  const pendingRegistrations = [
    { title: "Doni Pratama", desc: "React & Next.js Professional • via Ref: AKBAR-PROMO" },
    { title: "Endah Lestari", desc: "TypeScript & Data Structures • via Ref: Mandiri" }
  ];

  const getLogItemClass = () => {
    const baseClass = "flex justify-between items-center p-3 transition-all";
    switch (selectedStyle) {
      case "claymorphism":
        return `${baseClass} rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200/20 dark:border-zinc-700/20 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)]`;
      case "neobrutalism":
        return `${baseClass} bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none font-mono`;
      case "glassmorphism":
      case "liquid-glass":
        return `${baseClass} bg-white/10 dark:bg-zinc-900/20 border border-white/20 dark:border-white/10 backdrop-blur-xs rounded-xl`;
      case "bento-grid":
        return `${baseClass} bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-3xs rounded-xl`;
      case "minimalism":
        return `${baseClass} bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/20 dark:border-zinc-800/20 rounded-lg`;
      case "sakode-modern":
      default:
        return `${baseClass} bg-zinc-150/40 dark:bg-zinc-800/30 border border-zinc-200/40 dark:border-zinc-800/50 rounded-xl`;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left font-sans">
      {/* Top dashboard metric summary grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <UI.Card key={idx} accentColor={idx === 0 ? "blue" : idx === 1 ? "orange" : idx === 2 ? "green" : "pink"}>
            <div className="p-4 flex flex-col gap-1">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                {m.label}
              </span>
              <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
                {m.value}
              </span>
              <span className={`text-[9px] font-bold mt-1.5 ${m.trendUp ? "text-emerald-500" : "text-zinc-450 dark:text-zinc-500"}`}>
                {m.change}
              </span>
            </div>
          </UI.Card>
        ))}
      </div>

      {/* Primary columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Registration queues */}
        <div className="flex flex-col gap-3 text-left">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Antrean Review Pendaftaran Siswa
          </UI.Heading>
          <div className="flex flex-col gap-3">
            {pendingRegistrations.map((action, idx) => (
              <UI.Card key={idx} accentColor={idx === 0 ? "orange" : "blue"}>
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-150/40 dark:bg-zinc-800/40 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
                      {idx === 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-sakode-orange">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-sakode-blue">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-100">
                        {action.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-0.5">
                        {action.desc}
                      </p>
                    </div>
                  </div>
                  <UI.Button variant="primary" accentColor={selectedColor} className="text-[9px]! py-1.5! px-3! h-auto! font-black! cursor-pointer">
                    Buka
                  </UI.Button>
                </div>
              </UI.Card>
            ))}
          </div>
        </div>

        {/* System Audit logs */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Log Aktivitas Sistem Terakhir
          </UI.Heading>
          <div className="flex flex-col gap-2">
            {systemLogs.map((log, idx) => (
              <div key={idx} className={getLogItemClass()}>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-extrabold text-zinc-850 dark:text-zinc-100 leading-tight">
                    {log.action}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-500 dark:text-zinc-400 mt-1">
                    Oleh: {log.actor}
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick action grid */}
      <div className="flex flex-col gap-3">
        <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          Aksi Cepat Admin
        </UI.Heading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((act, idx) => (
            <UI.Card key={idx} accentColor={idx === 0 ? "blue" : idx === 1 ? "orange" : "green"}>
              <div className="p-4 flex flex-col justify-between h-full gap-3 text-left">
                <div className="flex flex-col gap-1.5">
                  {/* Render matching dynamic svg icon */}
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
                    {act.icon === "UserPlus" && <Icons.UserPlus className="w-4.5 h-4.5" />}
                    {act.icon === "BookPlus" && <Icons.BookPlus className="w-4.5 h-4.5" />}
                    {act.icon === "Settings" && <Icons.Settings className="w-4.5 h-4.5" />}
                  </div>
                  <h3 className="text-xs font-black text-zinc-850 dark:text-zinc-100 mt-1 leading-tight">
                    {act.title}
                  </h3>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold leading-normal">
                    {act.desc}
                  </p>
                </div>
                <UI.Button variant="primary" accentColor={selectedColor} className="text-[9px]! py-1.5! px-3! h-auto! font-black! cursor-pointer">
                  Buka
                </UI.Button>
              </div>
            </UI.Card>
          ))}
        </div>
      </div>
    </div>
  );
}
