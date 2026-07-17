"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import {
  getBgClass,
  getTextClass,
  getBgOpacity10Class,
  getBorderRadiusClass,
} from "@/UI/shared/color-utils";

interface MetricItem {
  label: string;
  value: string;
  change: string;
  trendUp: boolean;
}

export function AdminWidget() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI =
    UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] ||
    UIStyles.UI["sakode-modern"];
  const router = useRouter();

  const systemLogs = [
    {
      time: "16:42 WIB",
      actor: "Yogi Mentor Lead",
      action: "Plotting Siswa Doni Pratama",
      module: "React & Next.js",
      status: "success",
    },
    {
      time: "16:30 WIB",
      actor: "Budi Siswa Baru",
      action: "Registrasi Akun Baru",
      module: "Public Account",
      status: "success",
    },
    {
      time: "15:10 WIB",
      actor: "Super Admin Sakode",
      action: "Pembuatan Modul React v16",
      module: "Kurikulum",
      status: "info",
    },
    {
      time: "14:05 WIB",
      actor: "Sudarsono (Kepsek)",
      action: "Request Laporan Bulanan",
      module: "Administrasi",
      status: "warning",
    },
  ];

  const quickActions = [
    {
      title: "Tambah Referral",
      icon: "Gift",
      desc: "Daftarkan data referral secara manual",
    },
    {
      title: "Buat Kelas IT Baru",
      icon: "BookPlus",
      desc: "Buat jadwal kurikulum bootcamp baru",
    },
    {
      title: "Kelola Mentor",
      icon: "Users",
      desc: "Alokasi mentor ke kelas aktif",
    },
    {
      title: "Konfigurasi Sistem",
      icon: "Settings",
      desc: "Pengaturan email & integrasi server",
    },
  ];

  const metrics: MetricItem[] = [
    {
      label: "Total Siswa",
      value: "348",
      change: "+12 minggu ini",
      trendUp: true,
    },
    { label: "Grup Mentoring", value: "24", change: "+2 aktif", trendUp: true },
    {
      label: "Tiket Pending",
      value: "8",
      change: "Butuh review",
      trendUp: false,
    },
    { label: "Mentor Aktif", value: "18", change: "+1 standby", trendUp: true },
  ];

  const pendingRegistrations = [
    {
      id: "REG-001",
      title: "Dzulkifli Putra",
      refLabel: "Ref: Akbar",
      programLabel: "React & Next",
      dateOnly: "13/03/26",
      date: "13/03/26 16:30",
      desc: "React & Next.js Professional • via Ref: Akbar",
    },
    {
      id: "REG-002",
      title: "Endah Lestari",
      refLabel: "Ref: Mandiri",
      programLabel: "TypeScript & Structures",
      dateOnly: "13/03/26",
      date: "13/03/26 14:15",
      desc: "TypeScript & Data Structures • via Ref: MANDIRI",
    },
    {
      id: "REG-003",
      title: "Rian Hidayat",
      refLabel: "No Ref",
      programLabel: "Backend Dev Go/Docker",
      dateOnly: "12/03/26",
      date: "12/03/26 18:22",
      desc: "Backend Dev Go/Docker • Tanpa Referral",
    },
  ];

  // Visual Chart Data (Mocked Growth)
  const chartData = [
    { month: "Jan", count: 120 },
    { month: "Feb", count: 160 },
    { month: "Mar", count: 210 },
    { month: "Apr", count: 245 },
    { month: "Mei", count: 290 },
    { month: "Jun", count: 348 },
  ];

  const getLogItemClass = () => {
    const baseClass =
      "flex justify-between items-center p-3.5 transition-all text-xs font-semibold";
    switch (selectedStyle) {
      case "claymorphism":
        return `${baseClass} rounded-2xl bg-slate-50 dark:bg-zinc-805 border border-slate-205/20 dark:border-zinc-700/20 shadow-[inset_-2px_-2px_4px_rgba(230,230,230,1),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)]`;
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
        return `${baseClass} bg-zinc-100/40 dark:bg-zinc-800/30 border border-zinc-200/40 dark:border-zinc-800/50 rounded-xl`;
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
                <UI.Badge
                  variant={m.trendUp ? "success" : "warning"}
                  accentColor={m.trendUp ? "green" : "red"}
                >
                  {m.trendUp ? "↑" : "↓"} {m.change}
                </UI.Badge>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">
                  {m.value}
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-300 uppercase tracking-wider block mt-1.5">
                  {m.label}
                </span>
              </div>
            </div>
          </UI.Card>
        ))}
      </div>

      {/* Aksi Cepat Admin Section */}
      <div className="flex flex-col gap-3">
        <UI.Heading className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
          Aksi Cepat Admin
        </UI.Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((act, idx) => (
            <UI.Card
              key={idx}
              accentColor={selectedColor}
              className="h-full cursor-pointer hover:-translate-y-0.5 transition-transform duration-200"
            >
              <div className="p-4 flex items-center gap-3.5 text-left h-full">
                <div
                  className={`w-9 h-9 flex items-center justify-center shrink-0 ${getBorderRadiusClass(selectedStyle)} ${selectedStyle === "neobrutalism" ? "border-2 border-zinc-900 dark:border-white" : ""} ${getBgOpacity10Class(selectedColor)}`}
                >
                  {renderIcon(
                    act.icon as keyof typeof Icons,
                    `w-4.5 h-4.5 ${getTextClass(selectedColor)}`,
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                    {act.title}
                  </h3>
                  <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 mt-0.5 block truncate leading-normal font-medium">
                    {act.desc}
                  </p>
                </div>
                <Icons.ArrowRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0 ml-auto -rotate-45" />
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

          <UI.Card accentColor={selectedColor} className="h-full">
            {/* Very Hardcoded Must fix*/}
            {/* IMPORTANT NOTES*/}
            <div className="p-6 flex flex-col gap-6">
              {/* Chart Header */}
              <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${getBgClass(selectedColor)}`}
                  />
                  Total Siswa Terdaftar
                </span>
                <span>Target: 400 Siswa</span>
              </div>

              {/* Bar Layout */}
              <div className="flex justify-between items-end h-48 pt-6 px-2 border-b border-zinc-200 dark:border-zinc-800/80">
                {chartData.map((d, index) => {
                  const percentHeight = (d.count / 370) * 100;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-end h-full flex-1 group"
                    >
                      <div className="relative w-8 sm:w-10 h-32 flex flex-col justify-end">
                        {/* Tooltip */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-medium px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xs z-20">
                          {d.count} Siswa
                        </div>

                        {/* Dynamic Bar */}
                        <div
                          className={`w-full transition-all duration-500 ${getChartBarClass()} ${getBgClass(selectedColor)}`}
                          style={{ height: `${percentHeight}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-450 mt-2 block select-none">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wider pl-1">
                <span>Total Semester 1</span>
                <span>Peningkatan Rata-Rata: +21%</span>
              </div>
            </div>
          </UI.Card>
        </div>

        {/* Right Column: Pending Ticket Queue */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between pl-1">
            <UI.Heading className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Antrean Review Pendaftaran Siswa ({pendingRegistrations.length})
            </UI.Heading>
            <a
              href="/registration-review"
              className="text-xs text-sakode-blue font-medium hover:underline"
            >
              Lihat Semua →
            </a>
          </div>

          <div className="flex flex-col gap-3">
            {pendingRegistrations.slice(0, 2).map((ticket, idx) => (
              <UI.Card
                key={idx}
                accentColor={idx === 0 ? "orange" : selectedColor}
              >
                <div className="p-5 flex flex-col gap-3 text-left">
                  {/* Top Row: Name and Ref Badge (Style-Aware Badge) */}
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                      {ticket.title}
                    </h4>
                    {ticket.refLabel !== "No Ref" ? (
                      <UI.Badge
                        variant="accent"
                        accentColor="purple"
                        className="text-[9px]! font-medium! px-2! py-0.5!"
                      >
                        {ticket.refLabel}
                      </UI.Badge>
                    ) : (
                      <UI.Badge
                        variant="default"
                        className="text-[9px]! font-medium! px-2! py-0.5!"
                      >
                        No Ref
                      </UI.Badge>
                    )}
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
                      onClick={() =>
                        router.push(`/registration-review?id=${ticket.id}`)
                      }
                      className="text-[11px]! py-1.5! px-4! h-auto! font-medium! border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 bg-transparent text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-3xs"
                    >
                      Review
                    </UI.Button>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
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
        <UI.Heading className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
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
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      log.status === "success"
                        ? "bg-emerald-500"
                        : log.status === "warning"
                          ? "bg-amber-500"
                          : "bg-sakode-blue"
                    }`}
                  />
                  <div className="flex flex-col">
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-[11px] block">
                      {log.action}
                    </span>
                    <span className="text-[9.5px] text-zinc-500 dark:text-zinc-400 font-normal block">
                      Kategori: {log.module}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 text-[10px] text-zinc-500 dark:text-zinc-400">
                  <span>Aktor: {log.actor}</span>
                  <span className="font-mono text-[9px]">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </UI.Card>
      </div>
    </div>
  );
}
