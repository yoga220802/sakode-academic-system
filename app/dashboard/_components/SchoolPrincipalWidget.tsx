"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";

export function SchoolPrincipalWidget() {
  const { selectedStyle } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  const extracurricularStats = [
    { name: "Pramuka SAKODE", memberCount: 45, status: "Aktif", coach: "Udin Mentor React" },
    { name: "IT Club & Coding", memberCount: 38, status: "Aktif", coach: "Hamzah Mentor Lead" },
    { name: "Karya Ilmiah Remaja", memberCount: 22, status: "Aktif", coach: "Yogi Mentor Lead" }
  ];

  const recentActivities = [
    { desc: "Pendaftaran Ekskul Pramuka oleh Panjul disetujui Admin", time: "2 jam yang lalu" },
    { desc: "Plotting pembimbing baru untuk IT Club selesai dilakukan", time: "1 hari yang lalu" }
  ];

  return (
    <div className="flex flex-col gap-6 w-full text-left font-sans">
      {/* Scope Alert Notice */}
      <UI.Alert title="Lingkup Akses Terbatas (Read-Only)" type="info">
        Akun Anda terhubung dengan organisasi **SMA Negeri 1 Jakarta**. Anda memiliki akses penuh untuk memantau data pendaftaran, aktivitas mentoring, dan laporan ekstrakurikuler, namun tidak memiliki wewenang untuk menambah, mengubah, atau menyetujui data.
      </UI.Alert>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UI.Card accentColor="blue">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Total Siswa Terdaftar
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              105 Siswa
            </span>
            <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 mt-1.5">
              Tersebar di 3 program IT
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor="orange">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Ekstrakurikuler Aktif
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              3 Cabang
            </span>
            <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 mt-1.5">
              100% tingkat kepatuhan kuota
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor="green">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Sesi Mentoring Berjalan
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              42 Sesi
            </span>
            <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 mt-1.5">
              Bulan Juli 2026
            </span>
          </div>
        </UI.Card>
      </div>

      {/* Reports & Activity section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Extracurricular List */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Daftar Ekstrakurikuler Organisasi
          </UI.Heading>
          {extracurricularStats.map((item, idx) => (
            <UI.Card key={idx} accentColor={idx % 2 === 0 ? "blue" : "orange"}>
              <div className="p-4.5 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-zinc-850 dark:text-zinc-100">
                    {item.name}
                  </h3>
                  <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                    {item.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-500 dark:text-zinc-450 mt-1">
                  <span>Pembina/Mentor: <span className="font-bold">{item.coach}</span></span>
                  <span className="font-extrabold">{item.memberCount} Peserta</span>
                </div>
              </div>
            </UI.Card>
          ))}
        </div>

        {/* Right column: Recent Activity Logs */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Aktivitas Terkini Organisasi
          </UI.Heading>
          <UI.Card accentColor="green">
            <div className="p-4.5 flex flex-col gap-3.5">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 pb-2.5 last:pb-0">
                  <p className="text-xs text-zinc-700 dark:text-zinc-200 font-semibold leading-relaxed">
                    {act.desc}
                  </p>
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </UI.Card>
        </div>
      </div>
    </div>
  );
}
