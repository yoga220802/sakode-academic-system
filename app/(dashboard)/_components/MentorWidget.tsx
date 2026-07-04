"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { PaletteColorKey, getBgClass, getTextClass, getBgOpacity10Class } from "@/UI/shared/color-utils";

export function MentorWidget() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  const todayClasses = [
    { time: "16:00 - 17:30", student: "Rian Hidayat", topic: "Intro to CSS variables & grid layout", type: "1-on-1" },
    { time: "19:30 - 21:00", student: "Budi Siswa Baru", topic: "State Management with Zustand", type: "1-on-1" }
  ];

  const pendingGradings = [
    { student: "Dina Marlina", course: "React & Next.js Professional", task: "Tugas Modul 3: Routing & APIs", due: "2 jam lagi" },
    { student: "Feri Awan", course: "TypeScript Advanced Coding", task: "Tugas Akhir: Mini ORM Framework", due: "1 hari lagi" }
  ];

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Mentor Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <div className="w-fit">
              <UI.Badge variant="accent" accentColor={selectedColor}>
                ↑ +12 jam minggu ini
              </UI.Badge>
            </div>
            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-2 leading-none">
              128
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
              Total Jam Mengajar
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <div className="w-fit">
              <UI.Badge variant="accent" accentColor={selectedColor}>
                ↑ 45 Feedback
              </UI.Badge>
            </div>
            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-2 leading-none">
              4.92 / 5.00
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
              Penilaian Kepuasan Murid
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <div className="w-fit">
              <UI.Badge variant="accent" accentColor={selectedColor}>
                ↑ Wajib dinilai 24j
              </UI.Badge>
            </div>
            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-2 leading-none">
              2
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
              Tugas Belum Dinilai
            </span>
          </div>
        </UI.Card>
      </div>

      {/* Class Schedule & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Jadwal Bimbingan Hari Ini
          </UI.Heading>
          {todayClasses.map((cls, idx) => (
            <UI.Card key={idx} accentColor="blue">
              <div className="p-4 flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                  <span className="font-extrabold text-zinc-700 dark:text-zinc-300">{cls.time} WIB</span>
                  <span className="uppercase px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-[8px] font-black">
                    {cls.type}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-100">
                    Siswa: {cls.student}
                  </h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold mt-1">
                    Topik: {cls.topic}
                  </p>
                </div>
                <UI.Button variant="primary" accentColor={selectedColor} className="text-[10px]! py-1.5! px-3! h-auto! w-fit! font-black! cursor-pointer">
                  Mulai Kelas Zoom
                </UI.Button>
              </div>
            </UI.Card>
          ))}
        </div>

        {/* Pending Tasks Review */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Antrean Penilaian Tugas Siswa
          </UI.Heading>
          {pendingGradings.map((grade, idx) => (
            <UI.Card key={idx} accentColor="orange">
              <div className="p-4.5 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                  <span className="font-extrabold text-zinc-700 dark:text-zinc-300">{grade.student}</span>
                  <span className="text-sakode-orange uppercase font-black text-[9px]">{grade.due}</span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 block mb-0.5">{grade.course}</span>
                  <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-150">
                    {grade.task}
                  </h4>
                </div>
                <UI.Button variant="secondary" accentColor={selectedColor} className="text-[10px]! py-1.5! px-3! h-auto! w-fit! font-black! mt-1.5 cursor-pointer">
                  Buka File & Nilai
                </UI.Button>
              </div>
            </UI.Card>
          ))}
        </div>
      </div>
    </div>
  );
}
