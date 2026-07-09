"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass, getBorderRadiusClass } from "@/UI/shared/color-utils";

export function MentorLeadWidget() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  // Mock State for interactivity (e.g. dismissing alerts or filters)
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      type: "warning",
      message: "Kelebihan Beban: Mentor Yogi Saputra telah mencapai batas maksimal kuota bimbingan (12/12 siswa).",
      actionLabel: "Re-alokasi Siswa"
    },
    {
      id: 2,
      type: "danger",
      message: "Antrean Tertunda: Siswa Galih Prasetyo belum dialokasikan mentor selama lebih dari 24 jam.",
      actionLabel: "Plot Sekarang"
    }
  ]);

  // Scoped Mock Data
  const leadScope = {
    domainName: "Web Development (React & Next.js)",
    totalStudents: 23,
    maxCapacity: 32,
  };

  const studentQueue = [
    { name: "Doni Pratama", course: "React & Next.js Professional", date: "Daftar: 2 jam lalu", priority: "Tinggi", priorityColor: "red" },
    { name: "Siti Rahma", course: "TypeScript Advanced Coding", date: "Daftar: 5 jam lalu", priority: "Sedang", priorityColor: "orange" },
    { name: "Galih Prasetyo", course: "React & Next.js Professional", date: "Daftar: 1 hari lalu", priority: "Mendesak", priorityColor: "red" }
  ];

  const mentorStatus = [
    { name: "Akbar Syahputra", role: "Mentor React", activeStudents: 8, limit: 10, status: "Tersedia", colorClass: "text-sakode-green bg-sakode-green/10" },
    { name: "Yogi Saputra", role: "Mentor TS / Lead", activeStudents: 12, limit: 12, status: "Sibuk (Penuh)", colorClass: "text-sakode-red bg-sakode-red/10" },
    { name: "Rian Hidayat", role: "Mentor React Junior", activeStudents: 3, limit: 10, status: "Tersedia", colorClass: "text-sakode-green bg-sakode-green/10" }
  ];

  const upcomingSchedules = [
    { time: "Hari Ini, 16:00 - 17:30", student: "Rian Hidayat", mentor: "Akbar Syahputra", topic: "Intro to CSS variables & grid layout", type: "1-on-1" },
    { time: "Hari Ini, 19:30 - 21:00", student: "Budi Siswa Baru", mentor: "Yogi Saputra", topic: "State Management with Zustand", type: "1-on-1" },
    { time: "Besok, 10:00 - 11:30", student: "Doni Pratama", mentor: "Akbar Syahputra", topic: "Next.js App Router & Server Component", type: "1-on-1" }
  ];

  const recentPlottingActivities = [
    { time: "3 jam lalu", desc: "Siswa Budi Siswa Baru dialokasikan ke Mentor Yogi Saputra oleh Sistem (Autopilot)" },
    { time: "1 hari lalu", desc: "Siswa Siti Aminah dialokasikan ke Mentor Akbar Syahputra oleh Yogi (Lead)" },
    { time: "2 hari lalu", desc: "Siswa Galih Prasetyo masuk antrean menunggu alokasi kelas React & Next.js" }
  ];

  const handleDismissAlert = (id: number) => {
    setActiveAlerts(activeAlerts.filter(alert => alert.id !== id));
  };

  // UI styling helper for nested cards
  const getSubElementClass = (type: "inner-card" | "scope-banner") => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "inner-card") {
          return "bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none";
        }
        return "bg-amber-100 dark:bg-amber-950/20 border-2 border-zinc-900 dark:border-white p-4.5 rounded-none font-mono text-zinc-900 dark:text-amber-100";
      case "claymorphism":
        if (type === "inner-card") {
          return "bg-slate-50 dark:bg-zinc-900 border border-slate-200/20 dark:border-zinc-850/20 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)] rounded-2xl";
        }
        return "bg-amber-50/50 dark:bg-amber-950/10 border border-amber-250/20 shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.02),_3px_3px_6px_rgba(255,255,255,0.8)] p-5 rounded-3xl text-zinc-800 dark:text-amber-200";
      case "glassmorphism":
      case "liquid-glass":
        if (type === "inner-card") {
          return "bg-white/10 dark:bg-zinc-950/20 border border-white/10 backdrop-blur-md rounded-2xl shadow-xs";
        }
        return "bg-amber-500/10 dark:bg-amber-500/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl text-zinc-900 dark:text-amber-200";
      case "minimalism":
        if (type === "inner-card") {
          return "bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/40 rounded-lg";
        }
        return "bg-zinc-100/50 dark:bg-zinc-900/50 border-l-4 border-amber-500 p-4 rounded-r-lg text-zinc-700 dark:text-zinc-300";
      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "inner-card") {
          return "bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-850/50 rounded-2xl shadow-3xs";
        }
        return "bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl text-zinc-800 dark:text-amber-300";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left pb-12">
      
      {/* 1. Scoped Authority Notice Banner */}
      <div className={getSubElementClass("scope-banner")}>
        <div className="flex items-start gap-3">
          <Icons.Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-black tracking-tight leading-tight">
              Lingkup Otoritas: {leadScope.domainName}
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Anda masuk sebagai <strong>Mentor Lead</strong>. Seluruh data antrean siswa belum ter-plot, jadwal mentoring mingguan, rekam aktivitas, dan kapasitas mentor yang ditampilkan di bawah dibatasi hanya untuk wilayah pengajaran Anda.
            </p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full select-none shrink-0 border border-amber-500/20">
            Staff Scoped
          </span>
        </div>
      </div>

      {/* 2. Urgent Alerts Section */}
      {activeAlerts.length > 0 && (
        <div className="flex flex-col gap-3">
          {activeAlerts.map(alert => (
            <div 
              key={alert.id} 
              className={`flex items-center justify-between p-4 border text-xs font-semibold ${getBorderRadiusClass(selectedStyle)} ${
                alert.type === "danger" 
                  ? "bg-red-500/10 border-red-500/20 text-red-750 dark:text-red-300" 
                  : "bg-orange-500/10 border-orange-500/20 text-orange-750 dark:text-orange-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icons.AlertCircle className="w-4 h-4 shrink-0" />
                <span>{alert.message}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/plotting" className="hover:underline text-[10px] font-black uppercase tracking-wider shrink-0">
                  {alert.actionLabel}
                </Link>
                <button 
                  onClick={() => handleDismissAlert(alert.id)}
                  className="p-1 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-md transition-colors cursor-pointer"
                  title="Sembunyikan"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Operational Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <div className="w-fit">
              <UI.Badge variant="accent" accentColor="orange">
                ↑ Alokasikan segera
              </UI.Badge>
            </div>
            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-2 leading-none">
              {studentQueue.length}
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
              Antrean Plotting Scoped
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <div className="w-fit">
              <UI.Badge variant="accent" accentColor="blue">
                ↑ Aktif mengajar
              </UI.Badge>
            </div>
            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-2 leading-none">
              {mentorStatus.length}
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
              Total Mentor Standby
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <div className="w-fit">
              <UI.Badge variant="accent" accentColor="green">
                Batas {leadScope.maxCapacity} Siswa
              </UI.Badge>
            </div>
            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-2 leading-none">
              {Math.round((leadScope.totalStudents / leadScope.maxCapacity) * 100)}%
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
              Utilisasi Kuota Mengajar
            </span>
          </div>
        </UI.Card>
      </div>

      {/* 4. Student Plotting Queue & Mentor Workload Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scoped Plotting Queue list */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Antrean Siswa Belum Di-plot (React & Next.js)
          </UI.Heading>
          
          <div className="flex flex-col gap-3">
            {studentQueue.map((student, idx) => (
              <div key={idx} className={`${getSubElementClass("inner-card")} p-4.5 flex justify-between items-center`}>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-100 leading-none">
                      {student.name}
                    </h4>
                    <UI.Badge 
                      variant="accent" 
                      accentColor={student.priorityColor as any}
                      className="text-[8px]! px-1.5! py-0.5!"
                    >
                      {student.priority}
                    </UI.Badge>
                  </div>
                  <span className="text-[9.5px] font-bold text-zinc-400 dark:text-zinc-500 block mt-2">
                    Paket: {student.course}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[9.5px] text-zinc-450 font-bold">{student.date}</span>
                  <Link href="/plotting">
                    <UI.Button 
                      variant="primary" 
                      accentColor={selectedColor} 
                      className="text-[8.5px]! py-1.5! px-3.5! h-auto! font-black! cursor-pointer"
                    >
                      Alokasikan Mentor
                    </UI.Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Link href="/plotting" className="w-fit">
            <span className={`text-[10px] font-black ${getTextClass(selectedColor)} hover:underline cursor-pointer block mt-1`}>
              Buka Plotting Workspace →
            </span>
          </Link>
        </div>

        {/* Mentor Workload and Availability Map */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Kapasitas & Alokasi Mengajar Mentor
          </UI.Heading>
          
          <div className="flex flex-col gap-3">
            {mentorStatus.map((mentor, idx) => {
              const fillPercent = Math.min(100, Math.round((mentor.activeStudents / mentor.limit) * 100));
              return (
                <div key={idx} className={`${getSubElementClass("inner-card")} p-4.5 flex flex-col gap-3`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-100 leading-none">
                        {mentor.name}
                      </h4>
                      <span className="text-[9.5px] font-bold text-zinc-400 dark:text-zinc-500 block mt-1.5">
                        {mentor.role}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md ${
                        mentor.activeStudents >= mentor.limit 
                          ? "text-sakode-red bg-sakode-red/10 border border-sakode-red/20" 
                          : "text-sakode-green bg-sakode-green/10 border border-sakode-green/20"
                      }`}>
                        {mentor.status}
                      </span>
                      <span className="text-[9.5px] text-zinc-500 font-black">
                        {mentor.activeStudents} / {mentor.limit} Siswa
                      </span>
                    </div>
                  </div>

                  {/* Workload Progress bar */}
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        fillPercent >= 100 
                          ? getBgClass("red") 
                          : fillPercent >= 80 
                            ? getBgClass("orange") 
                            : getBgClass(selectedColor)
                      }`}
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Scoped Upcoming schedules & Recent Activities Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Scoped Upcoming schedules */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Jadwal Mentoring Terdekat (Scoped)
          </UI.Heading>
          
          <div className="flex flex-col gap-3">
            {upcomingSchedules.map((schedule, idx) => (
              <div key={idx} className={`${getSubElementClass("inner-card")} p-4 flex flex-col gap-2.5`}>
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                  <span className="font-extrabold text-zinc-700 dark:text-zinc-300">{schedule.time} WIB</span>
                  <span className="uppercase px-2 py-0.5 rounded-md bg-zinc-150 dark:bg-zinc-800 text-[8px] font-black border border-zinc-200 dark:border-zinc-800">
                    {schedule.type}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-805 dark:text-zinc-100">
                    Siswa: <span className="font-extrabold">{schedule.student}</span> • Mentor: <span className="font-extrabold text-sakode-blue">{schedule.mentor}</span>
                  </h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold mt-1.5">
                    Topik: {schedule.topic}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <Link href="/schedules-lead" className="w-fit">
            <span className={`text-[10px] font-black ${getTextClass(selectedColor)} hover:underline cursor-pointer block mt-1`}>
              Buka Jadwal Bimbingan →
            </span>
          </Link>
        </div>

        {/* Recent Plotting Activities */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Aktivitas Plotting Terakhir
          </UI.Heading>

          <div className="relative pl-6 border-l border-zinc-200 dark:border-zinc-800 space-y-6 pt-2 pb-2">
            {recentPlottingActivities.map((activity, idx) => (
              <div key={idx} className="relative">
                <span className={`absolute -left-9.5 top-0.5 w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-zinc-800 dark:text-white bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-3xs`}>
                  <Icons.Check className="w-3.5 h-3.5 text-sakode-green" />
                </span>
                <div className="text-left">
                  <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-150 leading-tight">
                    {activity.desc}
                  </h4>
                  <span className="text-[9px] text-zinc-450 font-bold block mt-1.5">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
