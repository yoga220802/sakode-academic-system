"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass, getBgOpacity10Class } from "@/UI/shared/color-utils";

interface MetricItem {
  label: string;
  value: string;
  change: string;
  trendUp: boolean;
}

export function AdminWidget() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  // Interactive quick review modal mock
  const [activeTicket, setActiveTicket] = useState<{ title: string; desc: string; date: string; refLabel: string; programLabel: string } | null>(null);

  const systemLogs = [
    { time: "16:42 WIB", actor: "Yogi Mentor Lead", action: "Plotting Siswa Doni Pratama", module: "React & Next.js", status: "success" },
    { time: "16:30 WIB", actor: "Budi Siswa Baru", action: "Registrasi Akun Baru", module: "Public Account", status: "success" },
    { time: "15:10 WIB", actor: "Super Admin Sakode", action: "Pembuatan Modul React v16", module: "Kurikulum", status: "info" },
    { time: "14:05 WIB", actor: "Sudarsono (Kepsek)", action: "Request Laporan Bulanan", module: "Administrasi", status: "warning" }
  ];

  const quickActions = [
    { title: "Tambah Referral", icon: "Gift", desc: "Daftarkan data referral secara manual" },
    { title: "Buat Kelas Baru", icon: "BookPlus", desc: "Buat jadwal kurikulum bootcamp baru" },
    { title: "Kelola Mentor", icon: "Users", desc: "Alokasi mentor ke kelas aktif" },
    { title: "Konfigurasi Sistem", icon: "Settings", desc: "Pengaturan email & integrasi server" }
  ];

  const metrics: MetricItem[] = [
    { label: "Total Siswa", value: "348", change: "+12 minggu ini", trendUp: true },
    { label: "Grup Mentoring", value: "24", change: "+2 aktif", trendUp: true },
    { label: "Tiket Pending", value: "8", change: "Butuh review", trendUp: false },
    { label: "Mentor Aktif", value: "18", change: "+1 standby", trendUp: true }
  ];

  const pendingRegistrations = [
    { title: "Dzulkifli Putra", refLabel: "Ref: Akbar", programLabel: "React & Next", dateOnly: "13/03/26", date: "13/03/26 16:30", desc: "React & Next.js Professional • via Ref: Akbar" },
    { title: "Endah Lestari", refLabel: "Ref: Mandiri", programLabel: "TypeScript & Structures", dateOnly: "13/03/26", date: "13/03/26 14:15", desc: "TypeScript & Data Structures • via Ref: MANDIRI" },
    { title: "Rian Hidayat", refLabel: "No Ref", programLabel: "Backend Dev Go/Docker", dateOnly: "12/03/26", date: "12/03/26 18:22", desc: "Backend Dev Go/Docker • Tanpa Referral" }
  ];

  // Visual Chart Data (Mocked Growth)
  const chartData = [
    { month: "Jan", count: 120 },
    { month: "Feb", count: 160 },
    { month: "Mar", count: 210 },
    { month: "Apr", count: 245 },
    { month: "Mei", count: 290 },
    { month: "Jun", count: 348 }
  ];

  const getLogItemClass = () => {
    const baseClass = "flex justify-between items-center p-3.5 transition-all text-xs font-semibold";
    switch (selectedStyle) {
      case "claymorphism":
        return `${baseClass} rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200/20 dark:border-zinc-700/20 shadow-[inset_-2px_-2px_4px_rgba(230,230,230,1),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)]`;
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

  const getChartBarClass = () => {
    switch (selectedStyle) {
      case "neobrutalism":
        return "border-2 border-zinc-900 dark:border-white shadow-[1px_1px_0px_rgba(0,0,0,1)] dark:shadow-[1px_1px_0px_rgba(255,255,255,1)] rounded-none";
      case "claymorphism":
        return "shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),_-1px_-1px_3px_rgba(0,0,0,0.15)] rounded-t-xl";
      case "glassmorphism":
      case "liquid-glass":
        return "bg-white/30 dark:bg-white/10 backdrop-blur-xs border border-white/20 rounded-t-lg";
      case "minimalism":
        return "rounded-t-xs";
      case "bento-grid":
      default:
        return "rounded-t-md";
    }
  };

  const renderIcon = (iconName: keyof typeof Icons, className: string) => {
    const Comp = Icons[iconName] as React.ComponentType<{ className?: string }>;
    if (Comp) return <Comp className={className} />;
    return <Icons.Settings className={className} />;
  };

  return (
    <div className="flex flex-col gap-10 w-full text-left font-sans relative">
      
      {/* Top dashboard metric summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <UI.Card key={idx} accentColor={selectedColor}>
            <div className="p-5 flex flex-col gap-2 text-left relative overflow-hidden group">
              <div className="flex items-center justify-start">
                <UI.Badge variant={m.trendUp ? "success" : "warning"} accentColor={m.trendUp ? "green" : "red"}>
                  {m.trendUp ? "↑" : "↓"} {m.change}
                </UI.Badge>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">
                  {m.value}
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block mt-1.5">
                  {m.label}
                </span>
              </div>
            </div>
          </UI.Card>
        ))}
      </div>

      {/* Aksi Cepat Admin Section */}
      <div className="flex flex-col gap-3">
        <UI.Heading className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-1">
          Aksi Cepat Admin
        </UI.Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((act, idx) => (
            <UI.Card key={idx} accentColor={selectedColor} className="h-full cursor-pointer hover:-translate-y-0.5 transition-transform duration-200">
              <div className="p-4 flex items-center gap-3.5 text-left h-full">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${getBgOpacity10Class(selectedColor)}`}>
                  {renderIcon(act.icon as keyof typeof Icons, `w-4.5 h-4.5 ${getTextClass(selectedColor)}`)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-150 truncate">
                    {act.title}
                  </h3>
                  <p className="text-[9.5px] text-zinc-450 dark:text-zinc-550 mt-0.5 block truncate leading-normal font-medium">
                    {act.desc}
                  </p>
                </div>
                <Icons.ArrowRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-650 shrink-0 ml-auto" />
              </div>
            </UI.Card>
          ))}
        </div>
      </div>

      {/* Middle Grid: Stats Chart & Registration Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Growth Chart (SVG/CSS Hybrid) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <UI.Heading className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
            Statistik Pertumbuhan Murid (6 Bulan Terakhir)
          </UI.Heading>
          
          <UI.Card accentColor={selectedColor}>
            <div className="p-6 flex flex-col gap-6">
              {/* Chart Header */}
              <div className="flex items-center justify-between text-xs font-medium text-zinc-550 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${getBgClass(selectedColor)}`} />
                  Total Siswa Terdaftar
                </span>
                <span>Target: 400 Siswa</span>
              </div>

              {/* Bar Layout */}
              <div className="flex items-end justify-between h-48 pt-6 px-2 border-b border-zinc-150 dark:border-zinc-800/80">
                {chartData.map((d, index) => {
                  const percentHeight = (d.count / 370) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 group">
                      <div className="relative w-8 sm:w-10 flex flex-col justify-end h-full">
                        {/* Tooltip */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-medium px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xs">
                          {d.count} Siswa
                        </div>
                        
                        {/* Dynamic Bar */}
                        <div 
                          className={`w-full transition-all duration-500 ${getChartBarClass()} ${getBgClass(selectedColor)}`} 
                          style={{ height: `${percentHeight}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-555 mt-2 block select-none">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 dark:text-zinc-555 uppercase tracking-wider pl-1">
                <span>Total Semester 1</span>
                <span>Peningkatan Rata-Rata: +21%</span>
              </div>
            </div>
          </UI.Card>
        </div>

        {/* Right Column: Pending Ticket Queue */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <UI.Heading className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-1">
            Antrean Review Pendaftaran Siswa ({pendingRegistrations.length})
          </UI.Heading>

          <div className="flex flex-col gap-3">
            {pendingRegistrations.map((ticket, idx) => (
              <UI.Card key={idx} accentColor={idx === 0 ? "orange" : selectedColor}>
                <div className="p-5 flex flex-col gap-3 text-left">
                  {/* Top Row: Name and Ref Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                      {ticket.title}
                    </h4>
                    <span className="text-[10px] font-normal px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/30 shrink-0">
                      {ticket.refLabel}
                    </span>
                  </div>

                  {/* Second Row: Program */}
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                    {ticket.programLabel}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-zinc-200/60 dark:bg-zinc-800/80 my-0.5 w-full" />

                  {/* Bottom Row: Review button and Date */}
                  <div className="flex items-center justify-between">
                    <UI.Button 
                      variant="secondary" 
                      accentColor={selectedColor} 
                      onClick={() => setActiveTicket(ticket)}
                      className="text-[11px]! py-1.5! px-4! h-auto! font-medium! border border-zinc-350 dark:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 bg-transparent text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-3xs"
                    >
                      Review
                    </UI.Button>
                    <span className="text-xs text-zinc-450 dark:text-zinc-500 font-normal">
                      {ticket.dateOnly}
                    </span>
                  </div>
                </div>
              </UI.Card>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Activity Logs */}
      <div className="flex flex-col gap-3">
        <UI.Heading className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-1">
          Log Aktivitas Sistem Terakhir
        </UI.Heading>
        
        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-2.5">
            {systemLogs.map((log, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 gap-2 transition-all ${getLogItemClass()}`}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    log.status === "success" 
                      ? "bg-emerald-500" 
                      : log.status === "warning" 
                        ? "bg-amber-500" 
                        : "bg-sakode-blue"
                  }`} />
                  <div className="flex flex-col">
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-[11px] block">
                      {log.action}
                    </span>
                    <span className="text-[9.5px] text-zinc-450 dark:text-zinc-500 font-normal block">
                      Kategori: {log.module}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 text-[10px] text-zinc-455 dark:text-zinc-500">
                  <span>Aktor: {log.actor}</span>
                  <span className="font-mono text-[9px]">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </UI.Card>
      </div>

      {/* Interactive Review Dialog Modal Mock */}
      <AnimatePresence>
        {activeTicket && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden text-left"
            >
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-350">
                    Review Pendaftaran Siswa
                  </h3>
                  <button 
                    onClick={() => setActiveTicket(null)}
                    aria-label="Tutup detail tiket"
                    className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <Icons.X className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-xs">
                    <span className="text-[9.5px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Calon Siswa</span>
                    <span className="font-semibold text-zinc-800 dark:text-white text-sm">{activeTicket.title}</span>
                  </div>
                  <div className="text-xs mt-2">
                    <span className="text-[9.5px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Keterangan Program</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-350">{activeTicket.desc}</span>
                  </div>
                  <div className="text-xs mt-2 border-t border-dashed border-zinc-150 dark:border-zinc-800 pt-3">
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block font-normal leading-relaxed">
                      Pendaftaran diajukan pada {activeTicket.date}. Sebagai admin, Anda dapat menyetujui tiket ini untuk membuat grup mentoring secara otomatis.
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  <UI.Button 
                    variant="secondary" 
                    accentColor={selectedColor} 
                    onClick={() => setActiveTicket(null)}
                    className="text-xs! py-2! font-semibold!"
                  >
                    Tolak
                  </UI.Button>
                  <UI.Button 
                    variant="primary" 
                    accentColor={selectedColor} 
                    onClick={() => {
                      setActiveTicket(null);
                    }}
                    className="text-xs! py-2! font-semibold! cursor-pointer"
                  >
                    Setujui & Plotting
                  </UI.Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
