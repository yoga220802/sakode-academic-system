"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { PaletteColorKey, getBgClass } from "@/UI/shared/color-utils";

export function StudentWidget() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  const activeClasses = [
    { title: "React & Next.js Professional", mentor: "Akbar Mentor React", progress: 68, badge: "Front-End", colorClass: "text-sakode-blue" },
    { title: "TypeScript & Data Structures", mentor: "Yogi Mentor Lead", progress: 42, badge: "Core IT", colorClass: "text-sakode-orange" }
  ];

  const upcomingSessions = [
    { topic: "State Management with Zustand", date: "Hari ini, 19:30 WIB", type: "1-on-1 Mentoring", mentor: "Akbar Mentor React" },
    { topic: "Review Tugas Akhir & Deployment", date: "Besok, 20:00 WIB", type: "Group Review", mentor: "Yogi Mentor Lead" }
  ];

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UI.Card accentColor="blue">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Kelas Berjalan
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              2 Kelas
            </span>
            <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 mt-1.5">
              1 modul tersisa minggu ini
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor="orange">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Sesi Mentoring Selesai
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              18 Sesi
            </span>
            <span className="text-[9px] font-bold text-zinc-455 dark:text-zinc-555 mt-1.5">
              Tingkat kehadiran 100%
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor="green">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Poin Aktivitas (XP)
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              1,240 XP
            </span>
            <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 mt-1.5">
              Peringkat #4 di kelas Anda
            </span>
          </div>
        </UI.Card>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active classes */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Kelas Aktif Saya
          </UI.Heading>
          {activeClasses.map((cls, idx) => (
            <UI.Card key={idx} accentColor={idx === 0 ? "blue" : "orange"}>
              <div className="p-4.5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-black text-zinc-850 dark:text-zinc-100">
                      {cls.title}
                    </h3>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-1">
                      Mentor: {cls.mentor}
                    </p>
                  </div>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500`}>
                    {cls.badge}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-zinc-500">
                    <span>Progres Kurikulum</span>
                    <span>{cls.progress}%</span>
                  </div>
                  {(() => {
                    const colorKey = (idx === 0 ? "blue" : "orange") as PaletteColorKey;
                    let trackClass = "w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden";
                    let barClass = `${getBgClass(colorKey)} h-full rounded-full`;

                    switch (selectedStyle) {
                      case "neobrutalism":
                        trackClass = "w-full bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-white rounded-none h-3.5 overflow-hidden";
                        barClass = `${getBgClass(colorKey)} border-r-2 border-zinc-900 dark:border-white h-full rounded-none`;
                        break;
                      case "claymorphism":
                        trackClass = "w-full bg-slate-100/80 dark:bg-zinc-900/50 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] rounded-full h-2.5 overflow-hidden border border-white/10";
                        barClass = `${getBgClass(colorKey)} shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2),_inset_2px_2px_4px_rgba(255,255,255,0.4)] h-full rounded-full`;
                        break;
                      case "glassmorphism":
                      case "liquid-glass":
                        trackClass = "w-full bg-white/10 dark:bg-zinc-900/25 border border-white/15 dark:border-white/5 rounded-full h-2 overflow-hidden";
                        barClass = `${getBgClass(colorKey)} opacity-85 h-full rounded-full`;
                        break;
                      case "minimalism":
                        trackClass = "w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-none h-1.5 overflow-hidden";
                        barClass = `${getBgClass(colorKey)} h-full rounded-none`;
                        break;
                      case "bento-grid":
                        trackClass = "w-full bg-zinc-100/80 dark:bg-zinc-800/40 rounded-lg h-2 overflow-hidden border border-zinc-200/20";
                        barClass = `${getBgClass(colorKey)} h-full rounded-lg`;
                        break;
                    }

                    return (
                      <div className={trackClass}>
                        <div 
                          className={barClass}
                          style={{ width: `${cls.progress}%` }}
                        />
                      </div>
                    );
                  })()}
                </div>
              </div>
            </UI.Card>
          ))}
        </div>

        {/* Right: Upcoming Sessions */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Jadwal Mentoring Terdekat
          </UI.Heading>
          {upcomingSessions.map((session, idx) => (
            <UI.Card key={idx} accentColor="green">
              <div className="p-4.5 flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-sakode-green/10 text-sakode-green">
                    {session.type}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
                    {session.date}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-150">
                    {session.topic}
                  </h4>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-1">
                    Dipandu oleh {session.mentor}
                  </p>
                </div>
                <UI.Button variant="primary" accentColor={selectedColor} className="text-[10px]! py-1.5! px-3! h-auto! w-fit! font-black! mt-1.5 cursor-pointer">
                  Masuk Sesi Kelas
                </UI.Button>
              </div>
            </UI.Card>
          ))}
        </div>
      </div>
    </div>
  );
}
