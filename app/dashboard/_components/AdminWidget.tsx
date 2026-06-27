"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";

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

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Admin stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UI.Card accentColor="blue">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Total Siswa Terdaftar
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              1,280 Siswa
            </span>
            <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 mt-1.5">
              +14 siswa minggu ini
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor="orange">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Total Staf & Mentor
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              24 Orang
            </span>
            <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 mt-1.5">
              12 Mentor aktif bimbingan
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor="green">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Bootcamp Berjalan
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              8 Kelas
            </span>
            <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 mt-1.5">
              3 kurikulum IT aktif
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor="pink">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Server Uptime
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              99.98%
            </span>
            <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 mt-1.5">
              Semua sistem berjalan normal
            </span>
          </div>
        </UI.Card>
      </div>

      {/* Admin Actions & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions panels */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Tindakan Cepat Admin
          </UI.Heading>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, idx) => (
              <UI.Card key={idx} accentColor={idx === 0 ? "blue" : idx === 1 ? "orange" : "green"}>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                      {action.icon === "UserPlus" && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-sakode-blue">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                      )}
                      {action.icon === "BookPlus" && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-sakode-orange">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      )}
                      {action.icon === "Settings" && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-sakode-green">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827a1.125 1.125 0 0 1 .26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-150">
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
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-extrabold text-zinc-700 dark:text-zinc-200 leading-tight">
                    {log.action}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 mt-1">
                    Oleh: {log.actor}
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-zinc-450 dark:text-zinc-500">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
